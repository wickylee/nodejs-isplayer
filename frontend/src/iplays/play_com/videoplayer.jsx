import React, {Component} from "react";
import videojs from "video.js";

export default class VideoPlayer extends Component {
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log("onPlayerReady") //, this);
    });

  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div data-vjs-player>
        <video
          ref={node => (this.videoNode = node)}
          autoPlay={true}
          preload="auto"
          muted={false}
          loop={true}
          className="video-js"
        />
      </div>
    );
  }
}
