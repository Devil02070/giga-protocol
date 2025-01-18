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
supra move tool publish --package-dir /supra/configs/ts_workspace/giga-protocol/src/move --profile default --url https://rpc-testnet.supra.com 
```

# CREATE VAULT
```bash
supra move tool run \
    --function-id 0x161954cac8c983fa7cd4c792f503e752595a5434a8dec577b09a747e36f022b8::router::create_vault_entry \
    --type-args "0x1::supra_coin::SupraCoin" "0x81155e25c265b20b713d03ba19e287968dc1f9a3946d1aa47b0de7f1eed671b3::ANT::ANT" "0x53f58e405ed45a7294d2064cedb3de5c96263ee8d3aa8d4d84f48b3089dfdab9::swap::LPToken<0x1::supra_coin::SupraCoin, 0x81155e25c265b20b713d03ba19e287968dc1f9a3946d1aa47b0de7f1eed671b3::ANT::ANT>" \
    --args "string:evo" "string:newvault" \
    --profile default \
    --url https://rpc-testnet.supra.com
```