import { FC, ReactNode, useState } from 'react';
import { Button, CardGrid, ContentCard, NavIdProps, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export interface CarShopListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

const mockCarShopList = [
  { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020 },
  { id: 2, brand: 'Honda', model: 'Civic', year: 2019 },
  { id: 3, brand: 'Ford', model: 'Mustang', year: 2021 },
  // Add more cars as needed
];

export const CarShopList: FC<CarShopListProps> = ({ id, setPopout }) => {
  const [carList, setCarList] = useState(mockCarShopList);
  const routeNavigator = useRouteNavigator();

  const handleBuyClick = (carId: number) => { }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Автомагазин
      </PanelHeader>
      <CardGrid size="l" spaced>
        {carList.map((car) => (
          <ContentCard
            header={car.brand + ' ' + car.model}
            key={car.id}
            src="https://images.unsplash.com/photo-1603988492906-4fb0fb251cf8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80"
            text={
              <Button size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleBuyClick(car.id)}>
                Купить за {car.year}
              </Button>
            }
            maxHeight={250}
          ></ContentCard>
        ))}
      </CardGrid>
    </Panel >
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

