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
} from '@vkontakte/vkui';
import bridge, { UserGetFriendsFriend, UserInfo } from '@vkontakte/vk-bridge';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import FriendService from '../utils/FriendService';
import { RegisterUserDto } from '../utils/types';

export interface HomeProps extends NavIdProps {
  // fetchedUser?: UserInfo;
  // fetchFriends?: { users: UserGetFriendsFriend[] };
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
  setUserId: React.Dispatch<React.SetStateAction<number | null>>,
}

export const Home: FC<HomeProps> = ({ id, setUserId }) => {
  const [friendList, setFriendList] = useState<RegisterUserDto[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    const getVkUser = async () => {
      const { vk_user_id } = await bridge.send('VKWebAppGetLaunchParams');
      if (vk_user_id) {
        setCurrentUserId(vk_user_id);
        getUserFriendList(vk_user_id);
        let vkUser = await FriendService.getUser(vk_user_id);
        if (!vkUser) {
          // @ts-ignore
          const user: UserInfo = await bridge.send('VKWebAppGetUserInfo', { user_ids: vk_user_id.toString() });

          if (user) {
            vkUser = await FriendService.registerUser({
              first_name: user.first_name,
              last_name: user.last_name,
              photo_200: user.photo_200,
              vk_user_id: user.id,
              city: user?.city?.title || 'Город', 
            });
          }
        }
      }
    }

    const getUserFriendList = async (vk_user_id: number) => {
      const getVkUserFriends = await FriendService.getFriendList(vk_user_id);
      console.log('getVkUserFriends:::', getVkUserFriends);
      setFriendList(getVkUserFriends);
    }

    getVkUser();
  }, [])

  const vkGetUsers = async (ids: number[]): Promise<RegisterUserDto[]> => {
    try {
      if (!ids.length) {
        return [];
      }

      if (ids.length === 1) {
        const dbUser = await FriendService.getUser(ids[0]);
        if (dbUser) {
          return [dbUser];
        }

        // @ts-ignore
        const user: UserInfo = await bridge.send('VKWebAppGetUserInfo', { user_ids: ids.join(',') });
        if (user) {
          const registerUser = await FriendService.registerUser({
            first_name: user.first_name,
            last_name: user.last_name,
            photo_200: user.photo_200,
            vk_user_id: user.id,
            city: user?.city?.title || 'Город',
          });
          return [registerUser];
        }
      }

      if (ids.length) {
        // смотрим кто зареган а кто нет, тащим данные из базы
        const dbUserList = [];

        // если в базе такого айди нет, то составляем список на регистрацию
        const nonDbUserList = [];

        for (let id of ids) {
          const dbUser = await FriendService.getUser(id);
          if (dbUser) {
            dbUserList.push(dbUser);
          } else {
            nonDbUserList.push(id)
          }
        }

        if (nonDbUserList.length) {
          // @ts-ignore
          const users: { result: UserInfo[] } = await bridge.send('VKWebAppGetUserInfo', { user_ids: nonDbUserList.join(',') });
          console.log('VK request users', users);
          // регистрация тех, кого пока нет в базе
          for (let user of users?.result) {
            const registerUser = await FriendService.registerUser({
              first_name: user.first_name,
              last_name: user.last_name,
              photo_200: user.photo_200,
              vk_user_id: user.id,
              city: user?.city?.title || 'Город',
            });
            dbUserList.push(registerUser);
          }

          return dbUserList;
        }
      }

    } catch (error) {
      console.error(error);
    }

    return [];
  }

  const handleChooseFriend = async (): Promise<void> => {
    try {
      const data: { users: UserGetFriendsFriend[] } = await bridge.send('VKWebAppGetFriends', { multi: true });
      if (!data) return;
      if (!currentUserId) return;

      const usersToShow: RegisterUserDto[] = [];
      for (let vkFriend of data.users) {
        let userDb = await FriendService.getVkUser(vkFriend.id);
        if (!userDb) {
          userDb = await FriendService.registerUser({
            first_name: vkFriend.first_name,
            last_name: vkFriend.last_name,
            photo_200: vkFriend.photo_200,
            vk_user_id: vkFriend.id,
            city: 'city',
          });
        }

        if (userDb?.id) {
          usersToShow.push(userDb);
          const result = await FriendService.addFriend({
            vkId: currentUserId,
            friendVkId: userDb.vk_user_id,
          });
          if (!result) {
            console.error('friend not added');
          }
        }
      }
      setFriendList(prev => [...prev, ...usersToShow]);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteUser = async (id: number): Promise<void> => { }

  // EXAMPLE
  // useEffect(() => {
  // getStorageFriendIds();
  // addStorageFriendIds([4790524]);
  // deleteStorageFriendIds([827631882]);
  // vkGetUsers([4790523, 827631882, 43658183]);
  // }, [])

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
        {friendList?.map(user => (
          <Cell
            key={user.id}
            mode="removable"
            onRemove={() => handleDeleteUser(user.vk_user_id)}
            before={user.photo_200 && <Avatar src={user.photo_200} />}
            // subtitle={user?.city}
            // indicator={user.taps}
            onClick={() => {
              setUserId(user.vk_user_id);
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
