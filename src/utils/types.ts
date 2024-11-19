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

export interface Mod {
  id: number;
  effect: number;
  friends?: any[];
}

// Car Entity
export interface CarEntity {
  id?: number;
  name?: string;
  price?: number;
  imageNormalUrl?: string;
  imageDamagedUrl?: string;
}

// UserCar Entity
export interface UserCarEntity {
  id?: number;
  user?: UserEntity;
  car?: CarEntity;
  state?: number;
  credits?: number;
}

// UserFriend Entity
export interface UserFriendEntity {
  id?: number;
  mods?: Mod[];
  user?: UserEntity;
  friend?: UserEntity;
}

// User Entity
export interface UserEntity {
  id?: number;
  first_name?: string;
  last_name?: string;
  photo_200?: string;
  city?: string;
  credits?: number;
  vk_user_id?: number;
  friends?: UserFriendEntity[];
}

export interface UserToolEntity {
  id?: number;
  user?: UserEntity;
  level?: number;
  isCurrent?: boolean;
  tool?: ToolEntity;
  state?: number;
}

export interface ToolEntity {
  id?: number;
  name?: string;
  additionalDamagePerLevel?: number;
  price?: number;
  imageUrl?: string;
  userTools?: UserToolEntity[];
}