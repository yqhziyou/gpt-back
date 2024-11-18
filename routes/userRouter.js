import express from 'express';
import { createUser } from '../services/userService.js'; // 修改为实际文件路径
import { getSessionIdsByUserId, findUserAndValidatePassword, getSessionBySessionIdAndUserId } from '../services/userService.js'

const userRouter = express.Router();

// POST 路由: 创建新用户
userRouter.post('/create', async (req, res) => {
    const { username, password } = req.body;

    try {
        // 调用 createUser 函数创建新用户
        const newUser = await createUser(username, password,false);

        // 返回成功响应
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: newUser,
        });
    } catch (error) {
        // 捕获错误并返回失败响应
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// 1. 获取用户的所有 sessionId
userRouter.get('/sessions/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const sessionIds = await getSessionIdsByUserId(userId);
        res.status(200).json({ sessionIds });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch session IDs' });
    }
});

// 2. get user information
userRouter.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    try {
        const result = await findUserAndValidatePassword(username, password);
        if (!result.success) {
            return res.status(401).json(result); // 用户名或密码错误
        }

        // 成功登录，可以选择在此处生成JWT或返回用户数据
        res.status(200).json(result);
    } catch (error) {
        console.error("Error during login route:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});



// 3. 根据 sessionId 和 userId 获取 session
userRouter.get('/session/:userId/:sessionId', async (req, res) => {
    const { userId, sessionId } = req.params;
    try {
        const session = await getSessionBySessionIdAndUserId(userId, sessionId);
        if (session) {
            res.status(200).json(session);
        } else {
            res.status(404).json({ error: 'Session not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

export default userRouter;