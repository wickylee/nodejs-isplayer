import React, {Component} from "react";
import Iframe from 'react-iframe'

class PlayWebsource extends Component {
//https://devpro.icast.com.hk/itdevice?id=37
  componentDidMount() {
    const media = this.props.element.mediasource;
    if(media.media_type.value == "websource" && media.content.indexOf("itdevice")) {
      window.addEventListener("message", this.msgHandler)
      console.log("addEventListener for iTicket print")
    }
}


msgHandler = (e) =>{
  //console.log("msgHandler:", e.origin)
  if (e.origin.includes('icast.com.hk') || e.origin.includes('cloud.icast.local') ) {
    // console.log("frame post data:", e.data)
    try {
        let msgData = JSON.parse(e.data)
        switch (msgData.type) {
          case 'printTicket':
            console.log("printTicket:", msgData.printTicket.issuedTicket.id);
            this.sendPrintJob(msgData);
            break;
          case 'other':
            console.log("data.type:", e.data.type);
            break;
        }
    } catch (err) {
      console.log("catch error:", err);
    }
  }

}

sendPrintJob = (msgData) => {
  if (msgData.printApiUrl.includes("/api/player/print/")){
    fetch(msgData.printApiUrl, {
      body: JSON.stringify(msgData.printTicket),
      headers:  {'Content-Type': 'application/json'},
      method: 'POST'
    }).then(response=>{
      console.log('printing', response)
    }).catch(error =>{
      console.log(error)
    });
  } else {
    console.log('RootPageCall', "Android.webAppTicketPrintHandler")
    Android.webAppTicketPrintHandler(JSON.stringify(msgData.printTicket));
  }
}

render() {
  const media = this.props.element.mediasource;
  let mStyle = { padding: "0px" };
  mStyle.width = `${this.props.element.width}px`;
  mStyle.height =  `${this.props.element.height}px`;
  //console.log(media.content)
  return (
    <div style={mStyle} className="play-websource">
      {media.content.indexOf("www.youtube.com") ? 
        <Iframe url={media.content}
              scrolling='no'
              id={`element_${this.props.element.id}`}
              className="play-iframe"
              width={mStyle.width}
              height={mStyle.height}
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
        />      
      :
        <Iframe url={media.content}
              scrolling='no'
              id={`element_${this.props.element.id}`}
              className="play-iframe"
              width={mStyle.width}
              height={mStyle.height}
              frameborder="0" 
              // allowtransparency="true"
        />      
      }
    </div>
  );
 }
}
export default PlayWebsource;
