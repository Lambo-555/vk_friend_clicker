import {
  type AdaptivityProps,
  getViewWidthByViewportWidth,
  getViewHeightByViewportHeight,
  ViewWidth,
  SizeType,
} from '@vkontakte/vkui';
import type { UseAdaptivity } from '@vkontakte/vk-bridge-react';

export const transformVKBridgeAdaptivity = ({
  type,
  viewportWidth,
  viewportHeight,
}: UseAdaptivity): AdaptivityProps => {
  switch (type) {
    case 'adaptive':
      return {
        viewWidth: getViewWidthByViewportWidth(viewportWidth),
        viewHeight: getViewHeightByViewportHeight(viewportHeight),
      };
    case 'force_mobile':
    case 'force_mobile_compact':
      return {
        viewWidth: ViewWidth.MOBILE,
        sizeX: SizeType.COMPACT,
        sizeY: type === 'force_mobile_compact' ? SizeType.COMPACT : SizeType.REGULAR,
      };
    default:
      return {};
  }
};

export const moneyShorter = (moneyCount: number): string => {
  if (moneyCount >= 1_000_000) {
    return Math.round(moneyCount / 1_000_000 * 1000) / 1000 + 'M';
  } else if (moneyCount >= 1_000) {
    return Math.round(moneyCount / 1000 * 10) / 10 + 'K';
  } else {
    return '' + moneyCount;
  }
}
