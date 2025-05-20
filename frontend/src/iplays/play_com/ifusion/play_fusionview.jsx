import React, { Component } from "react";
import { connect } from "react-redux";
import {appHelper} from "../../../lib/apphelper";
import WebSocketInstance from "./websocket";
import PlayStaticElement from "./play_staticelement";
import PlayListBlock from "./play_listblock";
import moment from 'moment';
import axios from "axios";

const getOnLineStatus = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : false;

class PlayFusionView extends Component {
  constructor(props) {
    super(props);
    this.state = {
                  fusionItemRunStatus: [],
                  onLineStatus: getOnLineStatus()
                };
    this.onLineStatusChechInterval = null;
  }

  componentDidMount() {
    //check player whether online
    console.log("onLineStatus", this.state.onLineStatus);
    
    if (this.state.onLineStatus) {
      this.reloadFusionItemStatuses(this.props.fusionView.id);
      // console.log("onPlaying", this.props.onPlaying);
      if (this.props.onPlaying) {
        this.builingWebsocketConnection();
      }
      
      // keep check onLineStatus whether have change
      this.onLineStatusChechInterval = setInterval(() => {
        // compare is onLineStatus having change
        if(this.state.onLineStatus != getOnLineStatus() ) {
          if (!this.state.onLineStatus && getOnLineStatus() ) { 
            // incase if onLineStatus from false resume to true then reload page
            console.log("play onLineStatus resumed!");
            window.location.reload();
          } else {
            // incase if onLineStatus from false resume to true then reload page
            console.log("play become offline!");
          }
        }
        // keep upate onLineStatus value
        console.log("onLineStatus", this.state.onLineStatus);
        this.setState({onLineStatus: getOnLineStatus()})
      }, 10*1000);

    } else {
      // try to resume ItemStatus check when player back to online
      this.onLineStatusChechInterval = setInterval(() => {
        if (getOnLineStatus()) {
          window.location.reload()
        } else {
          console.log("play still offline!");
        }
      }, 10*1000);
    }
    
  }

  builingWebsocketConnection = () => {
    // 1. Connect first
    WebSocketInstance.connect(this.props.fusionView.id, this.props.wserver);

    // 2. Wait for connection, then add callbacks
    this.waitForSocketConnection(() => {
      WebSocketInstance.addCallbacks(
        this.wsFusionItemStatusChangeCallback.bind(this)
      );
    });
  };

  waitForSocketConnection = (callback) => {
    const checkConnection = () => {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is made");
        callback();
      } else {
        console.log("Waiting for WebSocket connection...");
        setTimeout(checkConnection, 500);
      }
    };
    checkConnection();
  };

/*
  //websocket data methods
  builingWebsocketConnection = () => {
    setTimeout(() => {
      //initialize the websocket object
      this.waitForSocketConnection(() => {
        WebSocketInstance.addCallbacks(
          this.wsFusionItemStatusChangeCallback.bind(this) //bind to fusionitemStatusChange command
        );
      });

      WebSocketInstance.connect(this.props.fusionView.id, this.props.wserver);
    }, 500);
  };

  waitForSocketConnection = (callback) => {
    const component = this;
    setTimeout(function () {
      if (WebSocketInstance.state() === 1) {
        console.log("Connection is made");
        callback();
        return;
      } else {
        console.log("wait for connection...");
        // component.waitForSocketConnection(callback);
      }
    }, 1000);
  };
*/

  wsFusionItemStatusChangeCallback = (data) => {
    console.log("Fusion Item Status Change Callback:", data);
    const changedItemRunStatus = data;
    //count case and then update this.status.fusionItemRunStatus
    let _fusionItemRunStatus = this.state.fusionItemRunStatus;
    if (changedItemRunStatus.effective) { // add status or change status
      //find exists itemRunStatus ?
      const existsIndex = _fusionItemRunStatus.findIndex(runStatus=> runStatus.fusionItem.id == changedItemRunStatus.fusionItem.id);
      //if yes replace that data
      if (existsIndex != -1) {
        _fusionItemRunStatus[existsIndex] = changedItemRunStatus;
      } else { // else push new incoming itemrunstatus data
        _fusionItemRunStatus.push(changedItemRunStatus);
      }
      
    } else { //change status to default status of item product 
      //Just to filter out the itemrunstatus in this.status.fusionItemRunStatus
      _fusionItemRunStatus = _fusionItemRunStatus.filter(runStatus=> runStatus.fusionItem.id != changedItemRunStatus.fusionItem.id);
    }
    console.log("update fusionItemRun Status", _fusionItemRunStatus);
    this.setState({fusionItemRunStatus: _fusionItemRunStatus});
  };

  componentWillUnmount() {
    if (this.props.onPlaying) {
      WebSocketInstance.unmountDisconnect();
    }
    clearInterval(this.onLineStatusChechInterval);
  }
  //end websocket methods

  reloadFusionItemStatuses = (fusionViewId) =>{
    const today = moment().format();
    let payload = { fusionViewId : fusionViewId,
                    filterDay: today.slice(0, 10)
                  }
    axios.post(`/api/itemrunstatus/daystatus/`,
        payload,
        { 
          headers: { Authorization: ``}
        }).then((res) => {
            this.setState({fusionItemRunStatus: res.data})
          })
          .catch((err) => {
            console.log(appHelper.handleApiFailed(err));
          });
  }

  getFusionItemRunStatus = (fusionItemId) =>{
    let itemRunStatus = null;
    // if (fusionItemId && getOnLineStatus()) {
      this.state.fusionItemRunStatus.forEach(itemrunstatus=>{
        if (itemrunstatus.fusionItem.id == fusionItemId) itemRunStatus = itemrunstatus;
      });
    // }
    return itemRunStatus;
  }



  render() {
    const fusionLayout = appHelper.fusionLayoutParseDomStyle(this.props.fusionView.fusionLayout);

    const domStyle = appHelper.getRenderScaleStyle(
      this.props.viewScale,
      fusionLayout.domStyle
    );
    //apply mediasource as background image
    if (fusionLayout.mediasource) {
      domStyle.backgroundImage = `url("${fusionLayout.mediasource.content}")`;
    }

    return (
      <div className="composition-view" style={domStyle}>
        {fusionLayout.listBlocks.map((listBlock, ikey) => (
          <PlayListBlock
            key={listBlock.id}
            listBlock={listBlock}
            fusionView={this.props.fusionView}
            viewScale={this.props.viewScale}
            getFusionItemRunStatus={this.getFusionItemRunStatus}
            videoPlay={this.props.onPlaying}
          />
        ))}

        {fusionLayout.staticElements.map((staticElement, ikey) => (
          <PlayStaticElement
            key={ikey}
            staticElement={staticElement}
            viewScale={this.props.viewScale}
            videoPlay={this.props.onPlaying}
          />
        ))}
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    wserver: state.onplaying.wserver,
  };
};

export default connect(mapStateToProps, null)(PlayFusionView);