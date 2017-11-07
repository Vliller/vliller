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
  static getIcon(usageInPercent: number): any {
    let baseIcon = {
      url: '',
      size: {
        width: 28,
        height: 28
      }
    };

    // generate marker based on usage value
    for (var i = 0; i < 100; i += 10) {
      if (usageInPercent <= i) {
        baseIcon.url = `${MARKER_USAGE_BASE}${i}${MARKER_USAGE_EXT}`;
        return baseIcon;
      }
    }

    // usageInPercent >= 100
    baseIcon.url = `${MARKER_USAGE_BASE}100${MARKER_USAGE_EXT}`;
    return baseIcon;
  }
}