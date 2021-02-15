describe('AdaLite Test Ledger', () => {
  require('../../unit/common/setup-test-config')

  // describe('CBOR', () => {
  //   require('./cbor')
  // })
  // describe('Mnemonic Crypto Provider', () => {
  //   require('./cardano-wallet-secret-crypto-provider')
  // })
  // describe('Address Manager', () => {
  //   require('./address-manager')
  // })
  // describe('Blockchain Explorer', () => {
  //   require('./blockchain-explorer')
  // })
  // describe('Cardano Wallet', () => {
  //   require('./cardano-wallet')
  // })
  // describe('Import/Export Wallet as JSON', () => {
  //   require('./keypass-json')
  // })
  // describe('Actions', () => {
  //   require('./actions/actions')
  // })
  // describe('Shelley testnet', () => {
  //   require('./shelley')
  // })
  // describe('Address manager', () => {
  //   require('../../unit/wallet/address-manager')
  // })
  // describe('Account manager', () => {
  //   require('../../unit/wallet/account-manager')
  // })
  // eslint-disable-next-line prefer-arrow-callback
  describe('Account', function() {
    this.timeout(10000)
    require('./singTx')
  }).timeout(100000000)
})
