import {Fragment, h} from 'preact'
import {connect} from '../../../helpers/connect'
import actions from '../../../actions'
import range from '../../../../frontend/wallet/helpers/range'
import printAda from '../../../helpers/printAda'
import {Lovelace} from '../../../state'
import {AdaIcon} from '../../common/svg'
import Alert from '../../common/alert'
import SendTransactionModal from './sendTransactionModal'
import DelegationModal from './delegationModal'

const AccountTile = ({
  accountIndex,
  account,
  setSelectedAccount,
  selectedAccountIndex,
  showDelegationModal,
  showSendTransactionModal,
}) => {
  const isSelected = selectedAccountIndex === accountIndex

  const Balance = ({value}: {value: Lovelace}) => (
    <Fragment>
      {printAda(value, 3)}
      <AdaIcon />
    </Fragment>
  )
  const PoolTicker = () => {
    if (account) {
      return account.shelleyAccountInfo.delegation.ticker || '-'
    }
    return '-'
  }
  const TransferButton = () => (
    <button
      className="button primary nowrap account-button"
      onClick={() => showSendTransactionModal(selectedAccountIndex, accountIndex)}
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

  const buttonLabel = () => {
    if (isSelected) return 'Active'
    if (!account) return 'Explore'
    return 'Activate'
  }

  return (
    <div key={accountIndex} className={`card account ${isSelected ? 'selected' : ''}`}>
      <div className="header-wrapper mobile">
        <h2 className="card-title small-margin">Account #{accountIndex}</h2>
      </div>
      <div className="card-column account-button-wrapper">
        <h2 className="card-title small-margin account-header desktop">Account #{accountIndex}</h2>
        <button
          className="button primary nowrap"
          disabled={isSelected}
          onClick={() => {
            setSelectedAccount(accountIndex)
          }}
        >
          {buttonLabel()}
        </button>
      </div>
      <div className="card-column account-item-info-wrapper">
        <h2 className="card-title small-margin">Available balance</h2>
        <div className="balance-amount small item">
          {account ? (
            <Balance
              value={
                account.shelleyBalances.stakingBalance + account.shelleyBalances.nonStakingBalance
              }
            />
          ) : (
            '-'
          )}
        </div>
        <div className="mobile">
          {account && (
            <div className="account-action-buttons">
              <TransferButton />
            </div>
          )}
        </div>
      </div>
      <div className="card-column account-item-info-wrapper tablet-offset">
        <h2 className="card-title small-margin">Rewards balance</h2>
        <div className="balance-amount small item">
          {account ? <Balance value={account.shelleyBalances.rewardsAccountBalance} /> : '-'}
        </div>
      </div>
      <div className="card-column account-item-info-wrapper">
        <h2 className="card-title small-margin">Delegation</h2>
        <div className="delegation-account item">
          <PoolTicker />
        </div>
        <div className="mobile">
          {account && (
            <div className="account-action-buttons">
              <DelegateButton />
            </div>
          )}
        </div>
      </div>
      {account ? (
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

type Props = {
  accounts: Object
  setSelectedAccount: any
  reloadWalletInfo: any
  showSendTransactionModal: boolean
  showDelegationModal: boolean
  shouldShowSendTransactionModal: boolean
  shouldShowDelegationModal: boolean
  selectedAccountIndex: number
  totalWalletBalance: number
  totalRewardsBalance: number
}

const AccountsDashboard = ({
  accounts,
  setSelectedAccount,
  reloadWalletInfo,
  showSendTransactionModal,
  showDelegationModal,
  shouldShowSendTransactionModal,
  shouldShowDelegationModal,
  selectedAccountIndex,
  totalWalletBalance,
  totalRewardsBalance,
}: Props) => {
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

  const usedAccountsCount = Object.values(accounts).reduce(
    (a: number, {isUsed}) => (isUsed ? a + 1 : a),
    0
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
              {range(0, usedAccountsCount + 1).map((accountIndex) => (
                <AccountTile
                  key={accountIndex}
                  accountIndex={accountIndex}
                  account={accounts[accountIndex]}
                  setSelectedAccount={setSelectedAccount}
                  selectedAccountIndex={selectedAccountIndex}
                  showSendTransactionModal={showSendTransactionModal}
                  showDelegationModal={showDelegationModal}
                />
              ))}
            </div>
          </div>
          <div className="desktop">
            <InfoAlert />
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default connect(
  (state) => ({
    isDemoWallet: state.isDemoWallet,
    accounts: state.accounts,
    shouldShowSendTransactionModal: state.shouldShowSendTransactionModal,
    shouldShowDelegationModal: state.shouldShowDelegationModal,
    selectedAccountIndex: state.selectedAccountIndex,
    totalRewardsBalance: state.totalRewardsBalance,
    totalWalletBalance: state.totalWalletBalance,
  }),
  actions
)(AccountsDashboard)
