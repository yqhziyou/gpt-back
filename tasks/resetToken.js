import schedule from 'node-schedule';
import User from '../models/session.js'; // 引入用户模型

// 定时任务函数
const scheduleRefreshTokenLimit = () => {
    schedule.scheduleJob('0 0 * * *', async () => {
        console.log('Refreshing tokenLimit...');
        try {
            await User.updateMany({}, { tokenLimit: 5000 });
            console.log('Token limit refreshed successfully.');
        } catch (error) {
            console.error('Error refreshing token limit:', error);
        }
    });
};

export default scheduleRefreshTokenLimit;
