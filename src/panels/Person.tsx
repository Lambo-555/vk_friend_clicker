import { FC, ReactNode, useEffect, useState } from 'react';
import { NavIdProps, Panel, PanelHeader, PanelHeaderBack, Group, SimpleCell, FormItem, Progress, CellButton } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { routes } from '../routes';
import baseTheme from '@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme';
import { Icon28Flash, Icon28LockCircleFillBlack } from '@vkontakte/icons';


export interface PersonProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
  userId: number | null,
}

export const Person: FC<PersonProps> = ({ id, setPopout, userId }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [deformStyle, setDeformStyle] = useState<React.CSSProperties>({});
  const [progressPoints, setProgressPoints] = useState<number>(0);
  const [progressColor, setProgressColor] = useState<string>('hsl(0,75%,50%)');

  const routeNavigator = useRouteNavigator();

  const vkGetUser = async (id: number): Promise<UserInfo | undefined> => {
    try {
      // @ts-ignore
      const user: UserInfo = await bridge.send('VKWebAppGetUserInfo', { user_ids: id.toString() });
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  const getStorageFriendPoint = async (id: number): Promise<number> => {
    try {
      const data: { keys: { key: string; value: string; }[]; } = await bridge.send('VKWebAppStorageGet', {
        keys: [id.toString()],
      });
      const points = data.keys[0].value;
      if (points) {
        return +points;
      }
    } catch (error) {
      console.error(error);
    }
    return 0;
  }

  const addStorageFriendPoint = async (id: number): Promise<number> => {
    try {
      const data: { keys: { key: string; value: string; }[]; } = await bridge.send('VKWebAppStorageGet', {
        keys: [id.toString()],
      });
      const pointsBefore = +data.keys[0].value;
      if (pointsBefore || pointsBefore === 0) {
        const pointsAfter = pointsBefore + 1;

        const update: { result: boolean } = await bridge.send('VKWebAppStorageSet', {
          key: id.toString(),
          value: pointsAfter.toString(),
        });

        if (update) {
          return pointsAfter;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return 0;
  }

  useEffect(() => {
    setProgressPoints(points / 10);
    const hue = points % 360;
    const color = `hsl(${hue}, ${75}%, ${75}%)`;
    setProgressColor(color);
  }, [points])

  useEffect(() => {
    // setPopout(<ScreenSpinner state='loading' />)
    if (!userId) {
      routeNavigator.push(routes.default_root.default_view.home);
      return;
    }

    const loadUser = async () => {
      if (!userId) return;
      const userData = await vkGetUser(userId);
      if (userData) {
        setUser(userData);
      }
    }

    const loadUserPoints = async () => {
      if (!userId) return;
      const userPoints = await getStorageFriendPoint(userId);
      setPoints(userPoints);
    }

    loadUser();
    loadUserPoints();
    setPopout(null);
  }, [userId])

  const handleClick = async (e: React.PointerEvent<HTMLDivElement>) => {
    // setPopout(<ScreenSpinner state='loading' />)

    const target = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - target.left;
    const clickY = e.clientY - target.top;
    const centerX = target.width / 2;
    const centerY = target.height / 2;

    const rotationX = (centerY - clickY) / 7; // Adjust tilt effect
    const rotationY = (clickX - centerX) / 7; // Adjust tilt effect

    // Apply the transformation
    setDeformStyle({
      transform: `scale(0.85) skew(${rotationY}deg,${rotationX}deg)`,
      filter: 'brightness(85%)',
      boxShadow: `${(centerX - clickX) / 10}px ${(centerY - clickY) / 10}px 5px rgba(255,255,255,${Math.abs(1 - clickX / centerX)})`,
    });

    // Reset after animation
    setTimeout(() => {
      setDeformStyle({
        transform: `scale(0.95) skew(0deg,0deg)`,
        filter: 'brightness(100%)',
        boxShadow: '0px 0px 5px rgb(255,255,255)',
      });
    }, 100); // Same duration as transition

    if (!userId) {
      setPopout(null)
      return;
    }

    const pointsForNow = await addStorageFriendPoint(userId);
    setPoints(pointsForNow);
    setPopout(null);
  };

  const baseButtonStyle = {
    height: "95%",
    width: "95%",
    borderRadius: '50%',
    transition: 'transform 0.2s ease, filter 0.2s ease',
    transform: `scale(1) skew(0deg,0deg)`,
    filter: 'brightness(100%)',
  };

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        {user?.first_name} {user?.last_name}
      </PanelHeader>

      <div style={{
        height: '50px',
        borderRadius: '50px 50px 0% 0%',
        // borderTop: `solid 3px ${progressColor}`,
        borderTop: `solid 3px ${baseTheme.colorAccentBlue.normal.value}`,
        boxShadow: `0px -15px 15px ${progressColor}`,
        // boxShadow: `0px -15px 15px ${baseTheme.colorAccentAzure.normal.value}`,
        position: 'relative',
        top: '25px',
      }}></div>


      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          fontSize: 75,
          top: -3,
          position: 'relative',
          // textShadow: `0px 0px 15px ${baseTheme.colorAccentLime.hover.value}`,
          textShadow: `0px 0px 15px ${progressColor}`,
          color: progressColor,
        }} >{points}</div>
        <Icon28Flash width={50} height={50} />
      </div>

      <FormItem
        style={{
          color: progressColor,
        }}
        status='valid'
        top={
          <div style={{
            color: 'transparent',
            backgroundClip: 'text',
            backgroundImage: 'linear-gradient(90deg, #F0F0F0, #48484A, #48484A, #48484A, #48484A)',
          }}>
            Прогресс
          </div>
        }>
        <Progress aria-labelledby="progresslabel" value={progressPoints} />
      </FormItem>

      {user && (
        <div style={{
          marginTop: '20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div
            onPointerDown={handleClick}
            style={{
              height: "75vw",
              width: "75vw",
              background: `linear-gradient(0deg, ${baseTheme.colorAccentBlue.normal.value} 0%, ${progressColor} 100%)`,
              // background: `linear-gradient(0deg, ${baseTheme.colorAccentBlue.normal.value} 0%, ${baseTheme.colorAccentAzure.normal.value} 100%)`,
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'transform 0.2s ease',
              boxShadow: 'inset 0px 0px 15px black, 0px 0px 15px black',
            }}>
            <img style={{ ...baseButtonStyle, ...deformStyle }} src={user.photo_200} alt={user?.first_name}></img>
          </div>
        </div>
      )}

      <Group mode="plain">
        <SimpleCell indicator={
          <CellButton subtitle='150.000' disabled before={<Icon28LockCircleFillBlack />} onClick={() => { }}>
            Улучшить
          </CellButton>
        } before={<Icon28Flash />}>
          Энергия <b>100/100</b>
        </SimpleCell>
      </Group>

    </Panel>
  );
};

{/* <Image style={imageStyle} size={200} src={user.photo_200} alt={user?.first_name} /> */ }

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

