import React, { Component } from "react";
import { connect } from "react-redux";
import $ from "jquery";
import {appHelper} from "../../lib/apphelper";
import PlayFrame from "./play_frame";
import moment from "moment";

/* data structure 
layoutClip{ ..., clipframes[
                                     [ frame{...} ],
                                     ...]
                          }
*/

class PlayLayoutBlock extends Component {
    state = {
      layoutClip: null,
      clipFrameIndex: 0,
      currenFrame: null,
      //--
      playFrameTimeout: null,
      cloneFrameDomId: "layoutClipCloneFrame",
    };

  componentDidMount() {

    let layoutBlockClip = this.props.layoutBlockClips.find(blockClip => blockClip.id == this.props.layoutClipId );
    
    let set_frame = null;
    if (layoutBlockClip.clipframes.length){
      set_frame = layoutBlockClip.clipframes[0].frame;
    }

    this.setState({ 
      layoutClip: layoutBlockClip,
      currenFrame: set_frame,
      cloneFrameDomId: `layoutClipCloneFrame_${this.props.layoutClipId}`
     });

    //start looping
    setTimeout(()=>{
      //this.startLayoutClip();
      if (this.state.currenFrame && this.state.layoutClip.clipframes.length > 1) {
        console.log("layoutClip", 1);
        console.log("nextFrame", this.state.clipFrameIndex);
        //set time for change next frame
        this.setNextFrameTime(this.state.currenFrame.duration);
      }
    }, 100);
  }

  // startLayoutClip = () => {
  //   if (this.state.currenFrame) {
  //     console.log("layoutClip", 1);
  //     console.log("nextFrame", this.state.clipFrameIndex);
  //     //set time for change next frame
  //     if (this.state.layoutClip.clipframes.length > 1) 
  //         this.setNextFrameTime(this.state.currenFrame.duration);
  //   }
  // };

  setNextFrameTime = duration => {
    clearTimeout(this.state.playFrameTimeout);
    const hms = duration.split(":");
    let time = moment.duration({
      hours: Number(hms[0]),
      minutes: Number(hms[1]),
      seconds: Number(hms[2])
    });
    console.log("nextFrame time", time.asSeconds());
    this.state.playFrameTimeout = setTimeout(() => {
      this.nextFrame();
    }, time.asMilliseconds());
  };

  nextFrame = () => {
    //console.log("clipframes.length:", this.state.currenFrame);
    //clone the playing frame to backgroung for apply transition
    const cloneNode = `#onFrame_${this.state.currenFrame.id} .play-frame`;

    $(cloneNode)
      .clone()
      .appendTo(`#${this.state.cloneFrameDomId}`);
    //apply fadeOut transition for playing frame and then remove it
    $(`#${this.state.cloneFrameDomId} .play-frame`).animate({ opacity: "0" }, 1000, () => {
      $(`#${this.state.cloneFrameDomId} .play-frame`).remove();
    });

    //calculate for get next frame
    let clipFrameIndex = this.state.clipFrameIndex;
    //if playing clip next finish then get next frame of clip
    if (clipFrameIndex < this.state.layoutClip.clipframes.length - 1) {
      clipFrameIndex = clipFrameIndex + 1;
      const set_frame = this.state.layoutClip.clipframes[clipFrameIndex].frame;
      this.setState({
        clipFrameIndex: clipFrameIndex,
        currenFrame: set_frame
      });
      console.log("nextFrame", clipFrameIndex);
      this.setNextFrameTime(set_frame.duration);
    } else {
      const set_frame = this.state.layoutClip.clipframes[0].frame;
      this.setState({
        clipFrameIndex: 0,
        currenFrame: set_frame
      });
      
      if (this.state.layoutClip.clipframes.length > 1) 
            this.setNextFrameTime(set_frame.duration);
    }
  };

  displayStyle = display => {
    let dStyle = { padding: "0px" };
    if (display) {
      dStyle.width = `${display.width}px`;
      dStyle.height = `${display.height}px`;
    }
    return dStyle;
  };

  componentWillUnmount() {
    clearTimeout(this.state.playFrameTimeout);
  }

  render() {
    //console.log("currenFrame", this.state.currenFrame);
    return (
      <div className="play-layoutblock">
        {this.state.currenFrame ? (
          <div
            id={`onFrame_${this.state.currenFrame.id}`}
            className={`transit-frame animated ${this.state.currenFrame.transition} slow`}
            key={this.state.currenFrame.id}
            style={{ zIndex: "100" }}
          >
            <PlayFrame
              frame={this.state.currenFrame}
              appSetting={this.props.appSetting}
              onPlaying={this.props.onPlaying} 
            />
          </div>
        ) : (
          ""
        )}

        <div id={this.state.cloneFrameDomId}></div>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    layoutBlockClips: state.onplaying.layoutBlockClips,
  };
};


export default connect(mapStateToProps, null)(PlayLayoutBlock);
