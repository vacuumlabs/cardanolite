import {h} from 'preact'
import {connect} from '../../../helpers/connect'
import actions from '../../../actions'
import range from '../../../../frontend/wallet/helpers/range'

const Accounts = ({setAccount}) => (
  <div className="card" style={'width: 100%;'}>
    <h2 className="card-title small-margin" />
    <div className="account-dropdown">
      {range(0, 5).map((i) => (
        <a
          key={i}
          onClick={() => {
            setAccount(i)
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
