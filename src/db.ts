import { MongoClient, Db } from 'mongodb'

export class DB {
    user = 'admin';
    password = 'y0u80x';
    connection = `mongodb://${this.user}:${this.password}@ds135441.mlab.com:35441/youbox`
    // connection = 'mongodb://localhost:27017/youbox';
    client: MongoClient;
    db: Db;
    constructor() {
        console.log('test');
        this.start();
    }
    async start() {
        this.client = await MongoClient.connect(this.connection, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.db = await this.client.db('youbox');
    }

    async getUsers() {
        const users = await this.db.collection('ownerUser').find().toArray();
        return users;
    }

    async getUser(email: string) {
        if (!email) {
            throw 'Missing parameter: id'
        }
        const user = await this.db.collection('ownerUser').find({
            email
        }).toArray();
        return user;
    }

    async createUser(email: string, password: string) {
        if (!(email || password)) {
            throw 'Missing parameter'
        }
        const user = await this.db.collection('ownerUser').insertOne({
            _id: email,
            password
        });
        return user;
    }

    async deleteUser(email: string) {
        await this.db.collection('ownerUser').deleteOne({
            _id: email
        });
    }
}
