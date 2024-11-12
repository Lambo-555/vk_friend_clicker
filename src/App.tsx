import { useState, ReactNode } from 'react';
import { View, SplitLayout, SplitCol, ModalRoot } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { DEFAULT_MODALS, DEFAULT_VIEW_PANELS } from './routes';
import { CarShopList } from './panels/CarShopList';
import { UserCarList } from './panels/UserCarList';
import { UserCar } from './panels/UserCar';
import { MainScreen } from './panels/MainScreen';
import { WelcomeOnboarding, DamageOnboarding, BuyOnboarding, InviteOnboarding, AdsOnboarding } from './modals/Onboarding.modal';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [popout, setPopout] = useState<ReactNode | null>(null);
  const [currentModal, setCurrentModal] = useState<string | null>(null);


  const modal = (
    <ModalRoot activeModal={currentModal}>
      <WelcomeOnboarding id={DEFAULT_MODALS.WELCOME_1} setCurrentModal={setCurrentModal} />
      <DamageOnboarding id={DEFAULT_MODALS.DAMAGE_2} setCurrentModal={setCurrentModal} />
      <BuyOnboarding id={DEFAULT_MODALS.BUY_3} setCurrentModal={setCurrentModal} />
      <InviteOnboarding id={DEFAULT_MODALS.INVITE_4} setCurrentModal={setCurrentModal} />
      <AdsOnboarding id={DEFAULT_MODALS.ADS_5} setCurrentModal={setCurrentModal} />
    </ModalRoot>
  );

  return (
    <SplitLayout popout={popout} modal={modal}>
      <SplitCol>
        <View activePanel={activePanel}>
          <MainScreen id={DEFAULT_VIEW_PANELS.MAIN_SCREEN} setPopout={setPopout} setCurrentModal={setCurrentModal}/>
          <CarShopList id={DEFAULT_VIEW_PANELS.CAR_SHOP_LIST} setPopout={setPopout} />
          <UserCarList id={DEFAULT_VIEW_PANELS.USER_CAR_LIST} setPopout={setPopout} />
          <UserCar id={DEFAULT_VIEW_PANELS.USER_CAR} setPopout={setPopout} />

          {/* <Home id="home" setPopout={setPopout} /> */}
          {/* <Person id="person" setPopout={setPopout}/> */}
          {/* <Persik id="persik" /> */}
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
