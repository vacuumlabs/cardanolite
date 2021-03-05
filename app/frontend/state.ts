import {ADALITE_CONFIG} from './config'
import {MainTabs} from './constants'
import {localStorageVars} from './localStorage'
import {AccountInfo, AuthMethodType, Lovelace} from './types'
export interface SendTransactionSummary {
  amount?: Lovelace
  donation?: Lovelace
  fee: Lovelace
  plan: any
  tab?: any
  deposit: any
}

export interface State {
  // general
  loading: boolean
  loadingMessage: string
  alert: any // TODO
  sendSentry: {
    event?: any
    resolve?: (shouldSend: boolean) => void
  }
  errorBannerContent: string
  shouldShowUnexpectedErrorModal: boolean
  error?: any
  activeMainTab: MainTabs
  shouldShowContactFormModal?: boolean
  shouldShowExportOption?: boolean
  conversionRates?: {data: {USD: number; EUR: number}}

  // cache
  displayWelcome: boolean
  shouldShowStakingBanner: boolean
  displayInfoModal: boolean
  shouldShowPremiumBanner?: boolean

  // login / logout
  autoLogin: boolean
  authMethod: AuthMethodType | null
  shouldShowDemoWalletWarningDialog: boolean
  logoutNotificationOpen: boolean
  walletIsLoaded: boolean
  isShelleyCompatible: any
  shouldShowNonShelleyCompatibleDialog: any
  walletLoadingError?: any
  shouldShowWalletLoadingErrorModal?: boolean
  usingHwWallet?: boolean
  isBigDelegator: boolean
  shouldShowSaturatedBanner?: boolean
  mnemonicAuthForm: {
    mnemonicInputValue: string
    mnemonicInputError: {code: string}
    formIsValid: boolean
  }
  hwWalletName?: string
  isDemoWallet?: boolean
  shouldShowGenerateMnemonicDialog?: boolean
  shouldShowMnemonicInfoAlert: boolean

  // send form
  sendAddress: {
    fieldValue: string
  }
  sendAmount: {
    fieldValue: string
    coins: Lovelace
  }
  sendAddressValidationError?: any
  sendAmountValidationError?: any
  calculatingFee?: boolean

  // donation
  donationAmount: {
    fieldValue: string
    coins: Lovelace
  }
  checkedDonationType: string // TODO: enum
  donationAmountValidationError?: any
  shouldShowCustomDonationInput: boolean
  maxDonationAmount: number
  percentageDonationValue: number
  percentageDonationText: string
  isThresholdAmountReached: boolean

  // delegation form
  calculatingDelegationFee?: any
  isDelegationValid?: any
  shelleyDelegation?: {
    selectedPool?: any
    delegationFee?: any
  }
  delegationValidationError?: any
  gettingPoolInfo: boolean

  // transaction
  sendTransactionSummary: SendTransactionSummary
  rawTransactionOpen: boolean
  rawTransaction: string
  transactionFee?: any
  sendResponse: any // TODO
  txConfirmType: string
  txSuccessTab: string
  transactionSubmissionError?: any
  shouldShowConfirmTransactionDialog?: boolean
  shouldShowTransactionErrorModal?: boolean
  shouldShowThanksForDonation?: boolean
  waitingForHwWallet?: boolean
  keepConfirmationDialogOpen: boolean

  // router
  router: {
    pathname: string
    hash: string
  }

  // pool registration
  poolCertTxVars: {
    shouldShowPoolCertSignModal: boolean
    ttl: any
    signature: any
    plan: any
    witnessType: any
  }
  poolRegTxError?: any

  // address detail
  addressVerificationError?: boolean
  showAddressDetail?: {address: string; bip32path: string; copyOnClick: boolean}
  shouldShowAddressVerification?: boolean

  // accounts info
  accountsInfo: Array<AccountInfo>
  maxAccountIndex: number
  shouldNumberAccountsFromOne: boolean
  sourceAccountIndex: number
  activeAccountIndex: number
  targetAccountIndex: number
  totalWalletBalance: number
  totalRewardsBalance: number

  shouldShowSendTransactionModal: boolean
  shouldShowDelegationModal: boolean
  sendTransactionTitle: string
  delegationTitle: string

  currentDelegation?: {
    // TODO: probably useless
    stakePool?: any
  }
  validStakepools?: any | null
}

