import {
  addPalette,
  getAsymmetricDivergingColors,
  getPalette,
  getPalettes,
  getSequentialColors,
} from '../src';

describe('getPalette', () => {
  it('should return a palette when the name exists', () => {
    const palette = getPalette('Vivid', 7);
    expect(palette).toBeDefined();
    expect(palette!.colors.length).toBe(7);
  });

  it('should return undefined when the name does not exist', () => {
    const palette = getPalette('NonExistent', 7);
    expect(palette).toBeUndefined();
  });

  it('should return undefined when the number doesn\'t exist', () => {
    const palette1 = getPalette('Vivid', 1);
    expect(palette1).toBeUndefined();

    const palette2 = getPalette('Vivid', 12000);
    expect(palette2).toBeUndefined();
  });
});

describe('getSequentialColors', () => {
  it('should return a palette when the name exists, without interpolation if not needed', () => {
    const colors = getSequentialColors('Blues', 4);
    expect(colors).toBeDefined();
    expect(colors.length).toBe(4);
  });

  it('should return a palette when the name exists, with interpolation if needed', () => {
    const colors = getSequentialColors('Blues', 20);
    expect(colors).toBeDefined();
    expect(colors.length).toBe(20);
  });

  it('should throw Error when the name does not exist', () => {
    expect(() => getSequentialColors('NonExistent', 7))
      .toThrow(Error);
  });

  it('should return a reversed palette when "reverse" parameter is used', () => {
    const colors = getSequentialColors('Blues', 20);
    const colorsRev = getSequentialColors('Blues', 20, true);
    expect(colorsRev).toBeDefined();
    expect(colorsRev.length).toBe(20);
    expect(colorsRev).toEqual(colors.slice().reverse());
  });
});

const allDivergingNames = new Set(getPalettes({ type: "diverging" }).map((p) => p.name));

