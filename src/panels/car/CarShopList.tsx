import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, ContentCard, Div, Flex, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Snackbar, Spinner } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import { Icon20CheckCircleFillGreen, Icon20DiamondOutline } from '@vkontakte/icons';
import { ApiService } from '../../utils/ApiService';
import { CarEntity, UserEntity, UserCarEntity } from '../../utils/types';
import { getCarImageById } from '../images';

export interface CarShopListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

export const CarShopList: FC<CarShopListProps> = ({ id, setPopout }) => {
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
        `Модель ${result.car?.name || 'basecar'} куплена за ${result.car?.price || 0}`,
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
        Свалка
      </PanelHeader>
      <Flex direction='row' margin='auto' gap='l' justify='center'>
        {!carList.length && (
          <Spinner size="large" />
        )}
        {carList && Array.isArray(carList) && carList.map((car: CarEntity, index: number) => {
          return (
            <ContentCard
              style={{ maxWidth: 350 }}
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
      </Flex>
    </Panel >
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

