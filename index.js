const express = require('express');
const app = express();
const Promise = require("bluebird");
const MongoDB = require('mongodb');
Promise.promisifyAll(MongoDB);
app.listen(3000, function () {
    console.log('listening on 3000');
});

app.get('/', function (req, res) {
    res.send('Hello World 2')
})

async function start(){
    const MongoClient = MongoDB.MongoClient
    const client = await  MongoClient.connectAsync('mongodb://localhost:27017/youbox');
    const db = client.db('youbox');
    db.collection('ownerUser').find().toArray((err, result) => {
        console.log(result)
    });

}

start();