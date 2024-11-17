// *****
// verifyUser: Verifies if a user exists by userID. If not provided or not found, creates a new user.
// Returns an object with `isAnonymous` (true for new users) and the `user` object.
//********
//// createUser: Creates a new user with optional username and password.
// // If not provided, generates a random username and hashed password.
import { User } from "../models/session.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

// 验证用户函数
export const verifyUser = async (userID) => {
    try {
        if (!userID) {
            // 如果没有传入 userID，则创建一个新用户
            const newUser = await createUser();
            return { isAnonymous: true, user: newUser }; // 
        }

        const user = await findUserInDatabase(userID);
        if (!user) {
            throw new Error("User not found");
        }

        return { isAnonymous: false, user };
    } catch (error) {
        // 捕获业务逻辑中的异常
        console.error(`[verifyUser Error]: ${error.message}`);
        throw new Error(`Verification failed: ${error.message}`);
    }
};

// 在数据库中查找用户
const findUserInDatabase = async (userID) => {
        try {
            console.log(`[findUserInDatabase] Searching for userID: ${userID}`);
            const user = await User.findById(userID);
            console.log(`[findUserInDatabase] Found user: ${user}`);
            return user;
        } catch (error) {
            console.error(`[findUserInDatabase Error]: ${error.message}`);
            throw new Error(`Database query failed: ${error.message}`);
        }
};

// 创建新用户
export const createUser = async (username, password) => {
    let tag = ""; // 默认空值

    try {
        // 自动生成用户名
        if (!username) {
            tag = "auto-register";
            username = `user_${crypto.randomBytes(4).toString("hex")}`;
        }

        // 自动生成密码并加密
        if (!password) {
            const randomPassword = crypto.randomBytes(8).toString("hex");
            password = await bcrypt.hash(randomPassword, 10);
        }

        // 创建新用户
        const newUser = await User.create({
            username,
            password,
            tag,
        });

        return newUser; // 返回新创建的用户
    } catch (error) {
        // 捕获用户创建失败的错误
        console.error(`[createUser Error]: ${error.message}`);
        throw new Error(`User creation failed: ${error.message}`);
    }
};


