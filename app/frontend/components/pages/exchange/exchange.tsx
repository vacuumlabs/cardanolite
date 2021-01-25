import {h, Component, Fragment} from 'preact'
import {connect} from '../../../libs/unistore/preact'
import actions from '../../../actions'
import {State} from '../../../state'
import SearchableSelect from '../../common/searchableSelect'
import {useCallback, useEffect, useMemo, useState} from 'preact/hooks'
import {CoinSwitchCoin} from '../../../../frontend/types'

interface Props {
  initializeExchange: any
  updateCoinSwitchPairs: any
  updateCoinSwitchRate: any
  resetCoinSwitchPairs: any
  setCoinSwitchDepositAmount: any
  setCoinSwitchDepositCoin: any
  setCoinSwitchDestinationCoin: any
  updateCoinSwitchDestinationAddress: any
  coins: CoinSwitchCoin[]
  pairs: string[]
  depositCoin: CoinSwitchCoin
  depositAmount: number
  destinationCoin: CoinSwitchCoin
  destinationAmount: number
  destinationAddress: string
  initialized: boolean
  loadingPair: boolean
  limitMinDepositCoin: number
  limitMaxDepositCoin: number
  limitMinDepositCoinError: boolean
  limitMaxDepositCoinError: boolean
  updateRateError: boolean
}

const Loading = () => (
  <div>
    <div className="loading">
      <div className="spinner">
        <span />
      </div>
      <p className="loading-message" />
      {/* <p className="loading-message">Loading Exchange</p> */}
    </div>
  </div>
)

