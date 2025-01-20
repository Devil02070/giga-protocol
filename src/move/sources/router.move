module addrx::router {
    use addrx::lp_vault;
    use addrx::coin_helper;
    use evo::swap::LPToken;
    use supra_framework::supra_account;
    use supra_framework::coin::{Self, Coin};

    public entry fun create_vault_entry<X,Y>(
        _: &signer,
    ) {
        create_vault<X,Y>();
    }

    public fun create_vault<X,Y>(): address {
        if(!coin_helper::is_sorted<X,Y>()){
            return create_vault<Y,X>()
        };
        lp_vault::new_vault<X,Y>()
    }

    public entry fun add_liquidity_entry<X,Y>(
        acc: &signer,
        amount: u64
    ) {
        add_liquidity<X,Y>(acc, amount)
    }

    public fun add_liquidity<X,Y>(
        acc: &signer,
        amount: u64
    ) {
        if(!coin_helper::is_sorted<X,Y>()){
            return add_liquidity<Y,X>(acc, amount)
        };
        let lp_coins = coin::withdraw<LPToken<X,Y>>(acc, amount);
        lp_vault::mint<X,Y>(acc, lp_coins)
    }

     public entry fun remove_liquidity_entry<X,Y>(
        acc: &signer,
        amount: u64,
        recipient: address
    ) {
        if(!coin_helper::is_sorted<X,Y>()){
            return remove_liquidity_entry<Y,X>(acc, amount, recipient)
        };
        let lp_coins = remove_liquidity<X,Y>(acc, amount);
        supra_account::deposit_coins(recipient, lp_coins);
    }

    public fun remove_liquidity<X,Y>(
        acc: &signer,
        amount: u64
    ): Coin<LPToken<X,Y>> {
        lp_vault::burn<X,Y>(acc, amount)
    }
}