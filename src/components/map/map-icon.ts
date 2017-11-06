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
    url: 'www/assets/img/vliller-marker-unavailable@2x.png',
    size: {
      width: 34,
      height: 40
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

const MARKERS_BY_USAGE = {
  0: 'www/assets/img/marker/marker-0.png',
  16: 'www/assets/img/marker/marker-16.png',
  25: 'www/assets/img/marker/marker-25.png',
  33: 'www/assets/img/marker/marker-33.png',
  50: 'www/assets/img/marker/marker-50.png',
  66: 'www/assets/img/marker/marker-66.png',
  75: 'www/assets/img/marker/marker-75.png',
  83: 'www/assets/img/marker/marker-83.png',
  100: 'www/assets/img/marker/marker-100.png',
}

export class DynamicMapIcon {
  static getIcon(usageInPercent: number): any {
    let markerUrl = MARKERS_BY_USAGE[100];

    if (usageInPercent <= 0) {
      markerUrl = MARKERS_BY_USAGE[0];
    } else if (usageInPercent <= 16) {
      markerUrl = MARKERS_BY_USAGE[16];
    } else if (usageInPercent <= 25) {
      markerUrl = MARKERS_BY_USAGE[25];
    } else if (usageInPercent <= 33) {
      markerUrl = MARKERS_BY_USAGE[33];
    } else if (usageInPercent <= 50) {
      markerUrl = MARKERS_BY_USAGE[50];
    } else if (usageInPercent <= 66) {
      markerUrl = MARKERS_BY_USAGE[66];
    } else if (usageInPercent <= 75) {
      markerUrl = MARKERS_BY_USAGE[75];
    } else if (usageInPercent < 100) {
      markerUrl = MARKERS_BY_USAGE[83];
    }

    return {
      url: markerUrl,
      size: {
        width: 28,
        height: 28
      }
    }
  }
}