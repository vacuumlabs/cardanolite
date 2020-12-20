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
import tooltip from '../../common/tooltip'

const Account = ({
  i,
  account,
  setSelectedAccount,
  selectedAccount,
  showDelegationModal,
  showSendTransactionModal,
}) => {
  const isSelected = selectedAccount === i

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
      disabled={isSelected}
      onClick={() => showSendTransactionModal(selectedAccount, i)}
    >
      {false && (
        <a {...tooltip(`Send ADA from account ${selectedAccount} to account ${i}`, true)}>
          <span className="show-info">{''}</span>
        </a>
      )}
      Transfer
    </button>
  )
  const DelegateButton = () => (
    <button
      className="button primary nowrap account-button"
      onClick={() => {
        showDelegationModal(i, i)
      }}
    >
      {false && (
        <a {...tooltip(`Delegate Account #${i} Stake`, true)}>
          <span className="show-info">{''}</span>
        </a>
      )}
      Delegate
    </button>
  )

  const buttonLabel = () => {
    if (isSelected) return 'Active'
    if (!account) return 'Explore'
    return 'Activate'
  }

  return (
    <div key={i} className={`card account ${isSelected ? 'selected' : ''}`}>
      <div className="header-wrapper mobile">
        <h2 className="card-title small-margin">Account #{i}</h2>
      </div>
      <div className="card-column account-button-wrapper">
        <h2 className="card-title small-margin account-header desktop">Account #{i}</h2>
        <button
          className="button primary nowrap"
          disabled={isSelected}
          onClick={() => {
            setSelectedAccount(i)
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
        <div className="account-action-buttons desktop" style="width: 94px;" />
      )}
    </div>
  )
}

const Accounts = ({
  accounts,
  setSelectedAccount,
  reloadWalletInfo,
  showSendTransactionModal,
  showDelegationModal,
  shouldShowSendTransactionModal,
  shouldShowDelegationModal,
  selectedAccount,
  totalWalletBalance,
  totalRewardsBalance,
}) => {
  const accountInfos = Object.values(accounts)
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
              {range(0, Object.keys(accounts).length + 1).map(
                (i) =>
                  (i === 0 || accounts[i - 1].isUsed) && (
                    <Account
                      key={i}
                      i={i}
                      account={accounts[i]}
                      setSelectedAccount={setSelectedAccount}
                      selectedAccount={selectedAccount}
                      showSendTransactionModal={showSendTransactionModal}
                      showDelegationModal={showDelegationModal}
                    />
                  )
              )}
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
    selectedAccount: state.selectedAccount,
    totalRewardsBalance: state.totalRewardsBalance,
    totalWalletBalance: state.totalWalletBalance,
  }),
  actions
)(Accounts)
