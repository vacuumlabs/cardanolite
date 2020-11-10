import {h} from 'preact'
import {connect} from '../../../helpers/connect'
import actions from '../../../actions'
import range from '../../../../frontend/wallet/helpers/range'
import {ACCOUNT_COUNT} from '../../../../frontend/wallet/constants'

const Accounts = ({setWalletInfo}) => (
  <div className="card" style={'width: 100%;'}>
    <h2 className="card-title small-margin" />
    <div className="account-dropdown">
      {range(0, ACCOUNT_COUNT).map((i) => (
        <a
          key={i}
          onClick={() => {
            setWalletInfo(i)
          }}
        >
          Account {i}
        </a>
      ))}
    </div>
  </div>
)

export default connect(
  (state) => ({
    isDemoWallet: state.isDemoWallet,
    router: state.router,
  }),
  actions
)(Accounts)
