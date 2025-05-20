import WebSocket from 'ws';
import nodeDiskInfo from "node-disk-info";
import screenshot from 'desktop-screenshot';
import { exec, spawn } from 'child_process';
import PlayerModel from "../actions/playerModel.mjs";
import {cusLogger} from '../cusLogger.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import getOnLineStatus from './getOnLineStatus.mjs';
const __dirname = dirname(fileURLToPath(import.meta.url));


async function displaySocket() {
  let thisPlayer =  new PlayerModel();
  await thisPlayer.bindData();
  let keepCheckConnect = null;
  let onLineStatus = false;
  cusLogger.info(`wserver: ${thisPlayer.wserver}`);

  let wSocket = new WebSocket(`${thisPlayer.wserver}/ws/display/${thisPlayer.display_id}/`); // Connect to a WebSocket server
  wSocket.connected = false;

  wSocket.on('open', () => {
    cusLogger.info(`WebSocket connection established with ${thisPlayer.wserver}!`)
    // wSocket send frist messaae;
    wSocket.on_openAct();

    clearInterval(keepCheckConnect)
    onLineStatus = true;
    keepCheckConnect = setInterval( async () => {
        // compare is onLineStatus having change
        let lineStatus = await getOnLineStatus();
        // console.log(`onLineStatus = ${onLineStatus} and lineStatus = ${lineStatus}`);
        if(onLineStatus != lineStatus ) {
          if (!onLineStatus && lineStatus ) { 
            // incase if onLineStatus from false resume to true then reload page
            cusLogger.info("player networt resumed!");
            clearInterval(keepCheckConnect)
            wSocket.on_closeAct()
          } else {
            // incase if onLineStatus from false resume to true then reload page
            cusLogger.warn("player become offline!");
          }
        }
        // keep upate onLineStatus value
        onLineStatus = lineStatus;
      }, 5*1000);
  });

  wSocket.on('message', (data) => {
    cusLogger.info(`Received data: ${data.toString()}`);
    wSocket.on_messageAct(data.toString());
  });

  wSocket.on('close', () => {
    // cusLogger.info('WebSocket connection closed.');
    cusLogger.info('WebSocket connection closed.')
    wSocket.on_closeAct();
  });

  wSocket.on('error', (error) => {
    // console.error('WebSocket error:', error);
    cusLogger.error(`WebSocket error:  ${JSON.stringify(error)}`)
  });

  // wSocket.protocol 
  wSocket.on_openAct = () => {
    const socketData = {
              "command": "player_open_connected",
              "socketData": {"playerIKey" : thisPlayer.name, "replyMsg": "playerConnected", "shutdownTime": getShutdownTime() }
          }
    // cusLogger.info("send Data", JSON.stringify(socketData));
    wSocket.send(JSON.stringify(socketData));
  }

  wSocket.on_closeAct = () => {
    // cusLogger.info('Websocket closed. Trying to reconnect.')
    cusLogger.warn('Websocket closed. Trying to reconnect after 10 sec.');
    setTimeout(() =>{
      cusLogger.info('Websocket reconnecting');
      wSocket = displaySocket();
    }, 10*1000);
  }

  wSocket.on_messageAct = (message) => {
    wSocket.connected = true;
    // cusLogger.info("message", message);
    // message -> {"command": "wsserver_respond", "transmitdata": {"replymsg": "OK"}}
    const receiveMsg = JSON.parse(message)
    // cusLogger.info("receiveMsg", receiveMsg);

    if ( receiveMsg['command'] == 'wsserver_respond' || receiveMsg['command'] == 'player_reply_display') {
      // const socketData = receiveMsg['socketData'];
      cusLogger.info(`on_message: ${receiveMsg['socketData']['replyMsg']}`)
    }
        
    if (receiveMsg['command'] == 'player_actdo') {
      const socketData = receiveMsg['socketData'];
      cusLogger.info(`socketData: ${JSON.stringify(socketData)}`);
      if (socketData['actDo'] == "askOnlive") {
        wSocket.onlive_reply();
      }
                
      if (socketData['playerIkey'] == thisPlayer.name) {
            if (socketData['actDo'] == "askScreenCapture") wSocket.screenCapture_reply();
            if (socketData['actDo'] == "askReboot") wSocket.reboot_reply()
            if (socketData['actDo'] == "askRestartBrowser") wSocket.restartBrowser_reply()
            if (socketData['actDo'] == "askSetShutdownTime") wSocket.setShutdownTime_reply(socketData['shutdownTime'])
            // reply action for player storage control
            if (socketData['actDo'] == "askPlayerStorageStatus") wSocket.playerStorageStatus_reply()
            if (socketData['actDo'] == "askPlayerDeleteFiles") wSocket.playerDeleteFiles_reply(socketData['deleteFiles'])
      }

    }

  }

  // wSocket response functions 
  wSocket.onlive_reply = () => {
    cusLogger.info(`onlive reply`);
    const socketData = {
      "command": "player_open_connected",
      "socketData": {"playerIKey" : thisPlayer.name, "replyMsg": "onlive", "publishtime": thisPlayer.publish_at,  "shutdownTime": getShutdownTime() }
    }
    cusLogger.info(`send publishtime ${JSON.stringify(socketData)}`);
    wSocket.send(JSON.stringify(socketData))
  }

  wSocket.screenCapture_reply = () => {
    cusLogger.info(`ScreenCapture reply`);

    const screenshotPath = path.join(thisPlayer.frontend_root, 'media', 'screenshot.png');

    screenshot(screenshotPath, {width: 480}, function(error, complete) {
      let screenData = "";
      if(error) {
        cusLogger.error(`Screenshot failed ${error}`);
        screenData = "TV-None"
      } else {
        cusLogger.info("Screenshot succeeded");
        screenData = fs.readFileSync(screenshotPath, {encoding: 'base64'});
      }
      const socketData = {
          "command": "player_reply_display",
          "socketData": {"playerIKey" : thisPlayer.name, "replyMsg": "replyScreen", "screenImage": screenData }
      }
      // cusLogger.info("socketData",socketData );
      wSocket.send(JSON.stringify(socketData));
    });
  }

  wSocket.reboot_reply = () => {
    cusLogger.info(`reboot reply`);
    const socketData = {
            "command": "player_reply_display",
            "socketData": {"playerIKey" : thisPlayer.name, "replyMsg": "playerReboot" }
        }
    wSocket.send(JSON.stringify(socketData))

    cusLogger.info(`This is pid ${process.pid}`);
    // setTimeout(function () {
    //     process.on("exit", function () {
    //       spawn(process.argv.shift(), process.argv, {
    //             cwd: process.cwd(),
    //             detached : true,
    //             stdio: "inherit"
    //         });
    //     });
    //     process.exit();
    // }, 5*1000);

  }
  
  wSocket.restartBrowser_reply = () => {
    cusLogger.info(`restartBrowser reply`);
    closeBrowser();

    const socketData = {
      "command": "player_reply_display",
      "socketData": {"playerIKey" : thisPlayer.name, "replyMsg": "playerRestartBrowser" }
    }
    wSocket.send(JSON.stringify(socketData))

    // setTimeout(openBrowser,2*1000);
    
  }

  wSocket.setShutdownTime_reply = (shutdownTime) => {
    cusLogger.info(`setShutdownTime reply`);
    setShutdownTime(shutdownTime);
    const socketData = {
            "command": "player_reply_display",
            "socketData": {"playerIKey" : thisPlayer.name, "replyMsg": "shutdownTimeUpdated", "shutdownTime": shutdownTime }
        }
    cusLogger.info(`Send publishtime ${JSON.stringify(socketData)}`);
    wSocket.send(JSON.stringify(socketData))
  }

  wSocket.playerStorageStatus_reply = async () => {
    cusLogger.info(`playerStorageStatus reply`);
    const mediaSourceList = await mediaSourceFileList();
    let playerStorage, UsedSpace, freeSpace;
    try {
        const disks = nodeDiskInfo.getDiskInfoSync();
        // cusLogger.info('All Disks:', disks);
        // disks.forEach(dk=>{
        //   cusLogger.info(`Disks: ${dk._filesystem}`);
        // })
        let disk = disks[0];
        if ( disks.find(d => d._filesystem == '/dev/disk1s1') ) {
          disk = disks.find(d => d._filesystem == '/dev/disk1s1');
        }
        // cusLogger.info('Filesystem:', disk.filesystem);
        // cusLogger.info('Blocks:', disk.blocks);
        cusLogger.info(`Used: ${disk.used}`); convertToMB
        UsedSpace = `${ parseInt(convertToMB(disk.used))} GB`;

        cusLogger.info(`Available: ${disk.available}`);
        freeSpace = `${ parseInt(convertToMB(disk.available))} GB`;

        cusLogger.info(`Capacity: ${disk.capacity}`);
        playerStorage = `${ parseInt(convertToMB((disk.used + disk.available))) } GB`;

    } catch (e) {
      cusLogger.error(e);
      freeSpace = `--- GB`;
      playerStorage = `--- GB`;
    }

    const socketData = {
            "command": "player_reply_display",
            "socketData": { "playerIKey" : thisPlayer.name, 
                            "replyMsg": "playerStorageStatus",
                            "playerStorage": playerStorage,
                            "freeSpace": freeSpace,
                            "mediaSourceList": mediaSourceList
                             }
        }
    // cusLogger.info("send publishtime", JSON.stringify(socketData));
    wSocket.send(JSON.stringify(socketData))
  }

  wSocket.playerDeleteFiles_reply = (deleteFiles) => {
    cusLogger.info(`playerStorageStatus reply`);
    try {
      deleteFiles.forEach( (file) =>{
          const fileFullPath = getDeleteFileFullPath(thisPlayer.frontend_root, thisPlayer.media_path, file['name']);
          cusLogger.log(`to be delete: ${fileFullPath}`);
          if (fileFullPath != "") fs.unlinkSync(fileFullPath);
        });
    } catch (error) {
        cusLogger.error(`Error: ${error.message}`);
    }  
    wSocket.playerStorageStatus_reply();
  }

  return wSocket;
}

