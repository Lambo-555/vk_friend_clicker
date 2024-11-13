import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, CardGrid, ContentCard, NavIdProps, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { CarEntity, UserCarEntity, UserEntity } from '../utils/types';
import bridge from '@vkontakte/vk-bridge';
import { ApiService } from '../utils/ApiService';
import { DEFAULT_VIEW_PANELS } from '../routes';

export interface UserCarListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

const mockUserCarList: CarEntity[] = [
  // { id: 999999999, name: 'Лага Копейка', price: 550, imageNormalUrl: '', imageDamagedUrl: '' },
];

export const UserCarList: FC<UserCarListProps> = ({ id, setPopout }) => {
  const [userCarList, setUserCarList] = useState<UserCarEntity[]>(mockUserCarList);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    setIsLoading(true);
    const getUserData = async () => {
      const { vk_user_id } = await bridge.send('VKWebAppGetLaunchParams');
      if (vk_user_id) {
        const user: UserEntity = await ApiService.getVkUserByVkId(vk_user_id);
        if (user) {
          setUserData(user);
          // TODO auto register user on Main Panel
        }
      }
      setIsLoading(false);
    }
    getUserData();
  }, [])

  useEffect(() => {
    setIsLoading(true);
    if (!userData?.id) {
      console.error('no userData?.id')
      setIsLoading(false);
      return;
    }
    const getUserCarList = async () => {
      const result: UserCarEntity[] = await ApiService.getUserCarList(userData.id!);
      setUserCarList([...mockUserCarList, ...result]);
      setIsLoading(false);
    }
    getUserCarList();
  }, [userData])

  const handleSelectUserCarClick = (userCarId: number) => {
    routeNavigator.push(`${DEFAULT_VIEW_PANELS.USER_CAR}/${userCarId}`);
  }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Ваши автомобили
      </PanelHeader>
      <CardGrid size="l" spaced>
        {userCarList.map((userCarData) => (
          <ContentCard
            header={`${userCarData?.car?.name} (${userCarData?.car?.id})`}
            key={userCarData.id}
            subtitle={`Стоимость: ${userCarData?.car?.price}`}
            src={userCarData?.car?.imageNormalUrl || "https://images.unsplash.com/photo-1603988492906-4fb0fb251cf8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80"}
            text={
              (userData?.credits || 0) > (userCarData?.car?.price || 500) ? (
                <Button loading={isLoading} size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleSelectUserCarClick(userCarData?.id!)}>
                  Перемолоть!
                </Button>
              ) : (
                <Button disabled size="l" appearance="negative" stretched style={{ marginTop: '8px' }}>
                  Невозможно выбрать
                </Button>
              )
            }
            maxHeight={250}
          />
        ))}
      </CardGrid>
    </Panel >
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

