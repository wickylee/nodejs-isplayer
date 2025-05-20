import React from "react";
import uuid from 'react-uuid';
import {appHelper} from "../../../lib/apphelper";
import ComposStatusImage from "./compos_statusimage"
import ComposMediasource from "./compos_mediasource";

const PlayItemBoundField = (props) => {
  const componentId = uuid();
  const boundFieldDomStyle = JSON.parse(props.boundfield.express);
  const domStyle = appHelper.getRenderScaleStyle(
    props.viewScale,
    boundFieldDomStyle
  );

  const elementBoxSytle = {
    width: domStyle.width,
    height: domStyle.height,
    top: domStyle.top,
    left: domStyle.left,
    transform: "none",
  };

  //separate the position of dom style
  let insideDomStyle = {
    width: boundFieldDomStyle.width,
  };
  Object.keys(boundFieldDomStyle).map((cssKey) => {
    if (!elementBoxSytle.hasOwnProperty(cssKey))
      insideDomStyle[cssKey] = boundFieldDomStyle[cssKey];
  });

  insideDomStyle = appHelper.getRenderScaleStyle(
    props.viewScale,
    insideDomStyle
  );
  

  let visualGroupMediasources = [];
  if (props.boundfield.fieldkey == "mediasource") {
    insideDomStyle["overflow"] = "hidden";
    //check having transform css 
    if ( typeof domStyle.transform != "undefined" ){
      insideDomStyle["transform"] = domStyle.transform
    }

    if (props.bounditem.mediasources.length ) {
      //* case 1: to find out which mediasources are match boundFiled's visual group 
      visualGroupMediasources =  props.bounditem.mediasources.filter(mediaSource=> props.boundfield.pvg && mediaSource.pvg_id == props.boundfield.pvg_id)
      // console.log("case 1: visualGroupMediasources", visualGroupMediasources)
      
      //* case 2: if props.boundfield.pvg is null for old version coding, is there any mediasources.pvg == null (in old version coding case)
      if (props.boundfield.pvg == null ) {
        let shotsVisualGroup_boundItemMediaSources = props.bounditem.mediasources.filter(mediaSource=> (mediaSource.pvg_id == null || (mediaSource.pvg && mediaSource.pvg.value == "Shots")))
        visualGroupMediasources = [...visualGroupMediasources, ...shotsVisualGroup_boundItemMediaSources] 
        // console.log("case 2: visualGroupMediasources", visualGroupMediasources)
      }

      //* case 3: if boundfield.pvg.value == "Shots", is there any mediaSources.pvg.value == "Shots"
      if (props.boundfield.pvg && props.boundfield.pvg.value == "Shots") {
        let nonVisualGroup_boundItemMediaSources = props.bounditem.mediasources.filter(mediaSource=>mediaSource.pvg_id == null)
        visualGroupMediasources = [...visualGroupMediasources, ...nonVisualGroup_boundItemMediaSources] 
        // console.log("case 3: visualGroupMediasources", visualGroupMediasources)
      }
      
      //* cast 4: this partial coding goal for backward compatibly with iFusion master library itemShap image
      if (visualGroupMediasources.length == 0 && props.boundfield.pvg == null ) {
        visualGroupMediasources = props.bounditem.mediasources;
        // console.log("case 4: visualGroupMediasources", visualGroupMediasources)
      }
      
    }

    if (visualGroupMediasources.length == 0) {
      insideDomStyle["opacity"] = "0.3";
      if (props.planView != true) insideDomStyle["display"] = "none";
    }     
  }

  //if itemboundfield is for status
  let boundItemStatusImage = null;
  if (props.boundfield.fieldkey == "status") {
    insideDomStyle["overflow"] = "hidden";
    if (props.bounditem.status) {
      boundItemStatusImage = props.bounditem.status.mediasource;
    }

    if (props.fusionItem && props.getFusionItemRunStatus) {
      let realTimeStatus = props.getFusionItemRunStatus(props.fusionItem.id);
      if (realTimeStatus) {
        boundItemStatusImage = realTimeStatus.status.mediasource;
      }
    }

  }

  return (
    <div
      className="item-boundfield"
      style={{ opacity: props.fusionItem ? "1" : "0.25", zIndex: props.boundfield.zindex }}
    >
      <div className="element-box" style={elementBoxSytle}>
        <div className={`element-inside`} style={insideDomStyle}>
          
          {props.boundfield.fieldkey == "mediasource" || boundItemStatusImage ? (
            <>
              {props.boundfield.fieldkey == "mediasource" ? (
                <ComposMediasource 
                  boundfield={props.boundfield} 
                  visualGroupMediasources={visualGroupMediasources}
                  domStyle={insideDomStyle} 
                  planView={props.planView} 
                  videoPlay={props.videoPlay}
                  />
              ) : (
                <ComposStatusImage mediaSource={boundItemStatusImage} domStyle={insideDomStyle} />
              )}
            </>
          ) : (
            <div id={`boundfield_${componentId}`} className="boundfield-text" 
              style={{ lineHeight: appHelper.fontLineHeightAjustOnLinux(insideDomStyle), width: (insideDomStyle["whiteSpace"] == "nowrap") ? "auto" : "100%"} }
                  textwraphandle={appHelper.ifusionTextWrapHandler(`boundfield_${componentId}`, boundFieldDomStyle, props.viewScale)}>
                    {
                    appHelper.itemShapeBoundfieldText(
                      props.boundfield.fieldkey,
                      props.bounditem,
                      boundFieldDomStyle,
                      props.fusionView ? props.fusionView.price_group_id : null
                    )
                    }
                  </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PlayItemBoundField;
