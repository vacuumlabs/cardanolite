import {h} from 'preact'
import {connect} from '../../../helpers/connect'
import actions from '../../../actions'

import {AdaIcon} from '../../common/svg'
import {toAda} from '../../../helpers/adaConverters'

const CustomInputButton = ({
  disabled,
  onClickGoBack,
  setDonationAmount,
  donationAmount,
  maxDonationAmount,
}) => {
  return donationAmount > maxDonationAmount ? (
    <button
      className="button send-max"
      onClick={(e) => {
        e.preventDefault()
        setDonationAmount(maxDonationAmount)
      }}
      disabled={disabled}
    >
      Max ({`${maxDonationAmount} `}
      <AdaIcon />)
    </button>
  ) : (
    <button className="button send-max" onClick={onClickGoBack}>
      Back
    </button>
  )
}

const CustomDonationInput = ({
  donationAmount,
  donationAmountRaw,
  updateDonation,
  setDonation,
  disabled,
  toggleCustomDonation,
  maxDonationAmount,
}) => (
  <div className="input-wrapper donation">
    <input
      className="input send-amount"
      id="custom"
      name="donation-amount"
      placeholder="0.000000"
      value={donationAmountRaw}
      onInput={updateDonation}
    />
    <CustomInputButton
      disabled={disabled}
      onClickGoBack={toggleCustomDonation}
      setDonationAmount={
        setDonation /* Rant(ppershing): this is really different from updateDonation */
      }
      maxDonationAmount={maxDonationAmount}
      donationAmount={donationAmount}
    />
  </div>
)

export default connect(
  (state) => ({
    maxDonationAmount: Math.floor(toAda(state.maxDonationAmount)),
    donationAmount: toAda(state.donationAmount.coins),
    donationAmountRaw: state.donationAmount.fieldValue,
  }),
  actions
)(CustomDonationInput)
