import React, { Component } from "react";
import $ from "jquery";
import "./analog_clock.scss";
// import appHelper from "./apphelper";

class AnalogClock extends Component {
  state = {
    inc: 1000,
    minuteIntervalRef: null,
    secondIntervalRef: null,
    setTimeoutRef: null,
  };

  componentDidMount() {
    // Initialise the locale-enabled clocks
    // initInternationalClocks();
    // Initialise any local time clocks
    this.initLocalClocks();
    // Start the seconds container moving
    this.moveSecondHands();
    // Set the intial minute hand container transition, and then each subsequent step
    this.setUpMinuteHands();

    this.updateClock();


    if (!this.props.clockRun) {
      setTimeout(()=>{
        clearInterval(this.state.minuteIntervalRef);
        clearInterval(this.state.secondIntervalRef);
        clearTimeout(this.state.setTimeoutRef);
      }, 1000)
    }
  }

  /*
     Set up an entry for each locale of clock we want to use
   */
  getTimes = () => {
    moment.tz.add([
      "Eire|GMT IST|0 -10|01010101010101010101010|1BWp0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00 11A0 1o00 11A0 1qM0 WM0 1qM0 WM0 1qM0 11A0 1o00 11A0 1o00",
      "Asia/Tokyo|JST|-90|0|",
      "America/New_York|EST EDT|50 40|0101|1Lz50 1zb0 Op0",
    ]);
    let now = new Date();
    // Set the time manually for each of the clock types we're using
    let times = [
      {
        jsclass: "js-tokyo",
        jstime: moment.tz(now, "Asia/Tokyo"),
      },
      {
        jsclass: "js-london",
        jstime: moment.tz(now, "Eire"),
      },
      {
        jsclass: "js-new-york",
        jstime: moment.tz(now, "America/New_York"),
      },
    ];
    return times;
  };

  initInternationalClocks = () => {
    // Initialise the clock settings and the three times
    let times = this.getTimes();
    for (i = 0; i < times.length; ++i) {
      let hours = times[i].jstime.format("h");
      let minutes = times[i].jstime.format("mm");
      let seconds = times[i].jstime.format("ss");

      let degrees = [
        {
          hand: "hours-hand",
          degree: hours * 30 + minutes / 2,
        },
        {
          hand: "minutes-hand",
          degree: minutes * 6,
        },
        {
          hand: "seconds-hand",
          degree: seconds * 6,
        },
      ];
      for (let j = 0; j < degrees.length; j++) {
        let elements = document.querySelectorAll(
          ".active ." + times[i].jsclass + " ." + degrees[j].hand
        );
        for (let k = 0; k < elements.length; k++) {
          elements[k].style.webkitTransform =
            "rotateZ(" + degrees[j].degree + "deg)";
          elements[k].style.transform = "rotateZ(" + degrees[j].degree + "deg)";
          // If this is a minute hand, note the seconds position (to calculate minute position later)
          if (degrees[j].hand === "minutes-hand") {
            elements[k].parentNode.setAttribute(
              "data-second-angle",
              degrees[j + 1].degree
            );
          }
        }
      }
    }
    // Add a class to the clock container to show it
    let elements = document.querySelectorAll(".clock");
    for (let l = 0; l < elements.length; l++) {
      elements[l].className = elements[l].className + " show";
    }
  };

  /*
 Starts any clocks using the user's local time
 */
  initLocalClocks = () => {
    // Get the local time using JS
    let date = new Date();
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let hours = date.getHours();

    // Create an object with each hand and it's angle in degrees
    let hands = [
      {
        hand: "hours-hand",
        angle: hours * 30 + minutes / 2,
      },
      {
        hand: "minutes-hand",
        angle: minutes * 6,
      },
      {
        hand: "seconds-hand",
        angle: seconds * 6,
      },
    ];
    // Loop through each of these hands to set their angle
    for (let j = 0; j < hands.length; j++) {
      let elements = document.querySelectorAll("." + hands[j].hand);
      for (let k = 0; k < elements.length; k++) {
        elements[k].style.transform = "rotateZ(" + hands[j].angle + "deg)";
        // If this is a minute hand, note the seconds position (to calculate minute position later)
        if (hands[j].hand === "minutes-hand") {
          elements[k].parentNode.setAttribute(
            "data-second-angle",
            hands[j + 1].angle
          );
        }
      }
    }
  };

