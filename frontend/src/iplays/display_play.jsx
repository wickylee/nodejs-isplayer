import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { setAppSetting } from "../store/appconfig/appConfigSlice";
import {
  setServerHosts,
  setPlayingDisplay,
  setDisplayPlaylists,
  setLayoutBlockClips,
} from "../store/onplaying/onplayingSlice";
import axios from "axios";
// import { axiosPrivate } from "../lib/axiosApi";
import $ from "jquery";
import {appHelper} from "../lib/apphelper";
import "../scss/player.scss";
import PlayFrame from "./play_com/play_frame";
import moment from "moment";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

/* data structure 
  playlist {...placyclips[ 
                      clip{ ..., clipframes[
                                     [ frame{...} ],
                                     ...]
                          },
                          ... ]
              },
  */

class DisplayPlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onPlaying: true,
      brand: null,
      playlist: null,
      playClipIndex: 0,
      clipFrameIndex: 0,
      currentClipRepeat: 0,
      repeatCount: 0,
      currentClip: null,
      currenFrame: null,
      //--
      contentMsg: "loading...",
      publishTime: null,
      playingDate: null,
      partialUpdate: null,
      //--
      getPreviewContentApi: `/api/player/previewcontent/`,
      getContentApi: `/api/player/content/`,
      getPublishTimeApi: `/api/player/publishtime_v2/`,
      //--
      playFrameTimeout: null,
      playClipTimeout: null,
      checkMidnightPassInterval: null,
      //--
      countClipChangeInterval: null,
      changeNextClipTime: 0
    };
  }

  componentDidMount() {
    //get the application config and display and playlist
    if (this.props.preview) {
      console.log("get preview non-publish display content");
      // axiosPrivate(this.props.auth, this.props.dispatch)
      // .get(this.state.getPreviewContentApi)
      // .then((res) => {
      //   //console.log("res", res.data);
      //   this.props.setAppSetting(res.data.appSetting);
      //   this.props.setPlayingDisplay(res.data.display);
      //   this.props.setDisplayPlaylists(res.data.playlists);
      //   this.props.setLayoutBlockClips(res.data.layoutBlockClips);
      //   //--
      //   const todayPlaylist = this.getTodayPlaylist(res.data.playlists);
      //   this.setState({ brand: res.data.brand, playlist: todayPlaylist, onPlaying: false });
      //   setTimeout(() => {
      //     this.startPlaylist(todayPlaylist);
      //   }, 200);
      // })
      // .catch((err) => {
      //   console.log(appHelper.handleApiFailed(err));
      // });
  } else if ( this.props.secure ){
      console.log("get secure display content");
      // axiosPrivate(this.props.auth, this.props.dispatch)
      // .get(`${this.state.getContentApi}securecontent/`)
      //   .then((res) => {
      //     //console.log("res", res.data);
      //     this.frontendSetStateContent(res.data);
      //   })
      //   .catch((err) => {
      //     console.log(appHelper.handleApiFailed(err));
      //   });

      // //start a time for check the publish time have changed that display
      // setInterval(() => {
      //   this.comparePublishTime();
      // }, 30 * 1000);
    } else {
      // get published display content
      axios
        .get(this.state.getContentApi,
          {
            headers: {
              Authorization: ``,
            }
          })
        .then((res) => {
          //console.log("res", res.data);
          this.frontendSetStateContent(res.data);
        })
        .catch((err) => {
          console.log(appHelper.handleApiFailed(err));
        });

      //start a time for check the publish time have changed that display
      setInterval(() => {
        this.comparePublishTime();
        // add at 2023 for detect whether the playback content fits the window size
        this.detectContentFitWithWindowSize(this.props.playingDisplay); 
      }, 30 * 1000);
    }

    this.checkMidnightPass();

  }
  
  // Detect whether the playback content fits the window size
  detectContentFitWithWindowSize = (display) =>{
    let curWin_width = $(window).width();
    let curWin_height = $(window).height();
    let wrapScale = parseFloat( $(".screen-wrap").attr("wrapscale") )
    if (display) {
      let widthScale = curWin_width / display.width;
      let heightScale = curWin_height / display.height;

      wrapScale = widthScale;
      if (widthScale > heightScale) wrapScale = heightScale;
    }
    // console.log("size output:", curWin_width,curWin_height);
    // console.log("curWrapScale:", $(".screen-wrap").attr("wrapScale"));
    // console.log("new wrapScale:", wrapScale.toString());
    if ( wrapScale.toString() != $(".screen-wrap").attr("wrapscale") ) {
      console.log("Content scale not match window size, to do dispaly reload!");
      location.reload(false);
    } 
    // else {
    //   console.log("Content scale match window size!");
    // }
  }

  frontendSetStateContent = (resData) =>{
    if (resData.actionError) {
      this.setState({ contentMsg: displayContent.actionError });
    } else {
      if (resData['iserver']){
        const serverHosts = { iserver: resData.iserver , wserver: resData.wserver};
        this.props.setServerHosts(serverHosts);
      }
      const displayContent = JSON.parse(resData.playcontent);
      this.props.setAppSetting(displayContent.appSetting);
      this.props.setPlayingDisplay(displayContent.display);
      this.props.setDisplayPlaylists(displayContent.playlists);
      this.props.setLayoutBlockClips(displayContent.layoutBlockClips);
      //--
      const todayPlaylist = this.getTodayPlaylist(
        displayContent.playlists
      );

      console.log(`todayPlaylist: ${todayPlaylist.name}, days: ${todayPlaylist.days}`);

      this.setState({
        brand: displayContent.brand,
        playlist: todayPlaylist,
        publishTime: Date.parse(resData.publish_at),
        partialUpdate: Date.parse(resData.partial_update),
      });
      setTimeout(() => {
        this.startPlaylist(todayPlaylist);
      }, 200);
    }
  }

  checkMidnightPass = () =>{
    const playingDate = new Date();
    this.setState({ playingDay: playingDate.toJSON().slice(0, 10)})
    this.state.checkMidnightPassInterval = setInterval(() => {
                                                let checkDate = new Date();

                                                // console.log(`checkMidnightPass : ${this.state.playingDay} <> ${checkDate.toJSON().slice(0, 10)}`);

                                                if (this.state.playingDay != checkDate.toJSON().slice(0, 10) ) {
                                                  console.log("todo : midnightpass reload ");
                                                  location.reload(false);
                                                }
                                              }, 1000 * 60);
  }

  getPartailUpdateContent =() =>{
    //when Secure Display is actived then must use  axiosPrivate connector and call securecontent aply
    // axios.get(`${this.state.getContentApi}${this.props.secure? "securecontent" : "directcontent"}/`,
    axios.get(this.state.getContentApi,
          {
            headers: {
              Authorization: ``,
            }
          })
        .then((res) => {
            const displayContent = JSON.parse(res.data.playcontent);
            this.props.setDisplayPlaylists(displayContent.playlists);
            this.props.setLayoutBlockClips(displayContent.layoutBlockClips);
            const todayPlaylist = this.getTodayPlaylist(
              displayContent.playlists
            );
            let currentClip = this.state.currentClip;
            //find currentFrame in todayPlaylist
            let playlistFrames = [];
            todayPlaylist.playclips.forEach( playclip =>{
              if (playclip.clip.id == this.state.currentClip.id) currentClip = playclip.clip;
              playclip.clip.clipframes.forEach(clipframe=>{
                playlistFrames.push(clipframe.frame);
              })
            })
            let updateFrame = null//this.state.currenFrame;
            playlistFrames.forEach(frame=>{
              if (frame.id == this.state.currenFrame.id) {
                updateFrame = frame;
              }
            })
            //update currenFrame, currentClip, playlist in state
            this.setState({currenFrame: updateFrame,
                           currentClip: currentClip,
                           playlist: todayPlaylist,
                           partialUpdate: Date.parse(res.data.partial_update),})
        })
        .catch((err) => {
          console.log(appHelper.handleApiFailed(err));
        });
  }

  comparePublishTime = () => {
    axios
      .get(this.state.getPublishTimeApi,
        {
          headers: {
            Authorization: ``,
          }
        })
      .then((res) => {
        //{"publish_at": display.publish_at, "partial_update": display.partial_update}
        const lastPublishTime = Date.parse(res.data.publish_at);
        if (lastPublishTime > this.state.publishTime) {
          console.log("todo : page reload ");
          location.reload(false);
        } else {
          console.log("keep playing");
        }
        //handel partial update for fusionView
        const lastPartialUpdate = Date.parse(res.data.partial_update);
        if (lastPartialUpdate){
          if (lastPartialUpdate > this.state.partialUpdate) {
            console.log("todo : partial update ");
            this.getPartailUpdateContent()
          } else {
            console.log("no partial updat");
          }
        }
        
      })
      .catch((err) => {
        console.log(appHelper.handleApiFailed(err));
      });
  };

  getTodayPlaylist = (displayPlaylists) => {
    let thisMoment = moment();
    console.log(`getTodayPlaylist time: ${thisMoment}`);
    let todayPlaylist = displayPlaylists.length ? displayPlaylists[0] : null;
    //check all playlist active date to set current playlist
    displayPlaylists.forEach((playlist, index) => {
      const pl_active_sd = moment(`${playlist.active_startdate} 00:00:00`, 'YYYY-MM-DD HH:mm:ss').utcOffset(thisMoment.utcOffset());
      const pl_active_ed = moment(`${playlist.active_enddate} 23:59:59`, 'YYYY-MM-DD HH:mm:ss').utcOffset(thisMoment.utcOffset());
      //check which playlist will be concern today
      if (pl_active_sd <= thisMoment && thisMoment <= pl_active_ed) {
        if (playlist.days == "Everyday") {
          todayPlaylist = displayPlaylists[index];
        } else {
          const playWeekdays = playlist.days.split(",");
          if (playWeekdays.includes(thisMoment.format("ddd"))) {
            todayPlaylist = displayPlaylists[index];
          }
        }
      }
    });
    return todayPlaylist;
  };

  startPlaylist = (playlist) => {
    let set_clip = null;
    let set_frame = null;
    let set_playClipIndex = 0;
    let set_currentClipRepeat = 1;

    if (playlist) {
      if (playlist.playmode == "Looping") {
        if (playlist.playclips.length) {
          set_clip = playlist.playclips[0].clip;
          set_currentClipRepeat = playlist.playclips[0].repeat;
        }
      }

      if (playlist.playmode == "Schedule") {
        //find which playclip will take at this moment
        const thisMoment = moment();
        const thisMomentTime = moment.duration(thisMoment.format("HH:mm:ss"));
        playlist.playclips.forEach((playclip, index) => {
          const pc_stime = moment.duration(playclip.stime);
          const pc_etime = moment.duration(playclip.etime);
          if (pc_stime <= thisMomentTime && thisMomentTime <= pc_etime) {
            set_clip = playlist.playclips[index].clip;
            set_playClipIndex = index;
          }
        });

        setTimeout(() => {
          this.setChangeClipTime();
        }, 1000);
      }

      if (set_clip && set_clip.clipframes && set_clip.clipframes.length) set_frame = set_clip.clipframes[0].frame;

      if (set_frame) {
        console.log("playClip Index:", set_playClipIndex);
        console.log("clip will Repeat:", set_currentClipRepeat);
        console.log("repeatCount:", 1);
        console.log("Start Frame:", this.state.clipFrameIndex);
        //set time for change next frame
        this.setNextFrameTime(set_frame.duration);
        this.setState({
          playClipIndex: set_playClipIndex,
          currentClipRepeat: set_currentClipRepeat,
          currentClip: set_clip,
          currenFrame: set_frame,
          repeatCount: 1,
        });
      } else {
        this.setNoneContentEvent();
      }
    } else {
      this.setNoneContentEvent();
    }
  };

  setNoneContentEvent = () =>{
    this.setState({
      contentMsg: "Not have content playing at this moment !",
    });

    setTimeout(() => {
      console.log("todo : page reload ");
      location.reload(false);
    }, 1000 * 60);
  }


  setCurrentClip = (playlist, playClipIndex, repeatCount) => {
    //each time setCurrentClip will start playing the first frame of clip
    // console.log("set playClip Index: ", playClipIndex);
    let set_currentClip = null;
    let set_frame = null;
    if (playlist.playclips[playClipIndex] ) {
      set_currentClip = playlist.playclips[playClipIndex].clip;
      set_frame = set_currentClip.clipframes[0].frame;
    }
    // console.log("repeatCount:", repeatCount);
    // console.log("start Frame: ", 0);

    this.setState({
      playClipIndex: playClipIndex,
      currentClip: set_currentClip,
      clipFrameIndex: 0,
      currenFrame: set_frame,
      repeatCount: repeatCount,
    });

    if (set_frame){
      //set time for change next frame
      this.setNextFrameTime(set_frame.duration);6

      if (this.state.playlist.playmode == "Schedule") {
        setTimeout(() => {
          this.setChangeClipTime();
        }, 200);
      }
    } else{
      this.setNoneContentEvent();
    }
    
  };

  setChangeClipTime = () => {
    if (this.state.playClipIndex < this.state.playlist.playclips.length) {
      //set a timeout for current playing clip
      clearTimeout(this.state.playClipTimeout);
      const playclip = this.state.playlist.playclips[this.state.playClipIndex];
      const thisMomentTime = moment.duration(moment().format("HH:mm:ss"));
      const changeNextClipTime = moment.duration(playclip.etime);
      const timeout = changeNextClipTime.asSeconds() - thisMomentTime.asSeconds();
      console.log("setCurrentClip Timeout at after: ", playclip.etime);
      console.log("waiting time: ", timeout);

      this.state.playClipTimeout = setTimeout(() => {
        this.setCurrentClip(
          this.state.playlist,
          this.state.playClipIndex + 1,
          1
        );
        console.log("change clip time", moment().format("HH:mm:ss"));
      }, timeout * 1000);

      // for monitor Next Clip change
      const monitorNextClipChange = true;
      if (monitorNextClipChange) {
        clearInterval(this.state.countClipChangeInterval);
        this.setState({changeNextClipTime: timeout})
        let intervalTime = 30;
        console.log(`* Next clip will show up after ${this.state.changeNextClipTime}sec.`);
        this.state.countClipChangeInterval = setInterval(()=>{
          let nextCountTime = this.state.changeNextClipTime - intervalTime;
          console.log(`* Next clip will show up after ${nextCountTime}sec.`);
          this.setState({changeNextClipTime: nextCountTime})
        }, intervalTime*1000);
      }
      //end
    }
  };

  setNextFrameTime = (duration) => {
    clearTimeout(this.state.playFrameTimeout);
    const hms = duration.split(":");
    let time = moment.duration({
      hours: Number(hms[0]),
      minutes: Number(hms[1]),
      seconds: Number(hms[2]),
    });
    // console.log("nextFrame time", time.asSeconds());
    this.state.playFrameTimeout = setTimeout(() => {
      this.nextFrame();
    }, time.asMilliseconds());
  };

  nextFrame = () => {
    let set_frame = null;
    //clone the playing frame to backgroung for apply transition
    if (this.state.currenFrame) {
      const cloneNode = `#onFrame_${this.state.currenFrame.id} .play-frame`;
      $(cloneNode).clone().appendTo("#cloneFrame");
      
      $("#cloneFrame").find(".play-video").remove()
    }
    //apply fadeOut transition for playing frame and then remove it
    $("#cloneFrame .play-frame").animate({ opacity: "0" }, 1000, () => {
      $("#cloneFrame .play-frame").remove();
    });

    //calculate for get next frame
    let clipFrameIndex = this.state.clipFrameIndex;
    //if playing frame not the end of curret clip then get next frame in clip
    if (this.state.currentClip) {
      if (clipFrameIndex < this.state.currentClip.clipframes.length - 1) {
        clipFrameIndex = clipFrameIndex + 1;
        set_frame = this.state.currentClip.clipframes[clipFrameIndex].frame;
        this.setState({
          clipFrameIndex: clipFrameIndex,
          currenFrame: set_frame,
        });
        console.log("nextFrame", clipFrameIndex);
        this.setNextFrameTime(set_frame.duration);
      } else {
        //when playing clip is finished then to check what will next play
        let set_playClipIndex = this.state.playClipIndex;
        let set_repeatCount = this.state.repeatCount;
        //for playmode of playlist in "Looping"
        if (this.state.playlist.playmode == "Looping") {
          //first looking the repeatCount of current playclip whether need repeat continue
          if (set_repeatCount == this.state.currentClipRepeat) {
            //when playing Clip Repeat is done then to check what next clip in playlist
            if (set_playClipIndex < this.state.playlist.playclips.length - 1) {
              //if playing Clip is not the end of playlist the set playClipIndex to next
              set_playClipIndex++;
            } else {
              //if playing Clip is the end of playlist then reset playClipIndex to 0 for replay playlist from start beginning
              set_playClipIndex = 0;
            }
            //anyway reset repeatCount to 1
            set_repeatCount = 1;
            //set playing next Clip
            this.setCurrentClip(
              this.state.playlist,
              set_playClipIndex,
              set_repeatCount
            );
          } else {
            //when playing Clip Repeat not finish just repeat continue
            set_repeatCount++;
            set_frame = this.state.currentClip.clipframes[0].frame;
            this.setState({
              clipFrameIndex: 0,
              currenFrame: set_frame,
              repeatCount: set_repeatCount,
            });
            console.log("repeatCount:", set_repeatCount);
            console.log("clip Repeat Frame", 0);
            this.setNextFrameTime(set_frame.duration);
          }
        }

        //for playmode of playlist in "Schedule"
        if (this.state.playlist.playmode == "Schedule") {
          //not change the playClipIndex for continue playing current clip
          set_frame = this.state.currentClip.clipframes[0].frame;
          this.setState({
            clipFrameIndex: 0,
            currenFrame: set_frame,
          });
          // console.log("nextFrame reset:", 0);
          this.setNextFrameTime(set_frame.duration);
          //waitting Clip time out
        }
      }
    }
  };

  //render Style function
  screenWrapStyle = (display) => {
    let style = { padding: "0px", transform: '', cursor: "none" };
    let wrapScale = this.state.curWrapScale;
    if (display) {
      let w_width = $(window).width();
      let w_height = $(window).height();

      let widthScale = w_width / display.width;
      let heightScale = w_height / display.height;

      wrapScale = widthScale;
      if (widthScale > heightScale) wrapScale = heightScale;

      let tx = (display.width - w_width) / 2;
      let ty = (display.height - w_height) / 2;
      style.transform = `scale(${wrapScale}) translate(${-1 * tx}px, ${
        -1 * ty
      }px)`;

      $(".screen-wrap").attr("wrapScale", wrapScale )
    }
    // this.setState({curWrapScale: wrapScale});
    return style;
  };

  displayStyle = (display) => {
    let dStyle = { padding: "0px" };
    if (display) {
      dStyle.width = `${display.width}px`;
      dStyle.height = `${display.height}px`;
    }
    return dStyle;
  };

  componentWillUnmount() {
    clearTimeout(this.state.playFrameTimeout);
    clearTimeout(this.state.playClipTimeout);
    clearInterval(this.state.checkMidnightPassInterval);
    
  }

  render() {
    return (
      <div className="wedplayer">
        {this.state.brand ? (
          <link
            rel="stylesheet"
            type="text/css"
            href={this.state.brand.webfontcss}
          />
        ) : (
          ""
        )}
        <div
          className="screen-wrap"
          style={this.screenWrapStyle(this.props.playingDisplay)}
          wrapscale="1"
        >
          <div
            id="displayroot"
            className="display-root"
            style={this.displayStyle(this.props.playingDisplay)}
          >
            {this.props.appSetting &&
            this.props.appSetting.licenseExpiry ? (
              <Fragment>
                <div className="license-expired">
                  <div>{`Application License has been Expired at (${this.props.appSetting.expiryDate}) !`}</div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
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
                      onPlaying={this.state.onPlaying}
                    />
                  </div>
                ) : (
                  <div className="content-msg">{this.state.contentMsg}</div>
                )}

                <div id="cloneFrame"></div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //auth: state.auth,
    appSetting: state.appconfig.appSetting,
    playingDisplay: state.onplaying.playingDisplay,
    displayPlaylists: state.onplaying.displayPlaylists,
    layoutBlockClips: state.onplaying.layoutBlockClips,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setServerHosts: (serverHosts) => dispatch(setServerHosts(serverHosts)),
    setAppSetting: (appSetting) => dispatch(setAppSetting(appSetting)),
    setPlayingDisplay: (display) =>  dispatch(setPlayingDisplay(display)),
    setDisplayPlaylists: (playlists) => dispatch(setDisplayPlaylists(playlists)),
    setLayoutBlockClips: (clips) => dispatch(setLayoutBlockClips(clips)),
    dispatch
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DisplayPlay);
