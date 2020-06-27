import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import CovidLineChart from "./components/CovidLineChart";
import CovidDataTable from "./components/CovidDataTable";

const NAVIGATION_ITEMS = [
  {
    name: "Covid Line Chart",
    navigateTo: "lineChart",
    iconName: "line-chart",
  },
  {
    name: "Covid Data Table",
    navigateTo: "dataTable",
    iconName: "table",
  },
];

const getChartData = (covidData, selectedCountry) =>
  covidData
    .filter((dataItem) => dataItem.countrycode === selectedCountry)
    .map((item) => ({
      ...item,
      name: item.date,
      cases: +item.cases,
      deaths: +item.deaths,
      recovered: +item.recovered,
    }))
    .sort((a, b) => new Date(a.name) - new Date(b.name));

const getCountryCodes = (covidData) => {
  return [...new Set(covidData.map((dataItem) => dataItem.countrycode).sort())];
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      displaySideNav: false,
      selectedCountry: "",
    };

    this.countryCodes = [];
    this.chartData = [];
    this.showHideSideBar = this.showHideSideBar.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then((res) => {
        this.countryCodes = getCountryCodes(res.data);
        this.chartData = getChartData(
          res.data,
          this.state.selectedCountry || "US"
        );
        this.setState({
          data: res.data,
          selectedCountry: this.state.selectedCountry || "US",
        });
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

  showHideSideBar() {
    this.setState({
      displaySideNav: !this.state.displaySideNav,
    });
  }

  handleSelectChange(selectedValue) {
    this.chartData = getChartData(this.state.data, selectedValue);
    this.setState({
      selectedCountry: selectedValue,
    });
  }

  render() {
    return (
      <Router>
        <div
          className={`grid ${
            this.state.displaySideNav ? "grid--noscroll" : ""
          }`}
        >
          <Header showHideSideBar={this.showHideSideBar} />
          <SideNav
            showHideSideBar={this.showHideSideBar}
            displaySideNav={this.state.displaySideNav}
            navItems={NAVIGATION_ITEMS}
          />
          <main className="main">
            <div>
              <FormControl className="selectCountryContainer">
                <InputLabel htmlFor="select-country-code">
                  Select Country
                </InputLabel>
                <NativeSelect
                  native
                  value={this.state.selectedCountry}
                  onChange={(e) => {
                    this.handleSelectChange(e.target.value);
                  }}
                  label="Select Country"
                  inputProps={{
                    name: "country",
                    id: "select-country-code",
                  }}
                >
                  <option aria-label="None" value="" />
                  {this.countryCodes &&
                    this.countryCodes.map((country) => (
                      <option value={country} key={country}>
                        {country}
                      </option>
                    ))}
                </NativeSelect>
              </FormControl>
            </div>
            <Switch>
              <Route exact path="/">
                <CovidLineChart
                  data={this.state.data}
                  selectedCountry={this.state.selectedCountry}
                  chartData={this.chartData}
                />
              </Route>
              <Route path="/lineChart">
                <CovidLineChart
                  data={this.state.data}
                  selectedCountry={this.state.selectedCountry}
                  chartData={this.chartData}
                />
              </Route>
              <Route path="/dataTable">
                <CovidDataTable />
              </Route>
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
