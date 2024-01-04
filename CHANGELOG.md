# Changelog

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