const initialState: State = {
  //general
  loading: false,
  loadingMessage: '',
  alert: {
    show: false,
    type: 'success', // OPTIONS are error, warning, success
    title: 'Wrong mnemonic',
    hint: 'Hint: Ensure that your mnemonic is without mistake.',
  },
  sendSentry: {},
  errorBannerContent: '',
  shouldShowUnexpectedErrorModal: false,
  activeMainTab: MainTabs.SENDING,

  // cache
  displayWelcome:
    !(window.localStorage.getItem(localStorageVars.WELCOME) === 'true') &&
    ADALITE_CONFIG.ADALITE_DEVEL_AUTO_LOGIN !== 'true',
  shouldShowStakingBanner: !(
    window.localStorage.getItem(localStorageVars.STAKING_BANNER) === 'true'
  ),
  shouldShowPremiumBanner: !(
    window.localStorage.getItem(localStorageVars.PREMIUM_BANNER) === 'true'
  ),
  displayInfoModal: !(window.localStorage.getItem(localStorageVars.INFO_MODAL) === 'true'),

  // login / logout
  autoLogin:
    ADALITE_CONFIG.ADALITE_ENV === 'local' && ADALITE_CONFIG.ADALITE_DEVEL_AUTO_LOGIN === 'true',
  authMethod: ['#trezor', '#hw-wallet'].includes(window.location.hash)
    ? AuthMethodType.HW_WALLET
    : null,
  shouldShowDemoWalletWarningDialog: false,
  logoutNotificationOpen: false,
  walletIsLoaded: false,
  isShelleyCompatible: true,
  shouldShowNonShelleyCompatibleDialog: false,
  isBigDelegator: false,
  mnemonicAuthForm: {
    mnemonicInputValue: '',
    mnemonicInputError: null,
    formIsValid: false,
  },
  shouldShowMnemonicInfoAlert: false,

  // send form
  // todo - object (sub-state) from send-ada form
  sendAddress: {fieldValue: ''},
  sendAmount: {fieldValue: '0', coins: 0 as Lovelace},

  // donation
  donationAmount: {fieldValue: '0', coins: 0 as Lovelace},
  checkedDonationType: '',
  shouldShowCustomDonationInput: false,
  maxDonationAmount: Infinity,
  percentageDonationValue: 0,
  percentageDonationText: '0.2%', // What is this and why it isn't in config?
  isThresholdAmountReached: false,

  // delegation
  shelleyDelegation: {
    delegationFee: 0.0,
    selectedPool: {
      poolHash: '',
    },
  },
  gettingPoolInfo: false,

  // transaction
  sendTransactionSummary: {
    amount: 0 as Lovelace,
    fee: 0 as Lovelace,
    donation: 0 as Lovelace,
    plan: null,
    deposit: 0,
  },
  rawTransactionOpen: false,
  rawTransaction: '',
  transactionFee: 0,
  sendResponse: {},
  txConfirmType: '',
  txSuccessTab: '',
  keepConfirmationDialogOpen: false,

  // router
  router: {
    pathname: window.location.pathname,
    hash: window.location.hash,
  },

  // pool registration
  poolCertTxVars: {
    shouldShowPoolCertSignModal: false,
    ttl: 0,
    signature: null,
    plan: null,
    witnessType: null,
  },

  // accounts info
  accountsInfo: [
    {
      accountXpubs: {
        shelleyAccountXpub: null,
        byronAccountXpub: null,
      },
      stakingXpub: null,
      stakingAddress: null,
      balance: 0,
      shelleyBalances: {
        stakingBalance: 0,
        nonStakingBalance: 0,
        rewardsAccountBalance: 0,
      },
      shelleyAccountInfo: {
        accountPubkeyHex: '',
        shelleyXpub: '',
        byronXpub: '',
        stakingKey: null,
        stakingAccountAddress: '',
        currentEpoch: 0,
        delegation: {},
        hasStakingKey: false,
        rewards: 0,
        rewardDetails: {
          upcoming: null,
          nearest: null,
          currentDelegation: null,
        },
        value: 0,
      },
      transactionHistory: [],
      stakingHistory: [],
      visibleAddresses: [],
      poolRecommendation: {
        isInRecommendedPoolSet: true,
        recommendedPoolHash: '',
        status: '',
        shouldShowSaturatedBanner: false,
      },
      isUsed: false,
      accountIndex: 0,
    },
  ],
  maxAccountIndex: 0,
  shouldNumberAccountsFromOne: false,
  sourceAccountIndex: 0,
  activeAccountIndex: 0,
  targetAccountIndex: 0,
  totalWalletBalance: 0,
  totalRewardsBalance: 0,

  shouldShowSendTransactionModal: false,
  shouldShowDelegationModal: false,
  sendTransactionTitle: '',
  delegationTitle: '',
}
export type SetStateFn = (newState: Partial<State>) => void
export type GetStateFn = () => State

export const getSourceAccountInfo = (state: State) => state.accountsInfo[state.sourceAccountIndex]
export const getActiveAccountInfo = (state: State) => state.accountsInfo[state.activeAccountIndex]

export {initialState}
