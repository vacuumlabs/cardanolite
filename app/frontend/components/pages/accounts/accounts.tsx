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
  firstAddressPerAccount,
  setAccount,
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
  const SendFromButton = () => (
    <button
      className="button primary nowrap account-button"
      disabled={isSelected}
      onClick={() => {
        setAccount(i)
        showSendTransactionModal(
          firstAddressPerAccount[selectedAccount],
          `Send ADA from account ${i} to account ${selectedAccount}`
        )
      }}
    >
      Send from
    </button>
  )
  const SendToButton = () => (
    <button
      className="button primary nowrap account-button"
      disabled={isSelected}
      onClick={() =>
        showSendTransactionModal(
          firstAddressPerAccount[i],
          `Send ADA from account ${selectedAccount} to account ${i}`
        )
      }
    >
      Send to
    </button>
  )
  const DelegateButton = () => (
    <button
      className="button primary nowrap account-button"
      onClick={() => {
        setAccount(i)
        showDelegationModal(`Delegate Account ${i} Stake`)
      }}
    >
      Delegate
    </button>
  )

  return (
    <div key={i} className={`card account ${isSelected ? 'selected' : ''}`}>
      <div className="header-wrapper mobile">
        <h2 className="card-title small-margin">Account {i}</h2>
      </div>
      <div className="card-column account-button-wrapper">
        <h2 className="card-title small-margin account-header desktop">Account {i}</h2>
        <button
          className="button primary nowrap"
          disabled={isSelected}
          onClick={() => {
            setAccount(i)
          }}
        >
          {account ? 'Activate' : 'Explore'}
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
          <div className="account-action-buttons">
            <SendFromButton />
            <SendToButton />
          </div>
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
          <div className="account-action-buttons">
            <DelegateButton />
          </div>
        </div>
      </div>
      <div className="account-action-buttons desktop">
        <div {...tooltip(`Transfer funds from account ${i}`, !isSelected)}>
          <SendFromButton />
        </div>
        <div {...tooltip(`Transfer funds to account ${i}`, !isSelected)}>
          <SendToButton />
        </div>
        <div {...tooltip(`Delegate account ${i} stake`, true)}>
          <DelegateButton />
        </div>
      </div>
    </div>
  )
}

const Accounts = ({
  accounts,
  setAccount,
  selectedAccount,
  reloadWalletInfo,
  showSendTransactionModal,
  showDelegationModal,
  shouldShowSendTransactionModal,
  shouldShowDelegationModal,
}) => {
  const accountInfos = Object.values(accounts)
  const totalBalance = accountInfos.reduce(
    (a, {shelleyBalances}) =>
      shelleyBalances.stakingBalance + shelleyBalances.nonStakingBalance + a,
    0
  )
  const totalRewardBalance = accountInfos.reduce(
    (a, {shelleyBalances}) => shelleyBalances.rewardsAccountBalance + a,
    0
  )
  const firstAddressPerAccount = accountInfos.map((e: any) => e.visibleAddresses[0].address)
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
                {printAda(totalBalance as Lovelace)}
                <AdaIcon />
              </div>
            </div>
            <div className="item">
              <h2 className="card-title small-margin">Total rewards balance</h2>
              <div className="balance-amount">
                {printAda(totalRewardBalance as Lovelace)}
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
                      firstAddressPerAccount={firstAddressPerAccount}
                      setAccount={setAccount}
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
    selectedAccount: state.selectedAccount,
    shouldShowSendTransactionModal: state.shouldShowSendTransactionModal,
    shouldShowDelegationModal: state.shouldShowDelegationModal,
  }),
  actions
)(Accounts)
