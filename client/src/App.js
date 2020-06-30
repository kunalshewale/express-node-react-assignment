import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
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
    this.getCountryCodes()
      .then((res) => {
        this.countryCodes = res.countryCodes;
      })
      .catch((err) => console.log(err));

    this.getCountryWiseData()
      .then((res) => {
        this.setState({
          data: getChartData(res.data),
          selectedCountry: this.state.selectedCountry || "US",
        });
      })
      .catch((err) => console.log(err));
  }

  getCountryWiseData = async (countryCode = "US") => {
    const response = await fetch(`/getCovidDataForCountry/${countryCode}`);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  getCountryCodes = async () => {
    const response = await fetch("/getCountryCodes");
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
    this.getCountryWiseData(selectedValue)
      .then((res) => {
        this.setState({
          data: getChartData(res.data),
          selectedCountry: selectedValue,
        });
      })
      .catch((err) => console.log(err));
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
                  native="true"
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
                  selectedCountry={this.state.selectedCountry}
                  chartData={this.state.data}
                />
              </Route>
              <Route path="/lineChart">
                <CovidLineChart
                  selectedCountry={this.state.selectedCountry}
                  chartData={this.state.data}
                />
              </Route>
              <Route path="/dataTable">
                <CovidDataTable data={this.state.data} />
              </Route>
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