export default displaySocket;

function getShutdownTime() {
  const shutdowntime = fs.readFileSync(`${__dirname}/../shutdowntime.conf`, 'utf8')
  return shutdowntime;
}

function setShutdownTime(shutdownTime){
  fs.writeFileSync(`${__dirname}/../shutdowntime.conf`, shutdownTime, 'utf8', err => {
    if (err) {
      cusLogger.error(err);
    } else {
      // file written successfully
      cusLogger.error(`shutdowntime udated to ${shutdownTime}`);
    }
  });

}

function closeBrowser() {
  let execmd = "";
  try {
    if ( process.platform  == "win32") {// Windows
        if (process.env.playingBrowser == "chrome") {
          execmd = "taskkill /im chrome.exe /f";
        }
        if (process.env.playingBrowser == "firefox") {
          execmd = "taskkill /im firefox.exe /f";
        }
    } else if ( process.platform == "linux" || process.platform == "darwin" ) {
        if (process.env.playingBrowser == "chrome") {
          execmd = 'wmctrl -c "Google Chrome"';
        }
        if (process.env.playingBrowser == "firefox") {
          execmd = 'wmctrl -c "firefox"';
        }
    } 

    cusLogger.info( `closeBrowser execmd -> ${execmd}`);

    if (execmd != "") {
      exec(execmd, (error, stdout, stderr) => {
        if (error) {
          cusLogger.error(`Error: ${error.message}`);
        } else {
          cusLogger.info(`stdout: ${stdout}, `);
        }
      });
    }

  } catch (err) {
    cusLogger.error(`restartBrowser errer: ${err}` );
  }
}

