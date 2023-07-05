import data from './palettes.json';
import cbf from './cbf.json'

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
 * @property {string} CARTOCOLORS - CARTOColors palettes
 * @property {string} CMOCEAN - cmocean palettes
 * @property {string} COLORBREWER - ColorBrewer palettes
 * @property {string} LIGHTBARTLEIN - Light Bartlein palettes
 * @property {string} MATPLOTLIB - Matplotlib palettes
 * @property {string} MYCARTA - MyCarta palettes
 * @property {string} SCIENTIFIC - Fabio Crameri's Scientific palettes
 * @property {string} TABLEAU - Tableau palettes
 * @property {string} WESANDERSON - Wes Anderson palettes
 * @property {string} OKABEITO - Okabe & Ito's palette
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
  OKABEITO = 'okabeito',
}

/**
 * @description A Palette object.
 * @typedef {Object} Palette
 * @property {string} id - Palette id
 * @property {string} name - Palette name
 * @property {number} number - Palette number
 * @property {PaletteType} type - Palette type
 * @property {string[]} colors - Palette colors (hexadecimal)
 * @property {Provider} provider - Palette provider
 * @property {string} [url] - Reference url
 * @property {boolean} [cbf] - Whether the palette is colorblind-friendly
 */
type Palette = {
  id: string;
  name: string;
  number: number;
  type: PaletteType;
  colors: string[];
  provider: Provider;
  url: string;
  cbf?: boolean;
}

// @ts-ignore
const paletteDescriptions = data as { [key in Provider]: any };

const allProviders = Object.keys(paletteDescriptions);
const allTypes = Object.keys(PaletteType).map((key) => PaletteType[key as keyof typeof PaletteType]);

/**
 * @description Get a palette, given a name and number of classes. If no palette is found, undefined is returned.
 * @param {string} name - Palette name
 * @param {number} number - Number of classes in the palette
 * @returns {Palette | undefined} - The corresponding palette (if any)
 */
export const getPalette = (name: string, number: number): Palette | undefined => {
  for (let i = 0; i < allProviders.length; i++) {
    const provider = allProviders[i];
    if (paletteDescriptions[provider as Provider][name]?.values[`${number}`]) {
      const o = {
        id: `${name}_${number}`,
        name,
        number,
        type: paletteDescriptions[provider as Provider][name].type as PaletteType,
        colors: paletteDescriptions[provider as Provider][name].values[`${number}`],
        provider: provider as Provider,
        url: paletteDescriptions[provider as Provider][name].url,
      };
      if (cbf.includes(o.id)) {
        // @ts-ignore
        o.cbf = true;
      }
      return o as Palette;
    }
  }
  return undefined;
}

/**
 * @description Get a palette by id. If no palette is found, undefined is returned.
 * @param {string} id - Palette id (follows the pattern '{name}_{number}')
 * @returns {Palette | undefined} - The corresponding palette (if any)
 */
export const getPaletteById = (id: string): Palette | undefined => {
  const ix = id.search(/_\d+$/);
  if (ix === -1) return undefined;
  const name = id.slice(0, ix);
  const number = parseInt(id.slice(ix + 1), 10);
  return getPalette(name, number);
}

/**
 * @description Get the colors of a palette, given its name and its number of classes.
 * @param {string} name - Palette name
 * @param {number} number - Number of classes in the palette
 * @param {boolean} reverse - Whether to reverse the order of the colors
 * @returns {string[] | undefined} - The colors of the palette (if any)
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
 * @description Get the colors of a palette given its id.
 * @param {string} id - Palette id (follows the pattern '{name}_{number}')
 * @param {boolean} reverse - Whether to reverse the order of the colors
 * @returns {string[] | undefined} - The colors of the palette (if any)
 */
export const getColorsById = (id: string, reverse?: boolean): string[] | undefined => {
  const pal = getPaletteById(id);
  if (!pal) return;
  if (reverse === true) {
    return pal.colors.slice().reverse();
  }
  return pal.colors;
}

const getAllPalettes = (): Palette[] => {
  const res: Palette[] = [];

  allProviders.forEach((provider) => {
    const names = Object.keys(paletteDescriptions[provider as Provider]);
    names.forEach((name) => {
      const type = paletteDescriptions[provider as Provider][name].type as PaletteType;
      const url = paletteDescriptions[provider as Provider][name].url;
      const numbers = Object.keys(paletteDescriptions[provider as Provider][name].values);
      numbers.forEach((number) => {
        const o = {
          id: `${name}_${number}`,
          name,
          number: parseInt(number, 10),
          type,
          colors: paletteDescriptions[provider as Provider][name].values[number],
          provider: provider as Provider,
          url,
        };
        if (cbf.includes(o.id)) {
          // @ts-ignore
          o.cbf = true;
        }
        res.push(o as Palette);
      });
    });
  });

  return res;
};

/**
 * @description Returns palettes matching the requested criteria. Note that
 * 1) if no criteria is provided, all palettes are returned,
 * 2) if multiple criteria are provided, they are combined with AND, and
 * 3) the criteria are case-insensitive.
 * @param {Object} [options] - Options
 * @param {string} [options.type] - Palette type ('sequential', 'diverging' or 'qualitative')
 * @param {number} [options.number] - Number of classes in the palette
 * @param {string} [options.provider] - Palette provider
 * @param {string} [options.name] - Palette name
 * @returns {Palette[]} - Palettes matching the requested criteria, or all palettes if no criteria is provided
 */
export const getPalettes = (options: { type?: string, number?: number, provider?: string, name?: string} = {}): Palette[] => {
  const { type, number, provider, name } = options;

  const allPalettes = getAllPalettes();
  // If there is no criteria, return all palettes.
  if (!type && !number && !provider && !name) return allPalettes;

  const _type = type ? type.toLowerCase() : undefined;
  const _provider = provider ? provider.toLowerCase() : undefined;
  const _name = name ? name.toLowerCase() : undefined;

  // Find palettes that match the requested criteria.
  return allPalettes.filter((palette) => {
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
export const getPaletteProviders = (): Provider[] => allProviders.slice() as Provider[];

/**
 * @description Return the names of the palette types.
 * @returns {string[]} - Palette types
 */
export const getPaletteTypes = (): PaletteType[] => allTypes.slice() as PaletteType[];

/**
 * @description Return the names of the palettes (for all providers if no provider is specified).
 * @param {string} [provider] - Palette provider
 * @returns {string[]} - Palette names
 */
export const getPaletteNames = (provider?: Provider): string[] => {
  if (!provider) {
    return Object.keys(paletteDescriptions).map((p) => Object.keys(paletteDescriptions[p as Provider])).flat();
  }
  return Object.keys(paletteDescriptions[provider]);
}

/**
 * @description Return the available numbers of classes for a given palette name.
 * @param {string} name - Palette name
 * @returns {number[]} - Available numbers of classes
 */
export const getPaletteNumbers = (name: string): number[] => {
  const res: number[] = [];
  allProviders.forEach((provider) => {
    if (paletteDescriptions[provider as Provider][name]) {
      const numbers = Object.keys(paletteDescriptions[provider as Provider][name].values);
      numbers.forEach((number) => {
        res.push(parseInt(number, 10));
      });
    }
  });
  return res;
}

/**
 * @description Get the raw description of the palettes (for all providers if no provider is specified,
 *              otherwise for the specified provider).
 * @param {Provider} [provider] - Palette provider
 * @returns {Object} - Raw description of all the palette variations
 */
export const getRawData = (provider?: Provider) => {
  if (!provider) {
    return paletteDescriptions;
  }
  return paletteDescriptions[provider];
}
