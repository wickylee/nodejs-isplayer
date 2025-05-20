import express from 'express';
import {getICastPlayerConfig} from "../actions/iCastApi.mjs"
import { 
  playerConfig,
  playerContent,
  getLastPublishTime,
  checkDisplayUpdate,
  updateConfig,
  downloadWebfonts,
} from "../actions/playerActions.mjs";
import {dayStatus} from "../actions/itemrunstatus.mjs"
import {readRss, weatherData} from "../actions/mediasource.mjs"
import {cusLogger} from '../cusLogger.mjs';
// import path from "path";
// const __filename = path.basename(path.resolve(import.meta.url));

var router = express.Router();
/* GET users listing. */
router.get('/player/config', async function(req, res, next) {
  try {
    const config = await playerConfig();
    cusLogger.debug(`config: ${JSON.stringify(config)}` )
    res.send(config);
  } catch (error) {
    console.log("Error exceuting: ", error);
    res.send({message: error});
  }
});

router.get('/player/content', async function(req, res, next) {
  try {
    const content = await playerContent();
    res.send(content);
  } catch (error) {
    console.error(`Error exceuting: ${ JSON.stringify(error)}`);
    res.status(500).send({error: error});
  }
});

router.get('/player/publishtime_v2', async function(req, res, next) {
  try {
    const publishtime = await getLastPublishTime();
    res.send(publishtime);
  } catch (error) {
    console.log("Error exceuting: ", error);
    res.send({message: error});
  }
});

// router.get('/player/partialUpdateTime', async function(req, res, next) {
//   try {
//     const partial_updatetime = await partialUpdateTime();
//     // partialUpdateTime
//     res.send(partial_updatetime);
//   } catch (error) {
//     console.log("Error exceuting: ", error);
//     res.send({message: error});
//   }
// });

router.get('/player/checkdisplayupdate', async function(req, res, next) {car
  const displayUpdated = await checkDisplayUpdate()
  res.send(displayUpdated);
});

// router.get('/player/checkupgrade', async function(req, res, next) {
//   res.send('api -> player -> previewcontent');
// });

router.post('/player/searchIkey', async function(req, res, next) {
  try {
    const icastResponse = await getICastPlayerConfig(req.body);
    if ( icastResponse.hasOwnProperty('config')) {
      const icastPlayerconfig = icastResponse["config"];
      // console.log("icastPlayerconfig", icastPlayerconfig);
      res.send(icastPlayerconfig);
    } else {
      res.send({players: []});
    }
  } catch (error) {
    console.log("Error exceuting: ", error);
    res.send({message: error});
  }
  
});

// router.post('/player/setpublishtime', async function(req, res, next) {
//   res.send('Api -> player -> setpublishtime');
// });

// router.post('/player/setpartialupdate', async function(req, res, next) {
//   res.send('Api -> player -> setpublishtime');
// });

// router.post('/player/print', function(req, res, next) {
//   res.send('Api -> player -> print');
// });

/* PATCH users listing. */
router.patch('/player/:id', async function(req, res, next) {
  try {
    const config = await updateConfig(req)
    res.send(config);
  } catch (error) {
    console.log("Error exceuting: ", error);
    res.send({message: error});
  }
});

router.post('/mediasource/readrss', async function(req, res, next) {
  const readrss = await readRss(req)
  res.send(readrss);
});
router.post('/mediasource/weatherdata', async function(req, res, next) {
  const weatherdata = await weatherData(req)
  res.send(weatherdata);
});

router.post('/itemrunstatus/daystatus', async function(req, res, next) {
  const itemrunstatus = await dayStatus(req)
  res.send(itemrunstatus);
});

router.get('/downloadwebfonts', async function(req, res, next) {

  try {
    const config = await playerConfig();
//     cusLogger.debug(`config: ${JSON.stringify(config)}` )
    const actionResult = await downloadWebfonts(config);
    cusLogger.info(JSON.stringify(actionResult));
    res.send(actionResult);
  } catch (error) {
    console.log("Error exceuting: ", error);
    res.send({message: error});
  }
});

export default router;