function openBrowser() {
  let execmd = "";  
  if (process.platform == "win32") {
      if (process.env.playingBrowser == "chrome") {
        execmd = `"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" ${process.env.isPlayerHost} --kiosk`;
      }
      if (process.env.playingBrowser == "firefox"){
        execmd = `"C:\\Program Files\\Mozilla Firefox\\firefox.exe" ${process.env.isPlayerHost} --kiosk`;
      }
  } else if ( process.platform == "linux" || process.platform == "darwin" ) {
      // # Linux
      if (process.env.playingBrowser == "chrome") {
        execmd = `/usr/bin/google-chrome ${process.env.isPlayerHost} --kiosk --password-store=basic --disable-software-rasterizer`;
      }
      if (process.env.playingBrowser == "firefox") {
        execmd = `/usr/bin/firefox -private-window ${process.env.isPlayerHost} --kiosk`;
      }
  }
  
  cusLogger.info( `openBrowser execmd -> ${execmd}`);
  try {
      if (execmd != "") {
        exec(execmd, (error, stdout, stderr) => {
          if (error) {
              console.error(`Error: ${error.message}`);
          } else {
              cusLogger.info(`stdout: ${stdout}`);
              console.error(`stderr: ${stderr}`);
          }
        });
      }
  } catch (err) {
    cusLogger.error(`restartBrowser errer:`, err);
  }
}

