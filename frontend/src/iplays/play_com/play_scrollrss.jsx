import React, { Component } from "react";
import $ from "jquery";
import {appHelper} from "../../lib/apphelper";;
import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class PlayScrollRss extends Component {
  constructor(props) {
    super(props);
    this.state = {
      top: "0px",
    };
    this.animation = null;
    this.reloadRssInterval = null;
  }

  componentDidMount() {
    this.setState({top: this.props.scrollMsgsStyle.padding});
    if ( this.props.rssFeed ) {
        this.loadRssFeedData(this.props.rssFeed);
        //set reload rss feed
        this.reloadRssInterval = setInterval(()=>this.reloadRssFeed(), 1000*60*30);
         
      } 
  }

  loadRssFeedData = (rssFeed) => {
    axios
      .post(`/api/mediasource/readrss/`, 
          { rssUrl: rssFeed },
          {
            headers: {
              Authorization: ``,
            }
          })
      .then(res => {
          // console.log(res.data);
          let scrollMsgContent = res.data.join("    ");
          if (scrollMsgContent.length == 0) {
            scrollMsgContent = "!!!Rss url not receive have any data !!!";
          }
          //for start scrolling in farme
          setTimeout( () =>this.scrollingStart(scrollMsgContent), 100);
          // setTimeout( () =>this.scrollingStart(scrollMsgContent, this.props.scrollMsgsStyle.scrollingSpeed), 100);

        })
        .catch(err => {
          console.log(appHelper.handleApiFailed(err));
        });
}

reloadRssFeed = () =>{
    // console.log("reload rss url content");
    //clear exists scrolling dom element 
    $(`#scrollingMsg_${this.props.scrollingMsgId}`).empty()
    // clearInterval(this.scrollInterval);
    window.cancelAnimationFrame(this.animation);
	  this.animation = null;
    //reload reload rss message 
    setTimeout( () =>this.loadRssFeedData(this.props.rssFeed), 500);
}



fillMsgWord = (scrollMsgContent) =>{
  let scrollingMsg = $(`#scrollingMsg_${this.props.scrollingMsgId}`);

//   scrollMsgContent.split("").forEach((letter, index)=>{
//     if (letter==" ") {
//       scrollingMsg.append($(`<div class="msg-word" style="top: ${this.state.top}" ><span>&nbsp;</span></div>`));
//     } else {
//       scrollingMsg.append($(`<div class="msg-word" style="top: ${this.state.top}" ><span>${letter}</span></div>`));
//     }
//  });
  scrollMsgContent.split(" ").forEach((word, index)=>{
     scrollingMsg.append($(`<div class="msg-word" style="top: ${this.state.top}; opacity: 0" ><span>${word}</span></div>`));
     scrollingMsg.append($(`<div class="msg-word" style="top: ${this.state.top}; opacity: 0" ><span>&nbsp;</span></div>`));
  });

  scrollingMsg.append($(`<div class="msg-word" style="top: ${this.state.top}, opacity: 0.01" ><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></div>`));

  let msgWord_totalWidth = 0;
  const msgWords =  $(".msg-word");
  msgWords.each(function(index) {
      msgWord_totalWidth += $( this ).width();
  })

  return msgWord_totalWidth;
}

scrollingStart = (scrollMsgContent) =>{
  // scrollingStart = (scrollMsgContent, scrollingSpeed) =>{
  // console.log("scrollingStart");
  let scrollingMsg = $(`#scrollingMsg_${this.props.scrollingMsgId}`);
  scrollingMsg.empty();
  // scrollingMsg.css('opacity', '0');
  const scrollingMsgContainterWidth = scrollingMsg.parent().width();
  let totalWord_width = this.fillMsgWord(scrollMsgContent);
  while (totalWord_width < scrollingMsgContainterWidth) {
      totalWord_width = this.fillMsgWord(scrollMsgContent);
  }
  totalWord_width = this.fillMsgWord(scrollMsgContent);

  setTimeout(()=>{
    let msgChars =  $(".msg-word");
    const startOps = 200;
    let offsetX = 0;
    msgChars.each(function(index) {
        $( this ).css('left',  `${offsetX + startOps}px`);
        $( this ).css('opacity', '1');
        offsetX += $( this ).width();
    })

    // clearInterval(this.scrollInterval);
    // if (this.props.scrollRun) {
    //   this.scrollInterval = setInterval(() => {
    //       this.scrollingMove();
    //   }, scrollingSpeed);
    // } 
    this.animation = window.requestAnimationFrame(this.scrollingMove);
  }, 700);
}

scrollingMove = () =>{
  // console.log('scrollingRss');
  let msgWrds =  $(".msg-word");
  if (typeof(msgWrds) != "undefined") {
      msgWrds.each(function(index) {
          let left = appHelper.inputValueToNumber($( this ).css('left'));
          // console.log('left',  `${left - 1}px`);
          $( this ).css('left',  `${left - 1}px`);
      });

      if  (typeof(msgWrds.first().position()) != "undefined" ) {
          let mostLeft = appHelper.inputValueToNumber(msgWrds.first().css('left'))
          if ( mostLeft < 0 && Math.abs(mostLeft) > msgWrds.first().width()) {
              const mostRight = appHelper.inputValueToNumber(msgWrds.last().css('left')) + msgWrds.last().width();
              let firstWord = msgWrds.first();
              firstWord.css('left',  `${mostRight}px`);
              let scrollMsgs = $(`#scrollingMsg_${this.props.scrollingMsgId}`);
              firstWord.appendTo(scrollMsgs);
          }
      }
      this.animation = window.requestAnimationFrame(this.scrollingMove);
  } else {
    // clearInterval(this.scrollInterval);
    window.cancelAnimationFrame(this.animation);
	  this.animation = null;
  }

}
  componentWillUnmount() {
    window.cancelAnimationFrame(this.animation);
	  this.animation = null;
    // clearInterval(this.scrollInterval);
    // clearInterval(this.reloadRssInterval);
  }

  render() {

    let scrollMsgsStyle = this.props.scrollMsgsStyle;
    let playScrollmsgsStyle = {
        borderRadius: scrollMsgsStyle.borderRadius,
        boxShadow: scrollMsgsStyle.boxShadow,
        }

    if (this.props.element) {
        scrollMsgsStyle = { ...scrollMsgsStyle, width: `${this.props.element.width}px`, height: `${this.props.element.height}px`};
    }

    return (
        <div className="play-scrollmsgs" style={playScrollmsgsStyle} >
          <div id={`scrollingMsg_${this.props.scrollingMsgId}`} style={scrollMsgsStyle} className="scrolling-content">
             {/* {scrollMsgContent} */}
          </div>
      </div>
    );
  }
}
export default PlayScrollRss;
