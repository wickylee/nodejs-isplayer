#!/usr/bin/env node

import 'dotenv/config';
import app from '../app.mjs';
import http from 'http';
import {cusLogger} from '../cusLogger.mjs';
import displaySocket from "./displaySocket.mjs";
import {performBackgroundTasks, setIntervalPerformBackgroundTasks} from "../actions/backgroundTasks.mjs";

import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const reconFileDir = `${__dirname}/../public/recon/`;
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '8030');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * set a BackgroundTasks to checkig for playercontent update and playerprogam update
 */

// Start the interval timer when the server starts
let intervalId = await setIntervalPerformBackgroundTasks();

/**
 * start a displaySocket object
 */
let displaysocket = await displaySocket();

// Optionally, stop the interval when the server closes
process.on('exit', () => {
  clearInterval(intervalId);
  displaysocket.close();
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function deleteAllFilesInReconDir(folderPath) {
  if (!fs.existsSync(folderPath)) {
      throw new Error(`The folder "${folderPath}" does not exist.`);
  }

  // Read the contents of the folder
  const files = fs.readdirSync(folderPath);

  // Iterate through the files and delete them
  files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      // Ensure only files are deleted (not subdirectories)
      if (fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath); // Deletes the file
      }
  });

  console.log(`All files in folder "${folderPath}" have been deleted.`);
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

  // clear download trace files in recon folder
  cusLogger.info(`reconFileDir: ${reconFileDir}`);
  try {
    deleteAllFilesInReconDir(reconFileDir)
  } catch (error) {
      console.error(`Error: ${error.message}`);
  }
  cusLogger.info(`Node-isPlayer server started and listening on ${bind}`);

  // run performBackgroundTasks for first check contents update
  setTimeout(async () => {
    await performBackgroundTasks();
  }, 1000);

}