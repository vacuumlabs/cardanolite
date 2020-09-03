import {Component, h} from 'preact'

interface Props {
  totalTime: number
  remainingTime: number
  counter?: number
  text?: string
}

export default class CountdownTimer extends Component<Props> {
  strokes = 283
  timer: NodeJS.Timeout
  calculateFillAmount = (countdownTime, maxTime) =>
    Math.floor(this.strokes * (1 - (countdownTime - 1) / maxTime))
  state = {
    remainingTime: this.props.remainingTime,
    fillAmount: this.calculateFillAmount(this.props.remainingTime, this.props.totalTime),
    counter: this.props.counter,
  }

  updateTime = () => {
    if (this.state.remainingTime > 0) {
      this.setState({
        remainingTime: this.state.remainingTime - 1,
        fillAmount: this.calculateFillAmount(this.state.remainingTime, this.props.totalTime),
      })
    } else {
      this.setState({
        remainingTime: this.props.totalTime,
        fillAmount: 0,
        counter: this.state.counter && this.state.counter + 1,
      })
    }
  }

  // TODO: refactor for performance
  formatRemainingTime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor(totalSeconds / 3600) % 24
    const minutes = Math.floor(totalSeconds / 60) % 60
    const seconds = totalSeconds % 60
    const offset = (x) => (x < 10 ? `0${x}` : x)

    return `${days}:${offset(hours)}:${offset(minutes)}:${offset(seconds)}`
  }

  componentDidMount() {
    this.timer = setInterval(this.updateTime, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <div className="countdown-timer center-horizontally">
        <svg className="svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g className="circle">
            <circle className="path-remaining" cx="50" cy="50" r="45" />
            <path
              // eslint-disable-next-line react/no-unknown-property
              stroke-dasharray={`${this.state.fillAmount} ${this.strokes}`}
              className="path-elapsed"
              d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
              "
            />
          </g>
        </svg>
        <div className="middle-text">
          <span className="label">
            {this.props.text}
            {this.state.counter}
          </span>
          <span className="timer">{this.formatRemainingTime(this.state.remainingTime)}</span>
        </div>
      </div>
    )
  }
}
