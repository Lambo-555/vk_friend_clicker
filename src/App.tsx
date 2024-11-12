import { useState, ReactNode } from 'react';
import { View, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Persik, Home } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';
import { CarShopList } from './panels/CarShopList';
import { UserCarList } from './panels/UserCarList';
import { UserCar } from './panels/UserCar';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [popout, setPopout] = useState<ReactNode | null>(null);

  return (
    <SplitLayout popout={popout}>
      <SplitCol>
        <View activePanel={activePanel}>
          <CarShopList id={DEFAULT_VIEW_PANELS.CAR_SHOP_LIST} setPopout={setPopout} />
          <UserCarList id={DEFAULT_VIEW_PANELS.USER_CAR_LIST} setPopout={setPopout} />
          <UserCar id={DEFAULT_VIEW_PANELS.USER_CAR} setPopout={setPopout} />

          <Home id="home" setPopout={setPopout} />
          {/* <Person id="person" setPopout={setPopout}/> */}
          <Persik id="persik" />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
