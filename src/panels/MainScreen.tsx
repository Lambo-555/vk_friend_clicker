import { FC, ReactNode, useState, } from 'react';
import { Button, ButtonGroup, Div, Image, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Placeholder, Separator, Spacing } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon24HammerOutline, Icon28AccessibilityOutline, Icon28CarOutline, Icon28InfoOutline, Icon28MoneyWadOutline, Icon28ShoppingCartOutline, Icon28UserAddOutline } from '@vkontakte/icons';
import { DEFAULT_MODALS, DEFAULT_VIEW_PANELS } from '../routes';

export interface MainScreenProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
  setCurrentModal: React.Dispatch<React.SetStateAction<any>>,
}

export const MainScreen: FC<MainScreenProps> = ({ id, setPopout, setCurrentModal }) => {
  const routeNavigator = useRouteNavigator();

  const handleGoToCarShop = () => routeNavigator.push(DEFAULT_VIEW_PANELS.CAR_SHOP_LIST);
  const handleGoToUserCarList = () => routeNavigator.push(DEFAULT_VIEW_PANELS.USER_CAR_LIST);
  const handleGoToUserToolList = () => routeNavigator.push(DEFAULT_VIEW_PANELS.USER_CAR_LIST);
  const handleShowOnboarding = () => setCurrentModal(DEFAULT_MODALS.WELCOME_1);
  const handleShowAds = () => { }
  const handleAddFriends = () => { }


  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        Дестроер
      </PanelHeader>
      <Placeholder
        // icon={<Icon56MessageReadOutline />}
        header={<img alt='разбитое авто' style={{maxWidth: 300}} src='src/assets/1/5.png'/>}
        action={
          <Button size="m" mode="tertiary">
            Наше сообщество
          </Button>
        }
        stretched
      >
        <Div>
          <ButtonGroup mode="vertical" gap="m" style={{ minWidth: 328 }}>
            <Button before={<Icon28ShoppingCartOutline />} onClick={handleGoToCarShop} size="l" appearance="accent" stretched>
              Свалка
            </Button>
            <Button before={<Icon28CarOutline />} onClick={handleGoToUserCarList} size="l" appearance="accent" stretched>
              Ваш гараж
            </Button>
            <Button disabled before={<Icon24HammerOutline />} onClick={handleGoToUserToolList} size="l" appearance="accent" stretched>
              Инструменты (WIP)
            </Button>
            <Spacing size={12}>
              <Separator />
            </Spacing>
            <Button before={<Icon28UserAddOutline />} onClick={() => { }} size="l" appearance="neutral" stretched>
              Пригласить друзей
            </Button>
            <Button before={<Icon28MoneyWadOutline />} onClick={() => { }} size="l" appearance="neutral" stretched>
              Посмотреть рекламу
            </Button>
            <ButtonGroup mode="horizontal" gap="m" stretched>
              <Button before={<Icon28AccessibilityOutline />} onClick={handleShowOnboarding} size="l" appearance="positive" stretched>
                Обучение
              </Button>
              <Button disabled before={<Icon28InfoOutline />} onClick={() => { }} size="l" appearance="positive" stretched>
                О нас
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </Div>
      </Placeholder>
    </Panel >
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

