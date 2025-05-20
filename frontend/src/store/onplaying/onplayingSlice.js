import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import i18n from "../../lib/i18n";
// import { appHelper, appTokens } from "../../lib/apphelper";
// import AppTokens from "../../lib/AppTokens";
// import { TDisplay, TPlaylist, TPlayclip, TClip, TClipframe, TFrame, TMediaSource, TElement, TLayoutBlockClip } from "../icast/models";
// import {IOnplayingState} from "./models";

const initialOnplayingState = {
  iserver: `http${process.env.HTTPS == 'True' ? 's': ''}://${process.env.APPLICATION_HOST}`,
  wserver: `ws${process.env.HTTPS == 'True' ? 's': ''}://${process.env.APP_WEBSOCKET_SERVER}`,
  playingDisplay: null,
  displayPlaylists: [],
  layoutBlockClips: [],
  loading: false,
  actionError: null,
};

export const onplayingSlice = createSlice({
  name: "onplaying",
  initialState: initialOnplayingState,
  reducers: {
    setServerHosts: (state, {payload}) => {
      state.iserver= payload.iserver,
      state.wserver= payload.wserver,
      state.actionError =  null;
    },
    setPlayingDisplay: (state, {payload}) => {
      state.playingDisplay = payload
      state.actionError =  null;
    },
    setDisplayPlaylists: (state, {payload}) => {
      state.displayPlaylists = payload
      state.actionError =  null;
    },
    setLayoutBlockClips: (state, {payload}) => {
      state.layoutBlockClips = payload
      state.actionError =  null;
    },
    actionFailed: (state, {payload} ) => {
      state.actionError = payload;
      state.loading = false;
    },
  },
});

export const {
  setServerHosts,
  setPlayingDisplay,
  setDisplayPlaylists,
  setLayoutBlockClips,
  actionFailed
} = onplayingSlice.actions;

