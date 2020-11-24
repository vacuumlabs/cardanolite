import {Account} from './account'
import BlockchainExplorer from './blockchain-explorer'

const Wallet = ({config, cryptoProvider}) => {
  const blockchainExplorer = BlockchainExplorer(config)

  const accounts: Array<ReturnType<typeof Account>> = []

  function loadNewAccount(accountIndex: number) {
    const newAccount = Account({
      config,
      cryptoProvider,
      blockchainExplorer,
      accountIndex,
    })
    accounts.push(newAccount)
  }

  async function discoverAccounts() {
    let shouldExplore = true
    let accountIndex = 0
    while (shouldExplore) {
      const newAccount = Account({
        config,
        cryptoProvider,
        blockchainExplorer,
        accountIndex,
      })
      const isAccountUsed = await newAccount.isAccountUsed()
      if (isAccountUsed || accountIndex === 0) accounts.push(newAccount)

      accountIndex += 1
      shouldExplore = isAccountUsed && config.shouldExportPubKeyBulk && accountIndex < 100
    }
  }

  function isHwWallet() {
    return cryptoProvider.isHwWallet()
  }

  function getWalletName() {
    return cryptoProvider.getWalletName()
  }

  function submitTx(signedTx): Promise<any> {
    const params = {
      walletType: getWalletName(),
      // TODO: stakeKey
    }
    const {txBody, txHash} = signedTx
    return blockchainExplorer.submitTxRaw(txHash, txBody, params)
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
    const accountsInfo = await Promise.all(accounts.map((account) => account.getWalletInfo()))
    return Object.assign({}, accountsInfo)
  }

  return {
    isHwWallet,
    getWalletName,
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
