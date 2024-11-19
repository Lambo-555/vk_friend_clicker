import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from '@vkontakte/vk-mini-apps-router';

export const DEFAULT_ROOT = 'default_root';

export const DEFAULT_VIEW = 'default_view';

export const DEFAULT_VIEW_PANELS = {
  HOME: 'HOME',
  PERSIK: 'PERSIK',
  PERSON: 'PERSON',
  CAR_SHOP_LIST: 'CAR_SHOP_LIST',
  USER_CAR_LIST: 'USER_CAR_LIST',
  USER_CAR: 'USER_CAR',
  MAIN_SCREEN: 'MAIN_SCREEN',
  TOOL_SHOP_LIST: 'TOOL_SHOP_LIST',
  USER_TOOL_LIST: 'USER_TOOL_LIST',
} as const;

export const DEFAULT_MODALS = {
  WELCOME_1: 'WELCOME_1',
  DAMAGE_2: 'DAMAGE_2',
  BUY_3: 'BUY_3',
  INVITE_4: 'INVITE_4',
  ADS_5: 'ADS_5',
} as const;

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.MAIN_SCREEN, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.CAR_SHOP_LIST, `/${DEFAULT_VIEW_PANELS.CAR_SHOP_LIST}`, []),
      createPanel(DEFAULT_VIEW_PANELS.USER_CAR_LIST, `/${DEFAULT_VIEW_PANELS.USER_CAR_LIST}`, []),
      createPanel(DEFAULT_VIEW_PANELS.TOOL_SHOP_LIST, `/${DEFAULT_VIEW_PANELS.TOOL_SHOP_LIST}`, []),
      createPanel(DEFAULT_VIEW_PANELS.USER_TOOL_LIST, `/${DEFAULT_VIEW_PANELS.USER_TOOL_LIST}`, []),
      createPanel(DEFAULT_VIEW_PANELS.USER_CAR, `${DEFAULT_VIEW_PANELS.USER_CAR_LIST}/:userCarId`, []),
      createPanel(DEFAULT_VIEW_PANELS.MAIN_SCREEN, '*', []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
