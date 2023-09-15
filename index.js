const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer")
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const dotenv = require("dotenv").config()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const URL = process.env.DB;
const DB = "oipcrudapp"
const semail = process.env.EMAIL;
const spassword = process.env.PASSWORD
app.listen(process.env.PORT || 3000);

app.use(express.json());
app.use(cors({
    origin:"http://localhost:3001"
}))

const Authenticate = (req,res,next) => {
    if (req.headers.authorization) {
        try {
            const decode = jwt.verify(req.headers.authorization, process.env.SECRET);
            if (decode){
                next()
            }
        } catch (error) {
            res.status(401).json({message:"UnAuthorized"})
        }
    } else {
        res.ststus(401).json({message : "UnAuthorized"})
    }
};

app.get('/', function(req,res){
    res.send("Welcome to the OIPCRUDAPP")
})

// create User
app.post('/createuser', Authenticate, async function(req,res) {
    try {
        const connection = await mongoclient.connect(URL);
        const db = connection.db(DB);
        await db.collection('users').insertOne(req.body);
        await connection.close();
        res.json({message : "User Data Created"})
    } catch (error) {
        res.status(500).json({message : "Server Error"})
    }
})

// get all users 
app.get('/allusers', Authenticate, async function(req,res){
    try {
        const connection = await mongoclient.connect(URL);
        const db = connection.db(DB);
        const reusers = await db.collection('users').find().toArray();
        await connection.close();
        res.status(reusers);
    } catch (error) {
        res.status(500).json({message : "Server Error"})
    }
})

// View user
app.get('/user/:id',Authenticate, async function(req,res){
    try {
        const connection = await mongoclient.connect(URL);
        const db = connection.db(DB);
        const resuser = await db.collection('users').findOne({_id:new mongodb.ObjectId(req.params.id)});
        await connection.close();
        res.json(resuser);
    } catch (error) {
        
    }
})