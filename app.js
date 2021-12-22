require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const fileSys = require('fs');

const APP_PORT = 3000;
const MONGO_URI_LOCAL = process.env.MONGO_URI_LOCAL;
const MONGO_URI_DOCKER = process.env.MONGO_URI_DOCKER;
const MONGO_DB_NAME = 'node_mongo_docker_app';
const MONGO_USERS_COLLECTION = 'users';
const MONGO_CLIENT_OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };

let app = express();
app.use(
    bodyParser.urlencoded({extended: true})
);
app.use(
    bodyParser.json()
);
app.use(
    express.static(path.join(__dirname, '/public'))
);

app.get(
    '/',
    function (req, res) {
        res.sendFile(path.join(__dirname, 'view/index.html'));
        console.log(__dirname);
    }
);

app.get(
    '/profile',
    (req, res) => {
        let response = {};
        const nameOfRemarkablePerson = req.query.name;
        MongoClient.connect(MONGO_URI_LOCAL, MONGO_CLIENT_OPTIONS, (connectionError, client) => {
            if (connectionError) throw connectionError;

            const db = client.db(MONGO_DB_NAME);
            let query = {name: nameOfRemarkablePerson};

            db.collection(MONGO_USERS_COLLECTION).findOne(query, (queryExeError, queryResult) => {
                if (queryExeError) throw queryExeError;
                response = queryResult;
                client.close();
                res.send(response);
            });    
        }); 
    }
);

app.post(
    '/profile',
    (req, res) => {
        let exeResult = {}
        const userJsonInfo = req.body;
        
        response = MongoClient.connect(MONGO_URI_LOCAL, MONGO_CLIENT_OPTIONS, (connectionError, client) => {
            if (connectionError) throw connectionError;
            const nameOfRemarkablePerson = req.query.name;
            const db = client.db(MONGO_DB_NAME);
            let queryMatch = {name: nameOfRemarkablePerson};
            let querySet = {$set: userJsonInfo};
            const updateOptions = {upsert: true};

            db.collection(MONGO_USERS_COLLECTION).updateOne(
                queryMatch, querySet, updateOptions, (updateExeError, updateResult) => {
                    if (updateExeError) throw updateExeError;
                    
                    exeResult = updateResult;
                    client.close();
                    res.send(exeResult);
                }
            )      
        }); 
    }
);
app.listen(
    APP_PORT,
    () => {console.log(`Server is listening on port ${APP_PORT}`)}
)
