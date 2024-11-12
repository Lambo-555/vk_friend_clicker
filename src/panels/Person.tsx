import { FC, ReactNode, useEffect, useState } from 'react';
import { NavIdProps, Panel, PanelHeader, PanelHeaderBack, Group, SimpleCell, FormItem, Progress, CellButton, ButtonGroup, Button, Div } from '@vkontakte/vkui';
import { useParams, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import baseTheme from '@vkontakte/vkui-tokens/themes/vkBase/cssVars/theme';
import { Icon28ArrowDownOutline, Icon28ArrowUpCircleOutline, Icon28ArrowUpOutline, Icon28Flash, Icon28LockCircleFillBlack } from '@vkontakte/icons';
import FriendService from '../utils/FriendService';
import { RegisterUserDto } from '../utils/types';
import bridge from '@vkontakte/vk-bridge';


export interface PersonProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

export const Person: FC<PersonProps> = ({ id, setPopout }) => {
  const [friend, setFriend] = useState<RegisterUserDto | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [boostEffect, setBoostEffect] = useState<number>(1);
  const [boostPrice, setBoostPrice] = useState<number>(15);

  const [deformStyle, setDeformStyle] = useState<React.CSSProperties>({});
  const [progressPoints, setProgressPoints] = useState<number>(0);
  const [progressColor, setProgressColor] = useState<string>('hsl(0,75%,50%)');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const routeNavigator = useRouteNavigator();
  const params = useParams<'vkuseridparam'>();
  const vkUserId: string | undefined = params?.vkuseridparam;
  // if (!vkUserId) return;
  console.log(vkUserId);

  useEffect(() => {
    setProgressPoints(points / 10);
    const hue = points % 360;
    const color = `hsl(${hue}, ${75}%, ${75}%)`;
    setProgressColor(color);
  }, [points])

  useEffect(() => {
    const getVkUser = async () => {
      const { vk_user_id } = await bridge.send('VKWebAppGetLaunchParams');
      if (vk_user_id) {
        setCurrentUserId(vk_user_id);
      }
    }

    const getVkFriend = async () => {
      if (vkUserId) {
        const friend = await FriendService.getVkUser(parseInt(vkUserId));
        if (friend) {
          setPoints(friend?.taps || 0)
          setFriend(friend);
        }
      }
    }

    // setPopout(<ScreenSpinner state='loading' />)
    // if (!vkUserId) {
    //   routeNavigator.push(routes.default_root.default_view.home);
    //   return;
    // }

    getVkUser();
    getVkFriend();

    setPopout(null);
  }, [vkUserId])

  const handleClick = async (e: React.PointerEvent<HTMLDivElement>) => {
    // setPopout(<ScreenSpinner state='loading' />)

    const target = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - target.left;
    const clickY = e.clientY - target.top;
    const centerX = target.width / 2;
    const centerY = target.height / 2;

    // const rotationX = (centerY - clickY) / 7; // Adjust tilt effect
    const rotationY = (clickX - centerX) / 5; // Adjust tilt effect

    // Apply the transformation
    setDeformStyle({
      transform: `scale(0.85) rotate(${rotationY}deg)`,
      filter: 'brightness(85%)',
      boxShadow: `${(centerX - clickX) / 10}px ${(centerY - clickY) / 10}px 5px rgba(255,255,255,${Math.abs(1 - clickX / centerX)})`,
    });

    // Reset after animation
    setTimeout(() => {
      setDeformStyle({
        transform: `scale(0.95) rotate(0deg)`,
        filter: 'brightness(100%)',
        boxShadow: '0px 0px 5px rgb(255,255,255)',
      });
    }, 100); // Same duration as transition

    if (!vkUserId) {
      setPopout(null)
      // return;
    }

    if (currentUserId) {
      const resultOfClick = await FriendService.tapUserFriend({
        vkId: currentUserId,
        friendVkId: parseInt(vkUserId!),
      });
      setPoints(resultOfClick);
    }

    setPopout(null);
  };

  const handleBoost = async () => {
    if (vkUserId) {
      const resultOfClick = await FriendService.addModToFriend({
        effect: 1.1,
        friendVkId: parseInt(vkUserId),
      });

      const coof = Math.round(
        (resultOfClick?.reduce((prev, curr) => prev += curr.effect, 0) || 1)
      );

      const price = 1.08 ** (resultOfClick?.length || 2);
      setBoostPrice(Math.round(price));

      setBoostEffect(coof);
    }
  }

  const handleDebuff = async () => {
    if (vkUserId) {
      const resultOfClick = await FriendService.addModToFriend({
        effect: 0.95,
        friendVkId: parseInt(vkUserId),
      });

      const coof = Math.round(
        (resultOfClick?.reduce((prev, curr) => prev += curr.effect, 0) || 1)
      );

      const price = 1.08 ** (resultOfClick?.length || 2);
      setBoostPrice(Math.round(price));

      setBoostEffect(coof);
    }
  }

  const baseButtonStyle = {
    height: "95%",
    width: "95%",
    borderRadius: '50%',
    transition: 'transform 0.2s ease, filter 0.2s ease',
    transform: `scale(1) rotate(0deg)`,
    filter: 'brightness(100%)',
  };

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}>
        {friend?.first_name} {friend?.last_name}
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
        }} >{Math.round(points)}</div>
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

      {friend && (
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
            <img style={{ ...baseButtonStyle, ...deformStyle }} src={friend.photo_200} alt={friend?.first_name}></img>
          </div>
        </div>
      )}
{/* 
      <Group mode="plain">
        <SimpleCell disabled indicator={
          <CellButton disabled subtitle='150.000' before={<Icon28LockCircleFillBlack />} onClick={() => { }}>
            Улучшить
          </CellButton>
        } before={<Icon28Flash />}>
          Энергия <b>100/100</b>
        </SimpleCell>
      </Group> */}

      <Div>
        <Group mode="card">
          <ButtonGroup mode="horizontal" gap="m" stretched>
            <Button stretched mode='primary' size='l'
              after={boostPrice % 1000 > 1 ? Math.round(boostPrice / 1000) + 'K' : boostPrice}
              before={<Icon28ArrowUpOutline />} onClick={handleBoost}>
              Буст
            </Button>
            <Button stretched mode='secondary' size='l'
              after={boostPrice % 1000 > 1 ? Math.round(boostPrice / 1000) + 'K' : boostPrice}
              before={<Icon28ArrowDownOutline />} onClick={handleDebuff}>
              Дебаф
            </Button>
          </ButtonGroup>
        </Group>
        <Button stretched disabled mode='outline' size='l'>
          {boostEffect * 100} %
        </Button>
      </Div>

    </Panel>
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

