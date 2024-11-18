import express from 'express';
import messageHandler from '../controllers/chatController.js';

const messageRouter = express.Router();

// 定义消息处理的 POST 路由
messageRouter.post('/message', async (req, res) => {
    try {
        // 从请求体中解构出所需的参数
        const { userID, sessionID, userMessage, selectedModel } = req.body;

        // 调用 messageHandler
        const response = await messageHandler(userID, sessionID, userMessage, selectedModel);

        // 返回 AI 响应给客户端
        res.status(200).json({
            success: true,
            data: response,
        });
    } catch (error) {
        console.error("Error in /message route:", error);

        // 返回错误信息给客户端
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
});

export default messageRouter;
