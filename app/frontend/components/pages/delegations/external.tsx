import {h} from 'preact'
import {connect} from '../../../helpers/connect'
import actions from '../../../actions'
import {State} from '../../../state'
import HardwareAuth from '../login/hardwareAuth'
import {errorHasHelp} from '../../../../frontend/helpers/errorsWithHelp'
import {getTranslation} from '../../../../frontend/translations'
import WalletLoadingErrorModal from '../login/walletLoadingErrorModal'

// todo whitelist in env

interface Props {
  queryArgs: any
  shouldShowWalletLoadingErrorModal: boolean
  closeWalletLoadingErrorModal: any
  walletLoadingError: any
}

const External = ({
  queryArgs,
  shouldShowWalletLoadingErrorModal,
  closeWalletLoadingErrorModal,
  walletLoadingError,
}: Props) => {
  return (
    <div className="page-wrapper">
      <div className="external-delegation-content">
        <div>
          {/* TODO */}
          You have been redirected from {queryArgs.referrer}. Delegate to pool {queryArgs.poolHash}.
        </div>
        <div className="authentication card external-delegation-auth-wrapper">
          <HardwareAuth />
          {shouldShowWalletLoadingErrorModal && (
            <WalletLoadingErrorModal
              onRequestClose={closeWalletLoadingErrorModal}
              errorMessage={getTranslation(walletLoadingError.code, walletLoadingError.params)}
              showHelp={errorHasHelp(walletLoadingError.code)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default connect(
  (state: State) => ({
    shouldNumberAccountsFromOne: state.shouldNumberAccountsFromOne,
    shouldShowWalletLoadingErrorModal: state.shouldShowWalletLoadingErrorModal,
    walletLoadingError: state.walletLoadingError,
    queryArgs: state.router.queryArgs,
  }),
  actions
)(External)
