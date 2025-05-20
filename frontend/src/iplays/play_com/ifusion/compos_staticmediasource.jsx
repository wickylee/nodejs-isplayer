import React, { Fragment } from "react";
import {appHelper} from "../../../lib/apphelper";
import VideoPlayer from '../videoplayer'

const ComposStaticMediasource = (props) => {
  // console.log("props.mediasource", props.mediasource)
  let mediasource = props.mediasource;
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

  let videoJsOptions = null;
  if (mediasource) {
    // console.log("videoPlay", props.videoPlay);
    if (props.videoPlay && (mediasource.media_type.value == "proVideo" || mediasource.media_type.value == "video") ) 
    {
        let type = appHelper.getExt(mediasource.content);
        videoJsOptions = {
          width: props.domStyle.width,
          height: props.domStyle.height,
          sources: [{
            src: `${mediasource.content}`,
            type: `video/${type}`
          }]
        }
      } else if(mediasource.media_type.value == "proVideo" || mediasource.media_type.value == "video") {
        mediaStyle = {
          backgroundImage: `url("${appHelper.mediaThumbSrc(mediasource.content)}")`,
          ...mediaStyle,
        };        
      } else {
        mediaStyle = {
          backgroundImage: `url("${mediasource.content}")`,
          ...mediaStyle,
        };   
      }
  }

  return (
    <Fragment>
      {mediasource ? (
        <>
        {videoJsOptions ? 
          <div className="mediasource" >
              <VideoPlayer { ...videoJsOptions } />
          </div>
        :
          <div className="mediasource" style={mediaStyle} />
        }
        </>
      ) : (<div className="mediasource" style={{width: "100%", height: "100%", backgroundColor: "#ffffff"}} />
      )}
    </Fragment>
  );
};
export default ComposStaticMediasource;
