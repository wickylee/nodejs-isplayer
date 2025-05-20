class WebSocketService {
  static instance = null;
  componentWillUnmount = false;
  tryReconnectInterval = null;
  callbacks = {};

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  getOnLineStatus = () => {
    typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
      ? navigator.onLine
      : false;
  }


  connect(fusionViewId, webSocketServer) {
    const path = `${webSocketServer}/ws/fusionview/${fusionViewId}/`;
    try {
      this.socketRef = new WebSocket(path);
      this.socketRef.onopen = () => {
        console.log("WebSocket open");
        clearInterval(this.tryReconnectInterval);
      };
      this.socketRef.onmessage = e => {
        //console.log("onmessage:", e.data); 
        this.socketResponding(e.data);
      };
      this.socketRef.onerror = e => {
        console.log(e.message);
      };
      this.socketRef.onclose = () => {
        clearInterval(this.tryReconnectInterval);
        console.log("WebSocket closed let's reopen");
        if (!this.componentWillUnmount && !this.getOnLineStatus()) {
            this.tryReconnectInterval = setInterval(() => {
              console.log('In While loop trying to reconnect in 10 sec.')
              this.connect(fusionViewId, webSocketServer);
            }, 10*1000);
        } 
      };
    } catch (error) {
      console.error(error);
      this.socketRef = null;
    }
  }

  disconnect() {
    this.socketRef.close();
  }

  unmountDisconnect() {
    try {
      this.componentWillUnmount = true;
      this.socketRef.close();
    } catch (err) {
      console.log("unmountDisconnect error:");
    }
  }

  socketResponding(data) {
    const parsedData = JSON.parse(data);
    console.log("WebSocket data:", parsedData); 
    const command = parsedData.command;
    
    //console.log("WebSocket callbacks:", Object.keys(this.callbacks).length); 

    switch (command) {
      case "fusionitem_status_change":
        //console.log("Get fusionitemStatusChange WS command:", parsedData);
        if (this.callbacks[command] === undefined) {
          console.log("fusionitem_status_change callback not defined");
        } else {
          console.log("fusionitem_status_change callback defined");
          this.callbacks[command](parsedData.socketData);
        }
        break;
      // case "some_message_method":
      //   this.callbacks[command](parsedData.socketData);
      //   break;
      default: return;
    }
    
    return;

  }

  addCallbacks(
    fusionitemStatusChange
  ) {
    this.callbacks["fusionitem_status_change"] = fusionitemStatusChange; //map to component fusionitemStatusChanged
  }

  // SomeSendMessageMethod(actData) {
  //   this.sendMessage({
  //     command: "fusionitem_status_change",
  //     ...actData
  //   });
  // }

  sendMessage(data) {
    console.log("send", data);
    try {
      // console.log("send", JSON.stringify({ ...data }));
      this.socketRef.send(JSON.stringify({ ...data }));
    } catch (err) {
      console.log("sendMessage error:", err.message);
    }
  }

  state() {
    try {
      return this.socketRef.readyState;
    } catch (err) {
      console.log("state error:", err.message);
      return null;
    }
  }
}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
