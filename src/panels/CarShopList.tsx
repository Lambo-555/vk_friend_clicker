import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, CardGrid, ContentCard, NavIdProps, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { CarEntity, UserCarEntity, UserEntity } from '../utils/types';
import { ApiService } from '../utils/ApiService';
import bridge from '@vkontakte/vk-bridge';

export interface CarShopListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

const mockCarShopList: CarEntity[] = [
  { id: 999999999, name: 'Лага Копейка', price: 550, imageNormalUrl: '', imageDamagedUrl: '' },
];

export const CarShopList: FC<CarShopListProps> = ({ id, setPopout }) => {
  const [carList, setCarList] = useState<CarEntity[]>(mockCarShopList);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const routeNavigator = useRouteNavigator();

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
      setCarList([...mockCarShopList, ...result]);
      setIsLoading(false)
    }
    getCarShopList();
  }, [])

  const handleBuyUserBuyClick = async (carId: number) => {
    setIsLoading(true)
    if (!userData?.id) {
      console.error('no userData.id');
      setIsLoading(false)
      return;
    }

    const result: UserCarEntity = await ApiService.buyUserCar(userData.id, carId);
    if (result) {
      console.log('deal success')
      // TODO вывести что-то игроку
      // выводить плашки из вк юай
      setIsLoading(false)
    }
  }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Автомагазин
      </PanelHeader>
      <CardGrid size="l" spaced>
        {carList?.map((car) => (
          <ContentCard
            header={car.name}
            key={car.id}
            subtitle={`Стоимость: ${car.price}`}
            src={car.imageNormalUrl || "https://images.unsplash.com/photo-1603988492906-4fb0fb251cf8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80"}
            text={
              (userData?.credits || 0) > (car?.price || 500) ? (
                <Button loading={isLoading} size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleBuyUserBuyClick(car.id!)}>
                  Купить за {car.price}
                </Button>
              ) : (
                <Button disabled size="l" appearance="negative" stretched style={{ marginTop: '8px' }}>
                  Невозможно купить
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

