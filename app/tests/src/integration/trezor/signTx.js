import assert from 'assert'
import {accountSettings} from '../../unit/common/account-settings'
import {Account} from '../../../../frontend/wallet/account'
import mnemonicToWalletSecretDef from '../../../../frontend/wallet/helpers/mnemonicToWalletSecretDef'
import BlockchainExplorer from '../../../../frontend/wallet/blockchain-explorer'
import ShelleyTrezorCryptoProvider from '../../../../frontend/wallet/shelley/shelley-trezor-crypto-provider'
import {ADALITE_CONFIG} from '../../../../frontend/config'
import {transactionSettings} from '../../unit/common/tx-settings'
import mockNetwork from '../../unit/common/mock'
import {NETWORKS} from '../../../../frontend/wallet/constants'
import {ShelleyWallet} from '../../../../frontend/wallet/shelley-wallet'

let wallet
let cryptoProvider

const initCryptoProvider = async () => {
  const config = {...ADALITE_CONFIG, isShelleyCompatible: true, shouldExportPubKeyBulk: true}
  return await ShelleyTrezorCryptoProvider({
    config,
    network: NETWORKS[ADALITE_CONFIG.ADALITE_NETWORK],
    forceWebUsb: false,
  })
}

const initWallet = async (cryptoProvider, i) => {
  const blockchainExplorer = BlockchainExplorer(ADALITE_CONFIG, {})
  const config = {...ADALITE_CONFIG, isShelleyCompatible: true, shouldExportPubKeyBulk: true}
  return await ShelleyWallet({
    config,
    randomInputSeed: 30,
    randomChangeSeed: 30,
    cryptoProvider,
    blockchainExplorer,
  })
}

before(async () => {
  ADALITE_CONFIG.ADALITE_CARDANO_VERSION = 'shelley'
  ADALITE_CONFIG.ADALITE_NETWORK = 'MAINNET'
  const mockNet = mockNetwork(ADALITE_CONFIG)
  mockNet.mockBulkAddressSummaryEndpoint()
  mockNet.mockGetAccountInfo()
  mockNet.mockGetStakePools()
  mockNet.mockGetConversionRates()
  mockNet.mockUtxoEndpoint()
  mockNet.mockPoolMeta()
  mockNet.mockGetAccountState()
  mockNet.mockAccountDelegationHistory()
  mockNet.mockAccountStakeRegistrationHistory()
  mockNet.mockWithdrawalHistory()
  mockNet.mockRewardHistory()
  mockNet.mockPoolRecommendation()

  cryptoProvider = await initCryptoProvider()
  wallet = await initWallet(cryptoProvider)
})

describe('Account info', async () => {
  it(`should do anything ${'shit'}`, async () => {
    await wallet.getAccountsInfo()
    assert.deepEqual(xpubs, setting.accountXpubs)
  }).timeout(10000000)
}).timeout(10000000)
