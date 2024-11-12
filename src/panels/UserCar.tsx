import { FC, ReactNode, useState } from 'react';
import { Button, CardGrid, ContentCard, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Placeholder } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon56MessageReadOutline } from '@vkontakte/icons';

export interface UserCarListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

const mockUserCar = { id: 1, brand: 'Toyota', model: 'Corolla', year: 2020 };

export const UserCar: FC<UserCarListProps> = ({ id, setPopout }) => {
  const [userCar, setUserCar] = useState(mockUserCar);
  const routeNavigator = useRouteNavigator();

  const handleUserCarClick = (userCarId: number) => { }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        {userCar.brand + ' ' + userCar.model}
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
          header={userCar.brand + ' ' + userCar.model}
          key={userCar.id}
          src="https://images.unsplash.com/photo-1603988492906-4fb0fb251cf8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1600&q=80"
          text={
            <Button size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleUserCarClick(userCar.id)}>
              Выбрать
            </Button>
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

