const MongoDB = require('mongodb');
const Promise = require("bluebird");
Promise.promisifyAll(MongoDB);

class DB {
    // const user = 'admin';
    // const password = 'admin';
    // const connection = `mongodb+srv://${user}:${password}@cluster0-2qspc.mongodb.net/test?retryWrites=true&w=majority`
    constructor() {
        this.connection = 'mongodb://localhost:27017/youbox';
        this.start();
    }
    async start() {
        const MongoClient = MongoDB.MongoClient
        this.client = await MongoClient.connectAsync(this.connection, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.db = await this.client.db('youbox');
    }

    async getUsers() {
        const users = await this.db.collection('ownerUser').find().toArrayAsync();
        return users;
    }

    async getUser(email) {
        if (!email) {
            throw 'Missing parameter: id'
        }
        const user = await this.db.collection('ownerUser').find({
            email
        }).toArrayAsync();
        return user;
    }

    async createUser(email, password) {
        if (!(email || password)) {
            throw 'Missing parameter'
        }
        const user = await this.db.collection('ownerUser').insertOne({
            _id: email,
            password
        });
        return user;
    }

    async deleteUser(email) {
        await this.db.collection('ownerUser').deleteOne({
            _id: email
        });
    }
}

module.exports = DB;