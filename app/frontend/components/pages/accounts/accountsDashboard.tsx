import {Fragment, h} from 'preact'
import {connect} from '../../../helpers/connect'
import actions from '../../../actions'
import printAda from '../../../helpers/printAda'
import {State} from '../../../state'
import {AdaIcon} from '../../common/svg'
import Alert from '../../common/alert'
import SendTransactionModal from './sendTransactionModal'
import DelegationModal from './delegationModal'
import ConfirmTransactionDialog from '../../../../frontend/components/pages/sendAda/confirmTransactionDialog'
import AccountTile from './accountTile'
import {AccountInfo, Lovelace} from '../../../../frontend/types'
import Conversions from '../../common/conversions'

type DashboardProps = {
  accountsInfo: Array<AccountInfo>
  maxAccountIndex: number
  reloadWalletInfo: any
  shouldShowSendTransactionModal: boolean
  shouldShowDelegationModal: boolean
  totalWalletBalance: number
  totalRewardsBalance: number
  shouldShowConfirmTransactionDialog: boolean
  conversionRates: any
}

const AccountsDashboard = ({
  accountsInfo,
  maxAccountIndex,
  reloadWalletInfo,
  shouldShowSendTransactionModal,
  shouldShowDelegationModal,
  totalWalletBalance,
  totalRewardsBalance,
  shouldShowConfirmTransactionDialog,
  conversionRates,
}: DashboardProps) => {
  const InfoAlert = () => (
    <Fragment>
      <div className="dashboard-column account sidebar-item info">
        <Alert alertType="info sidebar">
          <p>
            <strong>Accounts</strong> offer the possibility to split the funds on your wallet. You
            can delegate to different stakepool from each account. Each account has its own balance,
            set of addresses and keys.
          </p>
        </Alert>
      </div>
      <div className="dashboard-column account sidebar-item info">
        <Alert alertType="info sidebar">
          <p>
            Please read our{' '}
            <a
              href="https://adalite.medium.com/multi-account-support-and-partial-delegation-fd96aa793f9d"
              target="_blank"
              rel="noopener"
            >
              comprehensive guide to accounts
            </a>{' '}
            and make sure you understand how it works before using this feature.
          </p>
        </Alert>
      </div>
      <div className="dashboard-column account sidebar-item info">
        <Alert alertType="info sidebar">
          <p>
            Click <b>Activate/Explore</b> button to load data for related account. If you are using
            a hardware wallet, you will be requested to export public key. Note that content on all
            tabs corresponds to currently active account.
          </p>
        </Alert>
      </div>
      <div className="dashboard-column account sidebar-item info">
        <Alert alertType="info sidebar">
          <p>
            Click <b>Transfer</b> to move funds from one account to another. Select the source and
            the destination accounts, amount of ADA and tranfer your funds.
          </p>
        </Alert>
      </div>
      <div className="dashboard-column account info">
        <Alert alertType="warning sidebar">
          <p>
            <b>
              This feature is not supported on other wallets yet. If you decide to move your funds
              to account other then the first account, you will not see these funds in other wallets
              such as Yoroi or Daedalus.
            </b>
          </p>
        </Alert>
      </div>
    </Fragment>
  )

  return (
    <Fragment>
      {shouldShowSendTransactionModal && <SendTransactionModal />}
      {shouldShowDelegationModal && <DelegationModal />}
      <div className="dashboard-column account">
        <div className="card account-aggregated">
          <div className="balance">
            <div className="item">
              <h2 className="card-title small-margin">Wallet available balance</h2>
              <div className="balance-amount">
                {printAda(totalWalletBalance as Lovelace)}
                <AdaIcon />
              </div>
              {conversionRates && (
                <Conversions
                  balance={totalWalletBalance as Lovelace}
                  conversionRates={conversionRates}
                />
              )}
            </div>
            <div className="item">
              <h2 className="card-title small-margin">Wallet rewards balance</h2>
              <div className="balance-amount">
                {printAda(totalRewardsBalance as Lovelace)}
                <AdaIcon />
              </div>
              {conversionRates && (
                <Conversions
                  balance={totalRewardsBalance as Lovelace}
                  conversionRates={conversionRates}
                />
              )}
            </div>
          </div>
          <div className="refresh-wrapper">
            <button className="button secondary balance refresh" onClick={reloadWalletInfo}>
              Refresh
            </button>
          </div>
        </div>
        <div className="mobile">
          <InfoAlert />
        </div>
        <div className="accounts-wrapper">
          <div className="dashboard-column account list">
            <div>
              {accountsInfo.map((accountInfo) => (
                <AccountTile
                  key={accountInfo.accountIndex}
                  accountIndex={accountInfo.accountIndex}
                  ticker={
                    accountInfo.shelleyAccountInfo.hasStakingKey &&
                    accountInfo.shelleyAccountInfo.delegation.ticker
                  }
                  availableBalance={accountInfo.balance}
                  rewardsBalance={accountInfo.shelleyBalances.rewardsAccountBalance}
                  shouldShowSaturatedBanner={
                    accountInfo.poolRecommendation.shouldShowSaturatedBanner
                  }
                  shouldShowAccountInfo
                />
              ))}
              {accountsInfo[accountsInfo.length - 1].isUsed &&
                accountsInfo.length - 1 < maxAccountIndex && (
                <AccountTile
                  accountIndex={accountsInfo.length}
                  ticker={null}
                  availableBalance={null}
                  rewardsBalance={null}
                  shouldShowSaturatedBanner={false}
                />
              )}
            </div>
          </div>
          <div className="desktop">
            <InfoAlert />
          </div>
        </div>
      </div>
      {shouldShowConfirmTransactionDialog && <ConfirmTransactionDialog />}
    </Fragment>
  )
}

export default connect(
  (state: State) => ({
    accountsInfo: state.accountsInfo,
    maxAccountIndex: state.maxAccountIndex,
    shouldShowSendTransactionModal: state.shouldShowSendTransactionModal,
    shouldShowDelegationModal: state.shouldShowDelegationModal,
    activeAccountIndex: state.activeAccountIndex,
    totalRewardsBalance: state.totalRewardsBalance,
    totalWalletBalance: state.totalWalletBalance,
    shouldShowConfirmTransactionDialog: state.shouldShowConfirmTransactionDialog,
    // TODO: refactor to get .data elsewhere
    conversionRates: state.conversionRates && state.conversionRates.data,
  }),
  actions
)(AccountsDashboard)
