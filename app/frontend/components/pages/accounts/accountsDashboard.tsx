import {Fragment, h} from 'preact'
import {connect} from '../../../helpers/connect'
import actions from '../../../actions'
import printAda from '../../../helpers/printAda'
import {Lovelace, State} from '../../../state'
import {AdaIcon} from '../../common/svg'
import Alert from '../../common/alert'
import SendTransactionModal from './sendTransactionModal'
import DelegationModal from './delegationModal'
import ConfirmTransactionDialog from '../../../../frontend/components/pages/sendAda/confirmTransactionDialog'
import {errorHasHelp} from '../../../../frontend/helpers/errorsWithHelp'
import TransactionErrorModal from '../sendAda/transactionErrorModal'
import {getTranslation} from '../../../../frontend/translations'

type TileProps = {
  accountIndex: number
  ticker: string | null
  availableBalance: Lovelace | null
  rewardsBalance: Lovelace | null
  setActiveAccount: any
  exploreNewAccount: any
  activeAccountIndex: number
  showDelegationModal: any
  showSendTransactionModal: any
  shouldShowAccountInfo?: boolean
}

const AccountTile = ({
  accountIndex,
  ticker,
  availableBalance,
  rewardsBalance,
  setActiveAccount,
  exploreNewAccount,
  activeAccountIndex,
  showDelegationModal,
  showSendTransactionModal,
  shouldShowAccountInfo,
}: TileProps) => {
  const isActive = activeAccountIndex === accountIndex

  const Balance = ({value}: {value: Lovelace}) =>
    value !== null ? (
      <Fragment>
        {printAda(value, 3)}
        <AdaIcon />
      </Fragment>
    ) : (
      <Fragment>-</Fragment>
    )

  const TransferButton = () => (
    <button
      className="button primary nowrap account-button"
      onClick={() => showSendTransactionModal(activeAccountIndex, accountIndex)}
      disabled={isActive}
    >
      Transfer
    </button>
  )

  const DelegateButton = () => (
    <button
      className="button primary nowrap account-button"
      onClick={() => {
        showDelegationModal(accountIndex)
      }}
    >
      Delegate
    </button>
  )

  const ActivationButton = () => (
    <button
      className="button primary nowrap"
      disabled={isActive}
      onClick={() => {
        setActiveAccount(accountIndex)
      }}
    >
      {isActive ? 'Active' : 'Activate'}
    </button>
  )

  const ExplorationButton = () => (
    <button
      className="button primary nowrap"
      onClick={() => {
        exploreNewAccount()
      }}
    >
      Explore
    </button>
  )

  return (
    <div key={accountIndex} className={`card account ${isActive ? 'selected' : ''}`}>
      <div className="header-wrapper mobile">
        <h2 className="card-title small-margin">Account #{accountIndex}</h2>
      </div>
      <div className="card-column account-button-wrapper">
        <h2 className="card-title small-margin account-header desktop">Account #{accountIndex}</h2>
        {shouldShowAccountInfo ? <ActivationButton /> : <ExplorationButton />}
      </div>
      <div className="card-column account-item-info-wrapper">
        <h2 className="card-title small-margin">Available balance</h2>
        <div className="balance-amount small item">
          <Balance value={availableBalance} />
        </div>
        <div className="mobile">
          {shouldShowAccountInfo && (
            <div className="account-action-buttons">
              <TransferButton />
            </div>
          )}
        </div>
      </div>
      <div className="card-column account-item-info-wrapper tablet-offset">
        <h2 className="card-title small-margin">Rewards balance</h2>
        <div className="balance-amount small item">
          <Balance value={rewardsBalance} />
        </div>
      </div>
      <div className="card-column account-item-info-wrapper">
        <h2 className="card-title small-margin">Delegation</h2>
        <div className="delegation-account item">{ticker || '-'}</div>
        <div className="mobile">
          {shouldShowAccountInfo && (
            <div className="account-action-buttons">
              <DelegateButton />
            </div>
          )}
        </div>
      </div>
      {shouldShowAccountInfo ? (
        <div className="account-action-buttons desktop">
          <TransferButton />
          <DelegateButton />
        </div>
      ) : (
        <div className="account-action-buttons desktop" style="width: 98px;" />
      )}
    </div>
  )
}

type DashboardProps = {
  accountsInfo: Array<any>
  setActiveAccount: any
  exploreNewAccount: any
  reloadWalletInfo: any
  showSendTransactionModal: boolean
  showDelegationModal: boolean
  shouldShowSendTransactionModal: boolean
  shouldShowDelegationModal: boolean
  activeAccountIndex: number
  totalWalletBalance: number
  totalRewardsBalance: number
  shouldShowConfirmTransactionDialog: boolean
  shouldShowTransactionErrorModal: boolean
  transactionSubmissionError: any
  closeTransactionErrorModal: any
}

