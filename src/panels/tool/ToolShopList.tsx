import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, ContentCard, Div, Flex, NavIdProps, Panel, PanelHeader, PanelHeaderBack, Spinner } from '@vkontakte/vkui';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';
import { Icon20CheckCircleFillGreen, Icon20DiamondOutline } from '@vkontakte/icons';
import { ApiService } from '../../utils/ApiService';
import { UserEntity, ToolEntity, UserToolEntity } from '../../utils/types';
import { getToolImageById } from '../images';
import { BuyCreditButton, openSnackbar } from '../utils';
import { moneyShorter } from '../../utils/transformVKBridgeAdaptivity';

export interface ToolShopListProps extends NavIdProps {
  setPopout: React.Dispatch<React.SetStateAction<ReactNode>>,
}

export const ToolShopList: FC<ToolShopListProps> = ({ id, setPopout }) => {
  const [toolList, setToolList] = useState<ToolEntity[]>([]);
  const [userData, setUserData] = useState<UserEntity | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const routeNavigator = useRouteNavigator();

  useEffect(() => {
    setIsLoading(true)
    const getUserData = async () => {
      const { vk_user_id } = await bridge.send('VKWebAppGetLaunchParams');
      if (vk_user_id) {
        const user: UserEntity = await ApiService.getVkUserByVkId(vk_user_id);
        if (user) {
          setUserData(user);
        }
      }
      setIsLoading(false)
    }
    getUserData();
  }, [])

  useEffect(() => {
    setIsLoading(true)
    const getToolShopList = async () => {
      const result: ToolEntity[] = await ApiService.getToolList();
      console.log('tools', result);
      if (result?.length) {
        setToolList(result);
      }
      setIsLoading(false)
    }
    getToolShopList();
  }, [userData])

  const handleBuyToolClick = async (toolId: number) => {
    setIsLoading(true)
    if (!userData?.id) {
      setIsLoading(false);
      return;
    }

    const result: UserToolEntity = await ApiService.buyUserTool(userData.id, toolId);
    if (result) {
      openSnackbar(
        setPopout,
        `Инструмент ${result.tool?.name || 'basetool'} куплен за ${result.tool?.price || 0}`,
        <Icon20CheckCircleFillGreen />
      );
      if (result?.user) setUserData(result.user);
      setIsLoading(false);
    }
  }

  return (
    <Panel id={id} style={{ overflowY: 'scroll' }}>
      <PanelHeader
        fixed
        before={
          <>
            <PanelHeaderBack onClick={() => routeNavigator.push('/')} />
            <Div>
              <BuyCreditButton credits={moneyShorter(userData?.credits || 0)} />
            </Div>
          </>
        }>
        Молоты
      </PanelHeader>
      <Flex direction='row' margin='auto' gap='l' justify='center'>
        {!toolList.length && (
          <Spinner size="large" />
        )}
        {toolList && Array.isArray(toolList) && toolList.map((tool: ToolEntity, index: number) => {
          return (
            <ContentCard
              style={{ maxWidth: 350 }}
              header={`"${tool?.name || 'error'}"`}
              key={index}
              caption={'Наноси больше урона, дедка!'}
              subtitle={`Молот`}
              src={getToolImageById(tool?.id || 1, 1)}

              text={
                (userData?.credits || 0) > (tool?.price || 500) ? (
                  <Button appearance='positive' before={<Icon20DiamondOutline/>} loading={isLoading} size="l" stretched style={{ marginTop: '8px' }} onClick={() => handleBuyToolClick(tool.id!)}>
                    Купить за {moneyShorter(tool?.price || 0) || 'error'}
                  </Button>
                ) : (
                  <Button disabled size="l" appearance="negative" stretched style={{ marginTop: '8px' }}>
                    Нет денег
                  </Button>
                )
              }
              maxHeight={250}
            />
          )
        }
        )}
      </Flex>
    </Panel >
  );
};

/**
 vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=wss --host=localhost --port=5173 --timeout=5000
 */

