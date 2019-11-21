import { Schema, model } from "mongoose";
import { IPlaylistDocument } from "../interfaces";

const PlaylistModel = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    musics: [{
        name: String,
        url: String,
        votes: Number
    }]
});

const Playlist = model<IPlaylistDocument>('Playlist', PlaylistModel);
export default Playlist;