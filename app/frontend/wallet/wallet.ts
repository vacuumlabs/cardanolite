import {Account} from './account'
import BlockchainExplorer from './blockchain-explorer'

const Wallet = ({config, cryptoProvider}) => {
  const blockchainExplorer = BlockchainExplorer(config)

  const accounts: Array<ReturnType<typeof Account>> = []

  function discoverNewAccount() {
    const newAccount = Account({
      config,
      cryptoProvider,
      blockchainExplorer,
      accountIndex: accounts.length,
    })
    accounts.push(newAccount)
    return newAccount
  }

  async function discoverAccounts() {
    let shouldExplore = true
    let accountIndex = 0
    while (shouldExplore) {
      const newAccount = accounts[accountIndex] || discoverNewAccount()
      const isAccountUsed = await newAccount.isAccountUsed()

      shouldExplore = isAccountUsed && config.shouldExportPubKeyBulk && accounts.length < 100
      accountIndex += 1
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

  function checkCryptoProviderVersion(type: string) {
    try {
      cryptoProvider.checkVersion(type)
    } catch (e) {
      return {code: e.name, message: e.message}
    }
    return null
  }

  async function getAccountsInfo(validStakepools) {
    await discoverAccounts()
    const accountsInfo = await Promise.all(
      accounts.map((account) => account.getAccountInfo(validStakepools))
    )
    const totalWalletBalance = accountsInfo.reduce(
      (a, {shelleyBalances}) =>
        shelleyBalances.stakingBalance + shelleyBalances.nonStakingBalance + a,
      0
    )
    const totalRewardsBalance = accountsInfo.reduce(
      (a, {shelleyBalances}) => shelleyBalances.rewardsAccountBalance + a,
      0
    )
    const shouldShowSaturatedBanner = accountsInfo.some(
      ({poolRecommendation}) => poolRecommendation.shouldShowSaturatedBanner
    )
    return {
      accountsInfo,
      totalWalletBalance,
      totalRewardsBalance,
      shouldShowSaturatedBanner,
    }
  }

  function getValidStakepools(): Promise<any> {
    return blockchainExplorer.getValidStakepools()
  }

  return {
    isHwWallet,
    getWalletName,
    submitTx,
    getWalletSecretDef,
    fetchTxInfo,
    checkCryptoProviderVersion,
    accounts,
    discoverNewAccount,
    discoverAccounts,
    getAccountsInfo,
    getValidStakepools,
  }
}

export {Wallet}
