import { useState, ReactNode, useEffect } from 'react';
import { View, SplitLayout, SplitCol, ModalRoot } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { DEFAULT_MODALS, DEFAULT_VIEW_PANELS } from './routes';
import { WelcomeOnboarding, DamageOnboarding, BuyOnboarding, InviteOnboarding, AdsOnboarding } from './modals/Onboarding.modal';
import bridge from '@vkontakte/vk-bridge';
import { ApiService } from './utils/ApiService';
import { UserEntity } from './utils/types';
import { UserCar } from './panels/car/UserCar';
import { UserCarList } from './panels/car/UserCarList';
import { MainScreen } from './panels/MainScreen';
import { ToolShopList } from './panels/tool/ToolShopList';
import { UserToolList } from './panels/tool/UserToolList';
import { CarShopList } from './panels/car/CarShopList';
import { PaymentModal } from './modals/Payment.modal';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [popout, setPopout] = useState<ReactNode | null>(null);
  const [currentModal, setCurrentModal] = useState<string | null>(null);

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
            console.log(`${user.first_name} зарегистрирован`);
          }
        }
      }
    }
    autoRegistration();
  }, [])

  const modal = (
    <ModalRoot activeModal={currentModal}>
      <WelcomeOnboarding id={DEFAULT_MODALS.WELCOME_1} setCurrentModal={setCurrentModal} />
      <DamageOnboarding id={DEFAULT_MODALS.DAMAGE_2} setCurrentModal={setCurrentModal} />
      <BuyOnboarding id={DEFAULT_MODALS.BUY_3} setCurrentModal={setCurrentModal} />
      <InviteOnboarding id={DEFAULT_MODALS.INVITE_4} setCurrentModal={setCurrentModal} />
      <AdsOnboarding id={DEFAULT_MODALS.ADS_5} setCurrentModal={setCurrentModal} />
      <AdsOnboarding id={DEFAULT_MODALS.ADS_5} setCurrentModal={setCurrentModal} />
      <PaymentModal id={DEFAULT_MODALS.PAYMENT_MODAL} setCurrentModal={setCurrentModal} setPopout={setPopout} />
    </ModalRoot>
  );

  return (
    <SplitLayout popout={popout} modal={modal}>
      <SplitCol>
        <View activePanel={activePanel}>
          <MainScreen id={DEFAULT_VIEW_PANELS.MAIN_SCREEN} setPopout={setPopout} setCurrentModal={setCurrentModal} />
          <CarShopList id={DEFAULT_VIEW_PANELS.CAR_SHOP_LIST} setPopout={setPopout} setCurrentModal={setCurrentModal} />
          <UserCarList id={DEFAULT_VIEW_PANELS.USER_CAR_LIST} setPopout={setPopout} setCurrentModal={setCurrentModal} />
          <UserCar id={DEFAULT_VIEW_PANELS.USER_CAR} setPopout={setPopout} setCurrentModal={setCurrentModal} />
          <ToolShopList id={DEFAULT_VIEW_PANELS.TOOL_SHOP_LIST} setPopout={setPopout} setCurrentModal={setCurrentModal} />
          <UserToolList id={DEFAULT_VIEW_PANELS.USER_TOOL_LIST} setPopout={setPopout} setCurrentModal={setCurrentModal} />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
