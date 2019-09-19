import User from "../models/User"
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { IUserRequest } from "../interfaces"

const auth = async(req: IUserRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, process.env.JWT_KEY);
    try {
        const user = await User.findOne({ _id: (data as any)._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user;
        req.token = token;
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }

}
export default auth