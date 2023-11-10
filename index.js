const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;
const pug = require("pug");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "assets")));

app.get("/:id", async (req, res) => {
  console.log(req.query, req.params);
  let title = "Default";
  req.params.id == "neomoon" ? title="Neomoon" : null;
  req.params.id == "credibanco" ? title="Credibanco" : null;
  req.params.id == "marcospaz" ? title="Marcos Paz" : null;
  if (req.query.value) {
    let data = JSON.stringify({
      "dataSource": "dev-common-uy-01",
      "database": "customer-success",
      "collection": "emails",
      document: {
        value: req.query.value,
      },
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url:
        "https://sa-east-1.aws.data.mongodb-api.com/app/data-gtkso/endpoint/data/v1/action/insertOne",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        "api-key": process.env.MONGO_KEY,
      },
      data: data,
    };

    const result = await axios.request(config);
    console.log(result.data);
  }
  res.render("index",{title});
});
app.post("/stats", async ({ body }, res) => {
  let document = {
    ask1: body.ask1 ?? null,
    ask2: body.ask2 ?? null,
    ask3: body.ask3 ?? null,
    extra: body.extra ?? null,
  };
  console.log(document);
  let data = JSON.stringify({
    "dataSource": "dev-common-uy-01",
    "database": "customer-success",
    "collection": "details",
    document,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url:
      "https://sa-east-1.aws.data.mongodb-api.com/app/data-gtkso/endpoint/data/v1/action/insertOne",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.MONGO_KEY,
    },
    data: data,
  };

  const result = await axios.request(config);
  console.log(result.data);
  res.render("thanks");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
