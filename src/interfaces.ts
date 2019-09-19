import { Document } from "mongoose";
import { Request } from "express";

export interface IUserDocument extends Document {
    name: string,
    email: string,
    password: string,
    tokens: any[],
    generateAuthToken: () => Promise<string>,
}

export interface IUser extends IUserDocument {
    comparePassword(password: string): boolean;
}

export interface IUserRequest extends Request{
    user: IUser,
    token: string
}