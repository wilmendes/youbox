import { Schema, model, Document } from "mongoose";
import { IOwnerDocument } from "../interfaces";

const OwnerModel = new Schema({
    playlists: [{
        type: Schema.Types.ObjectId,
        ref: 'Playlist',
        required: true
    }]
});

const Owner = model<IOwnerDocument>('Owner', OwnerModel);
export default Owner;