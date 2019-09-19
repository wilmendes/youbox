import express from "express";
import userRouter from './routers/user';
import connect from './db/db';
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(userRouter);

app.listen(port, async () => {
    await connect();
    console.log(`Server running on port ${port}`)
})