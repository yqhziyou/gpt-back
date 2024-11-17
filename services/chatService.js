import { Session } from "../models/session.js";
import { updateTotalTokenUsage } from './userService.js';
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is correctly set
});

const generateAIResponse = async (userId, sessionId, userMessage, aiModel="gpt-4o-mini") => {
    try {
        console.log("sessionId passed to generateAIResponse:", sessionId);

        // 1. Validate session ownership
        let session = await Session.findOne({ sessionId, userId });
        let messages = [];

        if (session) {
            // Load session history
            messages = session.content;
        } else {
            // Initialize new session without API call
            session = await Session.create({
                sessionId,
                userId,
                modelName: aiModel,
                content: [{ role: "system", content: "Session initialization." }],
                tokenUsage: 0,
            });

            messages.push({ role: "system", content: "Session initialization." });
        }

        // 2. Add user's new message to context
        messages.push({ role: "user", content: userMessage });

        // 3. Generate AI response using the updated SDK syntax
        const aiResponse = await openai.chat.completions.create({
            model: aiModel,
            messages,
            max_tokens: 500,
        });

        const responseText = aiResponse.choices[0]?.message?.content?.trim();

        if (!responseText) {
            throw new Error("AI response is empty");
        }

        // 4. Append AI response to messages
        messages.push({ role: "assistant", content: responseText });

        // 5. Update session with new content and token usage
        const totalTokens = aiResponse.usage?.total_tokens;
        if (totalTokens === undefined) {
            throw new Error("AI response does not contain usage information");
        }

        await Session.updateOne(
            { sessionId, userId },
            {
                content: messages,
                $inc: { tokenUsage: totalTokens },
            }
        );

        // 6. Update user's total token usage
        await updateTotalTokenUsage(userId, totalTokens);

        // 7. Return AI response
        console.log('AI response:', responseText);
        return responseText;
    } catch (error) {
        console.error("Error generating AI response:", error.response?.data || error.message);
        throw new Error("Failed to generate AI response. Please try again later.");
    }
};

export default generateAIResponse;
