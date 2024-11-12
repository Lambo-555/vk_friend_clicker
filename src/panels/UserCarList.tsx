import { FC, ReactNode, useState } from 'react';
import { Button, CardGrid, ContentCard, NavIdProps, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export interface UserCarListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

const mockUserCarList = [
  { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020 },
  { id: 2, brand: 'Honda', model: 'Civic', year: 2019 },
  { id: 3, brand: 'Ford', model: 'Mustang', year: 2021 },
  // Add more cars as needed
];

export const UserCarList: FC<UserCarListProps> = ({ id, setPopout }) => {
  const [userCarList, setUserCarList] = useState(mockUserCarList);
  const routeNavigator = useRouteNavigator();

  const handleSelectUserCarClick = (userCarId: number) => { }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Ваши автомобили
      </PanelHeader>
      <CardGrid size="l" spaced>
        {userCarList.map((car) => (
          <ContentCard
            header={car.brand + ' ' + car.model}
            key={car.id}
            src="https://images.unsplash.com/photo-1603988492906-4fb0fb251cf8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80"
            text={
              <Button size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleSelectUserCarClick(car.id)}>
                Выбрать
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

