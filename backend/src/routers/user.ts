import { Router } from "express";
import User from "../models/User";
import auth from "../middleware/auth";
import { IUserRequest } from "../interfaces";
import Owner from "../models/Owner";
import populateUser from "../utils/populateUser"

const router = Router();

router.post('/users', async (req, res) => {
    // Create a new user
    try {
        const owner = req.body.isOwner ? new Owner({
            playlists: []
        }) : undefined
        const params = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            _owner: owner && owner._id
        }
        console.log(req.body)
        const user = new User(params);
        await user.save();
        if (owner) {
            await owner.save();
        }
        const token = await user.generateAuthToken();
        console.log(user, token)
        res.status(201).send({ user, token });
    } catch (error) {
        console.log("Error creating user: ", error)
        res.status(400).send(error);
    }
})

router.post('/users/login', async (req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' });
        }
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/users/me', auth, async (req: IUserRequest, res) => {
    const populated = await User.populate(req.user, {
        path: '_owner',
        model: 'Owner'
    });
    res.send(populated);
});

router.post('/users/me/logout', auth, async (req: IUserRequest, res) => {
    try {
        console.log('Logout: ', req.body)
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })
        await req.user.save();
        res.status(200).send({});
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.toString()});
    }
});

router.post('/users/me/logoutall', auth, async (req: IUserRequest, res) => {
    try {
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/users/me', auth, async (req: IUserRequest, res) => {
    try {
        const popUser = await populateUser(req.user);
        await popUser._owner.remove();
        await popUser.remove();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;