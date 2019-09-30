import { SchemaTypeOpts, Schema, model, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserDocument, IUser } from '../interfaces';

interface IUserModel extends Model<IUser> {
    findByCredentials: (email: string, password: string) => IUser;
}

const userSchema = new Schema<IUserDocument>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value: any) => {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email address');
            }
        }
    } as SchemaTypeOpts<any>,
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    _owner: {
        type: Schema.Types.ObjectId,
        ref: 'Owner'
    }
});

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this as IUserDocument;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async (email: string, password: string) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid login credentials');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials');
    }
    return user
}

const User: IUserModel = model<IUser, IUserModel>('User', userSchema);

export default User