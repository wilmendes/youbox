import { Router } from "express";
import { IUserRequest, IUser } from "../interfaces";
import populateUser from "../utils/populateUser";
import Playlist from "../models/Playlist";
import auth from "../middleware/auth";
import { Response } from "express-serve-static-core";
import Owner from "../models/Owner";

const router = Router();

router.post('/playlists', auth, async (req: IUserRequest, res) => {
    const owner = await ensureOwner(req.user, res);
    try {
        const name = req.body.name;
        if (!name) {
            throw new Error('Missing parameter: "name"');
        }
        const playlist = new Playlist({ musics: [], name: name });
        owner.playlists.push(playlist._id);
        await playlist.save();
        await owner.save();
        res.status(200).send();
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/playlists', auth, async (req: IUserRequest, res) => {
    const owner = await ensureOwner(req.user, res);
    try {
        const name = req.body.name;
        if (!name) {
            throw new Error('Missing parameter: "name"');
        }
        const playlist = await Playlist.findOne({ name });
        owner.playlists.splice(owner.playlists.indexOf(playlist._id));
        await owner.save();
        await playlist.remove();
        res.status(200).send();
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/playlists', auth, async (req: IUserRequest, res) => {
    const owner = await ensureOwner(req.user, res);
    try {
        await Owner.populate(owner, {
            path: 'playlists',
            model: 'Playlist'
        })
        res.status(200).send(owner.playlists);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/playlists/music', auth, async (req: IUserRequest, res) => {
    const owner = await ensureOwner(req.user, res);

    try {
        if (!(req.body.url && req.body.playlist)) {
            throw new Error('Missing parameters');
        }
        const playlist = await Playlist.findOne({ name: req.body.playlist })
        if (owner.playlists.indexOf(playlist._id) === -1) {
            res.status(404).send();
        }
        playlist.musics.push(req.body.url);

        console.log(req.body.url, playlist.musics);
        await playlist.save();
        res.status(200).send(owner.playlists);
    } catch (e) {
        console.log(e)
        res.status(400).send(e);
    }
});

async function ensureOwner(user: IUser, res: Response) {
    if (!user._owner) {
        res.status(403).send();
        return;
    }
    return (await populateUser(user))._owner;
}

export default router;