import React from "react";
import {appHelper} from "../../lib/apphelper";;
import ClocksAppearance from "./clocks/clocks_appearance";

function PlayClock(props) {
  const mediasource = props.element.mediasource;
  let randerStyle = {
    padding: "0px",
    width: `${props.element.width}px`,
    height: `${props.element.height}px`,
  };
  const clockRanderSize = [props.element.width, props.element.height];
  const clockStyleSetting = JSON.parse(mediasource.file_path);
  return (
    <div className="play-clock" style={randerStyle}>
      <div
        style={{
          position: "relative",
          width: `${clockRanderSize[0]}px`,
          height: `${clockRanderSize[0]}px`,
        }}
      >
        <div
          style={appHelper.getScaleWarpTransformStyle(
            [mediasource.width, mediasource.height],
            clockRanderSize
          )}
        >
          <ClocksAppearance
            clockId={`clock_${props.element.id}`}
            clockTemplate={mediasource.content}
            clockRun={true}
            clockStyleSetting={clockStyleSetting}
          />
        </div>
      </div>
    </div>
  );
}
export default PlayClock;
