import React, { Component } from "react";
import { Icon, Button, Switch, NumericInput, Intent, HTMLSelect } from "@blueprintjs/core";
import axios from "axios";
import {appHelper} from "./lib/apphelper";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

class PlayerConfig extends Component {
    state = {
      id: 1,
      name: "iKey of Player",
      iserver: "https://cloud.icast.com.hk",
      wserver: "https://iticket.icast.com.hk",
      frontend_root: "/home/minix/isplayer/frontend",
      media_path: "",
      display_id: 1,
      check_update_time: 60,
      //--
      _actionCompleted: false,
      customFrontendRootInput: false,
      frontendRootOptions: [{value: "/home/minix/isplayer/frontend", label: "Linux Player: /home/minix/isplayer/frontend" },
                          {value: "C:/iSignage/isplayer/frontend", label: "Windows Player: C:/iSignage/isplayer/frontend" },
                          {value: "/storage/emulated/0/Documents/isplayer/frontend", label: "Android Player: /storage/emulated/0/Documents/isplayer/frontend"},
                          {value: "~/node-isplayer/public", label: "NodeJS: ~/node-isplayer/public"}
                        ],
      iKeySearchMsg: ""
    };

  componentDidMount() {
    //get the application config and display and playlist
    // console.log("pass loading data...")
    axios
      .get(`/api/player/config/`)
      .then(res => {
        // console.log("res", res.data);
        const model = res.data;
        //to detect whether need to apperar custom input of frontend_root
        let appearFrontendRootInput = !this.state.frontendRootOptions.find(item=>item.value == model.frontend_root)

        this.setState({ ...model, customFrontendRootInput: appearFrontendRootInput });

      })
      .catch(err => {
        appHelper.handleApiFailed(err);
      });
  }

  handleInputChange = e => {
    e.preventDefault();

    if (e.target.name== "frontend_root"){
      if (e.target.value == "[Install Location]/isplayer/frontend") {
        this.setState({ [e.target.name]: e.target.value, customFrontendRootInput: true, _actionCompleted: false});
      } else {
        this.setState({ [e.target.name]: e.target.value, customFrontendRootInput: false, _actionCompleted: false });
      }
      return
    } 
    
    this.setState({ [e.target.name]: e.target.value, _actionCompleted: false });
    
  };

  handleNumericInputChange = (field, value) => {
    this.setState({ [field]: value, _actionCompleted: false });
  };