const AccountsDashboard = ({
  accountsInfo,
  setActiveAccount,
  exploreNewAccount,
  reloadWalletInfo,
  showSendTransactionModal,
  showDelegationModal,
  shouldShowSendTransactionModal,
  shouldShowDelegationModal,
  activeAccountIndex,
  totalWalletBalance,
  totalRewardsBalance,
  shouldShowConfirmTransactionDialog,
  shouldShowTransactionErrorModal,
  transactionSubmissionError,
  closeTransactionErrorModal,
}: DashboardProps) => {
  const InfoAlert = () => (
    <Fragment>
      <div className="dashboard-column account sidebar-item info">
        <Alert alertType="info sidebar">
          <p>
            <strong>Accounts</strong> offer a way to split your funds. You are able to delegate to
            different pool from each account. Each account has different set of addresses and keys.
          </p>
        </Alert>
      </div>
      <div className="dashboard-column account sidebar-item info">
        <Alert alertType="info sidebar">
          <p>
            Click explore/activate button to load data for related account. If you are using
            hardware wallet, you will be requested to export public key.
          </p>
        </Alert>
      </div>
      <div className="dashboard-column account info">
        <Alert alertType="warning sidebar">
          <p>
            This feature might not be supported on other wallets yet. If you decide to move your
            funds to <strong>account</strong> other then <strong>account 0</strong>, you might not
            see your funds in other wallets.
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
              <h2 className="card-title small-margin">Total balance</h2>
              <div className="balance-amount">
                {printAda(totalWalletBalance as Lovelace)}
                <AdaIcon />
              </div>
            </div>
            <div className="item">
              <h2 className="card-title small-margin">Total rewards balance</h2>
              <div className="balance-amount">
                {printAda(totalRewardsBalance as Lovelace)}
                <AdaIcon />
              </div>
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
                  activeAccountIndex={activeAccountIndex}
                  ticker={accountInfo.shelleyAccountInfo.delegation.ticker}
                  availableBalance={
                    accountInfo.shelleyBalances.stakingBalance +
                    accountInfo.shelleyBalances.nonStakingBalance
                  } // TODO: this should be in state}
                  rewardsBalance={accountInfo.shelleyBalances.rewardsAccountBalance}
                  setActiveAccount={setActiveAccount}
                  exploreNewAccount={() => null}
                  showSendTransactionModal={showSendTransactionModal}
                  showDelegationModal={showDelegationModal}
                  shouldShowAccountInfo
                />
              ))}
              {accountsInfo[accountsInfo.length - 1].isUsed && (
                <AccountTile
                  accountIndex={accountsInfo.length}
                  activeAccountIndex={activeAccountIndex}
                  ticker={null}
                  availableBalance={null}
                  rewardsBalance={null}
                  setActiveAccount={() => null}
                  exploreNewAccount={exploreNewAccount}
                  showSendTransactionModal={showSendTransactionModal}
                  showDelegationModal={showSendTransactionModal}
                />
              )}
            </div>
          </div>
          <div className="desktop">
            <InfoAlert />
          </div>
        </div>
      </div>
      {shouldShowTransactionErrorModal && (
        <TransactionErrorModal
          onRequestClose={closeTransactionErrorModal}
          errorMessage={getTranslation(
            transactionSubmissionError.code,
            transactionSubmissionError.params
          )}
          showHelp={errorHasHelp(transactionSubmissionError.code)}
        />
      )}
      {shouldShowConfirmTransactionDialog && <ConfirmTransactionDialog />}
    </Fragment>
  )
}

export default connect(
  (state: State) => ({
    isDemoWallet: state.isDemoWallet,
    accountsInfo: state.accountsInfo,
    shouldShowSendTransactionModal: state.shouldShowSendTransactionModal,
    shouldShowDelegationModal: state.shouldShowDelegationModal,
    activeAccountIndex: state.activeAccountIndex,
    totalRewardsBalance: state.totalRewardsBalance,
    totalWalletBalance: state.totalWalletBalance,
    shouldShowConfirmTransactionDialog: state.shouldShowConfirmTransactionDialog,
    shouldShowTransactionErrorModal: state.shouldShowTransactionErrorModal,
    transactionSubmissionError: state.transactionSubmissionError,
  }),
  actions
)(AccountsDashboard)
