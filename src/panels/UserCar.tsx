import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, ContentCard, Group, Header, InfoRow, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Placeholder, SimpleCell, Snackbar } from '@vkontakte/vkui';
import { useParams, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { UserCarEntity, UserEntity } from '../utils/types';
import bridge from '@vkontakte/vk-bridge';
import { ApiService } from '../utils/ApiService';
import './ImageSwitcher.css';
import { DEFAULT_VIEW_PANELS } from '../routes';
import { Icon20CheckCircleFillGreen, Icon20DiamondOutline } from '@vkontakte/icons';

import photo_1_1 from '../assets/1/1.png';
import photo_1_2 from '../assets/1/2.png';
import photo_1_3 from '../assets/1/3.png';
import photo_1_4 from '../assets/1/4.png';
import photo_1_5 from '../assets/1/5.png';
import photo_1_6 from '../assets/1/6.png';
import photo_1_7 from '../assets/1/7.png';
import photo_1_8 from '../assets/1/8.png';
import photo_1_9 from '../assets/1/9.png';
import photo_1_10 from '../assets/1/10.png';

import photo_2_1 from '../assets/2/1.png';
import photo_2_2 from '../assets/2/2.png';
import photo_2_3 from '../assets/2/3.png';
import photo_2_4 from '../assets/2/4.png';
import photo_2_5 from '../assets/2/5.png';
import photo_2_6 from '../assets/2/6.png';
import photo_2_7 from '../assets/2/7.png';
import photo_2_8 from '../assets/2/8.png';
import photo_2_9 from '../assets/2/9.png';
import photo_2_10 from '../assets/2/10.png';

export interface UserCarListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

export const UserCar: FC<UserCarListProps> = ({ id, setPopout }) => {
  const [userCar, setUserCar] = useState<UserCarEntity | null>();
  const [damage, setDamage] = useState<number>(0);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentCarImgIndex, setCurrentCarImgIndex] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);

  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);

  const routeNavigator = useRouteNavigator();

  const params = useParams<'userCarId'>();
  const userCarIdStr: string | undefined = params?.userCarId;

  const getCarImageById = (carId: number, imgId: number): string => {
    const images: { [key: string]: { [key: string]: any } } = {
      1: {
        1: photo_1_1,
        2: photo_1_2,
        3: photo_1_3,
        4: photo_1_4,
        5: photo_1_5,
        6: photo_1_6,
        7: photo_1_7,
        8: photo_1_8,
        9: photo_1_9,
        10: photo_1_10,
      },
      2: {
        1: photo_2_1,
        2: photo_2_2,
        3: photo_2_3,
        4: photo_2_4,
        5: photo_2_5,
        6: photo_2_6,
        7: photo_2_7,
        8: photo_2_8,
        9: photo_2_9,
        10: photo_2_10,
      }
    }
    // const localUrl = BASE_IMG_URL + `src/assets/${carId}/${imgId}.png`;
    return images[carId][imgId];
  };

  const openSnackbar = (message?: string, icon?: ReactNode) => {
    setPopout(
      <Snackbar
        onClick={() => setPopout(null)}
        duration={2000}
        onClose={() => setPopout(null)}
        before={icon ? icon : null}
      >
        {message || 'Что-то пошло не так'}
      </Snackbar>
    );
  };

  useEffect(() => {
    setIsLoading(true);
    const getUserData = async () => {
      const { vk_user_id } = await bridge.send('VKWebAppGetLaunchParams');
      if (vk_user_id) {
        const user: UserEntity = await ApiService.getVkUserByVkId(vk_user_id);
        if (user) {
          setUserData(user);
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
      const userCar: UserCarEntity = await ApiService.getUserCar(userData.id!, Number(userCarIdStr));
      console.log('userCAAAR', userCarIdStr);
      setCurrentCarImgIndex(calculateImgIndex(1000 - (userCar?.state || 1)));
      setUserCar(userCar);
      setIsLoading(false);
    }
    getUserCar();
  }, [userData])

  const calculateImgIndex = (num: number): number => {
    return Math.min(Math.floor(num / 100) + 1, 10);
  }

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
    if ((userCar?.state || 0) <= 0) {
      setIsLoading(false);
      openSnackbar(
        `Модель ${userCar?.car?.name || 'basecar'} полностью уничтожена`,
        <Icon20CheckCircleFillGreen />
      );
      return;
    }

    // Effects
    const newXOffset = Math.random() * 10 - 5;
    const newYOffset = Math.random() * 10 - 5;
    setXOffset(newXOffset);
    setYOffset(newYOffset);
    // Logic
    setClickCount((prev) => prev + 1);
    if (clickCount >= 5) {
      setCurrentCarImgIndex(calculateImgIndex(1000 - (userCar?.state || 1)))
      setClickCount(0);
      const result: UserCarEntity = await ApiService.gamageUserCar(userData.id!, Number(userCarId || userCarIdStr));
      if (result) {
        const prev = Object.assign(userCar || {}, {});
        const damageDiff = (prev?.state || 1001) - (result?.state || 0);
        setDamage(damageDiff)
        setUserCar(result);
      }
    }
    setIsLoading(false);
  }

  const handleExchangeUserCarCreditsClick = async (userCarId: number) => {
    if (!userData?.id) {
      console.error('no userData?.id')
      return;
    }
    const result: UserCarEntity = await ApiService.exchangeUserCar(userData.id!, Number(userCarId));
    if (result) {
      routeNavigator.push(`/${DEFAULT_VIEW_PANELS.USER_CAR_LIST}`)
    }
  }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push(`/${DEFAULT_VIEW_PANELS.USER_CAR_LIST}`)} />}>
        {userCar?.car?.name}
      </PanelHeader>
      <Placeholder
        // icon={<Icon56MessageReadOutline />}
        action={
          <Group mode='plain' header={<Header mode="secondary">Техника</Header>}>
            <SimpleCell>
              <InfoRow header={"Кредиты"}>{userCar?.credits}</InfoRow>
              <InfoRow header={"Состояние"}>{userCar?.state}</InfoRow>
            </SimpleCell>
          </Group>
        }
        stretched
      >
        <div
          className={`image-container ${clickCount > 0 ? 'active' : ''}`}
          onClick={() => handleDamageUserCarClick(userCar?.id || 0)}
          style={{
            transform: `translate(${xOffset}px, ${yOffset}px) rotate(${(xOffset - yOffset) / 2}deg)`,
            transition: 'transform 0.5s ease-in-out',
            maxWidth: 500,
          }}
        >
          <img
            src={getCarImageById(userCar?.car?.id || 1, currentCarImgIndex)}
            alt={`Image ${currentCarImgIndex}`}
            className={`image ${clickCount > 0 ? 'bright' : ''}`}
          />
        </div>
        <ContentCard
          header={userCar?.car?.name}
          key={userCar?.id}
          subtitle={`Стоимость: ${userCar?.car?.price}`}
          caption={`Крайний удар по авто: ${damage}`}
          text={
            (userData?.credits || 0) > (userCar?.car?.price || 500) ? (
              <Button
                disabled={(userCar?.state || 0) <= 0}
                loading={isLoading}
                size="l"
                stretched
                style={{ marginTop: '8px' }}
                onClick={() => handleDamageUserCarClick(userCar?.id!)}
              >
                {(userCar?.state || 0) > 0 ? 'Молотить!' : 'Авто уничтожено'}
              </Button>
            ) : (
              <Button before={<Icon20DiamondOutline />} appearance='negative' loading={isLoading} size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleExchangeUserCarCreditsClick(userCar?.id!)}>
                Обменять
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

