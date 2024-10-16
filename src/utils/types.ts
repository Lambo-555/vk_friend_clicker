export interface RegisterUserDto {
    id?: number;
    vk_user_id: number;
    first_name: string;
    last_name: string;
    photo_200: string;
    city: string;
    taps?: number;
}

export interface FriendAddDto {
    vkId: number;
    friendVkId: number;
}

export interface TapUserFriendDto {
    vkId: number;
    friendVkId: number;
}

export interface AddModToFriendDto {
    effect: number;
    friendVkId: number;
}