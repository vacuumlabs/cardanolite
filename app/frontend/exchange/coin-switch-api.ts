import {ADALITE_CONFIG} from '../config'
import request from '../wallet/helpers/request'

const CoinSwitchAPI = () => {
  const getCoins = async () => {
    const url = `${ADALITE_CONFIG.ADALITE_SERVER_URL}/api/coinswitch/coins`
    return (await request(url)).Right
  }

  const getPairs = async (depositCoin: string) => {
    const url = `${ADALITE_CONFIG.ADALITE_SERVER_URL}/api/coinswitch/pairs`
    return (await request(url, 'POST', JSON.stringify({depositCoin}), {
      'Content-Type': 'application/json',
    })).Right
  }

  const getRate = async (depositCoin: string, destinationCoin: string) => {
    const url = `${ADALITE_CONFIG.ADALITE_SERVER_URL}/api/coinswitch/rate`
    return (await request(url, 'POST', JSON.stringify({depositCoin, destinationCoin}), {
      'Content-Type': 'application/json',
    })).Right
  }

  return {
    getCoins,
    getPairs,
    getRate,
  }
}

export default CoinSwitchAPI
