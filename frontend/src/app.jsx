import React, { Component } from "react";
import DisplayPlay from "./iplays/display_play";
import PlayerConfig from "./player_config";

class App extends Component {

  render() {
    let renderContent = <></>;
    const path = window.location.pathname;
    if (path.includes("config/")) {
      renderContent = <PlayerConfig />;
    } else {
      renderContent = <DisplayPlay preview={false} secure={false} />;
    }

    return <div className="app-root">
        {renderContent}
      </div>;
  }
}

export default App;
