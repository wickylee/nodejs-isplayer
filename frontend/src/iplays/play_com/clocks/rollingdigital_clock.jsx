import React, { Component } from "react";
import $ from "jquery";
import "./rollingdigital_clock.scss";
// import appHelper from "./apphelper";

class RollingDigitalClock extends Component {
  state = {
    week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    clockDate: "",
    inc: 1000,
    setIntervalRef: null,
  };

  componentDidMount() {
    // this.clock();

    // if (this.props.clockRun) {
    //     this.state.setIntervalRef = setInterval(() => {
    //     this.clock();
    //     //   console.log("setInterval");
    //     }, this.state.inc);
    // }
    // let hoursContainer = document.querySelector('.hours')
    // let minutesContainer = document.querySelector('.minutes')
    // let secondsContainer = document.querySelector('.seconds')
    // let tickElements = Array.from(document.querySelectorAll('.tick'))

    let last = new Date(0);
    last.setUTCHours(-1);

    // let tickState = true

    if (this.props.clockRun) {
      this.state.setIntervalRef = setInterval(() => {
        this.updateTime(last);
      }, this.state.inc);
    } else {
      this.updateTime(last);
    }

  }

  updateTime = (last) => {
    // let hoursContainer = document.querySelector(".hours");
    // let minutesContainer = document.querySelector(".minutes");
    // let secondsContainer = document.querySelector(".seconds");
    let hoursContainer = document.querySelector(`#${this.props.clockId}_hours`);
    let minutesContainer = document.querySelector(`#${this.props.clockId}_minutes`);
    let secondsContainer = document.querySelector(`#${this.props.clockId}_seconds`);
    // ${this.props.clockId}

    let now = new Date();

    let lastHours = last.getHours().toString();
    let nowHours = now.getHours().toString();
    if (lastHours !== nowHours) {
      this.updateContainer(hoursContainer, nowHours);
    }

    let lastMinutes = last.getMinutes().toString();
    let nowMinutes = now.getMinutes().toString();
    if (lastMinutes !== nowMinutes) {
      this.updateContainer(minutesContainer, nowMinutes);
    }

    let lastSeconds = last.getSeconds().toString();
    let nowSeconds = now.getSeconds().toString();
    if (lastSeconds !== nowSeconds) {
      if (this.props.clockRun) this.tick();
      this.updateContainer(secondsContainer, nowSeconds);
    }

    // last = now;

    // var cd = new Date();

    // let clock_time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2);
    let clock_date = this.zeroPadding(now.getFullYear(), 4) + '-' + this.zeroPadding(now.getMonth()+1, 2) + '-' + this.zeroPadding(now.getDate(), 2) + ' ' + this.state.week[now.getDay()];
    if (clock_date != this.state.clockDate) 
      this.setState({clockDate: clock_date });
  };

  zeroPadding = (num, digit) =>{
    var zero = '';
    for(var i = 0; i < digit; i++) {
        zero += '0';
    }
    return (zero + num).slice(-digit);
}

  tick = () => {
    let tickElements = Array.from(document.querySelectorAll(".tick"));
    tickElements.forEach((t) => t.classList.toggle("tick-hidden"));
  };

  updateContainer = (container, newTime) => {
    let time = newTime.split("");

    if (time.length === 1) {
      time.unshift("0");
    }

    let first = container.firstElementChild;
    if (first.lastElementChild.textContent !== time[0]) {
      this.updateNumber(first, time[0]);
    }

    let last = container.lastElementChild;
    if (last.lastElementChild.textContent !== time[1]) {
      this.updateNumber(last, time[1]);
    }
  };

  updateNumber = (element, number) => {
    let second = element.lastElementChild.cloneNode(true);
    second.textContent = number;

    element.appendChild(second);
    element.classList.add("move");

    setTimeout(() => {
      element.classList.remove("move");
    }, 960);
    setTimeout(() => {
      element.removeChild(element.firstElementChild);
    }, 960);
  };

  // destroy player on unmount
  componentWillUnmount() {
    clearInterval(this.state.setIntervalRef);
  }

  render() {
    // const t = this.props.t;
    let clockStyle = this.props.clockStyleSetting;

    let clockTimeStyle = { 
      height: clockStyle.clockTime.height,
      fontSize: clockStyle.clockTime.fontSize,
      fontFamily: clockStyle.clockTime.fontFamily,
      color: clockStyle.clockTime.color,
      textShadow: clockStyle.clockTime.textShadow,
      lineHeight: `calc(${clockStyle.clockTime.fontSize} * 1)`
    }
    let tickStyle = { lineHeight: `calc(${clockStyle.clockTime.fontSize} * 0.9)` }

    let topOverlayStyle ={background: `linear-gradient(to top, transparent, ${clockStyle.clockTime.backgroundColor})`}
    let bottomOverlayStyle={background: `linear-gradient(to bottom, transparent, ${clockStyle.clockTime.backgroundColor})`}

    return (
      <div id={this.props.clockId} className="rollingdigitalclock-root">
        <div className="rollingdigitalclock" style={clockStyle.clockAppearance}>
          <div className="clock-date" style={clockStyle.clockDate} >
            <div >{ this.state.clockDate.split(" ")[0] }</div>
            <div >{ this.state.clockDate.split(" ")[1] }</div>
            </div>

          <div className="clock-time" style={clockTimeStyle} >

            <div id={`${this.props.clockId}_hours`}  className="hours">
              <div className="first">
                <div className="number">0</div>
              </div>
              <div className="second">
                <div className="number">0</div>
              </div>
            </div>
            <div className="tick" style={tickStyle}>:</div>
            <div id={`${this.props.clockId}_minutes`} className="minutes">
              <div className="first">
                <div className="number">0</div>
              </div>
              <div className="second">
                <div className="number">0</div>
              </div>
            </div>
            <div className="tick" style={tickStyle}>:</div>
            <div id={`${this.props.clockId}_seconds`}  className="seconds">
              <div className="first">
                <div className="number">0</div>
              </div>
              <div className="second infinite">
                <div className="number">0</div>
                <div className="number">1</div>
              </div>
            </div>
          
            <div className="top-overlay" style={topOverlayStyle}></div>
            <div className="bottom-overlay" style={bottomOverlayStyle}></div>
          
          </div>
        </div>

      </div>
    );
  }
}

export default RollingDigitalClock;