  /*
  Move the second containers
 */
  moveSecondHands = () => {
    let containers = document.querySelectorAll(".seconds-container");
    this.state.secondIntervalRef = setInterval(() => {
      for (let i = 0; i < containers.length; i++) {
        if (containers[i].angle === undefined) {
          containers[i].angle = 6;
        } else {
          containers[i].angle += 6;
        }
        containers[i].style.webkitTransform =
          "rotateZ(" + containers[i].angle + "deg)";
        containers[i].style.transform =
          "rotateZ(" + containers[i].angle + "deg)";
      }
    }, 1000);

    for (let i = 0; i < containers.length; i++) {
      // Add in a little delay to make them feel more natural
      let randomOffset = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
      containers[i].style.transitionDelay = "0.0" + randomOffset + "s";
    }
  };

  /*
  Set a timeout for the first minute hand movement (less than 1 minute), then rotate it every minute after that
 */
  setUpMinuteHands = () => {
    // More tricky, this needs to move the minute hand when the second hand hits zero
    let containers = document.querySelectorAll(".minutes-container");
    let secondAngle = containers[containers.length - 1].getAttribute(
      "data-second-angle"
    );
    console.log(secondAngle);
    if (secondAngle > 0) {
      // Set a timeout until the end of the current minute, to move the hand
      let delay = ((360 - secondAngle) / 6 + 0.1) * 1000;
      console.log(delay);
      setTimeout(() => {
        this.moveMinuteHands(containers);
      }, delay);
    }
  };

  /*
  Do the first minute's rotation, then move every 60 seconds after
 */
  moveMinuteHands = (containers) => {
    for (let i = 0; i < containers.length; i++) {
      containers[i].style.webkitTransform = "rotateZ(6deg)";
      containers[i].style.transform = "rotateZ(6deg)";
    }
    // Then continue with a 60 second interval
    this.state.minuteIntervalRef = setInterval(() => {
      for (let i = 0; i < containers.length; i++) {
        if (containers[i].angle === undefined) {
          containers[i].angle = 12;
        } else {
          containers[i].angle += 6;
        }
        containers[i].style.webkitTransform =
          "rotateZ(" + containers[i].angle + "deg)";
        containers[i].style.transform =
          "rotateZ(" + containers[i].angle + "deg)";
      }
      this.updateClock();
    }, 60000);
  };

  updateClock = () => {
    let weekday = new Array(7),
      d = new Date(),
      h = d.getHours(),
      m = d.getMinutes(),
      s = d.getSeconds(),
      date = d.getDate(),
      month = d.getMonth() + 1,
      year = d.getFullYear(),
      dateEl = document.querySelector(".date-out"),
      dayEl = document.querySelector(".day-out");

    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    let day = weekday[d.getDay()];

    if (month < 9) month = "0" + month;

    if (dateEl) {
      dateEl.innerHTML = date + " - " + month + " - " + year;
       dayEl.innerHTML = day;
    }
    
  };

  // destroy player on unmount
  componentWillUnmount() {
    clearInterval(this.state.minuteIntervalRef);
    clearInterval(this.state.secondIntervalRef);
    clearTimeout(this.state.setTimeoutRef);
  }


  propValueToNumber = propValue => {
    return propValue.match(/\d+/g).map(Number)[0];
  };

  renderDialline = (diallinesStyle) =>{
    let diallines = [];
    diallines.push(<div key={0} className="diallines" style={diallinesStyle}></div>);
    for (let i = 1; i < 60; i++) {
      let _diallinesStyle = diallinesStyle;
      _diallinesStyle.transform = "rotate(" + 6 * (i + 1) + "deg)";
      // console.log("transform", _diallinesStyle.transform);
      diallines.push(<div key={i} className="diallines" style={_diallinesStyle}></div>);
    }

    return diallines;
  }

