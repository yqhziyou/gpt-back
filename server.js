import sendMessage from './controllers/chatController.js'
import connectDB from "./config/db.js";


connectDB();

const test1 = sendMessage("","","nice to meet you","");
const test2 = sendMessage("6739fb86f4320251bd1114f1","b48480f4-ee2a-420c-a615-8a1da1abd575","yes i know i am just debugging","");
console.log(test1,"\n","\n");

