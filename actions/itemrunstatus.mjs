import PlayerModel from "./playerModel.mjs";
import { getICastItemrunstatusDaystatus } from "./iCastApi.mjs";
// import path from 'path';
import {cusLogger} from '../cusLogger.mjs';
// const __filename = path.basename(path.resolve(import.meta.url));

export async function dayStatus(req) {
    let thisPlayer =  new PlayerModel();
    await thisPlayer.bindData();
    // cusLogger.info("daystatus: ", req.body)
    const payload = {fusionViewId : req.body.fusionViewId, 
                     filterDay: req.body.filterDay}
    let icastResponse = {}
    if (payload.fusionViewId) {
        icastResponse = await getICastItemrunstatusDaystatus(thisPlayer, payload);
        return icastResponse;
    }

}
