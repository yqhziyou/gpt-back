import generateAIResponse from "../services/chatService.js";
import { verifyUser } from "../modules/validate.js";
import { v4 as uuidv4 } from 'uuid'; // 用于生成随机 UUID

const messageHandler = async (userID, sessionID, userMessage, selectedModel = "gpt-4o-mini") => {
    try {
        let user = userID;
        let session = sessionID;
        let content = userMessage;
        let model = selectedModel || "gpt-4o-mini"; 

        // 验证用户并获取用户信息
        const { user: currentUser } = await verifyUser(userID); // 假设 verifyUser 返回 { user }
        const currentUserId = currentUser._id;
       
        // 如果 sessionID 为空或未定义，创建一个新 session
        if (!session) {
            session = uuidv4(); // 使用 UUID 生成随机的 sessionID
            console.log(`Generated new sessionID: ${session}`);
        }

        console.log("All information loaded");
        console.log("Send request from controllers...");
        console.log("user:",currentUserId,"session", session,"content:", content,"model", model);

        // 调用生成 AI 响应的服务
        const reply = await generateAIResponse(currentUserId, session, content, model);

        if (!reply) {
            throw new Error("No response received from AI service");
        }

        console.log("Message has been sent!");
        console.log("Reply:", reply);

        return reply;
    } catch (error) {
        console.error("MessageHandler controllers error:", error);
        throw error;
    }
};
export default messageHandler;
