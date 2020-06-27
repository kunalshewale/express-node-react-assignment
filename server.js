const express = require("express");
const https = require("https");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

const url = "mongodb://localhost:27017/coviddb";

mongoose.Promise = global.Promise;
mongoose.connect(url, {
  poolSize: 10,
  bufferMaxEntries: 0,
  reconnectTries: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const CovidDataDb = mongoose.connection;

const covidDataSchema = new mongoose.Schema({
  countrycode: String,
  date: String,
  cases: Number,
  deaths: Number,
  recovered: Number,
});

const CovidData = mongoose.model("CovidData", covidDataSchema, "covidStore");

CovidDataDb.on("error", console.error.bind(console, "connection error:"));

CovidDataDb.once("open", () => {
  console.log("Connection Successful!");

  let latestData = "";
  https
    .get("https://thevirustracker.com/timeline/map-data.json", (getRes) => {
      getRes.on("data", (d) => {
        latestData += d;
      });
      getRes.on("end", () => {
        //res.send(JSON.parse(latestData));
        createEntriesInCollection(JSON.parse(latestData).data);
      });
    })
    .on("error", (e) => {
      console.error(e);
    });
});

const createEntriesInCollection = (entries, callBack) => {
  let bulkInsertOps = [],
    batchCount = 1;
  CovidData.deleteMany({}, () => {
    entries.forEach((item) => {
      bulkInsertOps.push({ insertOne: { document: item } });

      if (bulkInsertOps.length === 1000) {
        CovidData.bulkWrite(bulkInsertOps).then(() => {});
        bulkInsertOps = [];
      }
    });

    if (bulkInsertOps.length > 0) {
      CovidData.bulkWrite(bulkInsertOps).then(() => {
        CovidDataDb.close();
      });
    }
  });
};

const getDataFromCollection = (callback) => {
  mongoose.connect(url);
  CovidDataDb.once("open", () => {
    CovidData.find({}, (err, covidData) => {
      if (err) {
        console.error("There is error in fetching data >>> ", err);
      } else {
        callback(covidData);
        CovidDataDb.close();
      }
    });
  });
};

// create a GET route
app.get("/getCovidData", (req, res) => {
  getDataFromCollection((data) => {
    res.send({ data });
  });
});
