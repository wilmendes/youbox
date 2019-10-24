import mongoose from "mongoose";

// export default mongoose.connect(process.env.MONGODB_URL, {
export default async () => {
    mongoose.set('useUnifiedTopology', true);
    await mongoose.connect(process.env.MONGODB_LOCAL_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
    })
}