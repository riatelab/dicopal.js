# Dicopal

**Di**screte **co**lor **pal**ettes (*hundreds of them!*) for JavaScript.

![palettes](./palettes.png)


> Dicopal offers color palettes from:
> - [Colorbrewer2](https://colorbrewer2.org/)
> - [Fabio Crameri's Scientific Colour Maps](https://www.fabiocrameri.ch/colourmaps/)
> - [CARTOColors](https://carto.com/carto-colors/)
> - [cmocean](https://matplotlib.org/cmocean/)
> - [Light & Bartlein](https://agupubs.onlinelibrary.wiley.com/doi/abs/10.1029/2004EO400002)
> - [Matplotlib](https://bids.github.io/colormap/)
> - [MyCarta](https://mycartablog.com/color-palettes/)
> - [Tableau](https://help.tableau.com/current/pro/desktop/en-us/formatting_create_custom_colors.htm#hex-values-for-discontinued-color-palettes)
> - [The Wes Anderson Palettes blog](https://wesandersonpalettes.tumblr.com/)
> - [Masataka Okabe and Kei Ito's Color Universal Design (CUD) palette](https://jfly.uni-koeln.de/color/)
> - [Joshua Stevens' palettes](https://www.joshuastevens.net/)

⏩ [Browse all the available palettes](https://observablehq.com/@mthh/hello-dicopal)  
⏩ [Example about the creation of asymmetric diverging palettes](https://observablehq.com/@mthh/asymmetric-diverging-schemes-with-dicopal)

## Installation

### NPM

Add the package to your project:

```bash
npm install dicopal
```

### CDN

Add the script to your HTML:

```html
<script src="https://unpkg.com/dicopal"></script>
```

## Usage

### Get a palette, by name and number of colors

```javascript
const pal = getPalette('Pastel', 4); // Returns the "Pastel" palette with 4 colors
// {
//   "number": 4,
//   "type": "qualitative",
//   "name": "Pastel",
//   "id": "Pastel_4",
//   "colors": ["#66C5CC","#F6CF71","#F89C74","#DCB0F2"],
//   "provider": "cartocolors",
//   "url": "https://github.com/CartoDB/CartoColor/wiki/CARTOColor-Scheme-Names"
// }
```

### Get a palette colors, by name and number of colors

```javascript
const cols = getColors('Pastel', 4); // Returns the "Pastel" palette with 4 colors
// ["#66C5CC","#F6CF71","#F89C74","#DCB0F2"]
```

Colors can also be reversed:

```javascript
const cols = getColors('Pastel', 4, true);
// ['#DCB0F2', '#F89C74', '#F6CF71', '#66C5CC']
```

### List the existing palettes for a given number of colors

```javascript
// Returns 135 instances of palette with 3 colors
const palettes = getPalettes({ number: 3 });
```

### List the existing palettes for a given type (sequential, diverging, qualitative)

```javascript
// Returns 160 instances of qualitative palettes
const palettes = getPalettes({ type: 'qualitative' });
```

### List the existing palettes for a given provider (ColorBrewer, Tableau, etc.)

```javascript
// Returns 265 instances of colorbrewer palettes
const palettes = getPalettes({ provider: 'colorbrewer' });
```

### List the existing palettes for a given name (for example, 'Accent')

```javascript
// Returns the 6 instances of the "Accent" palette
const palettes = getPalettes({ name: 'Accent' });
```

### List the existing palettes that match a set of criteria

```javascript
// Returns the 12 instances of the palettes that are qualitative and have 10 colors
const palettes = getPalettes({ type: 'qualitative', number: 10 });
```

### All the palettes or more criteria

When no argument is provided, the `getPalettes` function returns all the palettes:

```javascript
// Returns the 1600 instances of palettes
const allPalettes = getPalettes();
```

You can then filter the palettes yourself by any combination of criteria:

```javascript
// Only sequential and diverging palettes from all providers except colorbrewer
// with between 3 and 12 colors
const palettes = allPalettes
  .filter((p) => (
    ['sequential', 'diverging'].includes(p.type)
    && p.provider !== 'colorbrewer'
    && p.number >= 3
    && p.number <= 12)
  );
```

### List the existing providers

```javascript
const providers = getPaletteProviders(); // Returns the 10 providers
```

### List the existing types

```javascript
const providers = getPaletteTypes(); // Returns the 3 types
```

### List the existing palette names

```javascript
// Returns the 179 names ('ArmyRose', 'BrBg', 'Accent', etc.)
const providers = getPaletteNames();
```

```javascript
// Returns the 35 names ('BrBg', 'PRGn', etc.)
const providers = getPaletteNames('colorbrewer');
```

### Get the number of classes for a given palette

```javascript
// Returns an array of numbers, like [3, 4, 5, 6, 7, 8]
const numClasses = getPaletteNumbers('Pastel2');
```

### Generating colors for asymmetric diverging palettes

The `getAsymmetricDivergingPalette` function enables the creation of asymmetric diverging palettes
(e.g. 3 colors for the left side and 4 colors for the right side),
either balanced (i.e. the perceptual distance between the colors is the same on both sides) or not.

It takes the following arguments:
- `divergingSchemeName` (string): the name of the diverging scheme to use (e.g. 'RdYlBu')
- `leftNumber` (number): the number of colors to use on the left side
- `rightNumber` (number): the number of colors to use on the right side
- `centralClass` (boolean - optional): whether to include a central class (default: false)
- `balanced` (boolean - optional): whether to balance the colors on both sides (default: false)

#### Balanced

```javascript
const pal = getAsymmetricDivergingColors('RdYlBu', 7, 2, true, true);
```

#### Unbalanced

```javascript
const pal = getAsymmetricDivergingColors('RdYlBu', 7, 2, true, false);
```

### Generating colors for (interpolated) sequential palettes

Sometimes, a palette exists only in a limited number of colors (e.g. 3-to-9 colors) but you need
a palette with a different number of colors (e.g. 12 colors).

The `getSequentialColors` function enables the creation of interpolated sequential palettes with a custom number of colors.

It takes the following arguments:

- `sequentialSchemeName` (string): the name of the sequential scheme to use (e.g. 'Blues')
- `classNumber` (number): the number of colors to use
- `reverse` (boolean - optional): whether to reverse the palette (default: false)

```javascript
const pal = getSequentialColors('Blues', 12);
```

### Not a fan of the proposed API ? Just get the raw description of the palettes and use them as you wish

For a given provider:

```javascript
getRawData('colorbrewer');
```

For all the provider (default):

```javascript
getRawData();
```

## Contributing

Contributions of all kinds are welcome, through issues and pull requests.

If you use the library and feel that the API could be improved / simplified / enriched / etc.,
don't hesitate to come and discuss it in the issues!


## Other information

Palette information is stored in the `src/palette.json` file.
It is [generated in Python](./generate-palette-descriptions.py) from various sources,
notably the [palettable](https://github.com/jiffyclub/palettable)
Python library (authored by [Matt Davis](https://github.com/jiffyclub))
and the [dicopal](https://lig-tdcge.imag.fr/steamer/dicopal/index.html) RDF vocabulary which
both provide a list of palettes with their colors and metadata.

## License

Apache-2.0. See [LICENSE](./LICENSE) for details.