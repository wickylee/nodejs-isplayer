import React, { Fragment } from "react";
import {appHelper} from "../../../lib/apphelper";
import VideoPlayer from '../videoplayer'
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const ComposMediasource = (props) => {
  // define mediaSource css style
  let mediaStyle = {
    backgroundRepeat: props.domStyle.backgroundRepeat,
    backgroundSize: props.domStyle.backgroundSize,
  };
  // detect background position and add to mediaStyle
  if (props.domStyle.backgroundPositionX != undefined){
    mediaStyle = {
      ...mediaStyle,
      backgroundPositionX: props.domStyle.backgroundPositionX,
    }
  }
  if (props.domStyle.backgroundPositionY != undefined){
    mediaStyle = {
      ...mediaStyle,
      backgroundPositionY: props.domStyle.backgroundPositionY,
    }
  }

  let oneMediaSource =  null;
  let videoJsOptions = null;
  let multipleMediaSources = null;
  
  if (props.visualGroupMediasources.length) {
    // console.log("props.visualGroupMediasources.length", props.visualGroupMediasources);
    if (props.visualGroupMediasources.length == 1 ) { 
      oneMediaSource = props.visualGroupMediasources[0];
      // console.log("videoPlay", props.videoPlay);
      if ( props.videoPlay && (oneMediaSource.media_type.value == "proVideo" || oneMediaSource.media_type.value == "video")) {
        let type = appHelper.getExt(oneMediaSource.content);
        videoJsOptions = {
            width: props.domStyle.width,
            height: props.domStyle.height,
            sources: [{
                        src: `${oneMediaSource.content}`,
                        type: `video/${type}`
                      }]
            }
      } else if (oneMediaSource.media_type.value == "proVideo" || oneMediaSource.media_type.value == "video") {
          mediaStyle = {
            backgroundImage: `url("${appHelper.mediaThumbSrc(oneMediaSource.content)}")`,
            ...mediaStyle,
          }; 
      } else {
        mediaStyle = {
          backgroundImage: `url("${oneMediaSource.content}")`,
          ...mediaStyle,
        };  
      }

    } else {
      multipleMediaSources = [];
      props.visualGroupMediasources.forEach(mediaSource=>{
        if (mediaSource.media_type.value == "proVideo" || mediaSource.media_type.value == "video") {
          // if mediaSource is video type then just take it thumb image
          multipleMediaSources.push(appHelper.mediaThumbSrc(mediaSource.content))
        } else {
          multipleMediaSources.push(mediaSource.content)
        }
      });
      // console.log('multipleMediaSources',multipleMediaSources)
    }

    // console.log("oneMediaSource", oneMediaSource);
    // console.log("videoJsOptions", videoJsOptions);
    // console.log('multipleMediaSources', multipleMediaSources)
  }


  return (
    <Fragment>
      {props.visualGroupMediasources.length ? 
        <Fragment>
          {videoJsOptions ? 
            <div className="mediasource" >
                <VideoPlayer { ...videoJsOptions } />
            </div>
          :
            <>
            {multipleMediaSources ? 
              <div className="mediasource" style={mediaStyle} >
                <div className="slide-container" style={{width: props.domStyle.width}} >
                  <Zoom scale={1.4} duration={5*1000} arrows={false} 
                  onStartChange={(from, to) => {console.log(`images slide start ${from} to ${to}`)}}
                  >
                    {
                      multipleMediaSources.map((each, index) => (
                        <div key={index} style={{ width: "100%" }}>
                            <img style={{ objectFit: "cover", width: "100%" }} alt="Slide Image" src={each} />
                        </div>
                      ))
                    }
                  </Zoom>
                </div>
              </div>
            : 
              <div className="mediasource" style={mediaStyle} />
            }
            </>
          }
        </Fragment>
        :
       <Fragment>
       {/* if render the image box for planing design view */}
       { props.planView ? 
        <div className="mediasource w-full h-full border-red-500 border-dotted" style={{backgroundColor: "#ffffff", borderWidth: "1px" }} />
       : <></>}
       </Fragment> 
      }
    </Fragment>
  );

};

export default ComposMediasource;
