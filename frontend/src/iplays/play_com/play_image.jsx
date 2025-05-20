import React from "react";
import {appHelper} from "../../lib/apphelper";;

function PlayImage(props) {
  const media = props.element.mediasource;
  let mStyle = { padding: "0px" };
  mStyle.width = `${props.element.width}px`;
  mStyle.height =  `${props.element.height}px`;
  return (
    // <div className="play-image" >
      <img style={mStyle} src={media.content} />
    // </div>
  );
}
export default PlayImage;
