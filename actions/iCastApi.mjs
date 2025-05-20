import axios from 'axios';
// import path from 'path';
import {cusLogger} from '../cusLogger.mjs';
// const __filename = path.basename(path.resolve(import.meta.url));

export async function getICastPlayerConfig(playload) {
    cusLogger.info(`getICastPlayerConfig` )
    const apiUrl = `${playload.iserver}/api/display/${playload.display_id}/playerconfig/`;
    // cusLogger.info(`apiUrl: ${apiUrl}` )
    try {
      const apiResponse = await axios.get(apiUrl); 
      return {"status": apiResponse.status_code, "config": apiResponse.data};
    } catch (err) {
      cusLogger.error(`Get iCast player config failed, apiUrl: ${apiUrl} and errer: ${err}` )
    }
  }

export async function getICastDisplayPublishTime(playerModel) {
    // cusLogger.info(`getDisplayPublishTime` )
    const apiUrl = `${playerModel.iserver}/api/display/${playerModel.display_id}/publishtime_v2/`;
    // cusLogger.info(`apiUrl: ${apiUrl}` )
    try {
      const apiResponse = await axios.get(apiUrl); 
      return apiResponse.data
    } catch (err) {
      cusLogger.error(`Get iCast player config failed, apiUrl: ${apiUrl} call getDisplayPublishTime errer: ${err}` )
    }
  }
  
  export async function getDisplayPublishContent(playerModel) {
    cusLogger.info(`getDisplayPublishContent` )
    const apiUrl = `${playerModel.iserver}/api/display/${playerModel.display_id}/publishcontent/`;
    // cusLogger.info(`apiUrl: ${apiUrl}` )
    try {
      const apiResponse = await axios.get(apiUrl); 
      return apiResponse.data
    } catch (err) {
      cusLogger.error(`Get iCast player config failed, apiUrl: ${apiUrl} call getDisplayPublishTime errer: ${err}` )
    }
  }

  export async function getICastItemrunstatusDaystatus(playerModel, payload) {
    const apiUrl = `${playerModel.iserver}/api/itemrunstatus/daystatus/`;
    // cusLogger.info(`apiUrl: ${apiUrl}` )
    try {
      const apiResponse = await axios.post(apiUrl, payload); 
      // cusLogger.info(`apiResponse: ${JSON.stringify(apiResponse.data)}`, )
      return apiResponse.data
    } catch (err) {
      cusLogger.error(`Get iCast player config failed, apiUrl: ${apiUrl} call getICastitemrunstatusDaystatus errer: ${err}` )
    }
  }

  export async function getICastWeatherdata(playerModel, payload) {
    const apiUrl = `${playerModel.iserver}/api/mediasource/weatherdata/`;
    try {
      const apiResponse = await axios.post(apiUrl, payload); 
      // cusLogger.info("apiResponse:", apiResponse.data)
      return apiResponse.data
    } catch (err) {
      cusLogger.error(`Get iCast player config failed, apiUrl: ${apiUrl} call getICastitemrunstatusDaystatus errer: ${err}` )
    }
  }

  