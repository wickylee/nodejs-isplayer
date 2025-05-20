import React, { Fragment } from "react";
import AnalogClock from "./analog_clock";
import DigitalClock from "./digital_clock";
import RollingDigitalClock from "./rollingdigital_clock";
import LcdStyleDigitalClock from "./lcdstyledigital_clock";

const ClocksAppearance = (props) => {
  let clockAppear = <></>;
  if (props.clockTemplate == "AnalogClock" )
    clockAppear = ( <AnalogClock clockId={props.clockId} clockRun={props.clockRun} clockStyleSetting={props.clockStyleSetting} />);

  if (props.clockTemplate == "DigitalClock" )
    clockAppear = ( <DigitalClock clockId={props.clockId} clockRun={props.clockRun} clockStyleSetting={props.clockStyleSetting} />);

  if (props.clockTemplate == "RollingDigitalClock")
    clockAppear = ( <RollingDigitalClock clockId={props.clockId} clockRun={props.clockRun} clockStyleSetting={props.clockStyleSetting} />);

  if (props.clockTemplate == "LcdStyleDigitalClock")
    clockAppear = ( <LcdStyleDigitalClock clockId={props.clockId} clockRun={props.clockRun} clockStyleSetting={props.clockStyleSetting} />);

  return <Fragment>{clockAppear}</Fragment>;
};
export default ClocksAppearance;
