module addrx::lp_vault {
    use std::signer;
    use evo::swap::{Self,LPToken};
    use supra_framework::coin::{Self, Coin};
    use supra_framework::object::{Self, ConstructorRef, Object};
    use aptos_std::smart_vector::{Self, SmartVector};
    use supra_framework::fungible_asset::{Self, Metadata, BurnRef, MintRef, TransferRef, FungibleStore};
    use supra_framework::timestamp;
    use supra_framework::primary_fungible_store;
    use std::string::{Self, String};
    use aptos_std::type_info;
    use std::vector;
    use std::option;
    use aptos_std::bcs;
    use supra_framework::event;
    use addrx::coin_helper;
    use aptos_std::math128;
    use aptos_std::math64;
    use evo::router;
    use supra_framework::supra_account;
    use std::debug;
    use std::vector;

    friend addrx::router;

    const LP_TOKEN_DOES_NOT_EXIST: u64 = 0;
    const ERROR_VAULT_PAUSED: u64 = 1;
    const ERROR_ZERO_AMOUNT: u64 = 2;
    const ERROR_INSUFFICIENT_LIQUIDITY_REDEEMED: u64 = 3;
    const ERROR_ZERO_COINS_TO_HARVEST: u64 = 4;
    const ERROR_NO_REWARDS_TO_HARVEST: u64 = 5;

    const APP_OBJECT_SEED: vector<u8> = b"app_seed";
    const FEE_SCALE: u64 = 10000;
    const VAULT_TOKEN_DECIMALS: u8 = 8;
    const DEFAULT_VAULT_FEE_BPS: u64 = 450; // 4.5% 

    struct VaultConfigs has key {
        all_vaults: SmartVector<address>,
        is_paused: bool,
        fee_manager: address,
        vault_fee_bps: u64,
        app_extend_ref: object::ExtendRef,
    }

    struct VaultTokenRefs has store {
        burn_ref: BurnRef,
        mint_ref: MintRef,
        transfer_ref: TransferRef,
    }

    #[resource_group_member(group = supra_framework::object::ObjectGroup)]
    struct LPVault<phantom X, phantom Y> has key {
        lp_coins: Coin<LPToken<X,Y>>,
        fee_coins_1: Coin<X>,
        fee_coins_2: Coin<Y>,
        last_harvest: u64,
        vault_token_refs: VaultTokenRefs,
        vault_fee_bps: u64,
    }

    #[event]
    struct VaultCreated has drop, store {
        vault_addr: address,
        token_1_addr: String,
        token_2_addr: String,
        last_harvest: u64,
        vault_fee_bps: u64
    }

    fun init_module(module_signer: &signer) {
        let constructor_ref = object::create_named_object(module_signer, APP_OBJECT_SEED);
        let app_signer = object::generate_signer(&constructor_ref);
        move_to(&app_signer, VaultConfigs {
            all_vaults: smart_vector::new(),
            is_paused: false,
            fee_manager: signer::address_of(module_signer),
            vault_fee_bps: DEFAULT_VAULT_FEE_BPS,
            app_extend_ref: object::generate_extend_ref(&constructor_ref)
        });
    }

    fun get_app_signer_address(): address {
        object::create_object_address(&@addrx, APP_OBJECT_SEED)
    }

    inline fun get_app_signer(addr: address): signer acquires VaultConfigs {
        object::generate_signer_for_extending(&borrow_global<VaultConfigs>(addr).app_extend_ref)
    }

    inline fun unchecked_mut_vault_configs(addr: address): &mut VaultConfigs acquires VaultConfigs {
        borrow_global_mut<VaultConfigs>(addr)
    }

    inline fun safe_vault_configs(addr: address): &VaultConfigs acquires VaultConfigs {
        borrow_global<VaultConfigs>(addr)
    }

