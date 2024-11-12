import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, ContentCard, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useParams, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { UserCarEntity, UserEntity } from '../utils/types';
import bridge from '@vkontakte/vk-bridge';
import { ApiService } from '../utils/ApiService';

export interface UserCarListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

const mockUserCar: UserCarEntity = {
  id: 999999999,
  state: 1001,
  credits: 0,
  car: {
    id: 999999999,
    name: 'Грузится...',
    price: 0,
    imageNormalUrl: '',
    imageDamagedUrl: '',
  }
};

export const UserCar: FC<UserCarListProps> = ({ id, setPopout }) => {
  const [userCar, setUserCar] = useState<UserCarEntity | null>(mockUserCar);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const routeNavigator = useRouteNavigator();

  const params = useParams<'userCarId'>();
  const userCarIdStr: string | undefined = params?.userCarId;

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
    if (!userCarIdStr) {
      console.error('no react url param userCarId')
      setIsLoading(false);
      return;
    }
    const getUserCar = async () => {
      const result: UserCarEntity = await ApiService.getUserCar(userData.id!, Number(userCarIdStr));
      setUserCar(result);
      setIsLoading(false);
    }
    getUserCar();
  }, [])

  const handleDamageUserCarClick = async (userCarId: number) => {
    setIsLoading(true);

    if (!userData?.id) {
      console.error('no userData?.id')
      setIsLoading(false);
      return;
    }
    if (!userCarIdStr || !userCarId) {
      console.error('no react url param userCarId')
      setIsLoading(false);
      return;
    }
    const result: UserCarEntity = await ApiService.gamageUserCar(userData.id!, Number(userCarId || userCarIdStr));
    if (result) {
      const prev = Object.assign(userCar || {}, {});
      const damageDiff = (prev?.state || 1001) - (result?.state || 0);
      setUserCar(result);
    }

    setIsLoading(false);
  }

  // TODO вывод очков

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        {userCar?.car?.name}
      </PanelHeader>
      <Placeholder
        // icon={<Icon56MessageReadOutline />}
        action={
          <Button size="m" mode="tertiary">
            Показать все сообщения
          </Button>
        }
        stretched
      >
        <ContentCard
          header={userCar?.car?.name}
          key={userCar?.id}
          subtitle={`Стоимость: ${userCar?.car?.price}`}
          src={userCar?.car?.imageNormalUrl || "https://images.unsplash.com/photo-1603988492906-4fb0fb251cf8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80"}
          text={
            (userData?.credits || 0) > (userCar?.car?.price || 500) ? (
              <Button loading={isLoading} size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleDamageUserCarClick(userCar?.id!)}>
                Перемолоть!
              </Button>
            ) : (
              <Button disabled size="l" appearance="negative" stretched style={{ marginTop: '8px' }}>
                Невозможно взаимодействовать
              </Button>
            )
          }
          maxHeight={250}
        />
      </Placeholder>

      {/* 
      <Placeholder
        icon={<Icon56MessageReadOutline />}
        action={
          <Button size="m" mode="tertiary">
            Показать все сообщения
          </Button>
        }
        stretched
      >
        Нет непрочитанных
        <br />
        сообщений
      </Placeholder> */}

      {/* <CardGrid size="l" spaced>
        <ContentCard
          header={userCar.brand + ' ' + userCar.model}
          key={userCar.id}
          src="https://images.unsplash.com/photo-1603988492906-4fb0fb251cf8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80"
          text={
            <Button size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleUserCarClick(userCar.id)}>
              Выбрать
            </Button>
          }
          maxHeight={250}
        ></ContentCard>
      </CardGrid> */}
    </Panel >
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

