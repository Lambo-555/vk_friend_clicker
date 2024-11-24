import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, FormItem, Group, Header, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Placeholder, Progress, SimpleCell, Snackbar } from '@vkontakte/vkui';
import { useParams, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import './ImageSwitcher.css';
import { Icon20CheckCircleFillGreen, Icon20CupOutline, Icon20DiamondOutline, Icon24HammerOutline } from '@vkontakte/icons';
import { DEFAULT_VIEW_PANELS } from '../../routes';
import { ApiService } from '../../utils/ApiService';
import { UserCarEntity, UserEntity } from '../../utils/types';
import { SparkCanvas, SparkManager } from '../effects/SparkCanvas';
import { getCarImageById } from '../images';
import { moneyShorter } from '../../utils/transformVKBridgeAdaptivity';

// TODO добавить отображение инструмента, добавить учет инструмента при тапах по автомобилю, показывать состояние инструмента

export interface UserCarListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
  setCurrentModal: React.Dispatch<React.SetStateAction<any>>,
}

export const UserCar: FC<UserCarListProps> = ({ id, setPopout }) => {
  const [userCar, setUserCar] = useState<UserCarEntity | null>();
  const [damage, setDamage] = useState<number>(0);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentCarImgIndex, setCurrentCarImgIndex] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [sparkManager, setSparkManager] = useState<SparkManager | null>(null);

  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);

  const routeNavigator = useRouteNavigator();

  const params = useParams<'userCarId'>();
  const userCarIdStr: string | undefined = params?.userCarId;

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
    const canvasElement = document.getElementById("world") as HTMLCanvasElement;
    const canvas = new SparkCanvas(canvasElement);
    const manager = new SparkManager(canvas);
    setSparkManager(manager);
    manager.animate();
  }, [])

  useEffect(() => {
    SparkCanvas
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
      setIsLoading(false);
      return;
    }
    if (!userCarIdStr) {
      setIsLoading(false);
      return;
    }
    const getUserCar = async () => {
      const userCar: UserCarEntity = await ApiService.getUserCar(userData.id!, Number(userCarIdStr));
      console.log('userCAAAR', userCarIdStr);
      setCurrentCarImgIndex(calculateImgIndex(1000 - (userCar?.state || 1)));
      setUserCar(userCar);
      setIsLoading(false);
    }
    getUserCar();
  }, [userData])

  const calculateImgIndex = (num: number): number => {
    return Math.min(Math.floor(num / 100) + 1, 10);
  }

  const handleDamageUserCarClick = async (userCarId: number, e: MouseEvent) => {
    if (!userData?.id) {
      return;
    }
    if (!userCarIdStr || !userCarId) {
      return;
    }
    if ((userCar?.state || 0) <= 0) {
      openSnackbar(
        `Модель ${userCar?.car?.name || 'basecar'} полностью уничтожена`,
        <Icon20CheckCircleFillGreen />
      );
      return;
    }

    // Effects
    const newXOffset = Math.random() * 10 - 5;
    const newYOffset = Math.random() * 10 - 5;
    setXOffset(newXOffset);
    setYOffset(newYOffset);
    // Logic
    setCurrentCarImgIndex(calculateImgIndex(1000 - (userCar?.state || 1)))
    setClickCount(prev => prev + 1);
    setClickCount(0);
    const result: UserCarEntity = await ApiService.damageUserCar(userData.id!, Number(userCarId || userCarIdStr));
    if (result) {
      const prev = Object.assign(userCar || {}, {});
      const damageValue = (prev?.state || 1001) - (result?.state || 0);
      setDamage(damageValue)
      setUserCar(result);
      if (sparkManager) {
        sparkManager.handleClick(e, damageValue);
      }
    }
  }

  const handleExchangeUserCarCreditsClick = async (userCarId: number) => {
    if (!userData?.id) {
      return;
    }
    const result: UserCarEntity = await ApiService.exchangeUserCar(userData.id!, Number(userCarId));
    if (result) {
      routeNavigator.push(`/${DEFAULT_VIEW_PANELS.USER_CAR_LIST}`)
    }
  }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.push(`/${DEFAULT_VIEW_PANELS.USER_CAR_LIST}`)} />}>
        {userCar?.car?.name}
      </PanelHeader>
      <Placeholder stretched>
        <div
          className={`image-container ${clickCount > 0 ? 'active' : ''}`}
          style={{
            transform: `translate(${xOffset}px, ${yOffset}px) rotate(${(xOffset - yOffset) / 2}deg)`,
            transition: 'transform 0.5s ease-in-out',
            maxWidth: 500,
            overflow: 'hidden',
          }}
        >
          <canvas
            id='world'
            style={{ position: 'absolute', zIndex: 99999 }}
            onClick={(e: any) => handleDamageUserCarClick(userCar?.id || 0, e)}
          />
          <img
            style={{ userSelect: 'none' }}
            src={getCarImageById(userCar?.car?.id || 1, currentCarImgIndex)}
            alt={`Image ${currentCarImgIndex}`}
            className={`image ${clickCount > 0 ? 'bright' : ''}`}
          />
        </div>
        <Group
          header={<Header>Модель: "{userCar?.car?.name}" {(userCar?.state || 0) <= 0 ? '(Потрачено)' : ''}</Header>}
          key={userCar?.id}
          mode='card'
          separator='show'
        >
          <FormItem id="progresslabel" top={`Состояние ${(userCar?.state || 0)} из 1000`}>
            <Progress appearance='positive' aria-labelledby="progresslabel" value={(userCar?.state || 0) / 10} />
          </FormItem>
          <SimpleCell indicator={damage} before={<Icon24HammerOutline fill="var(--vkui--color_icon_positive)" />}>
            Крайний удар
          </SimpleCell>
          <SimpleCell indicator={moneyShorter(userCar?.car?.price || 0)} before={<Icon20DiamondOutline fill="var(--vkui--color_icon_positive)" />}>
            Цена покупки
          </SimpleCell>
          <SimpleCell indicator={
            moneyShorter(userCar?.credits || 0) + ' (' + Math.round((userCar?.credits || 1) / (userCar?.car?.price || 1) * 100) + '%)'
          } before={<Icon20CupOutline fill="var(--vkui--color_icon_positive)" />}>
            Прибыль
          </SimpleCell>
          {(userCar?.state || 0) <= 0 && (
            <Button before={<Icon20DiamondOutline />} appearance='negative' loading={isLoading} size="m" stretched style={{ marginTop: '8px' }} onClick={() => handleExchangeUserCarCreditsClick(userCar?.id!)}>
              Обменять +{moneyShorter(userCar?.credits || 0)}
            </Button>
          )}
        </Group>
      </Placeholder>
    </Panel >
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

