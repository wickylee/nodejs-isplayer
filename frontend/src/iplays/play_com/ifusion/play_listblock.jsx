import React, {Fragment} from "react";
import {appHelper} from "../../../lib/apphelper";
import PlayItemShape from "./play_itemshape";

const PlayListBlock = (props) => {
  const getAssignedProductOfListItem = (listItemId) => {
    const fusionItem = props.fusionView.fusionItems.find(
      (fitem) => fitem.listItem == listItemId
    );
    if (typeof fusionItem == undefined) return null;
    return fusionItem;
  };
  
  const listBlockElementDomStyle = JSON.parse(props.listBlock.express);

  let domStyle = appHelper.getRenderScaleStyle(
    props.viewScale,
    listBlockElementDomStyle
  );

  let listBlockSytle = {
    width: domStyle.width,
    height: domStyle.height,
    top: domStyle.top,
    left: domStyle.left,
  };

  //separate the position of dom style
  let partialDomStyle = {};
  Object.keys(listBlockElementDomStyle).map((cssKey) => {
      if (!listBlockSytle.hasOwnProperty(cssKey))
        partialDomStyle[cssKey] = listBlockElementDomStyle[cssKey];
    });

  partialDomStyle = appHelper.getRenderScaleStyle(
    props.viewScale,
    partialDomStyle
  );

  return (
    <div className="list-block" style={{ zIndex: props.listBlock.zindex }}>
      <div
        className="element-box"
        style={domStyle}
        data_id={props.listBlock.id}
      >
        <div className="element-inside" style={partialDomStyle}>
          {props.listBlock.listItems.map((listItem, ikey) => (
            <Fragment key={ikey}>
              { getAssignedProductOfListItem(listItem.id) ? 
                <div
                id={`listblock_${props.listBlock.id}-itemshape_${listItem.id}`}
                className="listblock-itemshape-draw" >
                  <PlayItemShape
                    fusionView={props.fusionView}
                    itemShape={listItem.itemShape}
                    viewScale={props.viewScale}
                    fusionItem={getAssignedProductOfListItem(listItem.id)}
                    getFusionItemRunStatus={props.getFusionItemRunStatus}
                    videoPlay={props.videoPlay}
                  />
                </div>
              : <></>}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
export default PlayListBlock;
