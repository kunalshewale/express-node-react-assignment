import React, { Component } from "react";
import "./App.css";
import CovidDataMap from "./CovidDataMap";

class App extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then((res) => {
        console.log("The received data is >>> ", res);
        this.setState({ data: res.data });
      })
      .catch((err) => console.log(err));
  }
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch("/getCovidData");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title"> Welcome to Covid Data Map </div>
        </header>
        <div className="App-intro">
          {this.state.data.length && <CovidDataMap data={this.state.data} />}
        </div>
      </div>
    );
  }
}

export default App;
