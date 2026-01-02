import {cusLogger} from '../cusLogger.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function produceMediaFileDownloadList(playerModel) {
    let downloadList = []

    try {
        let displayContent = JSON.parse(playerModel.playcontent);
        let displayMediaFileList = getMediaFileOfDisplay(displayContent);
        downloadList = findDownloadList(playerModel, displayMediaFileList);
        //cusLogger.info(displayMediaFileList)
    } catch (error) {
        cusLogger.error("Error exceuting: at produceMediaFileDownloadList()", error);
    }
    // cusLogger.info("downloadList", downloadList);
    return downloadList;
}

function findDownloadList(playerConfig, displayMediaFileList) {
    let downloadList = []
    cusLogger.info(`playerConfig.mediaSaveDir: -> ${playerConfig.mediaSaveDir}` )
    displayMediaFileList.forEach(mediaFile=>{
        let mediaUrl = ""
        let mediaSavePath = ""
        if (mediaFile.sourcePath == "" ) {
            mediaUrl = playerConfig.iserver + path.join(playerConfig.media_path, mediaFile.fileName)
            mediaSavePath = path.join(playerConfig.mediaSaveDir, mediaFile.fileName)
        } else {  // for that mediasource is not number the same brand save directory
            mediaUrl = playerConfig.iserver + path.join(mediaFile.sourcePath, mediaFile.fileName)
            let mediaSaveDir = playerConfig.frontend_root + mediaFile.sourcePath
            mediaSavePath = path.join(mediaSaveDir, mediaFile.fileName)
        }
        //cusLogger.info("-->", mediaSavePath)
        if (!fs.existsSync(mediaSavePath) && mediaFile.fileName != "" ) {
            downloadList.push({"mediaUrl": mediaUrl,
                               "savePath": mediaSavePath})
        }
    });

    return downloadList
}

