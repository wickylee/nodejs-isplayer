import {cusLogger} from '../cusLogger.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// cusLogger.info(`__dirname: ${__dirname}`);
const playerModelFile = `${__dirname}/playerModel.json`;

export default class PlayerModel {
  name;
  iserver;
  wserver;
  frontend_root; 
  media_path;
  display_id;
  playcontent;
  publish_at;
  check_update_time; 
  partial_update;
  mediaSaveDir;

  modelSchema () {
    return { id: Number,
      name: String,
      display_id: Number,
      playcontent: String,
      publish_at: String,
      media_path: String, 
      check_update_time: Number, 
      frontend_root: String, 
      partial_update: String,
      wserver: String,
      iserver: String,
      //--
      initial: String,
      org_key: String,
      brand_name: String,
      brand_id: Number,
      display_name: String,
      player_name: String,
      }
  }

  async bindData () {

    let playerModel = await new Promise((resolve) => {
          this.jsonReader(playerModelFile, (err, _playerModel) => {
            if (err) {
              cusLogger.error(`Binding Data Error: ${err}`);
              resolve(null);
            }
            resolve(_playerModel);
          });
      });

    this.name = playerModel.name;
    this.iserver = playerModel.iserver;
    this.wserver = playerModel.wserver;
    this.frontend_root = playerModel.frontend_root;
    this.media_path = playerModel.media_path;
    this.display_id = playerModel.display_id;
    this.playcontent = playerModel.playcontent;
    this.publish_at = playerModel.publish_at;
    this.check_update_time = playerModel.check_update_time;
    this.partial_update = playerModel.partial_update;
    //--
    this.initial = playerModel.initial;
    this.org_key = playerModel.org_key;
    this.brand_name = playerModel.brand_name;
    this.brand_id = playerModel.brand_id;
    this.display_name = playerModel.display_name;
    this.player_name = playerModel.player_name;
    this.mediaSaveDir = this.frontend_root + this.media_path;
  }

  // async bindData () {
  //     // cusLogger.info("PlayerModel bindData");
  //     const db = await connect(); 
  //     let playerModel = await new Promise((resolve) => {
  //       try {
  //         db.query('SELECT * FROM backend_player where id = 1 ', this.modelSchema(), function (err, rows) { 
  //           if (err != null) {
  //             cusLogger.error(`Binding Data Error: ${err}`);
  //           } else {
  //             // cusLogger.info(`Get Data rows: ${rows.length}`);
  //             resolve(rows[0]);
  //           }
  //         });
  //       } finally {
  //         db.close();
  //       }
  //     });

  //     this.name = playerModel.name;
  //     this.iserver = playerModel.iserver;
  //     this.wserver = playerModel.wserver;
  //     this.frontend_root = playerModel.frontend_root;
  //     this.media_path = playerModel.media_path;
  //     this.display_id = playerModel.display_id;
  //     this.playcontent = playerModel.playcontent;
  //     this.publish_at = playerModel.publish_at;
  //     this.check_update_time = playerModel.check_update_time;
  //     this.partial_update = playerModel.partial_update;
  //     this.mediaSaveDir = this.frontend_root + this.media_path;
  // }

  playerConfig () {
    return {
      name: this.name,
      iserver: this.iserver,
      wserver: this.wserver,
      frontend_root: this.frontend_root, 
      media_path: this.media_path,
      display_id: this.display_id,
      // playcontent: this.playcontent,
      publish_at: this.publish_at,
      check_update_time: this.check_update_time,
      //--
      partial_update: this.partial_update,
      brand_name : this.brand_name,
      brand_id : this.brand_id,
      display_name : this.display_name,
      player_name : this.player_name
    }
  }

  async save() {
    this.jsonSave(playerModelFile, this);
    // const db = await connect();
    // try {
    //   const sql = `UPDATE backend_player  
    //     SET
    //       name = ?,
    //       iserver = ?,
    //       wserver = ?,
    //       frontend_root = ?, 
    //       media_path = ?,
    //       display_id = ?,
    //       playcontent = ?,
    //       publish_at = ?,
    //       check_update_time = ?, 
    //       partial_update = ?
    //     WHERE ( id = 1)
    //   `;
    //   let uData =[
    //           this.name,
    //           this.iserver,
    //           this.wserver,
    //           this.frontend_root, 
    //           this.media_path,
    //           this.display_id,
    //           this.playcontent,
    //           this.publish_at,
    //           this.check_update_time, 
    //           this.partial_update,
    //         ];
    //   // cusLogger.info(`this.publish_at: ${this.publish_at}`);
    //   // cusLogger.info(`this.partial_update: ${this.partial_update}`);
    //   const result = db.query(sql, uData, function(err) {
    //                             if (err) {
    //                               return cusLogger.error(err.message); //console.error(err.message);
    //                             }
    //                           });
    //   return result;
    // } catch (e) {
    //   cusLogger.error(`Save Data Error: ${err}`);
    // } finally {
    //   db.close();
    // }
  }
  
  async updateConfig(playload) {
    this.name = playload.name;
    this.iserver = playload.iserver; 
    this.wserver = playload.wserver;
    // this.frontend_root = playload.frontend_root;
    this.frontend_root = `${__dirname}/../public`;
    this.media_path = playload.media_path;
    this.display_id = playload.display_id;
    this.check_update_time = playload.check_update_time;
    //--
    this.initial = "true";
    this.org_key = playload.org_key;
    this.brand_name = playload.brand_name;
    this.brand_id = playload.brand_id;
    this.display_name = playload.display_name;
    this.player_name = playload.player_name;
    this.mediaSaveDir = this.frontend_root + this.media_path;
    this.publish_at = playload.publish_at;
//     cusLogger.info(`frontend_root: ${this.frontend_root}`);
    const result = await this.save();
  }

  jsonReader(filePath, cb) {
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

  jsonSave(filePath, obj) {
    const jsonString =  JSON.stringify(obj);
    // cusLogger.error(`writing file: ${jsonString}`);
    fs.writeFileSync(filePath, jsonString, err => {
      if (err) {
          cusLogger.error(`Error writing file: ${err}`);
      } else {
         cusLogger.info('Successfully wrote file')
      }
      }
    );
  
  }


}
