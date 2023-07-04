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
 * @property {string[]} colors - Palette colors (hexadecimal)
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

/**
 * @description Get a palette.
 * @param {string} name - Palette name
 * @param {number} number - Number of classes in the palette
 * @returns {Palette} - The corresponding palette
 */
export const getPalette = (name: string, number: number): Palette | undefined => palettes.find((palette) => palette.name === name && palette.number === number);

/**
 * @description Get the colors of a palette.
 * @param {string} name - Palette name
 * @param {number} number - Number of classes in the palette
 * @param {boolean} reverse - Whether to reverse the order of the colors
 */
export const getColors = (name: string, number: number, reverse?: boolean): string[] | undefined => {
  const pal = getPalette(name, number);
  if (!pal) return;
  if (reverse === true) {
    return pal.colors.slice().reverse();
  }
  return pal.colors;
}

/**
 * @description Find palettes matching the requested criteria. Note that 1) if no criteria is provided, all palettes are returned,
 * 2) if multiple criteria are provided, they are combined with AND, and 3) the criteria are case-insensitive.
 * @param {Object} [options] - Options
 * @param {string} [options.type] - Palette type ('sequential', 'diverging' or 'qualitative')
 * @param {number} [options.number] - Number of classes in the palette
 * @param {string} [options.provider] - Palette provider
 * @param {string} [options.name] - Palette name
 */
export const findPalettes = (options: { type?: string, number?: number, provider?: string, name?: string} = {}): Palette[] => {
  const { type, number, provider, name } = options;

  // If there is no criteria, return all palettes.
  if (!type && !number && !provider && !name) return palettes;

  const _type = type ? type.toLowerCase() : undefined;
  const _provider = provider ? provider.toLowerCase() : undefined;
  const _name = name ? name.toLowerCase() : undefined;

  // Find palettes that match the requested criteria.
  return palettes.filter((palette) => {
    if (type && palette.type !== _type) return false;
    if (number && palette.number !== number) return false;
    if (provider && palette.provider !== _provider) return false;
    if (name && palette.name.toLowerCase() !== _name) return false;
    return true;
  });
}

/**
 * @description Return the names of the palette providers.
 * @returns {string[]} - Palette providers
 */
export const getPaletteProviders = (): Provider[] => Object.keys(Provider).map((key) => Provider[key as keyof typeof Provider]);

/**
 * @description Return the names of the palette types.
 * @returns {string[]} - Palette types
 */
export const getPaletteTypes = (): PaletteType[] => Object.keys(PaletteType).map((key) => PaletteType[key as keyof typeof PaletteType]);

/**
 * @description Return the names of the palettes.
 * @returns {string[]} - Palette names
 */
export const getPaletteNames = (): string[] => [...new Set(palettes.map((palette) => palette.name))];