import {h, Component, Fragment} from 'preact'
import {connect} from '../../helpers/connect' //'../../libs/unistore/preact'
import actions from '../../actions'
import {State} from '../../state'
import {useCallback, useRef, useState} from 'preact/hooks'

interface Props<T> {
  defaultItem: T
  items: T[]
  displaySelectedItem: (t: T) => string
  displayItem: (t: T) => string
  onSelect: (t: T) => void
  searchPredicate: (query: string, t: T) => boolean
  searchPlaceholder: string
}

// <T extends {}> is workaround for <T> being recognized as JSX element instead of generics
const SearchableSelect = <T extends {}>({
  defaultItem,
  items,
  displaySelectedItem,
  displayItem,
  onSelect,
  searchPredicate,
  searchPlaceholder,
}: Props<T>) => {
  const inputEl = useRef<HTMLInputElement>(null)
  const dropdownEl = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState(defaultItem)
  const [search, setSearch] = useState('')
  const shouldShowItem = (item: T) => searchPredicate(search, item)
  const showDropdown = (bool: boolean) => {
    setVisible(bool)
    setSearch('')
    dropdownEl.current.scrollTop = 0
    if (bool) {
      inputEl.current.focus()
    }
  }
  // TODO autofocus
  // TODO mouse up mouse down, make behave same as current version
  return (
    <div className="searchable-select-wrapper" onMouseLeave={() => showDropdown(false)}>
      <div className="searchable-select" onMouseUp={() => showDropdown(!visible)}>
        {displaySelectedItem(value)} ▼
      </div>
      <div ref={dropdownEl} className={`searchable-select-dropdown ${visible ? '' : 'hide'}`}>
        <input
          ref={inputEl}
          type="text"
          className="searchable-select-input"
          value={search}
          onInput={(event: any) => setSearch(event.target.value)}
          placeholder={searchPlaceholder}
        />
        <div>
          {(() => {
            console.log(items)
            return true
          })() &&
            items &&
            items.map((item, i) => (
              <div
                className={`seachable-select-item ${shouldShowItem(item) ? '' : 'hide'}`}
                key={i}
                onMouseUp={() => {
                  setVisible(false)
                  setValue(item)
                  onSelect(item)
                }}
              >
                {displayItem(item)}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default connect(
  (state: State) => ({}),
  actions
)(SearchableSelect)
