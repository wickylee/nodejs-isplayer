import React, { Component } from "react";
import $ from "jquery";
import moment from "moment";
import "./lcdstyledigital_clock.scss";
// import appHelper from "./apphelper";

class LcdStyleDigitalClock extends Component {
  state = {
    digit_to_name: "zero one two three four five six seven eight nine".split(
      " "
    ),
    positions: ["h1", "h2", ":", "m1", "m2", ":", "s1", "s2"],
    weekday_names: "MON TUE WED THU FRI SAT SUN".split(" "),
    digits: {},
    inc: 1000,
    setIntervalRef: null,
  };

  componentDidMount() {
    const clockStyle = this.props.clockStyleSetting;
    const timeDigitStyle = `background-color: ${clockStyle.timeDigit.color}; border-color: ${clockStyle.timeDigit.color}`;
    const dotsStyle = `background-color: ${clockStyle.timeDigit.color}; opacity: 0.7`;

    let digit_holder = $(`#${this.props.clockId} .display`).find(".digits");

    this.state.positions.forEach((item) => {
      if (item == ":") {
        digit_holder.append('<div class="dots"><div class="dot-t" style="'+dotsStyle+'" /><div class="dot-b" style="'+dotsStyle+'"/>');
      } else {
        let pos = $("<div>");

        for (let i = 1; i < 8; i++) {
          pos.append('<span class="d' + i + '" style="'+timeDigitStyle+'">'); //style='"+ timeDigit +"'
        }

        // Set the digits as key:value pairs in the digits object
        this.state.digits[item] = pos;

        // Add the digit elements to the page
        digit_holder.append(pos);
      }
    });

    // Add the weekday names

    // let weekday_names = 'MON TUE WED THU FRI SAT SUN'.split(' '),
    let weekday_holder = $(`#${this.props.clockId} .display`).find(".weekdays");
    this.state.weekday_names.forEach((item) => {
      weekday_holder.append("<span class='"+item.toLowerCase()+"'>" + item + "</span>");
    });

    if (this.props.clockRun) {
      this.state.setIntervalRef = setInterval(() => {
        this.updateTime();
      }, this.state.inc);
    } else {
      this.updateTime();
    }
  }

  updateTime = () => {
    let now = moment().format("hhmmssdA");

    this.state.digits.h1.attr("class", this.state.digit_to_name[now[0]]);
    this.state.digits.h2.attr("class", this.state.digit_to_name[now[1]]);
    this.state.digits.m1.attr("class", this.state.digit_to_name[now[2]]);
    this.state.digits.m2.attr("class", this.state.digit_to_name[now[3]]);
    this.state.digits.s1.attr("class", this.state.digit_to_name[now[4]]);
    this.state.digits.s2.attr("class", this.state.digit_to_name[now[5]]);

    let dow = now[6];
    dow--;
    // Sunday!
    if (dow < 0) {
      // Make it last
      dow = 6;
    }

    // Mark the active day of the week
    let weekdays = $(`#${this.props.clockId} .display`).find(".weekdays span");

    weekdays.removeClass("active").eq(dow).addClass("active");

    // Set the am/pm text:
    let ampm = $(`#${this.props.clockId} .display`).find(".ampm");
    ampm.text(now[7] + now[8]);
  };

  // destroy player on unmount
  componentWillUnmount() {
    clearInterval(this.state.setIntervalRef);
  }

  render() {
    // const t = this.props.t;
    let clockStyle = this.props.clockStyleSetting;

    return (
      <div id={this.props.clockId} className="ledstyledigitalclock-root">
        <div className="ledstyledigitalclock" style={clockStyle.clockAppearance}>
          <div className="display" style={clockStyle.clockDispaly}>
            <div className="weekdays"></div>
            
            <div className="time-content" style={clockStyle.timeDigit}>
              <div className="digits"></div>
              <div className="ampm"></div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default LcdStyleDigitalClock;
