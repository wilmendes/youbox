import { Document } from "mongoose";
import { Request } from "express";

export interface IUserDocument extends Document {
    name: string,
    email: string,
    password: string,
    tokens: any[],
    _owner?: IOwnerDocument;
    generateAuthToken: () => Promise<string>,
}

export interface IUser extends IUserDocument {
    comparePassword(password: string): boolean;
}

export interface IPlaylistDocument extends Document {
    name: string;
    musics: string[];
}

export interface IOwnerDocument extends Document {
    playlists: IPlaylistDocument[]
}

export interface IUserRequest extends Request{
    user: IUser,
    token: string
}