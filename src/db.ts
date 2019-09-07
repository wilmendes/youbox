import { MongoClient, Db } from 'mongodb'

export class DB {
    // const user = 'admin';
    // const password = 'admin';
    // const connection = `mongodb+srv://${user}:${password}@cluster0-2qspc.mongodb.net/test?retryWrites=true&w=majority`
    connection = 'mongodb://localhost:27017/youbox';
    client: MongoClient;
    db: Db;
    constructor() {
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
