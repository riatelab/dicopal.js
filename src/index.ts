import data from './data.json';

/**
 * @description Palette type
 * @enum {string}
 * @readonly
 * @memberof Palette
 * @property {string} SEQUENTIAL - Sequential palette
 * @property {string} DIVERGING - Diverging palette
 * @property {string} QUALITATIVE - Qualitative palette
 */
enum PaletteType {
  SEQUENTIAL = 'sequential',
  DIVERGING = 'diverging',
  QUALITATIVE = 'qualitative',
}

/**
 * @description Palette provider
 * @enum {string}
 * @readonly
 * @memberof Palette
 * @property {string} CARTOCOLORS - CARTOColors palette
 * @property {string} CMOCEAN - cmocean palette
 * @property {string} COLORBREWER - ColorBrewer palette
 * @property {string} LIGHTBARTLEIN - Light Bartlein palette
 * @property {string} MATPLOTLIB - Matplotlib palette
 * @property {string} MYCARTA - MyCarta palette
 * @property {string} SCIENTIFIC - Scientific palette
 * @property {string} TABLEAU - Tableau palette
 * @property {string} WESANDERSON - Wes Anderson palette
 */
enum Provider {
  CARTOCOLORS = 'cartocolors',
  CMOCEAN = 'cmocean',
  COLORBREWER = 'colorbrewer',
  LIGHTBARTLEIN = 'lightbartlein',
  MATPLOTLIB = 'matplotlib',
  MYCARTA = 'mycarta',
  SCIENTIFIC = 'scientific',
  TABLEAU = 'tableau',
  WESANDERSON = 'wesanderson',
}

/**
 * @description Palette
 * @typedef {Object} Palette
 * @property {string} id - Palette id
 * @property {string} name - Palette name
 * @property {number} number - Palette number
 * @property {PaletteType} type - Palette type
 * @property {string[]} colors - Palette colors
 * @property {Provider} provider - Palette provider
 * @property {string} [url] - Palette url
 */
type Palette = {
  id: string;
  name: string;
  number: number;
  type: PaletteType;
  colors: string[];
  provider: Provider;
  url?: string;
}

const palettes = data as Palette[];

export const getPalette = (name: string, number: number, reverse?: boolean): string[] | undefined => {
  const pal = palettes.find((palette) => palette.name === name && palette.number === number);
  if (!pal) return;
  if (reverse === true) {
    return pal.colors.slice().reverse();
  }
  return pal.colors;
}
