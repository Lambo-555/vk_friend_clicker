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
  HOME: 'home',
  PERSIK: 'persik',
  PERSON: 'person',
  CAR_SHOP_LIST: 'carshoplist',
  USER_CAR_LIST: 'usercarlist',
  USER_CAR: 'usercar',
} as const;

export const routes = RoutesConfig.create([
  createRoot(DEFAULT_ROOT, [
    createView(DEFAULT_VIEW, [
      createPanel(DEFAULT_VIEW_PANELS.USER_CAR, '/', []),
      // createPanel(DEFAULT_VIEW_PANELS.USER_CAR_LIST, '/', []),
      // createPanel(DEFAULT_VIEW_PANELS.CAR_SHOP_LIST, '/', []),
      // createPanel(DEFAULT_VIEW_PANELS.HOME, '/', []),
      createPanel(DEFAULT_VIEW_PANELS.PERSIK, `/${DEFAULT_VIEW_PANELS.PERSIK}`, []),
      createPanel(DEFAULT_VIEW_PANELS.PERSON, `/${DEFAULT_VIEW_PANELS.PERSON}/:vkuseridparam`, []),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
