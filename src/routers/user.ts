import { Router } from "express";
import User from "../models/User";
import auth from "../middleware/auth";
import { IUserRequest } from "../interfaces";

const router = Router()

router.post('/users', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        try {
            await user.save();
        } catch (e) {
            console.log(e);
        }
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/login', async (req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
        }
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

});

router.get('/users/me', auth, async (req: IUserRequest, res) => {
    res.send(req.user);
});

router.post('/users/me/logout', auth, async (req: IUserRequest, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
});

router.post('/users/me/logoutall', auth, async (req: IUserRequest, res) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length)
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
});

router.delete('/users/me', auth, async (req: IUserRequest, res) => {
    try {
        await req.user.remove();
        res.send();
    } catch (error) {
        res.status(500).send(error)
    }
});

export default router;