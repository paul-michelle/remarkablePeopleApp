require('dotenv').config()

const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const fileSys = require('fs');


const MONGO_URI_LOCAL = process.env.MONGO_URI_LOCAL;
const MONGO_URI_DOCKER = process.env.MONGO_URI_DOCKER;
const MONGO_DB_NAME = 'node_mongo_docker_app';
const MONGO_USERS_COLLECTION = 'users';
const MONGO_CLIENT_OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };

const APP_PORT = 3000;

let app = express();

const crossOrigin = cors();
app.use(crossOrigin);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE", "OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

app.get(
    '/',
    (req, res) => {
        res.sendFile(path.join(__dirname, 'view/index.html'));
    }
);

app.get(
    '/profile/all',
    (req, res) => {
        MongoClient.connect(MONGO_URI_DOCKER, MONGO_CLIENT_OPTIONS, (connectionError, client) => {
            if (connectionError) throw connectionError;

            const queryFindAll = {};
            client
                .db(MONGO_DB_NAME)
                .collection(MONGO_USERS_COLLECTION)
                .find(queryFindAll)
                .toArray(
                    (queryExeError, queryResult) => {
                        if (queryExeError) throw queryExeError;
                        client.close();
                        res.send(queryResult);
                    }
                )
        });
    }
);

app.get(
    '/profile',
    (req, res) => {
        MongoClient.connect(MONGO_URI_DOCKER, MONGO_CLIENT_OPTIONS, (connectionError, client) => {
            if (connectionError) throw connectionError;

            const queryFind = { name: req.query.name };
            client
                .db(MONGO_DB_NAME)
                .collection(MONGO_USERS_COLLECTION)
                .findOne(
                    queryFind, (queryExeError, queryResult) => {
                        if (queryExeError) throw queryExeError;
                        client.close();
                        res.send(queryResult);
                    });
        });
    }
);

app.post(
    '/profile',
    (req, res) => {
        MongoClient.connect(MONGO_URI_DOCKER, MONGO_CLIENT_OPTIONS, (connectionError, client) => {
            if (connectionError) throw connectionError;

            const queryMatch = { name: req.body.name };
            const querySet = { $set: req.body };
            const updateOptions = { upsert: true };
            client
                .db(MONGO_DB_NAME)
                .collection(MONGO_USERS_COLLECTION)
                .updateOne(
                    queryMatch, querySet, updateOptions, (updateExeError, updateResult) => {
                        if (updateExeError) throw updateExeError;
                        client.close();
                        res.send(req.body);
                    }
                );
        });
    }
);

app.delete(
    '/profile',
    (req, res) => {
        MongoClient.connect(MONGO_URI_DOCKER, MONGO_CLIENT_OPTIONS, (connectionError, client) => {
            if (connectionError) throw connectionError;

            const quertMatch = { name: req.query.name };
            client
                .db(MONGO_DB_NAME)
                .collection(MONGO_USERS_COLLECTION)
                .deleteOne(
                    quertMatch, (deletionError, deletionResult) => {
                        if (deletionError) throw deletionError;
                        client.close();;
                        res.send(deletionResult);
                    }
                );
        });
    }
);



app.listen(
    APP_PORT,
    () => { console.log(`Server is listening on port ${APP_PORT}`) }
);