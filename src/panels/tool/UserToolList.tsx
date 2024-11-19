import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, ButtonGroup, ContentCard, Div, Flex, Group, Header, NavIdProps, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import { Icon28ShoppingCartOutline, Icon20DiamondOutline, Icon24HammerOutline, Icon24AddOutline } from '@vkontakte/icons';
import { DEFAULT_VIEW_PANELS } from '../../routes';
import { ApiService } from '../../utils/ApiService';
import { UserEntity, UserToolEntity } from '../../utils/types';
import { getToolImageById } from '../images';
import { openSnackbar } from '../utils';

// TODO добавить уровень

export interface UserToolListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

export const UserToolList: FC<UserToolListProps> = ({ id, setPopout }) => {
  const [userToolList, setUserToolList] = useState<UserToolEntity[]>([]);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const routeNavigator = useRouteNavigator();
  const handleGoToToolShop = async () => {
    await routeNavigator.push(`/${DEFAULT_VIEW_PANELS.TOOL_SHOP_LIST}`)
  };

  const calculateImgIndex = (num: number): number => { // TODO change
    return Math.min(Math.floor(num / 100) + 1, 10);
  }

  const calcUpgradePrice = (tool: UserToolEntity): number => {
    if (!userData) return 1;
    return Math.round((tool?.level || 1) * (tool.tool?.price || 1) / 1.5);
  }

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
      setIsLoading(false);
      return;
    }
    const getUserToolList = async () => {
      const result: UserToolEntity[] = await ApiService.getUserToolList(userData.id!);
      console.log();
      setUserToolList(result);
      setIsLoading(false);
    }
    getUserToolList();
  }, [userData])

  const handleSelectUserToolClick = async (userToolId: number) => {
    if (!userData?.id) {
      return;
    }
    const result: UserToolEntity = await ApiService.selectUserTool(Number(userToolId));
    if (result) {
      if (result?.user) setUserData(result.user);
      const selectedToolIndex: UserToolEntity | number = userToolList.findIndex(item => item.id === Number(userToolId));
      if (selectedToolIndex === -1) return;
      const newUserToolList = [...userToolList].map(item => { item.isCurrent = false; return item; });
      newUserToolList[selectedToolIndex].isCurrent = true;
      setUserToolList(newUserToolList);
      openSnackbar(
        setPopout,
        `Инструмент "${result.tool?.name || 'basetool'}" selected`,
        <Icon20DiamondOutline fill="var(--vkui--color_icon_positive)" />
      )
    }
  }

  const handleUpgradeUserToolClick = async (userToolId: number) => {
    if (!userData?.id) {
      return;
    }
    const result: UserToolEntity = await ApiService.upgradeUserTool(Number(userToolId));
    if (result) {
      if (result?.user) setUserData(result.user);
      const upgradedToolIndex: UserToolEntity | number = userToolList.findIndex(item => item.id === Number(userToolId));
      if (upgradedToolIndex === -1) return;
      const newUserToolList = [...userToolList].map(item => { item.isCurrent = false; return item; });
      newUserToolList[upgradedToolIndex].level = result?.level || 1;
      setUserToolList(newUserToolList);
      openSnackbar(
        setPopout,
        `Инструмент "${result.tool?.name || 'basetool'}" upgraded`,
        <Icon20DiamondOutline fill="var(--vkui--color_icon_positive)" />
      )
    }
  }

  const handleExchangeUserToolClick = async (userToolId: number) => {
    if (!userData?.id) {
      return;
    }
    const result: UserToolEntity = await ApiService.exchangeUserTool(userData.id!, Number(userToolId));
    if (result) {
      if (result?.user) setUserData(result.user);
      setUserToolList(
        userToolList.filter(item => item.id !== userToolId)
      )
      openSnackbar(
        setPopout,
        `Инструмент "${result.tool?.name || 'basetool'}" продан за ${Math.round((result?.tool?.price || 1) * (result?.state || 1) / 1000)
        }`,
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
              <Button
                before={<Icon20DiamondOutline />}
                mode="outline"
                appearance="positive"
                size="m"
                style={{ minWidth: 75 }}
              >{userData?.credits || 0}
              </Button>
            </Div>
          </>
        }>
        Инструмент
      </PanelHeader>

      {!userToolList?.length && (
        <Div>
          <Group mode='card' header={<Header mode="secondary">Ваш гараж пуст</Header>}>
            <Button
              before={<Icon28ShoppingCartOutline />}
              size="l"
              appearance="positive"
              stretched
              onClick={handleGoToToolShop}
            >
              К покупкам!
            </Button>
          </Group>
        </Div>
      )}

      <Flex direction='row' margin='auto' gap='m' >
        {userToolList?.map((userToolData: UserToolEntity) => {
          const imgIdx = calculateImgIndex(1000 - (userToolData?.state || 1));
          return (
            <ContentCard
              style={{ maxWidth: 350 }}
              maxHeight={250}
              header={
                <ContentCard
                  header={`Tool: ${userToolData?.tool?.name}. Номер: ${userToolData?.id}`}
                  caption={`Состояние: ${userToolData?.state}`}
                  text={`Кредиты: ${userToolData?.tool?.price}`}
                />
              }
              key={userToolData.id}
              subtitle={`lvl: ${userToolData?.level} (${(userToolData?.level || 1) * (userToolData?.tool?.additionalDamagePerLevel || 1)} dmg)`}
              src={getToolImageById(userToolData.tool?.id || 1, imgIdx)}
              text={
                <ButtonGroup mode='vertical' stretched>
                  {(userToolData?.state || 0) > 0 && (
                    <>
                      <Button
                        disabled={userToolData?.isCurrent || false}
                        before={<Icon24HammerOutline />}
                        appearance='positive'
                        loading={isLoading}
                        size="m"
                        stretched
                        style={{ marginTop: '8px' }}
                        onClick={() => handleSelectUserToolClick(userToolData?.id!)}
                      >
                        Выбрать
                      </Button>
                      <Button
                        disabled={calcUpgradePrice(userToolData) > (userData?.credits || 1)}
                        before={<Icon24AddOutline />}
                        appearance='neutral'
                        loading={isLoading}
                        size="m"
                        stretched
                        style={{ marginTop: '8px' }}
                        onClick={() => handleUpgradeUserToolClick(userToolData?.id!)}
                      >
                        lvlup (+{userToolData.tool?.additionalDamagePerLevel} dmg)(-{calcUpgradePrice(userToolData)} cred)
                      </Button>
                    </>
                  )}
                  <Button before={<Icon20DiamondOutline />} appearance='negative' loading={isLoading} size="m" stretched style={{ marginTop: '8px' }} onClick={() => handleExchangeUserToolClick(userToolData?.id!)}>
                    Обменять (+{Math.round((userToolData?.tool?.price || 1) * (userToolData?.state || 1) / 1000)})
                  </Button>
                </ButtonGroup>
              }
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
