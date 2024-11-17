import mongoose from 'mongoose';


const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true, unique: true },
    creationDate: { type: Date, default: Date.now },
    tokenUsage: { type: Number, default: 0 },
    modelName: { type: String, required: true },
    content: [
        {
            role: { type: String, enum: ["user", "assistant",'system'], required: true },
            content: { type: String, required: true }
        }
    ],
    emailAddress: { type: String },
    tag: { type: String, default: "manual-register" },
});


// define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    tokenLimit: { type: Number, default: 5000 },
    totalTokenUsage: { type: Number, default: 0 }
});



export const User = mongoose.model('User', userSchema);
export const Session = mongoose.model('Session', sessionSchema);


