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
supra move tool publish --package-dir /supra/configs/ts_workspace/giga-protocol/src/move --profile giga_protocol --url https://rpc-testnet.supra.com 
```

# FAUCET
```bash
supra move account fund-with-faucet --profile giga_protocol --url https://rpc-testnet.supra.com 
```

supra move tool run \
    --function-id 0xe45c507269c96c33ab0bb2726068581c32924c202ea5975859e72ad989e7c10a::router::create_vault_entry \
    --type-args supra move tool run \
    --function-id 0xe45c507269c96c33ab0bb2726068581c32924c202ea5975859e72ad989e7c10a::router::create_vault_entry \
    --type-args "0x1::supra_coin::SupraCoin" "0xd35f0429c49b5c8914dc34488d788873bd23da7c19f617ad3eb7418241d938b6::VB::VB"\
    --profile chat \
    --url https://rpc-testnet.supra.com "0xd35f0429c49b5c8914dc34488d788873bd23da7c19f617ad3eb7418241d938b6::VB::VB"\
    --profile chat \
    --url https://rpc-testnet.supra.com

```bash
    supra move tool run --function-id '0x53f58e405ed45a7294d2064cedb3de5c96263ee8d3aa8d4d84f48b3089dfdab9::router::add_liquidity' --type-args "0x1::supra_coin::SupraCoin" "0xd35f0429c49b5c8914dc34488d788873bd23da7c19f617ad3eb7418241d938b6::VB::VB" --args "u64:[50000]" "u64:[50000]" "u64:[0]" "u64:[0]" --profile evo --url https://rpc-testnet.supra.com
```