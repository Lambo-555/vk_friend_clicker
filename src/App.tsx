import { useState, ReactNode } from 'react';
import { View, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';

import { Persik, Home } from './panels';
import { DEFAULT_VIEW_PANELS } from './routes';
import { Person } from './panels/Person';

export const App = () => {
  const { panel: activePanel = DEFAULT_VIEW_PANELS.HOME } = useActiveVkuiLocation();
  const [popout, setPopout] = useState<ReactNode | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  return (
    <SplitLayout popout={popout}>
      <SplitCol>
        <View activePanel={activePanel}>
          <Home id="home" setPopout={setPopout} setUserId={setUserId}/>
          <Person id="person" setPopout={setPopout} userId={userId}/>
          <Persik id="persik" />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
