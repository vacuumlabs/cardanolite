import actions from '../../../../frontend/actions'
import {connect} from '../../../../frontend/libs/unistore/preact'
import {EPOCHS_TO_REWARD_DISTRIBUTION, EPOCH_LENGTH} from '../../../../frontend/wallet/constants'
import {Component, Fragment, h} from 'preact'
import {CopyPoolId} from '../delegations/common'
import CountedownTimer from './countdownTimer'
import {EpochDateTime} from '../common'
import getEpochEndDateTime from '../../../../frontend/helpers/getEpochEndDateTime'

interface Props {
  shelleyAccountInfo: any
  nearestRewardDetails: any
}

class EpochPage extends Component<Props> {
  render({shelleyAccountInfo, nearestRewardDetails}) {
    const currentEpoch = shelleyAccountInfo.currentEpoch
    const rewardDistributionEpoch =
      nearestRewardDetails && nearestRewardDetails.forEpoch + EPOCHS_TO_REWARD_DISTRIBUTION
    const rewardDate = nearestRewardDetails && new Date(nearestRewardDetails.rewardDate)
    const secondsToEpochEnd = Math.floor(
      (getEpochEndDateTime(currentEpoch).getTime() - Date.now()) / 1000
    )
    const poolName = nearestRewardDetails && nearestRewardDetails.pool.name
    const poolHash = nearestRewardDetails && nearestRewardDetails.poolHash
    return (
      <div className="card">
        <div className="space-between">
          <div>
            <h2 className="card-title">Epoch progress</h2>
            <div className="epoch-text center-vertically" style="margin-top:50px">
              {nearestRewardDetails && (
                <Fragment>
                  <h3>Next reward</h3>
                  <EpochDateTime epoch={rewardDistributionEpoch} dateTime={rewardDate} />
                  <div>
                    From: {poolName}
                    <CopyPoolId value={poolHash} />
                  </div>
                </Fragment>
              )}
            </div>
          </div>
          <div>
            {/* <CountedownTimer remainingTime={5} totalTime={10} counter={epoch} text="Epoch " /> */}
            <CountedownTimer
              remainingTime={secondsToEpochEnd}
              totalTime={EPOCH_LENGTH}
              counter={currentEpoch}
              text="Epoch "
            />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  (state) => ({
    shelleyAccountInfo: state.shelleyAccountInfo,
    nearestRewardDetails: state.shelleyAccountInfo.rewardDetails.nearest,
  }),
  actions
)(EpochPage)
