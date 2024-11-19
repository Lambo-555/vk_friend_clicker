import axios from 'axios';
import { CarEntity, ToolEntity, UserCarEntity, UserEntity, UserFriendEntity, UserToolEntity } from './types';
import { API_URL } from './constants';

export class ApiService {
    // Car API

    static async getCarList(): Promise<CarEntity[]> {
        const response = await axios.get(`${API_URL}/cars`);
        return response.data;
    };

    static async getCarById(carId: number): Promise<CarEntity> {
        const response = await axios.get(`${API_URL}/cars/${carId}`);
        return response.data;
    };

    static async getUserCarList(userId: number): Promise<UserCarEntity[]> {
        const response = await axios.get(`${API_URL}/cars/user/${userId}`);
        return response.data;
    };

    static async getUserCar(userId: number, userCarId: number): Promise<UserCarEntity> {
        const response = await axios.get(`${API_URL}/cars/user/${userId}/car/${userCarId}`);
        return response.data;
    };

    static async buyUserCar(userId: number, carId: number): Promise<UserCarEntity> {
        const response = await axios.post(`${API_URL}/cars/user/${userId}/car/${carId}`);
        return response.data;
    };

    static async removeUserCar(userId: number, userCarId: number): Promise<UserCarEntity> {
        const response = await axios.delete(`${API_URL}/cars/user/${userId}/car/${userCarId}`);
        return response.data;
    };

    static async damageUserCar(userId: number, userCarId: number): Promise<UserCarEntity> {
        const response = await axios.post(`${API_URL}/cars/user/${userId}/car/${userCarId}/damage`);
        return response.data;
    };

    static async exchangeUserCar(userId: number, userCarId: number): Promise<UserCarEntity> {
        const response = await axios.post(`${API_URL}/cars/user/${userId}/car/${userCarId}/exchange`);
        return response.data;
    };

    // User API

    static async getUserById(userId: number): Promise<UserEntity> {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        return response.data;
    };

    static async getVkUserByVkId(vkUserId: number): Promise<UserEntity> {
        const response = await axios.get(`${API_URL}/users/vk/${vkUserId}`);
        return response.data;
    };

    static async getUserFriendList(vkUserId: number): Promise<UserEntity[]> {
        const response = await axios.get(`${API_URL}/users/friends/${vkUserId}`);
        return response.data;
    };

    static async registerUser(userData: UserEntity): Promise<UserEntity> {
        const response = await axios.post(`${API_URL}/users/register`, userData);
        return response.data;
    };

    static async addFriendToUser(friendData: UserFriendEntity): Promise<UserFriendEntity> {
        const response = await axios.post(`${API_URL}/users/addFriend`, friendData);
        return response.data;
    };

    static async addInviteBonus(userId: number): Promise<UserEntity> {
        const response = await axios.get(`${API_URL}/users/addInviteBonus/${userId}`);
        return response.data;
    };


    // Tool

    static async getToolList(): Promise<ToolEntity[]> {
        const response = await axios.get(`${API_URL}/tools`);
        return response.data;
    };

    static async getTool(toolId: number): Promise<ToolEntity> {
        const response = await axios.get(`${API_URL}/tools/${toolId}`);
        return response.data;
    };

    static async getUserToolList(userId: number): Promise<UserToolEntity[]> {
        const response = await axios.get(`${API_URL}/tools/${userId}/user-tools`);
        return response.data;
    };

    static async buyUserTool(userId: number, toolId: number): Promise<UserToolEntity> {
        const response = await axios.post(`${API_URL}/tools/${userId}/buy/${toolId}`);
        return response.data;
    };

    static async removeUserTool(userId: number, userToolId: number): Promise<UserToolEntity> {
        const response = await axios.delete(`${API_URL}/tools/${userId}/user-tools/${userToolId}`);
        return response.data;
    };

    static async exchangeUserTool(userId: number, userToolId: number): Promise<UserToolEntity> {
        const response = await axios.put(`${API_URL}/tools/${userId}/user-tools/${userToolId}/exchange`);
        return response.data;
    };

    static async getUpgradeUserToolPrice(userToolId: number): Promise<number> {
        const response = await axios.get(`${API_URL}/user-tools/${userToolId}/upgrade-price`);
        return response.data;
    };

    static async upgradeUserTool(userToolId: number): Promise<UserToolEntity> {
        const response = await axios.put(`${API_URL}/tools/user-tools/${userToolId}/upgrade`);
        return response.data;
    };

    static async selectUserTool(userToolId: number): Promise<UserToolEntity> {
        const response = await axios.put(`${API_URL}/tools/user-tools/${userToolId}/select`);
        return response.data;
    };
}