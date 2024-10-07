import FriendService from "./FriendService";

describe('FriendService', () => {
    it('getAllFriendsWithPoints should return an array of FriendEntity', async () => {
        const playerId = '1'; // Provide a playerId for testing
        const friends = await FriendService.getAllFriendsWithPoints(playerId);
        expect(friends).toBeInstanceOf(Array);
        expect(friends.length).toBeGreaterThan(0);
        expect(friends[0]).toHaveProperty('id');
        expect(friends[0]).toHaveProperty('name');
        // Add more specific assertions based on the structure of FriendEntity
    });

    it('getAllFriendsWithPoints should return an array of FriendEntity', async () => {
        const playerId = '1'; // Provide a playerId for testing
        const friends = await FriendService.getAllFriendsWithPoints(playerId);
        expect(friends).toBeInstanceOf(Array);
    });

    it('getTotalPointsForAllFriends should return a number', async () => {
        const playerId = '1'; // Provide a playerId for testing
        const totalPoints = await FriendService.getTotalPointsForAllFriends(playerId);
        expect(typeof totalPoints).toBe('number');
    });

    it('addPointsToFriend should return a FriendEntity', async () => {
        const playerId = '1'; // Provide a playerId for testing
        const friendId = 2; // Provide a friendId for testing
        const pointsToAdd = 10; // Provide points to add for testing
        const updatedFriend = await FriendService.addPointsToFriend(playerId, friendId, pointsToAdd);
        expect(updatedFriend).toHaveProperty('id');
        expect(updatedFriend).toHaveProperty('name');
    });

    it('getAllModifiersForPlayer should return an array of ModifierEntity', async () => {
        const playerId = '1'; // Provide a playerId for testing
        const modifiers = await FriendService.getAllModifiersForPlayer(playerId);
        expect(modifiers).toBeInstanceOf(Array);
    });
});