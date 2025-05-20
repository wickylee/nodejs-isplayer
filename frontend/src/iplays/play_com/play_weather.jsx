import React, { Component } from "react";
import {appHelper} from "../../lib/apphelper";;
import {weatherIconsMap} from '../constdata';
import axios from "axios";
import moment from "moment";
import ReactAnime from 'react-animejs';


axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class PlayWeather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherIconsMap: [],
      currentWeather: null,
      weatherForecast: null,
    };
    this.getWeatherInterval = null;
  }

  componentDidMount() {
    // this.setState({top: this.props.scrollMsgsStyle.padding});
    if ( this.props.getRealData ) {
        this.loadWeatherData();
        this.getWeatherInterval = setInterval( () =>this.loadWeatherData(), (1000 * 60 * 30));
    }
    

  }

  loadWeatherData = () => {
    axios
      .post(`/api/mediasource/weatherdata/`, 
          {
            weatherApi: this.props.weatherApi
          },
          {
            headers: {
              Authorization: ``,
            }
          }
      )
      .then(res => {
          // console.log(res.data);
          const weatherIconsMapData = weatherIconsMap.find(iconSet=>iconSet.name == this.props.weatherSetting.iconSet);
          this.setState({ currentWeather : res.data.currentWeather, 
                          weatherForecast: res.data.weatherForecast,
                          weatherIconsMap: weatherIconsMapData.iconsMap
                        })
        })
        .catch(err => {
          console.log(appHelper.handleApiFailed(err));
        });
  }

   //geter for current weather
  getCurrentIcon = (iconId) =>{
    let weatherIcon = "sky01.png";
    // console.log("iconId", iconId);
    if (iconId) {
      let targetIcon =  this.state.weatherIconsMap.find(iconItem => iconItem.mapKey == iconId );
      if (targetIcon) weatherIcon =  targetIcon.file;
    } else {
      weatherIcon = `sky0${1+Math.floor(Math.random() * 9)}.png`;
    }
    return weatherIcon;
  }

  getCurrentTemperature = () =>{
    let currentTemperature = 10;
    //console.log("getRealData", this.props.getRealData, "&&", this.state.currentWeather);
    if (this.props.getRealData && this.state.currentWeather) {
      currentTemperature =  this.state.currentWeather.temperature;
    } else {
      currentTemperature = currentTemperature + Math.floor(Math.random() * 20) ;
    }
    //console.log("currentTemperature", currentTemperature);
    return currentTemperature;
  }
 
  getCurrentUVIndex = () =>{
    let uvIndexDom = <></>
    let uvIndex = 0;
    if (this.props.getRealData  && this.state.currentWeather) {
      // uvIndex =  this.state.currentWeather.uvIdnex;
      if (this.state.currentWeather.uvIdnex) 
        uvIndexDom = (<div className="uv-Index"> UV : {this.state.currentWeather.uvIdnex}</div>)
    } else {
      uvIndex = uvIndex + Math.floor(Math.random() * 3) ;
      uvIndexDom = (<div className="uv-Index"> UV : {uvIndex}</div>)
    }

    return uvIndexDom;
  }

  getCurrentHumidity = () =>{
    let humidity = 10;
    if (this.props.getRealData  && this.state.currentWeather) {
      humidity =  this.state.currentWeather.humidity;
    } else {
      humidity = humidity + Math.floor(Math.random() * 70) ;
    }
    return humidity;
  }

  //geter for forecast
  getForecastIcon = (forecastdayIndex) =>{
    let weatherIcon = "sky01.png";
    if (this.props.getRealData && this.state.weatherForecast) {
      const forecastItem = this.state.weatherForecast[forecastdayIndex];
      let targetIcon =  this.state.weatherIconsMap.find(iconItem => iconItem.mapKey == forecastItem.forecastIcon );
      if (targetIcon) weatherIcon = targetIcon.file;
    } else {
      weatherIcon = `sky0${1+Math.floor(Math.random() * 9)}.png`;
    }
    return weatherIcon;
  }

  getForecastMaxTemperature = (forecastdayIndex) =>{
    let maxTemperature = 10;
    if (this.props.getRealData && this.state.weatherForecast) {
      const forecastItem = this.state.weatherForecast[forecastdayIndex];
      maxTemperature =  forecastItem.maxTemperature;
    } else {
      maxTemperature = maxTemperature + Math.floor(Math.random() * 20) ;
    }
    return maxTemperature;
  }

  getForecastMinTemperature = (forecastdayIndex) =>{
    let minTemperature = 10;
    if (this.props.getRealData && this.state.weatherForecast) {
      const forecastItem = this.state.weatherForecast[forecastdayIndex];
      minTemperature =  forecastItem.minTemperature;
    } else {
      minTemperature = minTemperature + Math.floor(Math.random() * 20) ;
    }
    return minTemperature;
  }

  componentWillUnmount() {
    clearInterval(this.getWeatherInterval);
  }


  render() {
    
    const appearSetting = this.props.weatherSetting.appearSetting;

    let currentStyle = { ...this.props.weatherPieceStyle,
                          width: `${appearSetting.current.width}px`,
                          height: `${appearSetting.current.height}px`,
                          backgroundColor: appearSetting.current.backgroundColor,
                        }
    let currentTemperatureTextStyle = {fontSize: `${appearSetting.current.temperatureFontSize}px`, 
                                        color: appearSetting.current.temperatureFontColor}
    let forecastStyle = { ...this.props.weatherPieceStyle,
                          width: `${appearSetting.forecast.width}px`,
                          height: `${appearSetting.forecast.height}px`,
                          backgroundColor: appearSetting.forecast.backgroundColor,
                        }
    let forecastTemperatureTextStyle = {fontSize: `${appearSetting.forecast.temperatureFontSize}px`, 
                        color: appearSetting.forecast.temperatureFontColor}

    // weatherSetting
    const forecastDays = this.props.weatherSetting.forecastDays;
    const forecastDaysName = [];
    for (let i = 1; i <= forecastDays; i++) {
      let todayMoment = moment();
      forecastDaysName.push(todayMoment.add(i, 'day').format("ddd"));
    }

    //set animetion for weather icon
    const {Anime, stagger} = ReactAnime;
    let animeInitial = [];
    if ( this.state.currentWeather && this.state.currentWeather.weatherIcon.length > 1) {
      this.state.currentWeather.weatherIcon.map((icon, index)=>{
        let addAnimeShowStep = {  targets: `#animateWeatherIcons .animaIcon_${index}`,
                                  scale: [0.5, 1],
                                  opacity: [0.0, 1.0],
                                  easing: "easeOutExpo",
                                  duration: 300,
                                  endDelay: 5000};
        animeInitial.push(addAnimeShowStep);
        let addAnimeHiddenStep = {  targets: `#animateWeatherIcons .animaIcon_${index}`,
                                    scale: [1, 0.5],
                                    opacity: [1.0, 0.0],
                                    easing: "easeOutExpo",
                                    duration: 100}
        animeInitial.push(addAnimeHiddenStep);
      });
    }

    return (
        <div id={`weather_${this.props.weatherId}`} className="play-weather" >
          {this.props.weatherSetting.current ? 
            <div style={currentStyle} className="weather-current-piece">
              <div className="weather-icon" style={{width:`${appearSetting.current.size}px`, height:`${appearSetting.current.size}px` }}>
                { this.state.currentWeather ? (
                  <Anime animeConfig={{autoplay: true, loop: true} } initial={animeInitial}>
                  <div id="animateWeatherIcons" className="animateWeatherIcons">
                  {this.state.currentWeather.weatherIcon.map((icon, index)=>(
                    <div key={index} className={`animaIcon animaIcon_${index}`}>
                      <img src={`/static/weather/${this.props.weatherSetting.iconSet}/${this.getCurrentIcon(icon)}`} style={{width:`${appearSetting.current.size}px` }}/>
                    </div>
                  )) }
                    </div>
                </Anime>
                ) :
                <img src={`/static/weather/${this.props.weatherSetting.iconSet}/${this.getCurrentIcon(null)}`} style={{width:`${appearSetting.current.size}px` }}/>
                }
              </div>
              <div className="weather-info">
                  <div className="temperature" style={currentTemperatureTextStyle}>
                    <div>{this.getCurrentTemperature()}</div><div style={{fontSize: "0.5em", paddingTop: "7%"}} >℃</div>
                  </div>
                  <div className="info-data">
                    {this.getCurrentUVIndex()}
                    <div className="humidity"> H : {this.getCurrentHumidity()}%</div>
                  </div>
              </div>
            </div>
          :""}


          { this.props.weatherSetting.forecast && forecastDaysName.map((dayName, index)=>(
            <div style={forecastStyle} className="weather-forecast-piece" key={index}> 
              <div className="forecast-day" >{dayName}</div>
              <div className="forecast-conten" >
                <div className="weather-icon">
                  <img src={`/static/weather/${this.props.weatherSetting.iconSet}/${this.getForecastIcon(index)}`} style={{width:`${appearSetting.forecast.size}px` }}/>
                </div>
                
                <div className="weather-info" >
          <div style={forecastTemperatureTextStyle} >{this.getForecastMaxTemperature(index)}°</div>
                  <div>|</div>
                  <div style={forecastTemperatureTextStyle} >{this.getForecastMinTemperature(index)}°</div>
                </div>
              </div>
            </div> 
          ))}


        </div>
    );
  }
}

export default PlayWeather;
