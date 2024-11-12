import axios from 'axios';
import { AddModToFriendDto, FriendAddDto, Mod, RegisterUserDto, TapUserFriendDto } from './types';

const API_URL = 'http://localhost:3000'; // Update with your API URL

class FriendService {
    static async getUser(userId: number): Promise<RegisterUserDto> {
        const response = await axios.get(`${API_URL}/friends/user/${userId}`);
        return response.data;
    }

    static async getVkUser(vkUserId: number): Promise<RegisterUserDto> {
        const response = await axios.get(`${API_URL}/friends/vk/${vkUserId}`); 
        return response.data;
    }

    static async getFriendList(userId: number) { 
        try {
            const response = await axios.get(`${API_URL}/friends/friendList/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching friend list:', error);
        }
    };

    static async registerUser(data: RegisterUserDto) {
        try {
            const response = await axios.post(`${API_URL}/friends/register`, data);
            return response.data;
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    static async addFriend(data: FriendAddDto) {
        try {
            const response = await axios.post(`${API_URL}/friends/add`, data);
            return response.data;
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    static async tapUserFriend(data: TapUserFriendDto) {
        try {
            const response = await axios.post(`${API_URL}/friends/tap`, data);
            return response.data;
        } catch (error) {
            console.error('Error tapping user friend:', error);
        }
    };

    static async addModToFriend(data: AddModToFriendDto): Promise<Mod[] | undefined> {
        try {
            const response = await axios.post(`${API_URL}/friends/addMod`, data);
            return response.data;
        } catch (error) {
            console.error('Error adding mod to friend:', error);
        }
    };
}

export default FriendService;