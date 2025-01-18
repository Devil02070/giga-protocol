module addrx::lp_vault {
    use std::signer;
    use evo::swap::LPToken;
    use supra_framework::coin::{Self, Coin};
    use supra_framework::object::{Self, ConstructorRef};
    use aptos_std::smart_vector::{Self, SmartVector};
    use supra_framework::fungible_asset::{Self, Metadata, BurnRef, MintRef, TransferRef};
    use supra_framework::timestamp;
    use supra_framework::primary_fungible_store;
    use std::string::{Self, String};
    use aptos_std::type_info;
    use std::vector;
    use std::option;
    use aptos_std::bcs;
    use supra_framework::event;

    friend addrx::router;

    const LP_TOKEN_DOES_NOT_EXIST: u64 = 0;

    const APP_OBJECT_SEED: vector<u8> = b"app_seed";
    const FEE_SCALE: u64 = 10000;
    const VAULT_TOKEN_DECIMALS: u8 = 8;
    const DEFAULT_VAULT_FEE_BPS: u64 = 450; // 4.5% 

    struct VaultConfigs has key {
        all_vaults: SmartVector<String>,
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

    public(friend) fun new_vault<X,Y>(): address acquires VaultConfigs {
        assert!(coin::is_coin_initialized<LPToken<X,Y>>(), LP_TOKEN_DOES_NOT_EXIST);
        let app_signer_addr = get_app_signer_address();
        let configs = unchecked_mut_vault_configs(app_signer_addr);
        let app_signer = &object::generate_signer_for_extending(&configs.app_extend_ref);
        let vault_constructor_ref = create_vault_token<X,Y>(app_signer);
        let vault_token = object::object_from_constructor_ref<Metadata>(vault_constructor_ref);
        fungible_asset::create_store(vault_constructor_ref, vault_token);
        let vault = LPVault {
            lp_coins: coin::zero<LPToken<X,Y>>(),
            fee_coins_1: coin::zero<X>(),
            fee_coins_2: coin::zero<Y>(),
            last_harvest: timestamp::now_seconds(),
            vault_fee_bps: configs.vault_fee_bps,
            vault_token_refs: create_vault_token_refs(vault_constructor_ref),
        };
        move_to(app_signer, vault);
        smart_vector::push_back(&mut configs.all_vaults, type_info::type_name<LPVault<X,Y>>());

        // event::emit(VaultCreated { 
        //     vault: type_info::type_name<LPVault<X,Y>>(),
        //     token_1: type_info::type_name<X>(),
        //     token_2: type_info::type_name<Y>(),
        //     lp_token: type_info::type_name<LPToken<X,Y>>(),
        //     vault_token,
        //     lp_platform,
        //     vault_description
        // });
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
}