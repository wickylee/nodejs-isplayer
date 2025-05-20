import axios from 'axios'
import fs from 'fs';
import {cusLogger} from '../cusLogger.mjs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const reconFileDir = `${__dirname}/../public/recon`;

function extractFileUrlToFileName(fileUrl) {
    let fileName = fileUrl.split('/').pop(); 
    /** 
    // Find the position of "static/" in the URL
    let keyword = "static/";
    let startIndex = fileUrl.indexOf(keyword);
    if (startIndex === -1) {
        // throw new Error(`The keyword "${keyword}" was not found in the URL.`);
        keyword = "media/";
        startIndex = fileUrl.indexOf(keyword);
    }

    // Extract the substring after "static/"
    const substring = fileUrl.substring(startIndex + keyword.length);

    // Convert the substring into a valid file name
    const fileName = substring.replace(/[^a-zA-Z0-9-]/g, '_'); // Replace invalid characters with underscores
    // 
*/
    fileName = fileName.replace(/[^a-zA-Z0-9-]/g, '_'); // Replace invalid characters with underscores
    // cusLogger.info(`extractFileUrlToFileName: ${fileName}`);
    
    return fileName;
}

function createRcf(rcfFilePath, filePath) {
    cusLogger.debug(`writing file: ${rcfFilePath}`);
    fs.writeFileSync(rcfFilePath, filePath, err => {
      if (err) {
          cusLogger.error(`Error writing file: ${err}`);
      } else {
         cusLogger.info('Successfully wrote file')
      }
      }
    );
}

function deleteRcf(rcfFilePath) {
    cusLogger.debug(`delete file: ${rcfFilePath}`);
    if (fs.existsSync(rcfFilePath)) {
        try {
            fs.unlinkSync(rcfFilePath); // Synchronous delete
            cusLogger.info(`Successfully deleted file: ${rcfFilePath}`);
        } catch (err) {
            cusLogger.error(`Error deleting file: ${err}`);
        }
    }
}

export default function fileDownloader(fileUrl, outputLocationPath) {
    // cusLogger.info(`fileDownloader fileUrl: ${fileUrl}`);
    // cusLogger.info(`fileDownloader outputLocationPath: ${outputLocationPath}`);
    const reconFileName = extractFileUrlToFileName(fileUrl);
    const reconFilePath = `${reconFileDir}/${reconFileName}.rcf`;
    return axios({ method: 'get', url: fileUrl, responseType: 'stream'})
        .then(response => {
            //ensure that the user can call `then()` only when the file has
            //been downloaded entirely. 
            return new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(outputLocationPath);
                response.data.pipe(writer);

                // create a recon file 
                createRcf(reconFilePath, fileUrl);
                // end

                let error = null;
                writer.on('error', err => {
                    error = err;
                    writer.close();
                    if (fs.existsSync(outputLocationPath)) {
                        fs.unlink(outputLocationPath);
                    }
                    deleteRcf(reconFilePath) // delete rcf file when download error
                    cusLogger.info(`writer file failed: ${outputLocationPath}`);
                    reject(err);
                });

                writer.on('close', () => {
                    if (!error) {
                        deleteRcf(reconFilePath) // delete rcf file when download file completed
                        cusLogger.info(`Download file ${fileUrl} completed`);
                        // delete a recon file 
                        resolve(true);  
                    }
                    //no need to call the reject here, as it will have been called in the
                    //'error' stream;
                });
        });
        }).catch((err) => {
            cusLogger.error(`fileDownloader Error : ${err}`);
            deleteRcf(reconFilePath) // delete rcf file when download error
            cusLogger.info(`file download failed: ${outputLocationPath}`);
        });
  }