describe('getAsymmetricDivergingColors', () => {
  it('should throw Error when the name does not exist', () => {
    expect(() => getAsymmetricDivergingColors('NonExistent', 7, 7, true, true))
      .toThrow(Error);
  });

  it('should throw Error when the number of colors is less than 1 on any side', () => {
    expect(() => getAsymmetricDivergingColors('Balance', 0, 7, true, true))
      .toThrow(Error);
    expect(() => getAsymmetricDivergingColors('Balance', 7, 0, true, true))
      .toThrow(Error);
    expect(() => getAsymmetricDivergingColors('Balance', 0, 0, true, true))
      .toThrow(Error);
  });

  it('should return the correct number of colors for balanced palettes with central class', () => {
    for (let nRight = 1; nRight <= 15; nRight++) {
      for (let nLeft = 1; nLeft <= 15; nLeft++) {
        for (const name of allDivergingNames) {
          const colors = getAsymmetricDivergingColors(name, nLeft, nRight, true, true);
          expect(colors).toBeDefined();
          expect(colors.length).toBe(nLeft + nRight + 1);
        }
      }
    }
  });

  it('should return the correct number of colors for balanced palettes without central class', () => {
    for (let nRight = 1; nRight <= 15; nRight++) {
      for (let nLeft = 1; nLeft <= 15; nLeft++) {
        for (const name of allDivergingNames) {
          const colors = getAsymmetricDivergingColors(name, nLeft, nRight, false, true);
          expect(colors).toBeDefined();
          expect(colors.length).toBe(nLeft + nRight);
        }
      }
    }
  });

  it('should return the correct number of colors for unbalanced palettes with central class', () => {
    for (let nRight = 1; nRight <= 15; nRight++) {
      for (let nLeft = 1; nLeft <= 15; nLeft++) {
        for (const name of allDivergingNames) {
          const colors = getAsymmetricDivergingColors(name, nLeft, nRight, true, false);
          expect(colors).toBeDefined();
          expect(colors.length).toBe(nLeft + nRight + 1);
        }
      }
    }
  });

  it('should return the correct number of colors for unbalanced palettes without central class', () => {
    for (let nRight = 1; nRight <= 15; nRight++) {
      for (let nLeft = 1; nLeft <= 15; nLeft++) {
        for (const name of allDivergingNames) {
          const colors = getAsymmetricDivergingColors(name, nLeft, nRight, false, false);
          expect(colors).toBeDefined();
          expect(colors.length).toBe(nLeft + nRight);
        }
      }
    }
  });

  it('should return the same colors for balanced and unbalanced palettes when classRight==classLeft and centralClass==true', () => {
    for (let n = 1; n <= 15; n++) {
      for (const name of allDivergingNames) {
        const colorsBalanced = getAsymmetricDivergingColors(name, n, n, true, true);
        const colorsUnbalanced = getAsymmetricDivergingColors(name, n, n, true, false);
        expect(colorsBalanced).toBeDefined();
        expect(colorsUnbalanced).toBeDefined();
        expect(colorsBalanced).toEqual(colorsUnbalanced);
      }
    }
  });

  it('should return the same colors for balanced and unbalanced palettes when classRight==classLeft and centralClass==false', () => {
    for (let n = 1; n <= 15; n++) {
      for (const name of allDivergingNames) {
        const colorsBalanced = getAsymmetricDivergingColors(name, n, n, false, true);
        const colorsUnbalanced = getAsymmetricDivergingColors(name, n, n, false, false);
        expect(colorsBalanced).toBeDefined();
        expect(colorsUnbalanced).toBeDefined();
        expect(colorsBalanced).toEqual(colorsUnbalanced);
      }
    }
  });

  it('should return a reversed palette when "reverse" parameter is used', () => {
    const params: [string, number, number, boolean, boolean][] = [
      // Without interpolation
      ['Balance', 2, 3, true, true], // Central class is true / balanced is true
      ['Balance', 2, 3, true, false], // Central class is true / balanced is false
      ['Balance', 2, 3, false, true], // Etc.
      ['Balance', 2, 3, false, false],
      // With interpolation
      ['Balance', 7, 8, true, true],
      ['Balance', 7, 8, true, false],
      ['Balance', 7, 8, false, true],
      ['Balance', 7, 8, false, false],
    ];
    for (const [name, nLeft, nRight, centralClass, balanced] of params) {
      const colors = getAsymmetricDivergingColors(name, nLeft, nRight, centralClass, balanced);
      const colorsRev = getAsymmetricDivergingColors(name, nLeft, nRight, centralClass, balanced, true);
      expect(colorsRev).toBeDefined();
      expect(colorsRev.length).toBe(colors.length);
      expect(colorsRev).toEqual(colors.slice().reverse());
    }
  });

  it('should always return all colors as hex strings', () => {
    const params: [string, number, number, boolean, boolean][] = [
      // All cases (central class / balanced) without needing interpolation
      ['Balance', 3, 2, true, true],
      ['Balance', 3, 2, true, false],
      ['Balance', 3, 2, false, true],
      ['Balance', 3, 2, false, false],
      // All cases (central class / balanced) needing interpolation
      ['Balance', 13, 12, true, true],
      ['Balance', 13, 12, true, false],
      ['Balance', 13, 12, false, true],
      ['Balance', 13, 12, false, false],
    ];
    for (const [name, nLeft, nRight, centralClass, balanced] of params) {
      const colors = getAsymmetricDivergingColors(name, nLeft, nRight, centralClass, balanced);
      for (const color of colors) {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });
});

describe('addPalette', () => {
  it('should add a palette to the list of palettes and succeed in using helpers for sequential palettes', () => {
    addPalette({
      name: 'NewPalette',
      type: 'sequential',
      colors: ['#000000', '#FFFFFF'],
      provider: 'MyOrg',
      url: 'https://example.com',
    });
    const palette = getPalette('NewPalette', 2);
    expect(palette).toBeDefined();
    expect(palette!.colors).toEqual(['#000000', '#FFFFFF']);

    const interpolatedColors = getSequentialColors('NewPalette', 12);
    expect(interpolatedColors).toBeDefined();
    expect(interpolatedColors.length).toBe(12);
  });


  it('should throw error when trying to add invalid palettes', () => {
    expect(() => addPalette({
      name: 'NewPalette1234',
      type: 'sequential',
      colors: ['#000000'],
      provider: 'MyOrg',
      url: 'https://example.com',
    }))
      .toThrow(Error);

    expect(() => addPalette({
      name: 'NewPalette1234',
      type: 'diverging',
      colors: ['#000000'],
      provider: 'MyOrg',
      url: 'https://example.com',
    }))
      .toThrow(Error);

    // @ts-ignore
    expect(() => addPalette({
      name: 'NewPalette1234',
      type: 'qualitative',
      provider: 'MyOrg',
      url: 'https://example.com',
    }))
      .toThrow(Error);

    expect(() => addPalette({
      name: 'NewPalette1234',
      type: 'qualitative',
      provider: 'MyOrg',
      url: 'https://example.com',
      colors: ['SomeStringThatIsNotAColor', 'SomeOtherStringThatIsNotAColor'],
    }))
      .toThrow(Error);
  });

  it('should add a palette to the list of palettes and succeed in using helpers for diverging palettes (1)', () => {
    addPalette({
      name: 'NewDivergingPalette1',
      type: 'diverging',
      colors: ['#D7191C', '#FDAE61', '#d7d7d7', '#ABDDA4', '#35AF24'],
      provider: 'MyOrg',
      url: 'https://example.com',
    });

    addPalette({
      name: 'NewDivergingPalette1',
      type: 'diverging',
      colors: ['#D7191C', '#efc091', '#b8e1b2', '#35AF24'],
      provider: 'MyOrg',
      url: 'https://example.com',
    });

    const colors1 = getAsymmetricDivergingColors('NewDivergingPalette1', 3, 5, true, true);
    expect(colors1).toBeDefined();
    expect(colors1.length).toBe(9);
    expect(colors1[3]).toBe('#d7d7d7');

    const colors2 = getAsymmetricDivergingColors('NewDivergingPalette1', 3, 5, false, true);
    expect(colors2).toBeDefined();
    expect(colors2.length).toBe(8);

    const colors3 = getAsymmetricDivergingColors('NewDivergingPalette1', 3, 5, true, false);
    expect(colors3).toBeDefined();
    expect(colors3.length).toBe(9);
    expect(colors3[3]).toBe('#d7d7d7');

    const colors4 = getAsymmetricDivergingColors('NewDivergingPalette1', 3, 5, false, false);
    expect(colors4).toBeDefined();
    expect(colors4.length).toBe(8);

    const colors5 = getAsymmetricDivergingColors('NewDivergingPalette1', 5, 3, true, false);
    expect(colors5).toBeDefined();
    expect(colors5.length).toBe(9);
    expect(colors5[5]).toBe('#d7d7d7');

    const colors6 = getAsymmetricDivergingColors('NewDivergingPalette1', 5, 3, true, true);
    expect(colors6).toBeDefined();
    expect(colors6.length).toBe(9);
    expect(colors6[5]).toBe('#d7d7d7');
  });

  it('should add a palette to the list of palettes and succeed in using helpers for diverging palettes (2)', () => {
    addPalette({
      name: 'NewDivergingPalette2',
      type: 'diverging',
      colors: ['#D7191C','#d7d7d7', '#35AF24'],
      provider: 'MyOrg',
      url: 'https://example.com',
    });

    addPalette({
      name: 'NewDivergingPalette2',
      type: 'diverging',
      colors: ['#D7191C', '#efc091', '#b8e1b2', '#35AF24'],
      provider: 'MyOrg',
      url: 'https://example.com',
    });

    const colors0 = getAsymmetricDivergingColors('NewDivergingPalette2', 3, 5, true, true);
    expect(colors0).toBeDefined();
    expect(colors0.length).toBe(9);
    expect(colors0[3]).toBe('#d7d7d7');

    const colors1 = getAsymmetricDivergingColors('NewDivergingPalette2', 3, 5, false, true);
    expect(colors1).toBeDefined();
    expect(colors1.length).toBe(8);

    const colors2 = getAsymmetricDivergingColors('NewDivergingPalette2', 3, 5, true, false);
    expect(colors2).toBeDefined();
    expect(colors2.length).toBe(9);
    expect(colors2[3]).toBe('#d7d7d7');

    const colors3 = getAsymmetricDivergingColors('NewDivergingPalette2', 3, 5, false, false);
    expect(colors3).toBeDefined();
    expect(colors3.length).toBe(8);
  });

  it('should add a palette to the list of palettes and succeed in using helpers for diverging palettes (3)', () => {
    addPalette({
      name: 'NewDivergingPalette3',
      type: 'diverging',
      colors: ['#a1292b', '#D7191C', '#FDAE61', '#d7d7d7', '#ABDDA4', '#35AF24', '#177a09'],
      provider: 'MyOrg',
      url: 'https://example.com',
    });

    addPalette({
      name: 'NewDivergingPalette3',
      type: 'diverging',
      colors: ['#a1292b', '#D7191C', '#FDAE61', '#ABDDA4', '#35AF24', '#177a09'],
      provider: 'MyOrg',
      url: 'https://example.com',
    });

    // ...
    const colors1 = getAsymmetricDivergingColors('NewDivergingPalette3', 3, 5, true, true);
    expect(colors1).toBeDefined();
    expect(colors1.length).toBe(9);
    expect(colors1[3]).toBe('#d7d7d7');

    const colors2 = getAsymmetricDivergingColors('NewDivergingPalette3', 3, 5, false, true);
    expect(colors2).toBeDefined();
    expect(colors2.length).toBe(8);

    const colors3 = getAsymmetricDivergingColors('NewDivergingPalette3', 3, 5, true, false);
    expect(colors3).toBeDefined();
    expect(colors3.length).toBe(9);
    expect(colors3[3]).toBe('#d7d7d7');

    const colors4 = getAsymmetricDivergingColors('NewDivergingPalette3', 3, 5, false, false);
    expect(colors4).toBeDefined();
    expect(colors4.length).toBe(8);

    // ...
    const colors5 = getAsymmetricDivergingColors('NewDivergingPalette3', 1, 1, true, true);
    expect(colors5).toBeDefined();
    expect(colors5.length).toBe(3);
    expect(colors5[1]).toBe('#d7d7d7');

    /// ...
    const colors6a = getAsymmetricDivergingColors('NewDivergingPalette3', 2, 1, true, false);
    expect(colors6a).toBeDefined();
    expect(colors6a.length).toBe(4);
    expect(colors6a[2]).toBe('#d7d7d7');

    const colors6b = getAsymmetricDivergingColors('NewDivergingPalette3', 2, 1, true, true);
    expect(colors6b).toBeDefined();
    expect(colors6b.length).toBe(4);
    expect(colors6b[2]).toBe('#d7d7d7');


    // ...
    const colors7a = getAsymmetricDivergingColors('NewDivergingPalette3', 2, 3, true, true);
    expect(colors7a).toBeDefined();
    expect(colors7a.length).toBe(6);
    expect(colors7a[2]).toBe('#d7d7d7');

    const colors7b = getAsymmetricDivergingColors('NewDivergingPalette3', 2, 3, true, false);
    expect(colors7b).toBeDefined();
    expect(colors7b.length).toBe(6);
    expect(colors7b[2]).toBe('#d7d7d7');


    // ...
    const colors8 = getAsymmetricDivergingColors('NewDivergingPalette3', 10, 12, false, false);
    expect(colors8).toBeDefined();
    expect(colors8.length).toBe(22);

    const colors9 = getAsymmetricDivergingColors('NewDivergingPalette3', 10, 12, true, false);
    expect(colors9).toBeDefined();
    expect(colors9.length).toBe(23);
    expect(colors9[10]).toBe('#d7d7d7');

    const colors10 = getAsymmetricDivergingColors('NewDivergingPalette3', 10, 12, false, true);
    expect(colors10).toBeDefined();
    expect(colors10.length).toBe(22);

    const colors11 = getAsymmetricDivergingColors('NewDivergingPalette3', 10, 12, true, true);
    expect(colors11).toBeDefined();
    expect(colors11.length).toBe(23);
    expect(colors11[10]).toBe('#d7d7d7');
  });
});