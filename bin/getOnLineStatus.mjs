import axios from 'axios';
import {cusLogger} from '../cusLogger.mjs';

async function getOnLineStatus() {
    const apiUrl = `https://cloud.icast.com.hk/`;
    try {
      const apiResponse = await axios.get(apiUrl); 
      // console.log(apiResponse)
      if ( apiResponse.status == 200){
        // cusLogger.info(`Player online!`)
        return true;
      } else {
        cusLogger.error(`iCast server respone error: ${apiResponse.status_code}` )
        return false;
      }
    } catch (err) {
      cusLogger.info(`Player can't to iCast server!`)
      return false;
    }
  }

export default getOnLineStatus;