  searchIkeyByName = () =>{
    let payload = {iserver: this.state.iserver,
                   display_id: this.state.display_id}

    axios
    .post(`/api/player/searchIkey/`, payload, {
      headers: {
        //Authorization: `JWT ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      // console.log("res", res.data);
      let playerlist = res.data.players;
      if (playerlist != undefined) {
        let targetPlayer = playerlist.find(item=>item.name == this.state.name)
        if (targetPlayer === undefined) {
          this.setState({ iKeySearchMsg: "Not found any match player IKey!", _actionCompleted: false });
        } else {
          this.setState({ name: targetPlayer.ikey, media_path: res.data.mediaPath, iKeySearchMsg: "", _actionCompleted: false,  });
        }  
      } else {
        this.setState({ iKeySearchMsg: "Not found player IKey as the target display not have any player!" });
      }
   
    })
    .catch(err => {
      appHelper.handleApiFailed(err);
      this.setState({ iKeySearchMsg: "Not found player IKey as iCast server responding error!" });
    });
  }
   
  handleSubmit = e => {
    e.preventDefault();
    //form this.state to port json model data
    const modelData = Object.keys(this.state)
      .filter(vkey => !vkey.startsWith("_"))
      .reduce((obj, key) => {
        obj[key] = this.state[key];
        return obj;
      }, {});

    axios
      .patch(`/api/player/${this.state.id}/`, modelData, {
        headers: {
          //Authorization: `JWT ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        console.log("res", res.data);
        //this.setState({ _actionCompleted: true });
        this.setState({ ...res.data, _actionCompleted: true });
      })
      .catch(err => {
        appHelper.handleApiFailed(err);
      });
  };

  render() {
    let submitTxt = "Update";
    if (this.state._actionCompleted) submitTxt = "Data Updated!";

    return (
      <div className="player-config">
        <div className="config-form">
          <div className="form-header">
            <div className="header-title">isPlayer Config</div>
          </div>
          <form action="#" onSubmit={this.handleSubmit} className="form-body">
          
          <div className="field-row">
              <div className="field-label ">iCast App. Server</div>

              <div className="field-value">
                <input
                  name="iserver"
                  className="bp3-input"
                  type="text"
                  value={this.state.iserver}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-label ">iCast WS Server</div>

              <div className="field-value">
                <input
                  name="wserver"
                  className="bp3-input"
                  type="text"
                  value={this.state.wserver}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>

          <div className="field-row">
              <div className="field-label ">Target Display Id</div>

              <div className="field-value">
                <NumericInput
                  name="display_id"
                  stepSize={1}
                  min={1}
                  value={this.state.display_id}
                  onValueChange={valueAsNumber => {
                    this.handleNumericInputChange("display_id", valueAsNumber);
                  }}
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-label ">Player IKey</div>

              <div className="field-value">
                <input
                  name="name"
                  className="bp3-input"
                  type="text"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
                <div style={{flexDirection: "row"}}>
                <Button
                    icon="search"
                    intent={Intent.PRIMARY}
                    text={"Search by Player name"}
                    small={true}
                    onClick={this.searchIkeyByName}
                  />
                  <div className="bp3-text-small" style={{color: "#9E2B0E", display: "inline", margin: "5px"}} >{this.state.iKeySearchMsg}</div>
                  </div>
              </div>
            </div>



            <div className="field-row">
              <div className="field-label ">Local Frontend Path</div>

              <div className="field-value">
                <div className="bp3-html-select">
                  <HTMLSelect 
                    name="frontend_root" 
                    value={this.state.frontend_root} 
                    onChange={this.handleInputChange} 
                    multiple={false}
                    options={[{value: "[Install Location]/isplayer/frontend", label: "Other Player: [Install Location]/isplayer/frontend"},...this.state.frontendRootOptions]}
                    />
                </div>

                <div name="otherLocalInput" style={{display: this.state.customFrontendRootInput? 'block' : 'none'}}>
                  <input
                    name="otherPlayerLocation"
                    className="bp3-input"
                    type="text"
                    value={this.state.frontend_root}
                    onChange={e=>this.setState({ ["frontend_root"]: e.target.value })}
                  />
                </div>
                {/* <input
                  name="frontend_root"
                  className="bp3-input"
                  type="text"
                  value={this.state.frontend_root}
                  onChange={this.handleInputChange}
                /> */}
              </div>
            </div>

            <div className="field-row">
              <div className="field-label ">Media Store Folder</div>

              <div className="field-value">
                <input
                  name="media_path"
                  className="bp3-input"
                  type="text"
                  value={this.state.media_path}
                  onChange={this.handleInputChange}
                  disabled={true}
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field-label ">Check Update Interval</div>

              <div className="field-value">
                <NumericInput
                  name="check_update_time"
                  stepSize={1}
                  min={1}
                  value={this.state.check_update_time}
                  onValueChange={valueAsNumber => {
                    this.handleNumericInputChange(
                      "check_update_time",
                      valueAsNumber
                    );
                  }}
                />
              </div>
            </div>

            <div className="span-row">
              <div className="span-label"></div>
            </div>

            <div className="button-row">
              <div className="button-span"></div>
              <div className="form-buttons">
                {this.state._actionCompleted ? (
                  <div className="action-completed-text">
                    <Icon icon="tick-circle" iconSize={16} />
                    {submitTxt}
                  </div>
                ) : (
                  <Button
                    type="submit"
                    icon="small-tick"
                    intent={Intent.PRIMARY}
                    text={submitTxt}
                    small={true}
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default PlayerConfig;
