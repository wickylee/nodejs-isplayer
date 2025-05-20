import React, { Fragment } from "react";
import PlayLayoutBlock from "./play_layoutblock";

function PlayFrameLayout(props) {
  let blockIndex = 1;
  const renderLayoutBlock = childBlock => {
    let layoutBlock = <></>;
    if (childBlock.child.length) {
      const netBlockStyle = {
        display: "flex",
        flexDirection: childBlock.flex,
        width: `${childBlock.width}px`,
        height: `${childBlock.height}px`
      };
      layoutBlock = (
        <div style={netBlockStyle}>
          {childBlock.child.map((netBlock, index) => (
            <Fragment key={index}>{renderLayoutBlock(netBlock)}</Fragment>
          ))}
        </div>
      );
    } else {
      const layoutClipStyle = {
        width: `${childBlock.width}px`,
        height: `${childBlock.height}px`
      };
      layoutBlock = (
        <div style={layoutClipStyle}>
          <div
            id={`layoutClip_${childBlock.layoutClip}`}
            className="play-layout-clip"
          >
            <PlayLayoutBlock
              layoutClipId={childBlock.layoutClip}
              appSetting={props.appSetting}
              onPlaying={props.onPlaying} 
            />
          </div>
        </div>
      );
    }

    return layoutBlock;
  };

  const media = props.element.mediasource;
  let mStyle = { padding: "0px" };
  mStyle.width = `${props.element.width}px`;
  mStyle.height = `${props.element.height}px`;
  
  return (
    <div style={mStyle} className="play-framelayout">
      {renderLayoutBlock(JSON.parse(media.content))}
    </div>
  );
}
export default PlayFrameLayout;
