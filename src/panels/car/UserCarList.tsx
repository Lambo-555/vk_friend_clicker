import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, ButtonGroup, ContentCard, Div, Flex, FormItem, Group, Header, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Progress, SimpleCell, Snackbar } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import { Icon28ShoppingCartOutline, Icon20DiamondOutline, Icon24HammerOutline, Icon20CupOutline } from '@vkontakte/icons';
import { DEFAULT_VIEW_PANELS } from '../../routes';
import { ApiService } from '../../utils/ApiService';
import { UserCarEntity, UserEntity } from '../../utils/types';
import { getCarImageById } from '../images';
import { moneyShorter } from '../../utils/transformVKBridgeAdaptivity';
import { BuyCreditButton } from '../utils';

export interface UserCarListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
  setCurrentModal: React.Dispatch<React.SetStateAction<any>>,
}

export const UserCarList: FC<UserCarListProps> = ({ id, setPopout, setCurrentModal }) => {
  const [userCarList, setUserCarList] = useState<UserCarEntity[]>([]);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const routeNavigator = useRouteNavigator();
  const handleGoToCarShop = async () => {
    await routeNavigator.push(`/${DEFAULT_VIEW_PANELS.CAR_SHOP_LIST}`)
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
    <Panel id={id} style={{ overflowY: 'scroll' }}>
      <PanelHeader
        fixed
        before={
          <>
            <PanelHeaderBack onClick={() => routeNavigator.push(`/${DEFAULT_VIEW_PANELS.MAIN_SCREEN}`)} />
            <Div>
              <BuyCreditButton setCurrentModal={setCurrentModal} credits={moneyShorter(userData?.credits || 0)} />
            </Div>
          </>
        }>
        Гараж
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

      <Flex direction='row' margin='auto' gap='l' justify='center'>
        {userCarList?.map((userCar) => {
          const imgIdx = calculateImgIndex(1000 - (userCar?.state || 1));
          return (
            <ContentCard
              style={{ maxWidth: 350 }}
              header={
                <>
                  <Group
                    header={<Header>Модель: "{userCar?.car?.name}({userCar?.id || 0})" {(userCar?.state || 0) <= 0 ? '(Потрачено)' : ''}</Header>}
                    key={userCar?.id}
                    mode='plain'
                    separator='show'
                  >
                    <FormItem id="progresslabel" top={`Состояние ${(userCar?.state || 0)} из 1000`}>
                      <Progress appearance='positive' aria-labelledby="progresslabel" value={(userCar?.state || 0) / 10} />
                    </FormItem>
                    <SimpleCell indicator={moneyShorter(userCar?.car?.price || 0)} before={<Icon20DiamondOutline fill="var(--vkui--color_icon_positive)" />}>
                      По чем куплено
                    </SimpleCell>
                    <SimpleCell indicator={
                      (userCar?.credits || 0) + ' ('
                      + moneyShorter(Math.round((userCar?.credits || 1) / (userCar?.car?.price || 1) * 100)) +
                      '%)'
                    } before={<Icon20CupOutline fill="var(--vkui--color_icon_positive)" />}>
                      Прибыль при обмене
                    </SimpleCell>
                    {
                      (userCar?.state || 0) > 0 ? (
                        <ButtonGroup mode='horizontal' stretched>
                          <Button before={<Icon24HammerOutline />} appearance='positive' loading={isLoading} size="m" stretched style={{ marginTop: '8px' }} onClick={() => handleSelectUserCarClick(userCar?.id!)}>
                            {(userCar?.state || 0) > 0 ? 'Дробить!' : 'Потрачено'}
                          </Button>
                          <Button before={<Icon20DiamondOutline />} appearance='negative' loading={isLoading} size="m" stretched style={{ marginTop: '8px' }} onClick={() => handleExchangeUserCarCreditsClick(userCar?.id!)}>
                            Обменять
                          </Button>
                        </ButtonGroup>
                      ) : (
                        <Button before={<Icon20DiamondOutline />} appearance='negative' loading={isLoading} size="m" stretched style={{ marginTop: '8px' }} onClick={() => handleExchangeUserCarCreditsClick(userCar?.id!)}>
                          Обменять
                        </Button>
                      )
                    }
                  </Group>
                </>
              }
              key={userCar.id}
              src={getCarImageById(userCar.car?.id || 1, imgIdx)}
            />
          )
        })}
      </Flex>
    </Panel >
  );
};
/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