function getMediaFileOfDisplay(displayContent) {
    const mediaSourceType = ["image", "video", "pdf", "proImage", "proVideo"];
    let mediaFileList = [];
 
    const playlists = displayContent.playlists;
    playlists.forEach(playlist => {
         playlist.playclips.forEach(playclip => {
             playclip.clip.clipframes.forEach(clipframe =>  {
                 clipframe.frame.elements.forEach(element =>  {
                     //the target of element is a MediaSource model
                     if (element.mediasource != undefined) {
                         let mediaType = element.mediasource.media_type.value;
                         if (mediaSourceType.includes(mediaType)) {
                            mediaFileList.push(getMediasourcesStorePathfileName(element.mediasource.content));
                            // if mediaType of target element is video
                            /*
                            if (mediaType === "video") {
                                // handle video specific logic get the video file thumbnail image also
                                let videoThumbnail = getVideoThumbnail(element.mediasource.content);
                                mediaFileList.push(videoThumbnail);
                            }*/
                            //end
                         }
                     }
                     // the target of element is an FusionView model
                     if (element.fusionview != undefined) {
                        let fusionviewInvolvedSourceFile = getFusionviewInvolvedSourceFile(element.fusionview);
                        mediaFileList = [...mediaFileList, ...fusionviewInvolvedSourceFile ];
                     }
                 });
             });
         });
     });
 
     const layoutBlockClips = displayContent.layoutBlockClips;
     layoutBlockClips.forEach(layoutClip =>  {
        layoutClip.clipframes.forEach(clipframe =>  {
             clipframe.frame.elements.forEach(element =>  {
                 //the target of element is a MediaSource model
                 if ( element.mediasource != undefined ){
                     console.log("downloadLoad:", element.mediasource);
                     let mediaType = element.mediasource.media_type.value;
                     if (mediaSourceType.includes(mediaType)) {
                        mediaFileList.push(getMediasourcesStorePathfileName(element.mediasource.content));
                     }
                 }
                 // the target of element is an FusionView models
                 if (element.fusionview != undefined ) {
                    let layoutBlockFusionviewInvolvedSourceFile = getFusionviewInvolvedSourceFile(element.fusionview);
                    mediaFileList = [...mediaFileList, ...layoutBlockFusionviewInvolvedSourceFile ];
                 }
             });
        });
    });
    // cusLogger.info("mediaFileList", mediaFileList);

     // get brandwebfontcss and
     const brandWebfontCss = displayContent.brand.webfontcss;
     const file_name = path.basename(brandWebfontCss);
     const storePath = path.dirname(brandWebfontCss);
    //  cusLogger.info("brandWebfontCss-storePath:", storePath);
     mediaFileList.push({"sourcePath": storePath, "fileName":  file_name});
 
     // get orgWebfont Sources download list
     const webfontSources = displayContent.webfontSources;
     webfontSources.forEach(webfontSource => {
        mediaFileList.push(getMediasourcesStorePathfileName(webfontSource.content));
     });
        
     // get proStatusImage Sources download list
     if (displayContent.statusImageSources != undefined) {
         // for statusImage in displayContent['statusImageSources']:
         displayContent.statusImageSources.forEach( statusImage =>{
             mediaFileList.push(getMediasourcesStorePathfileName(statusImage.content));
         })
     }
 
//      cusLogger.info(`mediaFileList: ${JSON.stringify(mediaFileList)}`)
     return mediaFileList
 }
 
 function getFusionviewInvolvedSourceFile(fusionview) {
     let fusionViewSourceFile = [];
     // fusionLayout["mediasource"]
     const fusionLayout = fusionview.fusionLayout;
     if (fusionLayout.mediasource != undefined) {
         fusionViewSourceFile.push(getMediasourcesStorePathfileName(fusionLayout.mediasource.content));
     }
            
     // fusionLayout[staticElements]
     fusionLayout.staticElements.forEach(staticElement => {
         if (staticElement.mediasource != undefined) {
             fusionViewSourceFile.push(getMediasourcesStorePathfileName(staticElement.mediasource.content));
         }
     });
 
     // fusionLayout[listBlocks]
     fusionLayout.listBlocks.forEach( listBlock => {
         // listBlock[listItems]
         listBlock.listItems.forEach( listItem => {
             const itemShape = listItem.itemShape
             if (itemShape.mediasource != undefined){
                 fusionViewSourceFile.push(getMediasourcesStorePathfileName(itemShape.mediasource.content));
             }
             // fusionLayout[staticElements]
             itemShape.staticElements.forEach( staticElement => {
                 if (staticElement.mediasource != undefined ) {
                     fusionViewSourceFile.push(getMediasourcesStorePathfileName(staticElement.mediasource.content));
                 }
             });
         });
     });
 
     /* ooking fusionItems (product images) mediasource files
        fusionItems -> bounditem -> mediasources
     */    
     fusionview.fusionItems.forEach( fusionItem => {
         const bounditem = fusionItem.bounditem;
         if (bounditem.mediasources.length) {
             fusionViewSourceFile.push(getMediasourcesStorePathfileName(bounditem.mediasources[0].content));    
         }
     });
     return fusionViewSourceFile;
 }
 
 function getMediasourcesStorePathfileName(mediasourceContent) {
    //  const mediaFile = mediasource.content;
     const storePath = path.dirname(mediasourceContent);
     const file_name = path.basename(mediasourceContent);
     return {"sourcePath": storePath, "fileName": file_name}
 }
 
function getVideoThumbnail(videoFilePath) {
    let thumbnailPath = videoFilePath.substring(0, videoFilePath.lastIndexOf("/"));
    // create the thumbs folder if it doesn't exist
    const thumbsFolder = path.join(thumbnailPath, "thumbs");
    const publicFolder = path.join(__dirname, "../public");
    const checkThumbsPath = path.join(publicFolder, thumbsFolder);
    // console.log(`Checking for thumbnails at: ${checkThumbsPath}`);
    if (!fs.existsSync(checkThumbsPath)) {
        fs.mkdirSync(checkThumbsPath);
    }
    thumbnailPath = thumbnailPath + "/thumbs" + videoFilePath.substring(videoFilePath.lastIndexOf("/"), videoFilePath.length);
    thumbnailPath = thumbnailPath.substring(0, thumbnailPath.lastIndexOf(".")) + ".jpg";
    return {"sourcePath": path.dirname(thumbnailPath), "fileName": path.basename(thumbnailPath)};
}