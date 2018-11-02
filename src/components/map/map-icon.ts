const BASE_MAP_ASSETS = 'assets/img/map/';
// const BASE_HALLOWEEN_MAP_ASSETS = 'assets/img/halloween/map/';

/**
 * All icons are in retina size
 */
export const MapIcon = {
  // Active state
  ACTIVE: {
    url: BASE_MAP_ASSETS + 'marker-active.png',
    size: {
      width: 62,
      height: 72
    }
  },

  // Station unavailable
  UNAVAILABLE: {
    url: BASE_MAP_ASSETS + 'marker-unavailable.png',
    size: {
      width: 29,
      height: 29
    },
    anchor: [14.5, 13]
  },
  UNAVAILABLE_ACTIVE: {
    url: BASE_MAP_ASSETS + 'marker-unavailable-active.png',
    size: {
      width: 62,
      height: 72
    }
  },

  // User position
  USER: {
    url: BASE_MAP_ASSETS + 'marker-user.png',
    size: {
      width: 18,
      height: 30
    },
    anchor: [9, 21]
  }
};

const MARKER_USAGE_BASE = BASE_MAP_ASSETS + 'marker-';
const MARKER_USAGE_EXT = '.png';

export class DynamicMapIcon {
  static getIcon(fulfillmentInPercent: number): any {
    let baseIcon = {
      url: '',
      size: {
        width: 29,
        height: 29
      },
      anchor: [14.5, 13]
    };

    // generate marker based on fulfillment value
    let markerValue = 0;
    if (fulfillmentInPercent <= 0) {
      markerValue = 0;
    } else if (fulfillmentInPercent <= 10) {
      markerValue = 10;
    } else if (fulfillmentInPercent <= 20) {
      markerValue = 20;
    } else if (fulfillmentInPercent <= 30) {
      markerValue = 30;
    } else if (fulfillmentInPercent <= 40) {
      markerValue = 40;
    } else if (fulfillmentInPercent <= 50) {
      markerValue = 50;
    } else if (fulfillmentInPercent <= 60) {
      markerValue = 60;
    } else if (fulfillmentInPercent <= 70) {
      markerValue = 70;
    } else if (fulfillmentInPercent <= 80) {
      markerValue = 80;
    }
    // avoid to have station with 1 bike and a full icon
    else if (fulfillmentInPercent < 100) {
      markerValue = 90;
    } else if (fulfillmentInPercent === 100) {
      markerValue = 100;
    }

    baseIcon.url = `${MARKER_USAGE_BASE}${markerValue}${MARKER_USAGE_EXT}`;
    return baseIcon;
  }
}