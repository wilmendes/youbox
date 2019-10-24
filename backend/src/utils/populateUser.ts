import { IUser } from "../interfaces";
import User from "../models/User";

export default async function populateUser(user: IUser) {
    const populated = await User.populate(user, {
        path: '_owner',
        model: 'Owner'
    });
    return populated as IUser;
}