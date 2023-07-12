const express = requore("express");
const app = express();
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;

app.use(express.json());

app.lisen(process.env.PORT || 3000);