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
}

export const Home: FC<HomeProps> = ({ id }) => {
  const [friendList, setFriendList] = useState<RegisterUserDto[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    const getVkUser = async () => {
      const { vk_user_id } = await bridge.send('VKWebAppGetLaunchParams');
      console.log('vk_user_idvk_user_idvk_user_id:::', vk_user_id);
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
      setFriendList(getVkUserFriends);
    }

    getVkUser();
  }, [])

  const handleChooseFriend = async (): Promise<void> => {
    try {
      const data: { users: UserGetFriendsFriend[] } = await bridge.send('VKWebAppGetFriends', { multi: true });
      if (data) {
        if (currentUserId) {
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
                vkId: currentUserId!,
                friendVkId: userDb.vk_user_id,
              });
              if (!result) {
                console.error('friend not added');
              }
            }
          }
          setFriendList(prev => [...prev, ...usersToShow]);
        }
      }
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
        {friendList?.map((user: RegisterUserDto) => (
          <Cell
            key={user.id}
            // mode="removable"
            onRemove={() => handleDeleteUser(user.vk_user_id)}
            before={user.photo_200 && <Avatar src={user.photo_200} />}
            // subtitle={user?.city}
            indicator={user?.taps || 0}
            onClick={() => {
              routeNavigator.push(`person/${user.vk_user_id}`);
            }}
          >
            {`${user.first_name} ${user.last_name}`}
          </Cell>
        ))}
      </List>
    </Panel>
  );
};
