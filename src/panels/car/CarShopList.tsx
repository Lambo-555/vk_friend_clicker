import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, Card, Div, Flex, Group, Header, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Snackbar, Spinner } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import { Icon20CheckCircleFillGreen, Icon20DiamondOutline } from '@vkontakte/icons';
import { ApiService } from '../../utils/ApiService';
import { CarEntity, UserEntity, UserCarEntity } from '../../utils/types';
import { getCarImageById } from '../images';
import { moneyShorter } from '../../utils/transformVKBridgeAdaptivity';
import { BuyCreditButton } from '../utils';

export interface CarShopListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
  setCurrentModal: React.Dispatch<React.SetStateAction<any>>,
}

export const CarShopList: FC<CarShopListProps> = ({ id, setPopout, setCurrentModal }) => {
  const [carList, setCarList] = useState<CarEntity[]>([]);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const routeNavigator = useRouteNavigator();

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

  const isCarAvailableForUser = (userData: UserEntity, car: CarEntity) => {
    return (userData?.credits || 0) > (car?.price || 500);
  }

  useEffect(() => {
    setIsLoading(true)
    const getUserData = async () => {
      const { vk_user_id } = await bridge.send('VKWebAppGetLaunchParams');
      if (vk_user_id) {
        const user: UserEntity = await ApiService.getVkUserByVkId(vk_user_id);
        if (user) {
          setUserData(user);
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
      openSnackbar(
        `Модель ${result.car?.name || 'basecar'} куплена за ${moneyShorter(result.car?.price || 0)}`,
        <Icon20CheckCircleFillGreen />
      );
      if (result?.user) setUserData(result.user);
      setIsLoading(false);
    }
  }

  return (
    <Panel id={id} style={{ overflowY: 'scroll' }}>
      <PanelHeader
        fixed
        before={
          <>
            <PanelHeaderBack onClick={() => routeNavigator.push('/')} />
            <Div>
              <BuyCreditButton setCurrentModal={setCurrentModal} credits={moneyShorter(userData?.credits || 0)} />
            </Div>
          </>
        }>
        Свалка
      </PanelHeader>
      <Flex direction='row' margin='auto' gap='l' justify='center'>
        {!carList.length && (
          <Spinner size="large" />
        )}
        {carList && Array.isArray(carList) && carList.map((car: CarEntity, index: number) => {
          return (
            <Card
              key={index}
              style={{
                width: 400,
                minHeight: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 55,
              }}
              mode="outline-tint">
              <img
                style={{ filter: 'brightness(0) blur(10px) opacity(0.5)', width: '75%', margin: 'auto', position: 'absolute', top: -50 }}
                src={getCarImageById(car?.id || 1, 1)}
                alt="car"
              />
              {isCarAvailableForUser(userData!, car) && (
                <img
                  style={{ width: '75%', margin: 'auto', position: 'absolute', top: -50 }}
                  src={getCarImageById(car?.id || 1, 1)}
                  alt="car"
                />
              )}
              <div style={{ height: 96 }} />
              <Group mode='plain' style={{ width: '95%' }} header={
                <Header>Модель: {isCarAvailableForUser(userData!, car) ? car?.name : 'неизвестно'}</Header>
              }>
                {
                  isCarAvailableForUser(userData!, car) ? (
                    <Button before={<Icon20DiamondOutline />} appearance='positive' loading={isLoading} size="m" stretched style={{ marginTop: '8px' }} onClick={() => handleBuyUserBuyClick(car.id!)}>
                      Купить за {moneyShorter(car?.price || 0) || 'error'}
                    </Button>
                  ) : (
                    <Button disabled size="m" appearance="negative" stretched style={{ marginTop: '8px' }}>
                      Нет денег на хлам
                    </Button>
                  )
                }
              </Group>
            </Card>
          )
        }
        )}
      </Flex>
    </Panel >
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

