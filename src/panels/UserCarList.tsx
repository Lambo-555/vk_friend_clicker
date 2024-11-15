import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, ButtonGroup, ContentCard, Div, Group, Header, NavIdProps, Panel, PanelHeader, PanelHeaderBack, SimpleGrid, Snackbar } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { UserCarEntity, UserEntity } from '../utils/types';
import bridge from '@vkontakte/vk-bridge';
import { ApiService } from '../utils/ApiService';
import { DEFAULT_VIEW_PANELS } from '../routes';
import { Icon28ShoppingCartOutline, Icon20DiamondOutline, Icon24HammerOutline } from '@vkontakte/icons';

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

export const UserCarList: FC<UserCarListProps> = ({ id, setPopout }) => {
  const [userCarList, setUserCarList] = useState<UserCarEntity[]>([]);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const routeNavigator = useRouteNavigator();
  console.log('routeNavigator', routeNavigator);
  const handleGoToCarShop = async () => {
    await routeNavigator.push(`/${DEFAULT_VIEW_PANELS.CAR_SHOP_LIST}`)
  };

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

  const calculateImgIndex = (num: number): number => {
    return Math.min(Math.floor(num / 100) + 1, 10);
  }

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
    const getUserCarList = async () => {
      const result: UserCarEntity[] = await ApiService.getUserCarList(userData.id!);
      console.log('result', result);
      setUserCarList(result);
      setIsLoading(false);
    }
    getUserCarList();
  }, [userData])

  const handleSelectUserCarClick = (userCarId: number) => {
    routeNavigator.push(`/${DEFAULT_VIEW_PANELS.USER_CAR_LIST}/${userCarId}`);
  }

  const handleExchangeUserCarCreditsClick = async (userCarId: number) => {
    if (!userData?.id) {
      console.error('no userData?.id')
      return;
    }
    const result: UserCarEntity = await ApiService.exchangeUserCar(userData.id!, Number(userCarId));
    if (result) {
      if (result?.user) setUserData(result.user);
      setUserCarList(
        userCarList.filter(item => item.id !== userCarId)
      )
      openSnackbar(
        `Осколки модели "${result.car?.name || 'basecar'}" проданы за ${result.credits || 0}`,
        <Icon20DiamondOutline fill="var(--vkui--color_icon_positive)" />
      )
    }
  }

  return (
    <Panel id={id}>
      <PanelHeader
        before={
          <>
            <PanelHeaderBack onClick={() => routeNavigator.push(`/${DEFAULT_VIEW_PANELS.MAIN_SCREEN}`)} />
            <Div>
              <Button
                before={<Icon20DiamondOutline />}
                mode="outline"
                appearance="positive"
                size="m"
                style={{ minWidth: 75 }}
              >{userData?.credits || 0}
              </Button>
            </Div>
          </>
        }>
        Ваш гараж
      </PanelHeader>
      {!userCarList?.length && (
        <Div>
          <Group mode='card' header={<Header mode="secondary">Ваш гараж пуст</Header>}>
            <Button
              before={<Icon28ShoppingCartOutline />}
              size="l"
              appearance="positive"
              stretched
              onClick={handleGoToCarShop}
            >
              К покупкам!
            </Button>
          </Group>
        </Div>
      )}
      <SimpleGrid
        align={'stretch'}
        margin='auto'
        gap={'m'}
        columns={Math.floor(window.innerWidth / 350)}
      >
        {userCarList?.map((userCarData) => {
          const imgIdx = calculateImgIndex(1000 - (userCarData?.state || 1));
          return (
            <ContentCard
              maxHeight={250}
              header={
                <ContentCard
                  header={`Авто: ${userCarData?.car?.name}. Номер: ${userCarData?.id}`}
                  caption={`Состояние: ${userCarData?.state}`}
                  text={`Кредиты: ${userCarData?.credits}`}
                />
              }
              key={userCarData.id}
              subtitle={`Стоимость: ${userCarData?.car?.price}`}
              src={getCarImageById(userCarData.car?.id || 1, imgIdx)}
              text={
                (userCarData?.state || 0) > 0 ? (
                  <ButtonGroup mode='horizontal' stretched>
                    <Button before={<Icon24HammerOutline />} appearance='positive' loading={isLoading} size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleSelectUserCarClick(userCarData?.id!)}>
                      {(userCarData?.state || 0) > 0 ? 'Дробить!' : 'Потрачено'}
                    </Button>
                    <Button before={<Icon20DiamondOutline />} appearance='negative' loading={isLoading} size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleExchangeUserCarCreditsClick(userCarData?.id!)}>
                      Обменять
                    </Button>
                  </ButtonGroup>
                ) : (
                  <Button before={<Icon20DiamondOutline />} appearance='negative' loading={isLoading} size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleExchangeUserCarCreditsClick(userCarData?.id!)}>
                    Обменять
                  </Button>
                )
              }
            />
          )
        })}
      </SimpleGrid>
    </Panel >
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

