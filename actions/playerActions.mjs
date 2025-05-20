import moment from "moment"
import PlayerModel from "./playerModel.mjs";
import { getICastPlayerConfig,
    getICastDisplayPublishTime,
    getDisplayPublishContent
 } from "./iCastApi.mjs";
import filedownloader from "./fileDownloader.mjs";
import path from 'path';
import fs from 'fs';
import {cusLogger} from '../cusLogger.mjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = path.basename(path.resolve(import.meta.url));

async function playerConfig() {
    let thisPlayer =  new PlayerModel();
    await thisPlayer.bindData();
    
    if (thisPlayer.media_path == "") {
        const icastResponse = await getICastPlayerConfig(thisPlayer);
        if ( icastResponse.hasOwnProperty('config')) {
            const config = icastResponse["config"];
            thisPlayer.media_path = config["mediaPath"];
            thisPlayer.publish_at = moment("2023-01-01").format("YYYY-MM-DD HH:mm:ss");
            cusLogger.info(`playerConfig: ${JSON.stringify(thisPlayer.playerConfig())}`)
            thisPlayer.save();
        }
    }

    return thisPlayer.playerConfig();
}

async function playerContent() {
    let thisPlayer = new PlayerModel()
    await thisPlayer.bindData();
    return thisPlayer;
}

async function getLastPublishTime() {
    let thisPlayer =  new PlayerModel()
    await thisPlayer.bindData()

    return {"publish_at": thisPlayer.publish_at, "partial_update": thisPlayer.partial_update}
}

// async function partialUpdateTime() {
//     let thisPlayer =  new PlayerModel()
//     cusLogger.info("partialUpdateTime");
//     await thisPlayer.bindData()

//     return thisPlayer.partial_update
// }

async function checkDisplayUpdate() {
    let thisPlayer =  new PlayerModel()
    // cusLogger.info("checkdisplayupdate");
    await thisPlayer.bindData();
    const icastResponse = await getICastDisplayPublishTime(thisPlayer);
    // cusLogger.info("icastResponse", icastResponse);
    // if the getDisplayPublishTime is sucess
    if (icastResponse.hasOwnProperty('publish_at')) {
        let gotoGetDisplayContent = false;
        // check pulish time
        let lastPublishTime = moment(icastResponse.publish_at);
        if (lastPublishTime > moment(thisPlayer.publish_at)) {
            cusLogger.info(`gotoGetDisplayContent cause by publish_at: ${lastPublishTime}`)
            gotoGetDisplayContent = true;
        }
        // check partial_update time
        let lastPartialUpdate = ""
        if (icastResponse.hasOwnProperty('partial_update')) {
            lastPartialUpdate = moment(icastResponse.partial_update);
            // #fix partial_update is null
            if ( thisPlayer.partial_update == "" || lastPartialUpdate > moment(thisPlayer.partial_update) ) {
                cusLogger.info(`gotoGetDisplayContent cause by lastPartialUpdate: ${lastPartialUpdate}`)
                gotoGetDisplayContent = true   
            }
        }

        if (gotoGetDisplayContent) {
            // #get display content data
            const publishContent = await getDisplayPublishContent(thisPlayer)
            cusLogger.info(`publishContent: ${JSON.stringify(publishContent)}` )
            if (publishContent.hasOwnProperty('playcontent')) {
                thisPlayer.playcontent = publishContent.playcontent
                // thisPlayer.save()
                // * at this time not update publish_at to localplayer database
                // * the save action will do by isPlayerAide apps at media source download completed
                thisPlayer.publish_at = lastPublishTime
                thisPlayer.partial_update = lastPartialUpdate                           
            }
 
        }
    }

    return thisPlayer.playerConfig() 
}

async function updateConfig(req) {
    let thisPlayer =  new PlayerModel();
    // cusLogger.info("updateConfig");
    await thisPlayer.bindData();

    await thisPlayer.updateConfig(req.body);

    return thisPlayer.playerConfig(); 
}

async function  checkUpgrade() {
    cusLogger.info("checkUpgrade");
    let thisPlayer =  new PlayerModel();
    await thisPlayer.bindData();

    let resp = "checkupgrade";
    return resp 
}

async function downloadWebfonts(config) {
    cusLogger.info("downloadWebfonts");
    // read webfonts list 
    const webfontJsonFile = `${__dirname}/static_webfont.json`;
    // cusLogger.info(`webfontJsonFile: ${webfontJsonFile}`);
    let downloadCount = 0;
    jsonReader(webfontJsonFile, (err, webfontList) => {
        if (err) {
          cusLogger.error(`Read Data Error: ${err}`);
        //   throw new Error(`Read Data Error: ${err}`);
        } else{
            // start downloading
            webfontList.forEach( async (webfontFile) => {
                // cusLogger.info(`looking file: ${webfontFile.src}`);
                try {
                    let dirPathParts = webfontFile.src.split("/");
                    ensureStaticWebfontDirExisted(config.frontend_root, dirPathParts);
                    let fontFileUrl = `${config.iserver}${webfontFile.src}`;
                    let fontsavePath = path.join(config.frontend_root, webfontFile.src);
                    // start download font file
                    if (!fs.existsSync(fontsavePath)) {
                        cusLogger.info(`download Item: ${webfontFile.src}`);
                        let downloadLoad = filedownloader( fontFileUrl, fontsavePath )
                        if (downloadLoad) {
                            downloadCount++;
                        }
                    }
                } catch (error) {
                    cusLogger.error(`downloadWebfonts error: ${error}`);
                }
            });

            cusLogger.info(`${downloadCount} files starting download`);
        }

      });

    let resp = {"action": "downloadWebfonts",
                "result": `Start download essential webfont files in background, Please don't close this app!`};
    return resp;
}

function ensureStaticWebfontDirExisted(frontend_root, dirPathParts) {
    let parentFolder = frontend_root;
    dirPathParts.splice(0,dirPathParts.length-1).forEach(pathPart => {
            let chechExsitPath = path.join(parentFolder, pathPart)
            if (!fs.existsSync(chechExsitPath)) {
                // cusLogger.info(`mkdir: ${chechExsitPath}`);
                fs.mkdirSync(chechExsitPath);
            }
            parentFolder = chechExsitPath;
    } )
}

function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
  }

export { 
    playerConfig,
    playerContent,
    getLastPublishTime,
    checkDisplayUpdate,
    checkUpgrade,
    updateConfig,
    downloadWebfonts
    // print
}
