# Simple ERC-20 Token & staking contract

Verified contract - 

Try running some of the following tasks:

Local deploy token
```shell
npx hardhat run scripts/deploy_token.ts --network localhost
```

Local deploy staking
```shell
npx hardhat run scripts/deploy_st.ts --network localhost
```

Rinkeby deploy token
```shell
npx hardhat run scripts/deploy_token.ts --network rinkeby
```

Rinkeby deploy staking
```shell
npx hardhat run scripts/deploy_st.ts --network rinkeby
```


Test
```shell
npx hardhat test
```

stake
```shell
npx hardhat stake --value <amount>
```

claim
```shell
npx hardhat claim
```

unstake
```shell
npx hardhat unstake
```


transfer
```shell
npx hardhat transfer --recipient <address> --value <amount>
```

transferFrom
```shell
npx hardhat transferFrom --sender <address> --recipient <address> --value <amount>
```

approve
```shell
npx hardhat approve --recipient <address> --value <amount>
```