import {Component, h} from 'preact'
import CountedownTimer from './countdownTimer'

interface Props {}

class EpochPage extends Component<Props> {
  render() {
    const epoch = 214

    return (
      <div className="card">
        <h2 className="card-title">Epoch progress</h2>
        {/* <CountedownTimer remainingTime={5} totalTime={10} counter={epoch} text="Epoch " /> */}
        <CountedownTimer remainingTime={68040} totalTime={432000} counter={epoch} text="Epoch " />
      </div>
    )
  }
}

export default EpochPage
