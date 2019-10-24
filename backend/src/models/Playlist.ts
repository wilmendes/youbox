import { Schema, model } from "mongoose";
import { IPlaylistDocument } from "../interfaces";

const PlaylistModel = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    musics: [{ type: Schema.Types.String }]
});

const Playlist = model<IPlaylistDocument>('Playlist', PlaylistModel);
export default Playlist;