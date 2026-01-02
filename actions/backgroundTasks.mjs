
import moment from "moment";
import PlayerModel from "./playerModel.mjs";
import { getICastDisplayPublishTime, getDisplayPublishContent } from "./iCastApi.mjs"
import {produceMediaFileDownloadList} from "./aideControler.mjs"
import filedownloader from "./fileDownloader.mjs";
import path from "path";
import fs from "fs";
import {cusLogger} from '../cusLogger.mjs';
import getOnLineStatus from '../bin/getOnLineStatus.mjs';
// const __filename = path.basename(path.resolve(import.meta.url));
/**
 * set a BackgroundTasks to checkig for playercontent update and playerprogam update
 */

// get the checking update time of the player data modle
async function getInteralTime() {
    let thisPlayer =  new PlayerModel();
    await thisPlayer.bindData();
    // cusLogger.info(`check_update_time ${thisPlayer.check_update_time}`);
    return thisPlayer.check_update_time;
}

// for call at server starting to setIneterval process
export async function setIntervalPerformBackgroundTasks() {
    const intervalTime = await getInteralTime();
    // cusLogger.info(`intervalTime ${intervalTime}`);
    return setInterval( async () => { await performBackgroundTasks(); }, intervalTime*1000); 
  }

// the main performBackgroundTasks function, it define the tasks logic
export async function performBackgroundTasks() {
    // cusLogger.info("backgroundTask start");
    let [isDisplayContentUpdated, thisPlayer] = await checkdisplayupdate();
    if (isDisplayContentUpdated && thisPlayer) {
        cusLogger.info(`DisplayContentUpdatd ${moment().format()}`)  
        if (await performNewContentMediaSourceDownload(thisPlayer)) {
            thisPlayer.save()
            cusLogger.info("Checked publish_at time updated!")
        } 
    } else {
        cusLogger.info("Checke display have no update.");
    }
    // onsole.log("checking for player program coding source upgrad");
};

// call the iCastAPI for return the last content publish time of related display and compare with 
async function checkdisplayupdate() {
    let isDisplayContentUpdated = false;
    let thisPlayer =  new PlayerModel();
    await thisPlayer.bindData();
    // cusLogger.info("checkdisplayupdate");
    try {
        let lineStatus = await getOnLineStatus();
        if ( lineStatus ) {
            const icastResponse = await getICastDisplayPublishTime(thisPlayer);
            // icastResponse: {
            //     publish_at: '2024-01-02T07:35:58.684812Z',
            //     partial_update: '2024-01-02T07:35:58.694761Z'    
            // }
            if (icastResponse.hasOwnProperty('publish_at')) {
                let gotoGetDisplayContent = false;
                // check pulish time
                let lastPublishTime = moment(icastResponse.publish_at.split(".")[0]);
                if (lastPublishTime > moment(thisPlayer.publish_at)) {
                    cusLogger.info(`gotoGetDisplayContent cause by publish_at: ${lastPublishTime},  ${moment(thisPlayer.publish_at)}`, )
                    gotoGetDisplayContent = true;
                }
                // check partial_update time
                let lastPartialUpdate = ""
                if (icastResponse.hasOwnProperty('partial_update')) {
                    lastPartialUpdate = moment(icastResponse.partial_update.split(".")[0]);
                    // fix partial_update is null
                    if ( thisPlayer.partial_update == "" || lastPartialUpdate > moment(thisPlayer.partial_update) ) {
                        cusLogger.info(`gotoGetDisplayContent cause by lastPartialUpdate: ${lastPartialUpdate}, ${moment(thisPlayer.partial_update)}`)
                        gotoGetDisplayContent = true   
                    }
                }
        
                if (gotoGetDisplayContent) {
                    // #get display content data
                    const publishContent = await getDisplayPublishContent(thisPlayer)
                    if (publishContent.playcontent) {
                        // cusLogger.info("publishContent", publishContent.playcontent )
                        thisPlayer.playcontent = publishContent.playcontent
                        // update playcontent to local player modle
                        await thisPlayer.save();
                        // * at this time not update publish_at and partial_update field to local player model
                        // let awaiting next function to completed the new media sources download, then save the last update time.
                        thisPlayer.publish_at = lastPublishTime.format("YYYY-MM-DD HH:mm:ss");
                        thisPlayer.partial_update = lastPartialUpdate.format("YYYY-MM-DD HH:mm:ss");   
                        isDisplayContentUpdated = true;                
                    }
                }
            }
        } else {
            cusLogger.info("Checking shows content update failed because the player is offline!");
        }

    } catch (error) {
        cusLogger.error(`Error exceuting: ${error}`);
    }
    return [isDisplayContentUpdated, thisPlayer];
}

async function performNewContentMediaSourceDownload(thisPlayer) {
    let isCompleteMediaSourceDownload = false;
    
    try {
        let downloadMediaFiles = await produceMediaFileDownloadList(thisPlayer);
        // start downloading
        let downloadCount = 0;
        downloadMediaFiles.forEach( async (mediaFile) => {
            // cusLogger.info(`download mediaFile.mediaUrl: ${mediaFile.mediaUrl}`);
            // cusLogger.info(`download mediaFile.savePath: ${mediaFile.savePath}`);
            try {
                 ensureMediaSaveDirExisted(thisPlayer, mediaFile.savePath);
                 let downloadLoad = filedownloader( mediaFile.mediaUrl, mediaFile.savePath )
                //  cusLogger.info("downloadLoad:", downloadLoad);
                 if (downloadLoad) downloadCount++;                   
            } catch (error) {
                cusLogger.error(`performNewContentMediaSourceDownload error: ${error}`);
            }
        });
        cusLogger.info(`${downloadCount} files starting download`);
        isCompleteMediaSourceDownload = true;
    } catch (error) {
        cusLogger.error("Error exceuting at performNewContentMediaSourceDownload(): ", error);
    }
    
    return isCompleteMediaSourceDownload;
}

function ensureMediaSaveDirExisted(thisPlayer, mediaFileSavePath) {
    const dirPathParts = mediaFileSavePath.split("/");
    const meidaIndex = dirPathParts.findIndex(item=> item == "media");
    const orgDirPath = path.join(thisPlayer.frontend_root, dirPathParts[meidaIndex], dirPathParts[meidaIndex+1]);
    const orgWwebfontPath = path.join(thisPlayer.frontend_root, dirPathParts[meidaIndex], dirPathParts[meidaIndex+1], "webfont");
    const brandDirPath = path.join(orgDirPath, dirPathParts[meidaIndex+2]);
    const sourceDirPath = path.join(brandDirPath, dirPathParts[meidaIndex+3]);

    if (!fs.existsSync(orgDirPath)) {
        cusLogger.info(`mkdirSync: ${orgDirPath}`);
        fs.mkdirSync(orgDirPath);
    }
    if (!fs.existsSync(orgWwebfontPath)) {
        cusLogger.info(`orgWwebfontPath: ${orgWwebfontPath}`);
        fs.mkdirSync(orgWwebfontPath);
    }
    if (!fs.existsSync(brandDirPath)) {  
        cusLogger.info(`brandDirPath: ${brandDirPath}`);
        fs.mkdirSync(brandDirPath);     
    }
    if (!fs.existsSync(sourceDirPath) && !dirPathParts.includes("webfont")) {
        cusLogger.info(`sourceDirPath: ${sourceDirPath}`);
        fs.mkdirSync(sourceDirPath);     
    }  
}
