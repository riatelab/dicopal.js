# Changelog

## 0.8.1 (2024-04-09)

- Fix 'reverse' behavior in getAsymmetricDivergingColors (fixes [#11](https://github.com/riatelab/dicopal.js/issues/11)).

## 0.8.0 (2024-03-25)

- New: Add 'Observable10' categorical palette from [d3-scale-chromatic](https://d3js.org/d3-scale-chromatic/categorical#schemeObservable10) (fixes [#9](https://github.com/riatelab/dicopal.js/issues/9)).

- New: Add functionality to add custom palette, with `addPalette`, to the package (fixes [#8](https://github.com/riatelab/dicopal.js/issues/8)).
  Note that it allows to handle custom palettes in the same way as the built-in ones, including calling `getSequentialColors` and `getAsymmetricDivergingColors` on them,
  but for the latter to work on all cases (balanced, unbalanced, with central classe or not, etc.), one must have added at least 2 variations of the targeted diverging palettes,
  one with a central class (and at least a total of 5 colors) and one without (and at least a total of 4 colors).

- Fix `tsconfig.json` so it doesn't output unnecessary files in `dist` folder.

- Opt for a more compact representation of palettes (fixes [#10](https://github.com/riatelab/dicopal.js/issues/10)). The minified dicopal file is now about 150 kB instead of 200 kB.

## 0.7.0 (2024-02-14)

- New: Add `reverse` optional parameter to `getAsymmetricDivergingColors` (Fixes [#6](https://github.com/riatelab/dicopal.js/issues/6)).

- Fix `getAsymmetricDivergingColors` to return the correct number of colors when `balanced` is `true` and 'classLeft' is less than 'classRight' and central class is false (Fixes [#7](https://github.com/riatelab/dicopal.js/issues/7)).

- Add test suite, notably for `getAsymmetricDivergingColors` that tests the previously reported issues (#5, #6, #7) as well
  as a few other assumptions.

- Update to rollup v4.

## 0.6.4 (2024-02-09)

- Fix values returned by `getAsymmetricDivergingColors` for unbalanced palettes (when requesting only one class on right or left side 
  and when the first declination of the original palette includes a central class) and for balanced palettes (on some case on the right side, when there is no need for interpolating).

## 0.6.3 (2024-02-06)

- Fix values returned by `getAsymmetricDivergingColors` and `getSequentialColors`.

## 0.6.2 (2024-02-06)

- Fix values returned by `getAsymmetricDivergingColors` and `getSequentialColors` to always be hexadecimals (instead of mixed hexadecimals and RGB strings).

- Fix central class value for `getAsymmetricDivergingColors` when balanced is `true` (was sometimes included in a one-member array instead of being a single value).

## 0.6.1 (2024-01-29)

- Fix order of `exports` fields `in package.json` (should fix [#4](https://github.com/riatelab/dicopal.js/issues/4)).

## 0.6.0 (2024-01-04)

- Enable the creation of asymmetric diverging palettes (e.g. 3 colors for the left side and 4 colors for the right side), either
  balanced (i.e. the perceptual distance between the colors is the same on both sides) or not. This is useful for creating
  some choropleth maps and fixes #3. See the new `getAsymmetricDivergingColors` function.

- Enable the creation of interpolated sequential palettes with a custom number of colors (i.e. if a scheme exists only in
  palette with 3-to-9 colors, it is now possible to create a palette with 12 colors). See the new `getSequentialColors` function.

## 0.5.0 (2023-09-20)

- Export missing types and enums (`Palette`, `Provider`, `Type`).
- Document `getPaletteNumbers` function in README.
- Add some of Joshua Steven's palettes.
- Build for 'esm' and 'umd' instead of 'esm' and 'cjs'.

## 0.4.0 (2023-07-05)

- Add `getRawData` function to return the raw data used by the package.
- Add `getPaletteNumbers` function to return the available number of classes for a given palette.

## 0.3.0 (2023-07-05)

- Specify location of type definitions in `package.json` to avoid warnings when using the package in a TypeScript project.

## 0.2.0 (2023-07-05)

- Update package metadata

## 0.1.0 (2023-07-05)

- Initial release