# COMPILE COMMAND

```bash
supra move tool compile --dev --package-dir /supra/configs/ts_workspace/giga-protocol/src/move
```

# TEST COMMAND
```bash
supra move tool test --package-dir /supra/configs/ts_workspace/giga-protocol/src/move
```

# PUBLISH COMMAND
```bash
supra move tool publish --package-dir /supra/configs/ts_workspace/giga-protocol/src/move --profile chat --url https://rpc-testnet.supra.com 
```

# CREATE VAULT
```bash
supra move tool run \
    --function-id 0xe45c507269c96c33ab0bb2726068581c32924c202ea5975859e72ad989e7c10a::router::create_vault_entry \
    --type-args "0x1::supra_coin::SupraCoin" "0xd35f0429c49b5c8914dc34488d788873bd23da7c19f617ad3eb7418241d938b6::VB::VB"\
    --profile chat \
    --url https://rpc-testnet.supra.com
```

supra move account fund-with-faucet --profile giga --url https://rpc-testnet.supra.com 