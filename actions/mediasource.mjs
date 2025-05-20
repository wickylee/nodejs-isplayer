import FeedParser from 'rss-parser';
import PlayerModel from "./playerModel.mjs";
import { getICastWeatherdata } from "./iCastApi.mjs";
import {cusLogger} from '../cusLogger.mjs';
// import path from 'path';
// const __filename = path.basename(path.resolve(import.meta.url));

export async function readRss(req) {
    let rssData = [];
    let parser = new FeedParser();
    // cusLogger.info("rssUrl", req.body.rssUrl);
    let feed = await parser.parseURL(req.body.rssUrl);
    if ( feed.items != undefined) {
        feed.items.forEach(post => {
            // cusLogger.info(item.title)
            rssData.push(post.title)
          });         
    }
    return rssData;
}

export async function weatherData(req) {
    let weatherData = {};
    let thisPlayer =  new PlayerModel();
    await thisPlayer.bindData();
    // cusLogger.info("weatherdata postData: ", req.body)
    const payload = {weatherApi : req.body.weatherApi}
    weatherData = await getICastWeatherdata(thisPlayer, payload);

    return weatherData;
}