const Exchange = ({
  initializeExchange,
  updateCoinSwitchPairs,
  updateCoinSwitchRate,
  resetCoinSwitchPairs,
  setCoinSwitchDepositAmount,
  setCoinSwitchDepositCoin,
  setCoinSwitchDestinationCoin,
  updateCoinSwitchDestinationAddress,
  coins,
  pairs,
  depositCoin,
  depositAmount,
  destinationCoin,
  destinationAmount,
  destinationAddress,
  initialized,
  loadingPair,
  limitMinDepositCoin,
  limitMaxDepositCoin,
  limitMinDepositCoinError,
  limitMaxDepositCoinError,
  updateRateError,
}: Props) => {
  const [isInputNan, setIsInputNan] = useState(false)
  const [showDestinationAddress, setShowDestinationAddress] = useState(false)

  useEffect(() => initializeExchange())

  const displayCoin = useCallback(
    (coin: CoinSwitchCoin): string => `${coin.name} (${coin.symbol})`,
    []
  )

  const displaySelectedCoin = useCallback(
    (coin: CoinSwitchCoin): string => coin.symbol.toUpperCase(),
    []
  )

  const onCoinSelectDeposit = useCallback(
    (coin: CoinSwitchCoin): void => setCoinSwitchDepositCoin(coin),
    [setCoinSwitchDepositCoin]
  )

  const onCoinSelectDestination = useCallback(
    (coin: CoinSwitchCoin): void => setCoinSwitchDestinationCoin(coin),
    [setCoinSwitchDestinationCoin]
  )

  const searchPredicate = useCallback(
    (query: string, coin: CoinSwitchCoin): boolean =>
      coin.name.toLowerCase().includes(query.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(query.toLowerCase()),
    []
  )

  const coinsMap = useMemo(
    () => {
      console.log('updating coins map')
      if (coins) {
        return coins.reduce((acc, coin) => {
          acc[coin.symbol] = coin.name
          return acc
        }, {})
      }
      return null
    },
    [coins]
  )

  const validDestinationCoins: CoinSwitchCoin[] = useMemo(
    () => {
      console.log('updating validDestinationCoins')
      console.log('pairs')
      console.log(pairs)
      console.log('coinsMap')
      console.log(coinsMap)
      if (pairs && coinsMap) {
        return pairs
          .map((pair) => {
            const name = coinsMap[pair]
            if (name) {
              return {
                symbol: pair,
                name: coinsMap[pair],
              }
            }
            return null
          })
          .filter((coin) => !!coin)
      }
      return null
    },
    [coinsMap, pairs]
  )

  const depositSearchPlaceholder: string = useMemo(
    () => `Search from ${coins && coins.length} coins`,
    [coins]
  )

  const buySearchPlaceholder: string = useMemo(
    () => `Search from ${validDestinationCoins && validDestinationCoins.length} coins`,
    [validDestinationCoins]
  )

  const exchangeButtonClick = useCallback(() => {
    // TODO
  }, [])

  return (
    <div className="page-wrapper exchange">
      {initialized ? (
        <div className="card exchange">
          <h2 className="card-title">Instant exchange</h2>
          {/* TODO: Nice errors */}
          {isInputNan && <div>isNanError</div>}
          {updateRateError && (
            <div>
              {depositCoin.symbol.toUpperCase()} to {destinationCoin.symbol.toUpperCase()} is not
              supported currently. Please choose other combination.
            </div>
          )}
          {!updateRateError &&
            limitMinDepositCoinError && (
            <div>Minimum coin amount supported for this coin pair is {limitMinDepositCoin}</div>
          )}
          {!updateRateError &&
            limitMaxDepositCoinError && (
            <div>Maximum coin amount supported for this coin pair is {limitMaxDepositCoin}</div>
          )}
          <div className="content">
            <div className="deposit">
              <span className="send-coin-text">You send {depositCoin.name}</span>
              <SearchableSelect
                defaultItem={depositCoin}
                displaySelectedItem={displaySelectedCoin}
                items={coins}
                displayItem={displayCoin}
                onSelect={onCoinSelectDeposit}
                searchPredicate={searchPredicate}
                searchPlaceholder={depositSearchPlaceholder}
              />
              <input
                className="input"
                placeholder="0.000000"
                onInput={(e: any) => {
                  if (e && e.target && e.target.value) {
                    if (!isNaN(e.target.value)) {
                      const depositAmount = parseFloat(e.target.value)
                      setIsInputNan(false)
                      setCoinSwitchDepositAmount(depositAmount)
                      return
                    }
                  }
                  setIsInputNan(true)
                }}
              />
            </div>
            <div className="destination">
              <span className="text">You receive {destinationCoin.name}</span>
              <SearchableSelect
                defaultItem={destinationCoin}
                displaySelectedItem={displaySelectedCoin}
                items={validDestinationCoins}
                displayItem={displayCoin}
                onSelect={onCoinSelectDestination}
                searchPredicate={searchPredicate}
                searchPlaceholder={buySearchPlaceholder}
              />
              <input
                className="input"
                value={
                  limitMinDepositCoinError ||
                  limitMaxDepositCoinError ||
                  isInputNan ||
                  updateRateError
                    ? ''
                    : destinationAmount
                }
                readOnly
              />
              <div className="send-address-text">Enter your {destinationCoin.symbol} address</div>
              <input
                type="text"
                className="input"
                value={destinationAddress}
                onInput={updateCoinSwitchDestinationAddress}
              />
            </div>
          </div>
          <button
            className="button primary"
            onClick={() =>
              showDestinationAddress ? exchangeButtonClick() : setShowDestinationAddress(true)
            }
          >
            {showDestinationAddress ? 'Exchange' : 'Continue'}
          </button>
          {/* TODO: Nicer loading */}
          {loadingPair && <Loading />}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default connect(
  (state: State) => ({
    coins: state.exchange.coins,
    depositCoin: state.exchange.deposit.coin,
    depositAmount: state.exchange.deposit.amount,
    destinationCoin: state.exchange.destination.coin,
    destinationAmount: state.exchange.destination.amount,
    destinationAddress: state.exchange.destination.address,
    pairs: state.exchange.destination.pairs,
    initialized: state.exchange.loading.initialized,
    loadingPair: state.exchange.loading.loadingPair,
    limitMinDepositCoin: state.exchange.rate.limitMinDepositCoin,
    limitMaxDepositCoin: state.exchange.rate.limitMaxDepositCoin,
    limitMinDepositCoinError: state.exchange.errors.limitMinDepositCoinError,
    limitMaxDepositCoinError: state.exchange.errors.limitMaxDepositCoinError,
    updateRateError: state.exchange.errors.updateRateError,
  }),
  actions
)(Exchange)
