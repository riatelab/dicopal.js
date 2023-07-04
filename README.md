# Dicopal

**Di**screte **co**lor **pal**ettes (*hundreds of them!*) for JavaScript.

![palettes](./palettes.png)


> Dicopal offers color palettes from:
> - CartoColors
> - cmocean
> - Colorbrewer2
> - Light & Bartlein
> - matplotlib
> - MyCarta
> - Scientific
> - Tableau
> - The Wes Anderson Palettes blog

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
const cols = getColors('Pastel', 4, true); // Returns the "Pastel" palette with 4 colors, reversed
// ['#DCB0F2', '#F89C74', '#F6CF71', '#66C5CC']
```

### List the existing palettes for a given number of colors

```javascript
const palettes = findPalettes({ number: 3 }); // Returns 135 instances of palette
```

### List the existing palettes for a given type (sequential, diverging, qualitative)

```javascript
const palettes = findPalettes({ type: 'qualitative' }); // Returns 159 instances of qualitative palettes
```

### List the existing palettes for a given provider (ColorBrewer, Tableau, etc.)

```javascript
const palettes = findPalettes({ provider: 'colorbrewer' }); // Returns 265 instances of colorbrewer palettes
```

### List the existing palettes for a given name (for example, 'Accent')

```javascript
const palettes = findPalettes({ name: 'Accent' }); // Returns the 6 instances of the "Accent" palette
```

### List the existing palettes that match a set of criteria

```javascript
const palettes = findPalettes({ type: 'qualitative', number: 10 }); // Returns the 12 instances of the palettes that are qualitative and have 10 colors
```

### List the existing providers

```javascript
const providers = getPaletteProviders(); // Returns the 9 providers
```

### List the existing types

```javascript
const providers = getPaletteTypes(); // Returns the 3 types
```

### List the existing palette names

```javascript
const providers = getPaletteNames(); // Returns the 177 names ('ArmyRose', 'BrBg', 'Accent', etc.)
```


## License

Apache-2.0. See [LICENSE](./LICENSE) for details.