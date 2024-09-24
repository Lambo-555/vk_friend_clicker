import { FC, ReactNode, useEffect, useState } from 'react';
import {
  Panel,
  PanelHeader,
  Header,
  Button,
  Group,
  Cell,
  Div,
  Avatar,
  NavIdProps,
  List,
  ScreenSpinner,
} from '@vkontakte/vkui';
import bridge, { UserGetFriendsFriend, UserInfo } from '@vkontakte/vk-bridge';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export interface HomeProps extends NavIdProps {
  // fetchedUser?: UserInfo;
  // fetchFriends?: { users: UserGetFriendsFriend[] };
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
  setUserId: React.Dispatch<React.SetStateAction<ReactNode>>,
}

export const Home: FC<HomeProps> = ({ id, setPopout, setUserId }) => {
  const [fetchedUsers, setFetchedUsers] = useState<UserInfo[]>([]);
  const [fetchedPoints, setFetchedPoints] = useState<{ [key: number]: number }>({});
  const routeNavigator = useRouteNavigator();

  const getStorageFriendIds = async (): Promise<number[]> => {
    try {
      const data: { keys: { key: string; value: string; }[]; } = await bridge.send('VKWebAppStorageGet', {
        keys: ['friendList'],
      });
      const ids = JSON.parse(data?.keys?.[0]?.value) || [];
      return ids;
    } catch (error) {
      console.error(error);
    }
    return [];
  }

  const getStorageFriendPoint = async (id: number): Promise<number> => {
    try {
      const data: { keys: { key: string; value: string; }[]; } = await bridge.send('VKWebAppStorageGet', {
        keys: [id.toString()],
      });
      const points = data.keys[0].value;
      if (points) {
        return +points;
      }
    } catch (error) {
      console.error(error);
    }
    return 0;
  }

  const addStorageFriendIds = async (idsToAdd: number[]): Promise<number[]> => {
    try {
      const data: { keys: { key: string; value: string; }[]; } = await bridge.send('VKWebAppStorageGet', {
        keys: ['friendList'],
      });
      const existedIds = JSON.parse(data?.keys?.[0]?.value) || [];
      const idsToSave: number[] = Array.from(new Set([...existedIds, ...idsToAdd]));
      const update: { result: boolean } = await bridge.send('VKWebAppStorageSet', {
        key: 'friendList',
        value: JSON.stringify(idsToSave),
      });
      return idsToSave;
    } catch (error) {
      console.error(error);
    }
    return [];
  }

  const deleteStorageFriendIds = async (idsToRemove: number[]): Promise<number[]> => {
    try {
      const data: { keys: { key: string; value: string; }[]; } = await bridge.send('VKWebAppStorageGet', {
        keys: ['friendList'],
      });
      const existedIds: number[] = JSON.parse(data?.keys?.[0]?.value) || [];
      const idsToSave = existedIds.filter(item => !idsToRemove.includes(item));
      const update: { result: boolean } = await bridge.send('VKWebAppStorageSet', {
        key: 'friendList',
        value: JSON.stringify(idsToSave),
      });
      return idsToSave;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const vkGetUsers = async (ids: number[]): Promise<UserInfo[]> => {
    try {
      if (!ids.length) {
        return [];
      }

      if (ids.length === 1) {
        const user: UserInfo = await bridge.send('VKWebAppGetUserInfo', { user_ids: ids.join(',') });
        return [user];
      } else {
        const users: { result: UserInfo[] } = await bridge.send('VKWebAppGetUserInfo', { user_ids: ids.join(',') });
        return users.result;
      }
    } catch (error) {
      console.error(error);
    }
    return [];
  }

  const handleChooseFriend = async (): Promise<void> => {
    try {
      const userListData: { users: UserGetFriendsFriend[] } = await bridge.send('VKWebAppGetFriends', { multi: true });
      if (!userListData) return;
      const ids = userListData.users.map(item => item.id);
      await addStorageFriendIds(ids);
      const users: UserInfo[] = await vkGetUsers(ids);
      if (!users?.length) return;
      setFetchedUsers(fetchedUsers.concat(users));
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteUser = async (id: number): Promise<void> => {
    await deleteStorageFriendIds([id]);
    setFetchedUsers(fetchedUsers.filter(item => item.id !== id))
  }

  // EXAMPLE
  // useEffect(() => {
  // getStorageFriendIds();
  // addStorageFriendIds([4790524]);
  // deleteStorageFriendIds([827631882]);
  // vkGetUsers([4790523, 827631882, 43658183]);
  // }, [])

  useEffect(() => {
    const loadUsers = async () => {
      const ids: number[] = await getStorageFriendIds();
      if (!ids.length) return;

      const users: UserInfo[] = await vkGetUsers(ids);
      if (!users.length) return;

      for await (const idOfUser of ids) {
        const points = await getStorageFriendPoint(idOfUser);
        setFetchedPoints(prev => {
          prev[idOfUser] = points
          return prev;
        })
        console.log(idOfUser, points, fetchedPoints);
      }

      setFetchedUsers(users);
    }

    loadUsers();
  }, []);

  return (
    <Panel id={id}>
      <PanelHeader>TAP-HYPER</PanelHeader>
      <Group header={<Header mode="secondary">Кого будем нещадно тапать?</Header>}>
        <Div>
          {/* <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.push('persik')}>
            Выбрать друга!
          </Button> */}

          <Button stretched size="l" mode="secondary" onClick={() => handleChooseFriend()}>
            Добавить друга!
          </Button>
        </Div>
      </Group>

      <List>
        {fetchedUsers?.map(user => (
          <Cell
            key={user.id}
            mode="removable"
            onRemove={() => handleDeleteUser(user.id)}
            before={user.photo_200 && <Avatar src={user.photo_200} />}
            subtitle={user?.city?.title}
            indicator={fetchedPoints[user.id] || 0}
            onClick={() => {
              setUserId(user.id);
              routeNavigator.push('person');
            }}
          >
            {`${user.first_name} ${user.last_name}`}
          </Cell>
        ))}
      </List>
    </Panel>
  );
};
