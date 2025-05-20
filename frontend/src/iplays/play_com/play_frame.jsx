import React from "react";
import PlayElement from "./play_element";

const PlayFrame = (props) =>{

  const frameStyle = (frame) =>{
    let style={ padding: "0px" }
    if (frame) {
      style.width = `${frame.width}px`;
      style.height =  `${frame.height}px`;
    }
    return style
  }

    return (
      <div className="play-frame" style={frameStyle(props.frame)}>
        {props.frame &&
         props.frame.elements.map((element, index) => (
            <PlayElement key={index} element={element} appSetting={props.appSetting} onPlaying={props.onPlaying} />
          ))}
      </div>
    );

}

export default PlayFrame;
