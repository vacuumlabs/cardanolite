import {Account} from './account'
import BlockchainExplorer from './blockchain-explorer'

const Wallet = ({config, cryptoProvider, isShelleyCompatible}) => {
  const blockchainExplorer = BlockchainExplorer(config)

  const accounts: Array<ReturnType<typeof Account>> = []

  // accounts[0] = Account({
  //   config,
  //   isShelleyCompatible,
  //   cryptoProvider,
  //   blockchainExplorer,
  //   accountIndex: 0,
  // })

  function loadNewAccount(accountIndex: number) {
    const newAccount = Account({
      config,
      isShelleyCompatible,
      cryptoProvider,
      blockchainExplorer,
      accountIndex,
    })
    accounts.push(newAccount)
  }

  async function discoverAccounts() {
    let isAccountUsed = true
    let accountIndex = 0
    while (isAccountUsed) {
      // for
      const newAccount = Account({
        config,
        isShelleyCompatible,
        cryptoProvider,
        blockchainExplorer,
        accountIndex,
      })
      isAccountUsed = await newAccount.isAccountUsed()
      accountIndex += 1
      if (isAccountUsed) accounts.push(newAccount)
    }
  }

  function isHwWallet() {
    return cryptoProvider.isHwWallet()
  }

  function getHwWalletName() {
    return isHwWallet ? (cryptoProvider as any).getHwWalletName() : undefined
  }

  function submitTx(signedTx): Promise<any> {
    const {txBody, txHash} = signedTx
    return blockchainExplorer.submitTxRaw(txHash, txBody)
  }

  function getWalletSecretDef() {
    return {
      rootSecret: cryptoProvider.getWalletSecret(),
      derivationScheme: cryptoProvider.getDerivationScheme(),
    }
  }

  async function fetchTxInfo(txHash) {
    return await blockchainExplorer.fetchTxInfo(txHash)
  }

  function checkCryptoProviderVersion() {
    try {
      cryptoProvider.checkVersion(true)
    } catch (e) {
      return {code: e.name, message: e.message}
    }
    return null
  }

  function getBalance() {
    return 0
  }

  async function getAccountsInfo() {
    await discoverAccounts()
    console.log(accounts)
    const accountsInfo = await Promise.all(accounts.map((account) => account.getWalletInfo()))
    return Object.assign({}, accountsInfo)
  }

  return {
    isHwWallet,
    getHwWalletName,
    submitTx,
    getWalletSecretDef,
    fetchTxInfo,
    checkCryptoProviderVersion,
    getBalance,
    accounts,
    loadNewAccount,
    discoverAccounts,
    getAccountsInfo,
  }
}

export {Wallet}
