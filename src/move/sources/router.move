module addrx::router {
    use addrx::lp_vault;

    public entry fun create_vault_entry<X,Y>(
        acc: &signer,
    ) {
        create_vault<X,Y>();
    }

    public fun create_vault<X,Y>(): address {
        lp_vault::new_vault<X,Y>()
    }
}