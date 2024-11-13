import axios from 'axios';
import { CarEntity, UserCarEntity, UserEntity, UserFriendEntity } from './types';
import { API_URL } from '../constants';

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

    static async gamageUserCar(userId: number, userCarId: number): Promise<UserCarEntity> {
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
}