    public(friend) fun new_vault<X,Y>(): address acquires VaultConfigs {
        assert!(coin::is_coin_initialized<LPToken<X,Y>>(), LP_TOKEN_DOES_NOT_EXIST);
        let app_signer_addr = get_app_signer_address();
        let configs = unchecked_mut_vault_configs(app_signer_addr);
        assert!(!configs.is_paused, ERROR_VAULT_PAUSED);
        let app_signer = &object::generate_signer_for_extending(&configs.app_extend_ref);
        let vault_constructor_ref = create_vault_token<X,Y>(app_signer);
        let vault_signer = &object::generate_signer(vault_constructor_ref);
        let vault_token = object::object_from_constructor_ref<Metadata>(vault_constructor_ref);
        fungible_asset::create_store(vault_constructor_ref, vault_token);
        let current_timestamp = timestamp::now_seconds();
        move_to(vault_signer, LPVault {
            lp_coins: coin::zero<LPToken<X,Y>>(),
            fee_coins_1: coin::zero<X>(),
            fee_coins_2: coin::zero<Y>(),
            last_harvest: current_timestamp,
            vault_fee_bps: configs.vault_fee_bps,
            vault_token_refs: create_vault_token_refs(vault_constructor_ref),
        });
        let vault_addr = object::address_from_constructor_ref(vault_constructor_ref);
        smart_vector::push_back(&mut configs.all_vaults, vault_addr);
        event::emit(VaultCreated { 
            vault_addr,
            token_1_addr: type_info::type_name<X>(),
            token_2_addr: type_info::type_name<X>(),
            last_harvest: current_timestamp,
            vault_fee_bps: configs.vault_fee_bps
        });

        object::address_from_constructor_ref(vault_constructor_ref)
    }

