// *****
// verifyUser: Verifies if a user exists by userID. If not provided or not found, creates a new user.
// Returns an object with `isAnonymous` (true for new users) and the `user` object.
//********
//// createUser: Creates a new user with optional username and password.
// // If not provided, generates a random username and hashed password.
import { User } from "../models/session.js";
import { createUser} from "../services/userService.js";


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

