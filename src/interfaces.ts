import { Document } from "mongoose";

export interface IUserDocument extends Document {
    name: string,
    email: string,
    password: string,
    tokens: any[],
    generateAuthToken: () => Promise<string>,
}