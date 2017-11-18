/**
 * All icons are in retina size
 */
export const MapIcon = {
  // Normal state
  NORMAL: {
    url: 'www/assets/img/vliller-marker-normal@2x.png',
    size: {
      width: 34,
      height: 40
    }
  },
  NORMAL_ACTIVE: {
    url: 'www/assets/img/vliller-marker-normal-active@2x.png',
    size: {
      width: 62,
      height: 72
    }
  },
  NORMAL_SMALL: {
    url: 'www/assets/img/vliller-marker-normal-small@2x.png',
    size: {
      width: 10,
      height: 10
    }
  },

  // Station unavailable
  UNAVAILABLE: {
    url: 'www/assets/img/marker/marker-unavailable.png',
    size: {
      width: 28,
      height: 28
    }
  },
  UNAVAILABLE_ACTIVE: {
    url: 'www/assets/img/vliller-marker-unavailable-active@2x.png',
    size: {
      width: 62,
      height: 72
    }
  },
  UNAVAILABLE_SMALL: {
    url: 'www/assets/img/vliller-marker-unavailable-small@2x.png',
    size: {
      width: 10,
      height: 10
    }
  },

  // User position
  USER: {
    url: 'www/assets/img/vliller-marker-user@2x.png',
    size: {
      width: 18,
      height: 30
    },
    anchor: [9, 21]
  }
};

const MARKER_USAGE_BASE = 'www/assets/img/marker/marker-';
const MARKER_USAGE_EXT = '.png';

export class DynamicMapIcon {
  static getIcon(fulfillmentInPercent: number): any {
    let baseIcon = {
      url: '',
      size: {
        width: 28,
        height: 30
      }
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