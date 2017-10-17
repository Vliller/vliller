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

export class MapDynamicIcon {
  static generate(usageInPercent: number, width: number = 100, height: number = 100): any {
    const TOTAL = 158; // pi*2*r
    const COLOR = "#E52B38";
    const BG_COLOR = "#FFF";

    let dashSize = (usageInPercent / 100) * TOTAL;

    let svgMarker = `<?xml version="1.0"?>\n<svg width="${width}px" height="${height}px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" style="transform:rotate(-90deg);background:${COLOR};border-radius:50%;"><circle r="25" cx="50" cy="50" fill="${COLOR}" stroke="${BG_COLOR}" stroke-width="50" stroke-dasharray="${dashSize} ${TOTAL}"/></svg>`;

    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgMarker),
      size: {
        width: 34,
        height: 40
      }
    }
  }
}