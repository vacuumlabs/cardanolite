import {BIP32Path, CertificateType, Lovelace, _Address} from '../types'

export const enum NetworkId {
  MAINNET = 1,
  TESTNET = 0,
}

export const enum ProtocolMagic {
  MAINNET = 764824073,
  HASKELL_TESTNET = 42,
  MARY_TESTNET = 1097911063,
}

export type Network = {
  name: string
  networkId: NetworkId
  protocolMagic: ProtocolMagic
  eraStartSlot: number
  eraStartDateTime: number
  epochsToRewardDistribution: number
  minimalOutput: number
}

export const enum CryptoProviderType {
  LEDGER = 'LEDGER',
  TREZOR = 'TREZOR',
  WALLET_SECRET = 'WALLET_SECRET',
}

export type UTxO = {
  txHash: string
  address: _Address
  coins: Lovelace
  outputIndex: number
}

export const enum OutputType {
  CHANGE,
  NO_CHANGE,
}

export type _Input = UTxO

export type _Output =
  | {
      type: OutputType.NO_CHANGE
      address: _Address
      coins: Lovelace
    }
  | {
      type: OutputType.CHANGE
      address: _Address
      coins: Lovelace
      spendingPath: BIP32Path
      stakingPath: BIP32Path
    }

export type _Certificate = {
  type: CertificateType
  poolHash?: string
  stakingAddress: _Address
  poolRegistrationParams?: any
}

export type _Withdrawal = {
  stakingAddress: _Address
  rewards: Lovelace
}

export type _ShelleyWitness = {
  publicKey: Buffer
  signature: Buffer
}

export type _ByronWitness = {
  publicKey: Buffer
  signature: Buffer
  chainCode: Buffer
  addressAttributes: any // TODO:
}
