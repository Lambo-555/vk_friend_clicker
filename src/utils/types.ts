export interface FriendEntity {
    id: number;
    points: number;
    friends: FriendEntity[];
    modifiers: ModifierEntity[];
}

export interface ModifierEntity {
    id: number;
    name: string;
    coefficient: number;
    friends: FriendEntity[];
}