import React, { Component } from "react";
// import ReactPlayer from "react-player";
import VideoPlayer from './videoplayer'
import {appHelper} from "../../lib/apphelper";;

class PlayVideo extends Component {
  // state = { playing: false };

  // handleOnReady = () => {
  //   console.log('OnReady');
  //   setTimeout(() => this.setState({ playing: true }), 100);
  // };

  // // destroy player on unmount
  // componentWillUnmount() {
  //     this.setState({ playing: false });
  // }

  render() {
    const media = this.props.element.mediasource;
    let mStyle = { padding: "0px" };
    mStyle.width = `${this.props.element.width}px`;
    mStyle.height = `${this.props.element.height}px`;
    const type = appHelper.getExt(media.content);
    const videoJsOptions = {
      width: this.props.element.width,
      height: this.props.element.height,
      sources: [{
        src: `${media.content}`,
        type: `video/${type}`
      }]
    }
    return (
      <div className="play-video">
        <VideoPlayer { ...videoJsOptions } />
        {/* <ReactPlayer
          ref={el => this._videoRef = el}
          muted={true} 
          url={media.content}
          loop={false}
          controls={false}
          width={this.props.element.width}
          height={this.props.element.height}
          className="react-player"
          onReady={this.handleOnReady}
          playing={this.state.playing}
        /> */}
      </div>
    );
  }
}

export default PlayVideo;
