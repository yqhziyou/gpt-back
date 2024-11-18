import sendMessage from './controllers/chatController.js'
import connectDB from "./config/db.js";
import express from 'express';
import messageRouter from './routes/messageRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();
app.use(express.json());
app.use('/api',messageRouter);
app.use('/api/user',userRouter)

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//test code
// const test1 = sendMessage("","","nice to meet you","");
 const test2 = sendMessage("6739fb86f4320251bd1114f1","b48480f4-ee2a-420c-a615-8a1da1abd575","yes i know i am just debugging","");
// console.log(test1,"\n","\n");
//
// const test3 = {
//     "userID": "12345",
//     "sessionID": "",
//     "userMessage": "Hello, how are you?",
//     "selectedModel": "gpt-4o-mini"
// }
