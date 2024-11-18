import { User, Session } from '../models/session.js';
import bcrypt from 'bcrypt';
import crypto from "crypto";

export const createUser = async (username, password, allowAnonymous = true) => {
    try {
        // 如果不允许匿名用户创建，则必须提供用户名和密码
        if (!allowAnonymous) {
            if (!username || !password) {
                throw new Error("Username and password are required for non-anonymous registration.");
            }
        }

        let tag = allowAnonymous ? "anonymous" : "registered"; // 根据用户类型设置标记

        // 如果允许匿名用户创建并且未提供用户名和密码，则生成默认匿名账户
        if (allowAnonymous && (!username || !password)) {
            username = `anon_${crypto.randomBytes(4).toString("hex")}`;
            password = await bcrypt.hash(crypto.randomBytes(8).toString("hex"), 10); // 随机生成匿名密码
        }

        // 加密密码（如果提供了密码）
        if (password && !allowAnonymous) {
            password = await bcrypt.hash(password, 10);
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



export const updateTotalTokenUsage = async(userId, tokens) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { error: 'User not found' };
        }

        user.totalTokenUsage += tokens;
        await user.save();

        return { success: true, user };
    } catch (error) {
        return { error: 'Error updating total token usage' };
    }
}

// 获取一个 userId 的所有 sessionId
export const getSessionIdsByUserId = async (userId) => {
    try {
        const sessions = await Session.find({ userId }).select('sessionId -_id');
        return sessions.map(session => session.sessionId);
    } catch (error) {
        console.error('Error fetching session IDs:', error);
        throw error;
    }
};

// get user
export const findUserAndValidatePassword = async (username, inputPassword) => {
    try {
        // 查找用户
        const user = await User.findOne({ username });
        if (!user) {
            return { success: false, message: "User not found" };
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(inputPassword, user.password);
        if (!isPasswordValid) {
            return { success: false, message: "Invalid password" };
        }

        // 返回成功信息和用户数据
        return { success: true, message: "Login successful", user };
    } catch (error) {
        console.error("Error during user authentication:", error);
        return { success: false, message: "An error occurred during authentication" };
    }
};

// 使用 sessionId 和 userId 查询一个 session
export const getSessionBySessionIdAndUserId = async (userId, sessionId ) => {
    try {
        const session = await Session.findOne({ userId, sessionId });
        return session;
    } catch (error) {
        console.error('Error fetching session:', error);
        throw error;
    }
};

