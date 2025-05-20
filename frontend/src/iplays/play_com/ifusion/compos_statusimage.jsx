import React, { Fragment } from "react";

const ComposStatusImage = (props) => {
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


  if ( props.mediaSource ) {
        mediaStyle = {
          backgroundImage: `url("${props.mediaSource.content}")`,
          ...mediaStyle,
        }; 
  }

  return (
    <Fragment>
      {props.mediaSource  ? (
        <div className="mediasource" style={mediaStyle} />
      ) : (<div className="mediasource" style={{width: "100%", height: "100%", backgroundColor: "#ffffff"}} />
      )}
    </Fragment>
  );

};

export default ComposStatusImage;
