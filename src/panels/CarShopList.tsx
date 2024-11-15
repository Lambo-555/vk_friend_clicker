import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, ContentCard, Div, NavIdProps, Panel, PanelHeader, PanelHeaderBack, SimpleGrid, Snackbar, Spinner } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { CarEntity, UserCarEntity, UserEntity } from '../utils/types';
import { ApiService } from '../utils/ApiService';
import bridge from '@vkontakte/vk-bridge';
import { Icon20CheckCircleFillGreen, Icon20DiamondOutline } from '@vkontakte/icons';
import { BASE_IMG_URL } from '../constants';

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

export interface CarShopListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

export const CarShopList: FC<CarShopListProps> = ({ id, setPopout }) => {
  const [carList, setCarList] = useState<CarEntity[]>([]);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const routeNavigator = useRouteNavigator();

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
    setIsLoading(true)
    const getUserData = async () => {
      const { vk_user_id } = await bridge.send('VKWebAppGetLaunchParams');
      if (vk_user_id) {
        const user: UserEntity = await ApiService.getVkUserByVkId(vk_user_id);
        if (user) {
          setUserData(user);
          // TODO auto register user on Main Panel
        }
      }
      setIsLoading(false)
    }
    getUserData();
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const getCarShopList = async () => {
      const result: CarEntity[] = await ApiService.getCarList();
      if (result?.length) {
        setCarList(result);
      }
      setIsLoading(false)
    }
    getCarShopList();
  }, [userData])

  const handleBuyUserBuyClick = async (carId: number) => {
    setIsLoading(true)
    if (!userData?.id) {
      console.error('no userData.id');
      setIsLoading(false);
      return;
    }

    const result: UserCarEntity = await ApiService.buyUserCar(userData.id, carId);
    if (result) {
      console.log('deal success', result)
      openSnackbar(
        `Модель ${result.car?.name || 'basecar'} куплена за ${result.car?.price || 0}`,
        <Icon20CheckCircleFillGreen />
      );
      if (result?.user) setUserData(result.user);
      setIsLoading(false);
    }
  }

  return (
    <Panel id={id}>
      <PanelHeader
        before={
          <>
            <PanelHeaderBack onClick={() => routeNavigator.push('/')} />
            <Div>
              <Button
                before={<Icon20DiamondOutline />}
                mode="outline"
                appearance="positive"
                size="m"
                style={{minWidth: 75}}
              >{userData?.credits || 0}
              </Button>
            </Div>
          </>
        }>
        Свалка
      </PanelHeader>
      <SimpleGrid
        align={'stretch'}
        margin='auto'
        gap={'m'}
        columns={Math.floor(window.innerWidth / 350)}
      > {!carList.length && (
        <Spinner size="large" />
      )}
        {carList && Array.isArray(carList) && carList.map((car: CarEntity, index: number) => {
          return (
            <ContentCard
              header={`Модель: ${car?.name || 'error'}`}
              key={index}
              subtitle={`Стоимость: ${car?.price || 'error'}`}
              src={getCarImageById(car?.id || 1, 1)}

              text={
                (userData?.credits || 0) > (car?.price || 500) ? (
                  <Button loading={isLoading} size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleBuyUserBuyClick(car.id!)}>
                    Купить за {car?.price || 'error'}
                  </Button>
                ) : (
                  <Button disabled size="l" appearance="negative" stretched style={{ marginTop: '8px' }}>
                    Нет денег на хлам
                  </Button>
                )
              }
              maxHeight={250}
            />
          )
        }
        )}
      </SimpleGrid>
    </Panel >
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

