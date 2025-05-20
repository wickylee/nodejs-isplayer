import React, { Component, Fragment } from "react";
// import $ from "jquery";
import {appHelper} from "../../lib/apphelper";
import ReactAnime from "react-animejs";

class PlayAnimateText extends Component {

  render() {
    const { Anime, stagger } = ReactAnime;
    const source = this.props.element.mediasource;
    const animateSetting = JSON.parse(source.file_path);
  
    let elementStyle = JSON.parse(source.style.css);
    elementStyle = {...elementStyle, ...this.props.renderSize};

    return (
      <div className="play-animatetext" >
          <Anime animeConfig={animateSetting.animeConfig}
                     initial={source.file_path != "" ? appHelper.applyAnimeTimeline(animateSetting.animeInitial, this.props.element.id) : []}
                >
            <div id={`animateText_${this.props.element.id}`} style={elementStyle}>
                     {source.content.split(" ").map((word, index)=>(
                          <Fragment key={index} >
                          <div className="anime-word">
                          { word.split('').map((char, index)=>(
                            <div className="anime-char" key={index}>{char}</div>
                          ))}
                          </div>
                          <div className="anime-word"><span>&nbsp;&nbsp;</span></div>
                          </Fragment>
                        )) }
                    </div>
        </Anime>
      </div>
    );
  }
}
export default PlayAnimateText;
