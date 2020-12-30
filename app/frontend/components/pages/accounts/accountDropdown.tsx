import {h} from 'preact'
import {connect} from '../../../libs/unistore/preact'
import actions from '../../../actions'
import {useState, useCallback} from 'preact/hooks'

import range from '../../../wallet/helpers/range'
import {State} from '../../../state'

const AccountDropdown = ({accountIndex, setAccountFunc, accountsInfo}) => {
  const [shouldHideAccountDropdown, hideAccountDropdown] = useState(true)
  const toggleAccountDropdown = useCallback(
    () => {
      hideAccountDropdown(!shouldHideAccountDropdown)
    },
    [shouldHideAccountDropdown]
  )

  return (
    <div className="account-dropdown">
      <button className="account-dropdown-button" onClick={() => toggleAccountDropdown()}>
        Account {accountIndex}
      </button>
      <div className={`account-dropdown-content ${shouldHideAccountDropdown ? 'hide' : 'show'}`}>
        {range(0, accountsInfo.length).map((i) => (
          <a
            key={i}
            onClick={() => {
              hideAccountDropdown(true)
              setAccountFunc(i)
            }}
          >
            Account {i}
          </a>
        ))}
      </div>
    </div>
  )
}

export default connect(
  (state: State) => ({
    accountsInfo: state.accountsInfo,
    activeAccountIndex: state.activeAccountIndex,
  }),
  actions
)(AccountDropdown)
