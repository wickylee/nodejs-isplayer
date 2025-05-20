import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

const initialAuthState = {
  org: localStorage.getItem("org") ? localStorage.getItem("org") : null,
  appSetting: {},
  appLic: {},
};

export const appConfigSlice = createSlice({
  name: "appconfig",
  initialState: initialAuthState,
  reducers: {
    setAppSetting: (state, {payload} ) => {
      state.appSetting = payload;
    },
    setAppLic: (state, {payload}) => {
      //change license formate for frontend
      //[{"app": "iPlays", "prop": "Brand", "expiry": "2020/10/31"}, {"app": "iPlays", "prop": "Band", "expiry": "2020/10/31"},...]
      let _appLic = {};
      //get application property group
      for (const i in payload) {
        const item = payload[i];
        const appProp = `${item["app"]}:${item["prop"]}`;
        if (!(appProp in _appLic)) _appLic[appProp] = 0;
      }
      //get number of each property
      for (const propkey in _appLic) {
        let propEntries = {}
        for (const i in payload) { 
          const item = payload[i];
          if (propkey == `${item.app}:${item.prop}`) { 
            if (! (item.expiry in propEntries ) ) {
              propEntries[item.expiry] = 1;
            } else {
              propEntries[item.expiry] = propEntries[item.expiry] + 1;
            }
          }
        }
        //console.log('propEntries', propEntries)
        _appLic[propkey] = propEntries;
      }
      state.appLic = _appLic;
    },
  }
});

export const {
  setAppSetting,
  setAppLic
} = appConfigSlice.actions;