     inline fun create_vault_token<X,Y>(app_signer: &signer): &ConstructorRef {
        let token_name = vault_token_name<X,Y>();
        let seeds = get_vault_seeds<X,Y>();
        let vault_token_constructor_ref = &object::create_named_object(app_signer, seeds);
        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            vault_token_constructor_ref,
            option::none(),
            token_name,
            string::utf8(b"G-"),
            VAULT_TOKEN_DECIMALS,
            string::utf8(b""),
            string::utf8(b""),
        );
        vault_token_constructor_ref
    }

    inline fun create_vault_token_refs(constructor_ref: &ConstructorRef): VaultTokenRefs {
        VaultTokenRefs {
            burn_ref: fungible_asset::generate_burn_ref(constructor_ref),
            mint_ref: fungible_asset::generate_mint_ref(constructor_ref),
            transfer_ref: fungible_asset::generate_transfer_ref(constructor_ref),
        }
    }

    inline fun get_vault_seeds<X,Y>(): vector<u8> {
        let seeds = vector[];
        vector::append(&mut seeds, bcs::to_bytes(&type_info::type_name<LPToken<X,Y>>()));
        seeds
    }

    inline fun vault_token_name<X,Y>(): String {
        let token_symbol = string::utf8(b"G-");
        string::append(&mut token_symbol, coin::symbol<LPToken<X,Y>>());
        token_symbol
    }

    public(friend) fun mint<X,Y>(
        lp: &signer,
        lp_coins: Coin<LPToken<X,Y>>
    ) acquires LPVault, VaultConfigs {
        let configs = safe_vault_configs(get_app_signer_address());
        assert!(!configs.is_paused, ERROR_VAULT_PAUSED);
        let vault = vault<X,Y>();
        let vault_store = ensure_vault_token_store(signer::address_of(lp), vault);
        let amount = coin::value(&lp_coins);
        assert!(amount > 0, ERROR_ZERO_AMOUNT);
        let vault_data = unchecked_mut_vault_data<LPVault<X,Y>>(&vault);
        let mint_ref = &vault_data.vault_token_refs.mint_ref;
        let vault_token_supply = option::destroy_some(fungible_asset::supply(vault));
        let vault_token_amount = if(vault_token_supply == 0) {
            (math128::sqrt((amount as u128)) as u64)
        } else {
            math64::mul_div(amount, (vault_token_supply as u64), coin::value(&vault_data.lp_coins))
        };
        coin::merge(&mut vault_data.lp_coins, lp_coins);
        let vault_tokens = fungible_asset::mint(mint_ref, vault_token_amount);
        fungible_asset::deposit_with_ref(&vault_data.vault_token_refs.transfer_ref, vault_store, vault_tokens);
    }

    public(friend) fun ensure_vault_token_store<T: key>(addr: address, vault: Object<T>): Object<FungibleStore> {
        primary_fungible_store::ensure_primary_store_exists(addr, vault);
        let store = primary_fungible_store::primary_store(addr, vault);
        store
    }

    #[view]
    public fun vault<X,Y>(): Object<LPVault<X,Y>> {
        object::address_to_object(vault_address<X,Y>())
    }

    #[view]
    public fun vault_address<X,Y>(): address {
        if(!coin_helper::is_sorted<X,Y>()){
            return vault_address<Y,X>()
        };
        object::create_object_address(&get_app_signer_address(), get_vault_seeds<X,Y>())
    }

    inline fun unchecked_mut_vault_data<T:key>(vault: &Object<T>): &mut T acquires LPVault {
        borrow_global_mut<T>(object::object_address(vault))
    }

    inline fun safe_vault_data<T:key>(vault: &Object<T>): &T acquires LPVault {
        borrow_global<T>(object::object_address(vault))
    }

    public(friend) fun burn<X,Y>(
        lp: &signer,
        amount: u64,
    ): Coin<LPToken<X,Y>> acquires LPVault {
        assert!(amount > 0, ERROR_ZERO_AMOUNT);
        let user_addr = signer::address_of(lp);
        let vault = vault<X,Y>();
        let store = ensure_vault_token_store(user_addr, vault);

        let vault_token_supply = option::destroy_some(fungible_asset::supply(vault));
        let vault_data = unchecked_mut_vault_data(&vault);

        fungible_asset::burn_from(&vault_data.vault_token_refs.burn_ref, store, amount);

        let lp_reserve = (coin::value(&vault_data.lp_coins) as u128);
        let amount_to_redeem = (
            math128::mul_div(
                (amount as u128),
                lp_reserve,
                vault_token_supply
            ) as u64
        );

        assert!(amount_to_redeem > 0, ERROR_INSUFFICIENT_LIQUIDITY_REDEEMED);

        coin::extract(&mut vault_data.lp_coins, amount_to_redeem)
    }

    public(friend) fun harvest<X,Y>() acquires LPVault, VaultConfigs {
        if(!coin_helper::is_sorted<X,Y>()) {
            return harvest<Y,X>()
        };
        let vault = vault<X,Y>();
        let vault_data = unchecked_mut_vault_data(&vault);
        let liquidity = coin::value(&vault_data.lp_coins);
        assert!(liquidity > 0, ERROR_ZERO_COINS_TO_HARVEST);
        let lp_coins = coin::extract(&mut vault_data.lp_coins, liquidity);
        let app_signer = &get_app_signer(get_app_signer_address());
        supra_account::deposit_coins(get_app_signer_address(), lp_coins);
        // swap functions
        let total_lp_supply = swap::total_lp_supply<X,Y>();
        let (balance_x, balance_y, _) = swap::token_reserves<X,Y>();
        let amount_x = ((balance_x as u128) * (liquidity as u128) / total_lp_supply as u64);
        let amount_y = ((balance_y as u128) * (liquidity as u128) / total_lp_supply as u64);

        router::remove_liquidity<X,Y>(
            app_signer,
            liquidity,
            amount_x,
            amount_y,
        );

        let amount_x = coin::balance<X>(get_app_signer_address());
        let amount_y = coin::balance<Y>(get_app_signer_address());

        router::add_liquidity<X,Y>(
            app_signer,
            amount_x,
            amount_y,
            0,
            0
        );

        let new_liquidity = coin::balance<LPToken<X,Y>>(get_app_signer_address());
        // debug::print(&amount_x);
        // debug::print(&amount_y);
        debug::print(&new_liquidity);
        debug::print(&liquidity);
        assert!(new_liquidity > liquidity, ERROR_NO_REWARDS_TO_HARVEST);
        let added_liquidity = new_liquidity - liquidity;
        let liquidity_fee = math64::mul_div(added_liquidity, vault_data.vault_fee_bps, FEE_SCALE);

        let total_lp_supply = swap::total_lp_supply<X,Y>();
        let (balance_x, balance_y, _) = swap::token_reserves<X,Y>();
        let amount_x = ((balance_x as u128) * (liquidity_fee as u128) / total_lp_supply as u64);
        let amount_y = ((balance_y as u128) * (liquidity_fee as u128) / total_lp_supply as u64);

        router::remove_liquidity<X,Y>(
            app_signer,
            liquidity_fee,
            amount_x,
            amount_y
        );

        let fee_coins_1 = coin::withdraw<X>(app_signer, coin::balance<X>(get_app_signer_address()));
        let fee_coins_2 = coin::withdraw<Y>(app_signer, coin::balance<Y>(get_app_signer_address()));

        coin::merge(&mut vault_data.fee_coins_1, fee_coins_1);
        coin::merge(&mut vault_data.fee_coins_2, fee_coins_2);

        vault_data.last_harvest = timestamp::now_seconds();
    }

    #[view]
    public fun all_vaults(): vector<address> {
        
    }


    // #[test_only]
    // use std::debug;

    #[test_only]
    use supra_framework::account;

    #[test_only]
    public fun init_module_for_test(deployer: &signer) {
        init_module(deployer);
    }

    #[test_only]
    public fun initialize_and_mint_coins_for_test<X,Y>(acc: &signer, x_amount: u64, y_amount: u64): (Coin<X>, Coin<Y>) {
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<X>(
            acc,
            string::utf8(b"t1"),
            string::utf8(b"T1"),
            8,
            false
        );
        let x_coins = coin::mint<X>(x_amount, &mint_cap);
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_freeze_cap(freeze_cap);
        coin::destroy_mint_cap(mint_cap);

        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<Y>(
            acc,
            string::utf8(b"t2"),
            string::utf8(b"T2"),
            8,
            false
        );
        let y_coins = coin::mint<Y>(y_amount, &mint_cap);
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_freeze_cap(freeze_cap);
        coin::destroy_mint_cap(mint_cap);
        (x_coins, y_coins)
    }

    #[test_only]
    struct CoinA has key{}

    #[test_only]
    struct CoinB has key{}


    #[test_only]
    public fun add_liquidity_to_swap_test<X,Y>(acc: &signer, x_amount: u64, y_amount: u64) {
        evo::router::add_liquidity<X,Y>(
            acc,
            x_amount,
            y_amount,
            x_amount,
            y_amount
        )
    }

    #[test(supra_framework = @0x1, evo_framework = @evo_framework, dev = @dev, admin= @admin, treasury = @treasury, resource_account = @evo, alice = @0x123, bob = @0x456, new_acc = @0xcafe)]
    public fun create_new_vault_test(
        supra_framework: signer,
        evo_framework: &signer,
        dev: &signer,
        admin: &signer,
        treasury: &signer,
        resource_account: &signer,
        alice: &signer,
        bob: &signer,
        new_acc: &signer
    ): address acquires VaultConfigs {
        evo::swap_test::setup_test_with_genesis(supra_framework, evo_framework, dev, admin, treasury, resource_account, alice, bob);
        init_module_for_test(new_acc);

        let acc_addr = signer::address_of(new_acc);
        account::create_account_for_test(acc_addr);

        let amount_a = 100 * math64::pow(10, 8);
        let amount_b = 100 * math64::pow(10, 8);

        let (a_coins, b_coins) = initialize_and_mint_coins_for_test<CoinA, CoinB>(
            new_acc,
            amount_a,
            amount_b
        );

        coin::register<CoinA>(new_acc);
        coin::register<CoinB>(new_acc);

        coin::deposit<CoinA>(acc_addr, a_coins);
        coin::deposit<CoinB>(acc_addr, b_coins);

        add_liquidity_to_swap_test<CoinA, CoinB>(new_acc, amount_a/2, amount_b/2);
        assert!(coin::balance<LPToken<CoinA, CoinB>>(acc_addr) > 0, 0);

        new_vault<CoinA, CoinB>()
    }

    #[test(supra_framework = @0x1, evo_framework = @evo_framework, dev = @dev, admin= @admin, treasury = @treasury, resource_account = @evo, alice = @0x123, bob = @0x456, new_acc = @0xcafe)]
    public fun mint_test(
        supra_framework: signer,
        evo_framework: &signer,
        dev: &signer,
        admin: &signer,
        treasury: &signer,
        resource_account: &signer,
        alice: &signer,
        bob: &signer,
        new_acc: &signer
    ): address acquires VaultConfigs, LPVault {
        let vault_addr = create_new_vault_test(supra_framework, evo_framework, dev, admin, treasury, resource_account, alice, bob, new_acc);
        let metadata = object::address_to_object<Metadata>(vault_addr);
        let lp_coins = coin::withdraw<LPToken<CoinA, CoinB>>(new_acc, coin::balance<LPToken<CoinA,CoinB>>(signer::address_of(new_acc)));
        mint(new_acc, lp_coins);
        let vt = fungible_asset::balance(ensure_vault_token_store(signer::address_of(new_acc), metadata));
        assert!(coin::balance<LPToken<CoinA,CoinB>>(signer::address_of(new_acc)) == 0, 0);
        assert!(vt > 0, 1);
        vault_addr
    }


    #[test(supra_framework = @0x1, evo_framework = @evo_framework, dev = @dev, admin= @admin, treasury = @treasury, resource_account = @evo, alice = @0x123, bob = @0x456, new_acc = @0xcafe)]
    public fun burn_test(
        supra_framework: signer,
        evo_framework: &signer,
        dev: &signer,
        admin: &signer,
        treasury: &signer,
        resource_account: &signer,
        alice: &signer,
        bob: &signer,
        new_acc: &signer
    ) acquires VaultConfigs, LPVault {
        let vault_addr = mint_test(supra_framework, evo_framework, dev, admin, treasury, resource_account, alice, bob, new_acc);
        let metadata = object::address_to_object<Metadata>(vault_addr);
        let store = ensure_vault_token_store(signer::address_of(new_acc), metadata);
        let vt = fungible_asset::balance(store);
        let lp_coins = burn<CoinA, CoinB>(new_acc, vt);
        supra_account::deposit_coins(signer::address_of(new_acc), lp_coins);
        let new_vt = fungible_asset::balance(store);
        assert!(new_vt == 0, 0);
        assert!(coin::balance<LPToken<CoinA,CoinB>>(signer::address_of(new_acc)) > 0, 0);
    }


    #[test(supra_framework = @0x1, evo_framework = @evo_framework, dev = @dev, admin= @admin, treasury = @treasury, resource_account = @evo, alice = @0x123, bob = @0x456, new_acc = @0xcafe, john = @0x111)]
    #[expected_failure]
    public fun harvest_test(
        supra_framework: signer,
        evo_framework: &signer,
        dev: &signer,
        admin: &signer,
        treasury: &signer,
        resource_account: &signer,
        alice: &signer,
        bob: &signer,
        new_acc: &signer,
        john: &signer
    ) acquires VaultConfigs, LPVault{
        mint_test(supra_framework, evo_framework, dev, admin, treasury, resource_account, alice, bob, new_acc);
        account::create_account_for_test(signer::address_of(john));
        let input_x = 50 * math64::pow(10, 8);
        let coins_a_for_john = coin::withdraw<CoinA>(new_acc, input_x);
        supra_account::deposit_coins<CoinA>(signer::address_of(john), coins_a_for_john);
        router::swap_exact_input<CoinA, CoinB>(john, input_x, 0);
        harvest<CoinA,CoinB>();
        let vault = borrow_global<LPVault<CoinA,CoinB>>(vault_address<CoinA,CoinB>());
        debug::print(&coin::value(&vault.fee_coins_1));
    }




}