import express from "express";
import { DB } from './db.js'

const app = express();
const bodyParser = require('body-parser');
class Server {
    db: DB;
    constructor() {
        this.db = new DB();
        app.use(bodyParser());

    }
    start() {
        app.listen(3000, () => {
            console.log('listening on 3000');
        });

        app.get('/users', async (req, res) => {
            const users = await this.db.getUsers();
            res.send(JSON.stringify(users));
        });

        app.get('/user/:id', async (req, res) => {
            const user = (await this.db.getUser(req.params.id))[0];
            if (user) {
                res.send(JSON.stringify(user));
            } else {
                res.status(404).send('not found');
            }
        });

        app.post('/user', async (req, res) => {
            var email = req.body.email;
            var password = req.body.password;
            if (!(email || password)) {
                res.status(400).send('Missing parameters');
            }
            try {
                const user = await this.db.createUser(email, password);
                console.log(user)
            } catch (e) {
                if (e.code === 11000) {
                    res.status(409).send('User already exists');
                    return;
                } else {
                    res.status(500).send(`Error creating user: ${JSON.stringify(e)}`);
                    return;
                }
            }
            res.send('user created');
        });

        app.delete('/user', async (req, res) => {
            console.log(req.body)
            var email = req.body.email;
            if (!(email)) {
                res.status(400).send('Missing parameter');
            }
            try {
                const user = await this.db.deleteUser(email);
                res.send('user deleted');
                return;
            } catch (e) {
                console.log(e);
                res.status(500).send(`Error deleting user: ${JSON.stringify(e)}`);
                return;
            }
            res.send('user deleted');
        });
    }
}

module.exports = Server;
