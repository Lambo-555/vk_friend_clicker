import axios from 'axios';
import { FriendEntity, ModifierEntity } from './types';

const API_URL = 'http://localhost:3000'; // Update with your API URL

class FriendService {
    static async getAllFriendsWithPoints(playerId: string): Promise<FriendEntity[]> {
        const response = await axios.get(`${API_URL}/friends/${playerId}`);
        return response.data;
    }

    static async getTotalPointsForAllFriends(playerId: string): Promise<number> {
        const response = await axios.get(`${API_URL}/friends/${playerId}/totalPoints`);
        return response.data;
    }

    static async addPointsToFriend(playerId: string, friendId: number, pointsToAdd: number): Promise<FriendEntity> {
        const response = await axios.post(`${API_URL}/friends/${playerId}/addPoints`, { friendId, pointsToAdd });
        return response.data;
    }

    static async getAllModifiersForPlayer(playerId: string): Promise<ModifierEntity[]> {
        const response = await axios.get(`${API_URL}/friends/${playerId}/modifiers`);
        return response.data;
    }
}

export default FriendService;