function getDirListRows(dirFullPath) {
  let fileListRows = [];
  if (fs.existsSync(dirFullPath)) {
      let files = fs.readdirSync(dirFullPath, 'utf8');
      for (let file of files) {
        const name = path.basename(file);
        const ext = path.extname(file);
        const size = fs.statSync(path.join(dirFullPath, file)).size;
        const mtime = parseInt(fs.statSync(path.join(dirFullPath, file)).mtimeMs / 1000);
        
        fileListRows.push({ "ext": ext, "name": name, "size": size, "date": mtime})
      }        
  }
  return fileListRows;
}

async function mediaSourceFileList() {
  let playerModel =  new PlayerModel();
  await playerModel.bindData();
  // get default brand source directory file list
  let fileListRows = [];
  const mediaPathSplit = playerModel.media_path.split('/')
  //cusLogger.error(`mediaPathSplit: ${mediaPathSplit}`);
  // #get all brand soruce folder of organiztion
  const orgMediaPath = path.join(playerModel.frontend_root, mediaPathSplit[1], mediaPathSplit[2]) // .../isplayer/frontend/media/org_2/
  //cusLogger.error(`orgMediaPath: ${orgMediaPath}`);
  if (fs.existsSync(orgMediaPath)){
      const sub_folders = fs.readdirSync(orgMediaPath, 'utf8');
      sub_folders.forEach(folderName=>{
        if ( folderName.substring(0, 6) == "brand_") {
          let lookupBrandFolderPath = orgMediaPath +'/' + folderName + '/source/';
          fileListRows = [...fileListRows, ...getDirListRows(lookupBrandFolderPath)];
        }
      })     
  }
  
  // #get webfont directory files
  const webfontDir = orgMediaPath + '/webfont/';   
  fileListRows = [...fileListRows, ...getDirListRows(webfontDir)];
  
  // # looking for involved iFusion Master images
  const iFusionMasterMediaSaveDir = playerModel.frontendRoot+'/media/org_1/brand_6/source/';
  fileListRows = [...fileListRows, ...getDirListRows(iFusionMasterMediaSaveDir)];
  return fileListRows
}

function getDeleteFileFullPath(frontend_root, media_path, delFile) {
    const mediaPath = media_path.split('/');
    const orgFolder = path.join(frontend_root, mediaPath[1], mediaPath[2]);
    // cusLogger.info("orgFolder", orgFolder);
    const lookupFolders = fs.readdirSync(orgFolder, 'utf8');
    let delFileFullPath = "";

    // find in source folder of brands 
    lookupFolders.forEach( (brandFolder) => {
      if ( brandFolder.substring(0, 6) == "brand_") {
        const lookupBrandSourceDir = path.join(orgFolder, brandFolder, "source" );
        // cusLogger.info("sub_folders", lookupBrandSourceDir);
        const fileListOfSource = fs.readdirSync(lookupBrandSourceDir, 'utf8');
        if ( fileListOfSource.find( f => f == delFile) ) {
          delFileFullPath = path.join(lookupBrandSourceDir, delFile);
        }
      }
    });

    // find in webfont folder
    if ( delFileFullPath == "") {
      const webfontDir = path.join(orgFolder, "webfont");
      const fileListOfWebfont = fs.readdirSync(webfontDir, 'utf8');
      if ( fileListOfWebfont.find( f => f == delFile) ) {
        delFileFullPath = path.join(webfontDir, delFile);
      }
    }

    return delFileFullPath;

}

function convertToMB(bytes) {
  return bytes / (1024 * 1024);
}