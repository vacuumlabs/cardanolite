![image](https://user-images.githubusercontent.com/837681/53001830-d7c8a600-342b-11e9-9038-e745cc91e543.png)

### @cardano-foundation/ledgerjs-hw-app-cardano

JS Library for communication with Ledger Hardware Wallets.
This library is compatible with the [Cardano ADA Ledger Application](https://github.com/cardano-foundation/ledger-app-cardano).

### Example code

Example code interacting with `hw-app-cardano` is provided in `example_node` directory.
To compile run `yarn build-example`.
Run example by `node example-node/lib/index.js`.

### Tests

Automated tests are provided. There are two types of tests

1. `yarn test-integration`. Tests JS api.
2. `yarn test-direct`. Mostly tests vartious corner cases. There are some extensive tests which are disabled by default, see tests source code. Also note that for these tests it is advised to install developer version of Cardano app with _headless_ mode enabled, otherwise you spend your entire life confirming various prompts on device.
