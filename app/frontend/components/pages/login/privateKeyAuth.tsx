import {bech32, toPublic} from 'cardano-crypto.js'
import actions from '../../../actions'
import {ValidationResult} from '../../../types'
import {CryptoProviderType} from '../../../wallet/constants'
import {h} from 'preact'
import {useState, useCallback, useRef} from 'preact/hooks'
import {useActions} from '../../../helpers/connect'
import {getTranslation} from '../../../translations'
import tooltip from '../../common/tooltip'
import derivationSchemes from '../../../wallet/helpers/derivation-schemes'

const validatePrivateKey = (key: string): ValidationResult => {
  // TODO
  return null
}

const usePrivateKeyProps = () => {
  const [key, setKey] = useState<string>('')
  const [error, setError] = useState<ValidationResult>(null)
  const {loadWallet} = useActions(actions)

  const updateKey = useCallback((e) => {
    const input = e.target.value
    setKey(input)
    setError(validatePrivateKey(input))
  }, [])

  const login = useCallback(
    () => {
      const decodedKey = bech32.decode(key).data
      console.log('decoded', decodedKey)
      const publicKey = toPublic(decodedKey.slice(0, 64))
      const finalKey = Buffer.concat([decodedKey.slice(0, 64), publicKey, decodedKey.slice(64)])
      console.log('final', finalKey)

      return loadWallet({
        cryptoProviderType: CryptoProviderType.WALLET_SECRET,
        walletSecretDef: {
          rootSecret: finalKey,
          derivationScheme: derivationSchemes.v2,
        },
        shouldExportPubKeyBulk: true,
      })
    },
    [key, loadWallet]
  )

  return {key, error, updateKey, login}
}

const PrivateKeyAuth = () => {
  const {key, error: keyError, updateKey, login} = usePrivateKeyProps()
  const keyField = useRef(null)
  const unlockButton = useRef(null)

  return (
    <div className="authentication-content centered">
      <label className="authentication-label" htmlFor="mnemonic-submitted">
        Enter the root private key
      </label>
      <input
        type="text"
        className="input fullwidth auth"
        id="mnemonic-submitted"
        name="mnemonic-submitted"
        placeholder="xprv..."
        value={key}
        onInput={updateKey}
        // onBlur={updateMnemonicValidationError}
        // autoComplete="off"
        ref={keyField}
        onKeyDown={(e) => {
          e.key === 'Enter' && (e.target as HTMLAnchorElement).click()
        }}
      />
      <div className="validation-row">
        <button
          className="button primary"
          disabled={!!keyError || key === ''}
          onClick={login}
          {...tooltip('The root private key is invalid.', !!keyError)}
          onKeyDown={(e) => {
            e.key === 'Enter' && (e.target as HTMLButtonElement).click()
            if (e.key === 'Tab') {
              keyField.current.focus(e)
              e.preventDefault()
            }
          }}
          ref={unlockButton}
        >
          Unlock
        </button>
        {keyError && (
          <div className="validation-message error">{getTranslation(keyError.code)}</div>
        )}
      </div>
    </div>
  )
}

export default PrivateKeyAuth
