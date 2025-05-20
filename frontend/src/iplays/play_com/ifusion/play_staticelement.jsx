import React from "react";
import uuid from 'react-uuid';
import {appHelper} from "../../../lib/apphelper";
import ComposStaticMediasource from "./compos_staticmediasource";

const PlayStaticElement = (props) => {
  const componentId = uuid();

  const staticElementDomStyle = JSON.parse(props.staticElement.express);
  const domStyle = appHelper.getRenderScaleStyle(props.viewScale, staticElementDomStyle);

    const mediasource = props.staticElement.mediasource;
    // setup mediasource for staticElement
    if ( mediasource ) {
      domStyle['overflow'] = "hidden";
    }

    let segments =
      props.staticElement.segments != ""
        ? JSON.parse(props.staticElement.segments)
        : [];

  const getSegmentDomStyle = (express) =>{
          let segmentsDomStyle = appHelper.getRenderScaleStyle( props.viewScale, express);
          segmentsDomStyle['lineHeight'] = appHelper.fontLineHeightAjustOnLinux(segmentsDomStyle);
          if (segmentsDomStyle["whiteSpace"] == "nowrap") 
              segmentsDomStyle["width"] = "auto";
          return segmentsDomStyle;
        }

    return (
      <div
        id={`staticElement_${props.staticElement.id}`}
        data_id={props.staticElement.id}
        className="static-element"
        style={{zIndex: props.staticElement.zindex}}
      >
            <div className="element-box" style={domStyle}>
              <div className={`element-inside`}>
                {mediasource ? 
                  <ComposStaticMediasource 
                  mediasource={mediasource} domStyle={domStyle} 
                  videoPlay={props.videoPlay}/>
                : <></>}

                {segments.map((segment, ikey) => (
                  <div
                  id={`staticsegment_${componentId}`}
                    key={ikey}
                    className="segments-txt"
                    style={getSegmentDomStyle(segment.express)}
                    textwraphandle={appHelper.ifusionTextWrapHandler(`staticsegment_${componentId}`, segment.express, props.viewScale)}
                  >
                    {segment.text}
                  </div>
                ))}
              </div>
            </div>
      </div>
    );

}
export default PlayStaticElement;