  render() {
    let clockStyle = this.props.clockStyleSetting;
    // console.log("clockStyle", clockStyle);
    let diallineLayerStyle = { 
                              width: `${this.propValueToNumber(clockStyle.clockFace.width) - this.propValueToNumber(clockStyle.clockFace.padding)*2}px`,
                              height: `${this.propValueToNumber(clockStyle.clockFace.height) - this.propValueToNumber(clockStyle.clockFace.padding)*2}px`,
                              };
    let diallinesStyle = {...clockStyle.dialLines, transformOrigin: `50% ${this.propValueToNumber(clockStyle.clockFace.height) / 2 - this.propValueToNumber(clockStyle.clockFace.padding)}px`};
    let dialLinesQuarterStyle = {...clockStyle.dialLinesQuarter, transformOrigin: `50% ${this.propValueToNumber(clockStyle.clockFace.height) / 2 - this.propValueToNumber(clockStyle.clockFace.padding)}px`};    
    // console.log("clockStyle", clockStyle);

    let diallinesStyleAy = [];
    for (let i = 0; i < 60; i++) {
      let _style = {};
      if (i % 5 == 0) {
        _style = {...dialLinesQuarterStyle, transform: `rotate(${6 * i}deg)`};
      } else {
        _style = {...diallinesStyle, transform: `rotate(${6 * i}deg)`};
      }
      diallinesStyleAy.push(_style);
    }

    let numbersLayerStyle = {...clockStyle.numbersLayer,
      // opacity: 
      // padding: `${this.propValueToNumber(clockStyle.numbersLayer.padding)}px`,
      width: `${this.propValueToNumber(clockStyle.clockFace.width) - this.propValueToNumber(clockStyle.clockFace.padding)*2}px`,
      height: `${this.propValueToNumber(clockStyle.clockFace.height) - this.propValueToNumber(clockStyle.clockFace.padding)*2}px`,
      top: `${this.propValueToNumber(clockStyle.clockFace.padding)}px`,
      left: `${this.propValueToNumber(clockStyle.clockFace.padding)}px`,
      };

    let centerDotStyle = {...clockStyle.centerDot,
      left: `calc(50% - ${this.propValueToNumber(clockStyle.centerDot.width)/2}px)`,
      top: `calc(50% - ${this.propValueToNumber(clockStyle.centerDot.height)/2}px)`,
      ...clockStyle.clockHand
    }
      
    let dateInfoStyle = {
      opacity: clockStyle.dateDay.opacity,
      color: clockStyle.dateDay.color,
      fontSize: clockStyle.dateDay.fontSize,
      fontFamily: clockStyle.dateDay.fontFamily,
    };

    let dateOutStyle = {
      height: clockStyle.dateDay.height,
      padding: clockStyle.dateDay.padding, 
      top: clockStyle.dateDay.margin, 
      backgroundColor: clockStyle.dateDay.backgroundColor,
      boxShadow: clockStyle.dateDay.boxShadow};
    let dayOutStyle = {
      height: clockStyle.dateDay.height,
      padding: clockStyle.dateDay.padding, 
      bottom: clockStyle.dateDay.margin, 
      backgroundColor: clockStyle.dateDay.backgroundColor,
      boxShadow: clockStyle.dateDay.boxShadow};
    return (
      <div id={this.props.clockId} className="analogclock-root">
        <div className="analogclock" style={clockStyle.clockAppearance}>
          <div className="clock-face" style={clockStyle.clockFace}>
            <div className="dialline-layer" style={diallineLayerStyle}>
              {diallinesStyleAy.map((lineStyle, index)=>(
                <div key={index} className="diallines" style={lineStyle}></div>
              ))}
            </div>

            <div className="numbers-layer" style={numbersLayerStyle}>
              <div className="hour-numbers" style={clockStyle.hourNumbers}>
                <p>
                  <span>1</span>
                </p>
                <p>
                  <span>2</span>
                </p>
                <p>
                  <span style={clockStyle.hourNumbersQuarter}>3</span>
                </p>
                <p>
                  <span>4</span>
                </p>
                <p>
                  <span>5</span>
                </p>
                <p>
                  <span style={clockStyle.hourNumbersQuarter}>6</span>
                </p>
                <p>
                  <span>7</span>
                </p>
                <p>
                  <span>8</span>
                </p>
                <p>
                  <span style={clockStyle.hourNumbersQuarter}>9</span>
                </p>
                <p>
                  <span>10</span>
                </p>
                <p>
                  <span>11</span>
                </p>
                <p>
                  <span style={clockStyle.hourNumbersQuarter}>12</span>
                </p>
              </div>
            </div>

            <div className="date-info" style={dateInfoStyle}>
              <div className="date-out" style={dateOutStyle}></div>
              <div className="day-out" style={dayOutStyle}></div>
            </div>

            <div className="hours-container">
              <div className="hours-hand" style={{...clockStyle.hourHand, ...clockStyle.clockHand}}></div>
            </div>
            <div className="minutes-container">
              <div className="minutes-hand" style={{...clockStyle.minuteHand, ...clockStyle.clockHand}}></div>
            </div>
            <div className="seconds-container">
              <div className="seconds-hand" style={{...clockStyle.secondHand, ...clockStyle.clockHand}}></div>
            </div>

            <div className="center-dot" style={centerDotStyle}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default AnalogClock;
