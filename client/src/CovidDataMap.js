import React, { PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import moment from "moment";

const getCountryCodes = (covidData) => {
  console.log("The data for country code >>> ", covidData);
  return [...new Set(covidData.map((dataItem) => dataItem.countrycode).sort())];
};

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

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-35)"
        >
          {" "}
          {payload.value}{" "}
        </text>{" "}
      </g>
    );
  }
}

export default class CovidDataMap extends PureComponent {
  constructor(props) {
    super(props);
    this.countryCodes = getCountryCodes(props.data);
    this.state = {
      selectedCountry: "US",
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSelectChange(selectedValue) {
    this.setState({
      selectedCountry: selectedValue,
    });
  }

  render() {
    const chartData = getChartData(this.props.data, this.state.selectedCountry);
    console.log("CharData >>> ", chartData);
    return (
      <React.Fragment>
        <div>
          <label> Select Country </label>{" "}
          <select
            value={this.state.selectedCountry}
            onChange={(e) => {
              this.handleSelectChange(e.target.value);
            }}
          >
            {" "}
            {this.countryCodes.map((country) => (
              <option value={country} key={country}>
                {" "}
                {country}{" "}
              </option>
            ))}{" "}
          </select>{" "}
        </div>{" "}
        <LineChart
          width={1000}
          height={800}
          data={chartData}
          margin={{
            top: 60,
            right: 60,
            left: 60,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />{" "}
          <YAxis interval={0} /> <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cases" stroke="#8884d8" />
          <Line type="monotone" dataKey="deaths" stroke="#82ca9d" />
          {/* <Line type="monotone" dataKey="recovered" stroke="#33fc9d" /> */}
        </LineChart>{" "}
      </React.Fragment>
    );
  }
}
