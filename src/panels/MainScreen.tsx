import { FC, ReactNode, useEffect, useState, } from 'react';
import { Button, ButtonGroup, Div, Link, NavIdProps, Panel, PanelHeader, Placeholder, Separator, Snackbar } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import { Icon20DiamondOutline, Icon24HammerOutline, Icon24WarningTriangleOutline, Icon28AccessibilityOutline, Icon28CarOutline, Icon28StarCircleFillBlue, Icon28MoneyWadOutline, Icon28ShoppingCartOutline, Icon28UserAddOutline, Icon28Cards2Outline } from '@vkontakte/icons';
import { DEFAULT_MODALS, DEFAULT_VIEW_PANELS } from '../routes';
import bridge, { EAdsFormats } from '@vkontakte/vk-bridge';
import { UserEntity } from '../utils/types';
import { ApiService } from '../utils/ApiService';
import photo_1_1 from '../assets/1/1.png';
import { moneyShorter } from '../utils/transformVKBridgeAdaptivity';
import { BuyCreditButton } from './utils';

export interface MainScreenProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
  setCurrentModal: React.Dispatch<React.SetStateAction<any>>,
}

export const MainScreen: FC<MainScreenProps> = ({ id, setPopout, setCurrentModal }) => {
  const [userData, setUserData] = useState<UserEntity | null>(null);
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
    const autoRegistration = async () => {
      console.log('autoregistration start');
      const { vk_user_id } = await bridge.send('VKWebAppGetLaunchParams');

      if (vk_user_id) {
        const dbUserData: UserEntity = await ApiService.getVkUserByVkId(vk_user_id);

        if (!dbUserData) {
          const vkUserData = await bridge.send('VKWebAppGetUserInfo', { user_id: Number(vk_user_id) });

          if (vkUserData) {
            const user: UserEntity = await ApiService.registerUser({
              first_name: vkUserData.first_name,
              last_name: vkUserData?.last_name || 'Неизвестов',
              photo_200: vkUserData.photo_200,
              city: vkUserData?.city?.title || 'Градополь',
              credits: 250,
              vk_user_id: vk_user_id,
            });
            setUserData(user);
            console.log(`${user.first_name} зарегистрирован`);
          }
        }
      }
    }
    autoRegistration();
  }, [])

  useEffect(() => {
    const getUserData = async () => {
      const { vk_user_id } = await bridge.send('VKWebAppGetLaunchParams');
      if (vk_user_id) {
        const user: UserEntity = await ApiService.getVkUserByVkId(vk_user_id);
        if (user) {
          setUserData(user);
        }
      }
    }
    getUserData();
  }, [])

  const handleGoToCarShop = () => routeNavigator.push(`/${DEFAULT_VIEW_PANELS.CAR_SHOP_LIST}`);
  const handleGoToUserCarList = () => routeNavigator.push(`/${DEFAULT_VIEW_PANELS.USER_CAR_LIST}`);
  const handleGoToToolShop = () => routeNavigator.push(`/${DEFAULT_VIEW_PANELS.TOOL_SHOP_LIST}`);
  const handleGoToUserToolList = () => routeNavigator.push(`/${DEFAULT_VIEW_PANELS.USER_TOOL_LIST}`);
  const handleShowOnboarding = () => setCurrentModal(DEFAULT_MODALS.WELCOME_1);
  const handleShowAds = async () => {
    try {
      const adsShow = await bridge.send('VKWebAppShowNativeAds', {
        ad_format: EAdsFormats.REWARD,
      })
      if (adsShow?.result && userData?.id) {
        const isSuccess = await ApiService.addInviteBonus(userData.id);
        if (isSuccess) {
          setUserData(isSuccess);
          openSnackbar(
            `Кредиты за рекламу: ${250}`,
            <Icon20DiamondOutline fill="var(--vkui--color_icon_positive)" />
          )
          console.log('adsShow:', adsShow);
        }
      }
    } catch (error) {
      openSnackbar(
        'Ошибка рекламы пук-пук',
        <Icon24WarningTriangleOutline fill="var(--vkui--color_icon_negative)" />
      );
      console.error(error);
    }
  }

  const handleToFavorites = async () => {
    try {
      const toFavorites = await bridge.send('VKWebAppAddToFavorites', { request_id: 'from_main_menu' });
      if (toFavorites?.result && userData?.id) {
        const isBonus = await ApiService.addInviteBonus(userData.id);
        if (isBonus) {
          setUserData(isBonus);
          openSnackbar(
            `Спасибо! Ваши доп.кредиты: ${250}`,
            <Icon20DiamondOutline fill="var(--vkui--color_icon_positive)" />
          )
          console.log('toFavorites:', toFavorites);
        }
      }
    } catch (error) {
      openSnackbar(
        'Не удалось добавить в избранное, упс',
        <Icon24WarningTriangleOutline fill="var(--vkui--color_icon_negative)" />
      );
      console.error(error);
    }
  }
  const handleInviteFriends = async (): Promise<void> => {
    try {
      const userListData = await bridge.send('VKWebAppShowInviteBox', { request_id: 'from_main_menu' });
      if (userListData && userData?.id) {
        const isBonus = await ApiService.addInviteBonus(userData.id);
        if (isBonus) {
          setUserData(isBonus);
          openSnackbar(
            `Вы получили кредиты: ${250}`,
            <Icon20DiamondOutline fill="var(--vkui--color_icon_positive)" />
          )
          console.log('userListData.success:', userListData.success);
        }
      }
    } catch (error) {
      openSnackbar(
        'Не удалось пригласить друзей, лев-тигр',
        <Icon24WarningTriangleOutline fill="var(--vkui--color_icon_negative)" />
      );
      console.error(error);
    }
  }

  return (
    <Panel id={id}>
      <PanelHeader before={
        <Div>
          <BuyCreditButton credits={moneyShorter(userData?.credits || 0)} />
        </Div>
      }>
        ТапаЛом
      </PanelHeader>
      <Placeholder
        header={<img alt='разбитое авто' style={{ maxWidth: 300 }} src={photo_1_1} />}
        action={
          <Link href='https://vk.com/tapoLom'>
            Наше сообщество
          </Link>
        }
        stretched
      >
        <Div>
          <ButtonGroup mode="vertical" gap="m" style={{ minWidth: 328 }}>
            <ButtonGroup
              mode="horizontal"
              gap="m"
              stretched
            >
              <Button before={<Icon28ShoppingCartOutline />} onClick={handleGoToCarShop} size="l" appearance="accent" stretched>
                Свалка
              </Button>
              <Button before={<Icon28CarOutline />} onClick={handleGoToUserCarList} size="l" appearance="accent" stretched>
                Гараж
              </Button>
            </ButtonGroup>

            <ButtonGroup
              mode="horizontal"
              gap="m"
              stretched
            >
              <Button before={<Icon24HammerOutline />} onClick={handleGoToToolShop} size="l" appearance="accent" stretched>
                Молоты
              </Button>
              <Button before={<Icon28Cards2Outline />} onClick={handleGoToUserToolList} size="l" appearance="accent" stretched>
                Пояс
              </Button>
            </ButtonGroup>

            <Separator />

            <ButtonGroup
              mode="vertical"
              gap="m"
              stretched
            >
              <Button before={<Icon28UserAddOutline />} onClick={handleInviteFriends} size="l" appearance="neutral" stretched>
                Пригласить друзей
              </Button>
              <Button before={<Icon28StarCircleFillBlue />} onClick={handleToFavorites} size="l" appearance="neutral" stretched>
                В избранное
              </Button>
            </ButtonGroup>

            <Separator />

            <ButtonGroup mode="horizontal" gap="m" stretched>
              <Button before={<Icon28AccessibilityOutline />} onClick={handleShowOnboarding} size="l" appearance="positive" stretched>
                Обучение
              </Button>
              <Button before={<Icon28MoneyWadOutline />} onClick={handleShowAds} size="l" appearance="positive" stretched>
                Реклама
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

