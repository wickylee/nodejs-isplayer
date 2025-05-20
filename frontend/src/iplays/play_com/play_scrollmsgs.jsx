import React, { Component, Fragment } from "react";
import $ from "jquery";
import styled, { keyframes } from "styled-components";

class Playscrollmsgs extends Component {
  // constructor(props) {
  //   super(props);
    state = {
      msgWordDomWidth: 0,
      msgRepeatTimes: [],
      tickerAnimaStart: false,
    };
  // }

  componentDidMount() {
    setTimeout(() => this.scrollingStart(), 700);
  }

  fillMsgWord = () => {
    let scrollingMsg = $(`#msgTicker_${this.props.scrollingMsgId}`);
    scrollingMsg.append(
      $(`<div class="ticker-word" ><span>${this.props.content}</span></div>`)
    );
    scrollingMsg.append(
      $(`<div class="ticker-word ticker-space" >&nbsp;</div>`)
    );
  };

  scrollingStart = () => {
    // console.log("scrollingStart");
    let scrollingMsg = $(`#msgTicker_${this.props.scrollingMsgId}`);
    scrollingMsg.empty();
    const scrollingMsgContainterWidth = scrollingMsg.parent().width();

    let msgRepeatTimes = [1];
    this.fillMsgWord();

    setTimeout(() => {
      const msgWords = $(
        `#msgTicker_${this.props.scrollingMsgId} .ticker-word`
      );

      if (typeof msgWords != "undefined") {
        let msgWordDomWidth = 0;
        msgWords.each(function (index) {
          msgWordDomWidth += this.offsetWidth;
        });
        if (msgWordDomWidth > 0) {
          let totalWord_width = msgWordDomWidth;
          console.log("setTimeout_totalWidth", totalWord_width);
          while (totalWord_width < scrollingMsgContainterWidth) {
            totalWord_width += msgWordDomWidth;
            this.fillMsgWord();
            msgRepeatTimes.push(1);
          }
          this.fillMsgWord();
  
          msgRepeatTimes.push(1);
          this.setState({
            msgWordDomWidth: Number(msgWordDomWidth),
            msgRepeatTimes: msgRepeatTimes,
          });
        }
      }
    }, 700);
  };

  setAnimaStart = () =>{
    this.setState({tickerAnimaStart: true});
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.tickerAnimaStart) {
      // console.log("not ComponentUpdate");
      return false;
    } else {
      // console.log("shouldComponentUpdate");
      return true;
    }
    
  }

  render() {
    //console.log("msgWordDomWidth", this.state.msgWordDomWidth);
    let scrollMsgsStyle = this.props.scrollMsgsStyle;
    let playScrollmsgsStyle = {
      borderRadius: scrollMsgsStyle.borderRadius,
      boxShadow: scrollMsgsStyle.boxShadow,
    };

    if (this.props.element) {
      scrollMsgsStyle = {
        ...scrollMsgsStyle,
        width: `${this.props.element.width}px`,
        height: `${this.props.element.height}px`,
      };
    }

    let tickerKf = keyframes`
          0% {
            transform: translate3d(0, 0, 0);
          }
        
          100% {
            transform: translate3d(-${this.state.msgWordDomWidth}px, 0, 0);
          }
        `;

    let keyFrameSpeed = this.props.scrollMsgsStyle.scrollingSpeed;
    if (this.state.msgWordDomWidth > 0) {
      keyFrameSpeed = parseInt(this.state.msgWordDomWidth / keyFrameSpeed);
      // console.log("keyFrameSpeed", keyFrameSpeed);
      setTimeout(()=>{this.setAnimaStart()}, 200);
    }

    let MsgTicker = styled.div`
      animation: ${tickerKf}
        ${this.state.msgWordDomWidth /
        this.props.scrollMsgsStyle.scrollingSpeed}s
        linear infinite;
    `;

    return (
      <div className="play-scrollmsgs" style={playScrollmsgsStyle}>
        <div
          id={`scrollingMsg_${this.props.scrollingMsgId}`}
          style={scrollMsgsStyle}
          className="scrolling-content"
        >
          {this.state.msgWordDomWidth > 0 ? (
            <MsgTicker
              id={`msgTicker_${this.props.scrollingMsgId}`}
              className="msg-ticker"
            >
              {this.state.msgRepeatTimes.map((time, ikey) => (
                <Fragment key={ikey}>
                  <div className="ticker-word">
                    <span>{this.props.content}</span>
                  </div>
                  <div className="ticker-word ticker-space">&nbsp;</div>
                </Fragment>
              ))}
            </MsgTicker>
          ) : (
            <MsgTicker
              id={`msgTicker_${this.props.scrollingMsgId}`}
              className="msg-ticker"
            ></MsgTicker>
          )}
        </div>
      </div>
    );
  }
}
export default Playscrollmsgs;
