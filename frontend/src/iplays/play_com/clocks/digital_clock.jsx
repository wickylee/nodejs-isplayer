import React, { Component } from "react";
import $ from "jquery";
import moment from "moment";
import "./digital_clock.scss";
// import appHelper from "./apphelper";

class DigitalClock extends Component {
  state = {
    // week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    clockDate: "",
    inc: 100,
    setIntervalRef: null,
  };

  componentDidMount() {
    if (this.props.clockRun) {
      this.state.setIntervalRef = setInterval(() => {
        this.updateClock();
      }, this.state.inc);
    } else {
      this.updateClock();
    }
  }

  updateClock = () => {
    let clockDay = $(`#${this.props.clockId} .clock-day`);
    let clockhours = $(`#${this.props.clockId} .clock-hours`);
    let clockMinutes = $(`#${this.props.clockId} .clock-minutes`);
    let clockSeconds = $(`#${this.props.clockId} .clock-seconds`);
    clockDay.html(moment().format("dd"));
    clockhours.html(moment().format("k"));
    clockMinutes.html(moment().format("mm"));
    clockSeconds.html(moment().format("ss"));

    let now = new Date();

    let clock_date =
      this.zeroPadding(now.getFullYear(), 4) +
      " - " +
      this.zeroPadding(now.getMonth() + 1, 2) +
      " - " +
      this.zeroPadding(now.getDate(), 2);
    if (clock_date != this.state.clockDate)
      this.setState({ clockDate: clock_date });
  };

  zeroPadding = (num, digit) => {
    var zero = "";
    for (var i = 0; i < digit; i++) {
      zero += "0";
    }
    return (zero + num).slice(-digit);
  };

  // destroy player on unmount
  componentWillUnmount() {
    clearInterval(this.state.setIntervalRef);
  }

  render() {
    // const t = this.props.t;
    let clockStyle = this.props.clockStyleSetting;

    return (
      <div id={this.props.clockId} className="digitalclock-root">
        <div className="digitalclock" style={clockStyle.clockAppearance}>

          <div className="clock-date" style={clockStyle.clockDate} >{this.state.clockDate}</div>

          <div className="span-line" style={clockStyle.spanLine} > </div>

          <div className="clock-time" style={clockStyle.clockTime} >
            <div className="clock-col">
              <p className="clock-day clock-timer"></p>
              <p className="clock-label">Day</p>
            </div>
            <div className="clock-col">
              <p className="clock-hours clock-timer"></p>
              <p className="clock-label">Hours</p>
            </div>
            <div className="clock-col">
              <p className="clock-minutes clock-timer"></p>
              <p className="clock-label">Minutes</p>
            </div>
            <div className="clock-col">
              <p className="clock-seconds clock-timer"></p>
              <p className="clock-label">Seconds</p>
            </div>
          </div>
        
        </div>
      </div>
    );
  }
}

export default DigitalClock;
