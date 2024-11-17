import { User } from '../models/session.js';

export async function updateTotalTokenUsage(userId, tokens) {
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
