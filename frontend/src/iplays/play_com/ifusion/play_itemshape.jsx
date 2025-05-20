import React from "react";
import {appHelper} from "../../../lib/apphelper";
import PlayStaticElement from "./play_staticelement";
import PlayItemBoundField from "./play_itemboundfield";

const PlayItemShape = (props) => {
  let itemShape = props.itemShape;

  let domStyle = appHelper.getRenderScaleStyle(
    props.viewScale,
    JSON.parse(itemShape.express)
  );
  //apply mediasource as background image
  if (itemShape.mediasource) {
    domStyle.backgroundImage = `url("${itemShape.mediasource.content}")`;
  }

  return (
    <div className="itemshape-view" style={domStyle}>
      {itemShape.staticElements.map((staticElement, ikey) => (
        <PlayStaticElement
          key={ikey}
          staticElement={staticElement}
          viewScale={props.viewScale}
          videoPlay={true}
        />
      ))}

      {itemShape.boundfields &&
        itemShape.boundfields.map((boundfield, ikey) => (
          <PlayItemBoundField
            key={ikey}
            viewScale={props.viewScale}
            fusionView={props.fusionView}
            fusionItem={props.fusionItem}
            boundfield={boundfield}
            bounditem={
              props.fusionItem
                ? props.fusionItem.bounditem
                : itemShape.bounditem
            }
            getFusionItemRunStatus={props.getFusionItemRunStatus}
            planView={props.planView != undefined ? props.planView : false}
            videoPlay={props.videoPlay}
          />
        ))}
    </div>
  );
};

export default PlayItemShape;
