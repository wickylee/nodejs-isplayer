import React from "react";
// import {appHelper} from "../../lib/apphelper";;
import PlayImage from "./play_image";
import PlayPdf from "./play_pdf";
import PlayWebsource from "./play_websource";
import PlayVideo from "./play_video";
import PlayScrollMsgs from "./play_scrollmsgs";
import PlayScrollRss from "./play_scrollrss";
import PlayAnimateText from "./play_animatetext";
import PlayFrameLayout from "./play_framelayout";
import PlayClock from "./play_clock";
import PlayWeather from "./play_weather";
import PlayFusionView from "./ifusion/play_fusionview";

const PlayElement = (props) => {
  let elementContent = <></>;

  let renderStyle = { padding: "0px" };
    renderStyle.width = `${props.element.width}px`;
    renderStyle.height =  `${props.element.height}px`;
    renderStyle.top = `${props.element.top}px`;
    renderStyle.left =  `${props.element.left}px`;
    renderStyle.zIndex = `${props.element.zindex}`;

  const eMediasource = props.element.mediasource;
  const eFusionview = props.element.fusionview;

  if (eMediasource) {
    if (eMediasource.media_type.value != "animatetext" &&  eMediasource.media_type.value != "scrollmsgs" &&  eMediasource.media_type.value != "weather") {
      const presentStyle = eMediasource.style ? JSON.parse(eMediasource.style.css) : {} ;
      renderStyle = {...renderStyle, ...presentStyle};
    }

    switch (eMediasource.media_type.value) {
      case "image":
        elementContent = <PlayImage element={props.element} appSetting={props.appSetting} onPlaying={props.onPlaying} />;
        break;
      case "proImage":
          elementContent = <PlayImage element={props.element} appSetting={props.appSetting} onPlaying={props.onPlaying} />;
          break;
      case "proStatusImage":
            elementContent = <PlayImage element={props.element} appSetting={props.appSetting} onPlaying={props.onPlaying} />;
            break;
      case "video":
        elementContent = <PlayVideo element={props.element} appSetting={props.appSetting} onPlaying={props.onPlaying} />;
        break;
      case "proVideo":
          elementContent = <PlayVideo element={props.element} appSetting={props.appSetting} onPlaying={props.onPlaying} />;
          break;
      case "websource":
        elementContent = <PlayWebsource element={props.element} appSetting={props.appSetting} onPlaying={props.onPlaying} />;
        break;
      case "pdf":
        elementContent = <PlayPdf element={props.element} appSetting={props.appSetting} onPlaying={props.onPlaying} />;
        break;
      case "scrollmsgs":
        if (eMediasource.content == "rssFeedUrl") {
          elementContent = <PlayScrollRss scrollingMsgId={props.element.id} scrollRun={true} onPlaying={props.onPlaying} 
                          scrollMsgsStyle={JSON.parse(eMediasource.style.css)}
                          rssFeed = {eMediasource.file_path }
                          content = {eMediasource.content}
                          element={props.element} />
        } else {
          elementContent = <PlayScrollMsgs scrollingMsgId={props.element.id} scrollRun={true} onPlaying={props.onPlaying} 
                        scrollMsgsStyle={JSON.parse(eMediasource.style.css)}
                        content = {eMediasource.content}
                        msgImage = {eMediasource.file_path}
                        element={props.element} />
        }
        
        break;
      case "animatetext":
          elementContent = <PlayAnimateText element={props.element} renderSize={{width: renderStyle.width , height: renderStyle.height}} appSetting={props.appSetting} onPlaying={props.onPlaying} />;
          break;
      case "clock":
        elementContent = <PlayClock element={props.element} renderSize={{width: renderStyle.width , height: renderStyle.height}} appSetting={props.appSetting} onPlaying={props.onPlaying} />
          break;
      case "weather":
        elementContent = <PlayWeather element={props.element} weatherId={props.element.id} getRealData={true} onPlaying={props.onPlaying} 
        weatherSetting = {JSON.parse(eMediasource.content)}
        weatherPieceStyle={JSON.parse(eMediasource.style.css)}
        weatherApi = {eMediasource.file_path}
        />
          break;
      case "framelayout":
        elementContent = <PlayFrameLayout element={props.element} appSetting={props.appSetting} onPlaying={props.onPlaying} />;
        break;
      default:
        elementContent = <div>unknown content</div>;
    }
  } 
  
  if (eFusionview) {
    elementContent = (<div className="fusionView-element">
                      <PlayFusionView fusionView={eFusionview} viewScale={1} onPlaying={props.onPlaying} />
                      </div>);
  }

  return (
    <div className="play-element" style={renderStyle}>
      {elementContent}
    </div>
  );
}

export default PlayElement;
