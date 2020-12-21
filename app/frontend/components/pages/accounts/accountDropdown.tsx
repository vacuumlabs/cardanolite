import {h} from 'preact'
import {connect} from '../../../libs/unistore/preact'
import actions from '../../../actions'
import {useState, useCallback} from 'preact/hooks'

import range from '../../../wallet/helpers/range'
import {State} from '../../../state'

const AccountDropdown = ({accountIndex, setAccountFunc, accounts}) => {
  const [shouldHideAccountDropdown, hideAccountDropdown] = useState(true)
  const toggleAccountDropdown = useCallback(
    () => {
      hideAccountDropdown(!shouldHideAccountDropdown)
    },
    [shouldHideAccountDropdown]
  )
  const [selectedAccountIndex, selectAccountIndex] = useState(accountIndex)
  return (
    <div className="account-dropdown">
      <button className="account-dropdown-button" onClick={() => toggleAccountDropdown()}>
        Account {selectedAccountIndex}
      </button>
      <div className={`account-dropdown-content ${shouldHideAccountDropdown ? 'hide' : 'show'}`}>
        {range(0, Object.values(accounts).length).map((i) => (
          <a
            key={i}
            onClick={() => {
              hideAccountDropdown(true)
              selectAccountIndex(i)
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
    accounts: state.accounts,
    selectedAccountIndex: state.selectedAccountIndex,
  }),
  actions
)(AccountDropdown)