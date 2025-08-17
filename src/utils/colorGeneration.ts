// Advanced color generation utility inspired by Coolors.co
// Implements color harmony algorithms and themed palette generation

export type ColorHarmony = 'random' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'monochrome' | 'split-complementary';

export type ColorTheme = 
  | 'vibrant' 
  | 'pastel' 
  | 'vintage' 
  | 'earthy' 
  | 'neon' 
  | 'minimal' 
  | 'warm' 
  | 'cool' 
  | 'dark' 
  | 'light';

// HSL color type
export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100  
  l: number; // 0-100
}

// Convert HSL to Hex
export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

// Convert Hex to HSL
export const hexToHsl = (hex: string): HSLColor => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

// Generate random number within range
const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Theme-based color generation constraints
const getThemeConstraints = (theme: ColorTheme) => {
  switch (theme) {
    case 'pastel':
      return { saturation: [20, 50], lightness: [70, 90] };
    case 'vibrant':
      return { saturation: [70, 100], lightness: [40, 70] };
    case 'vintage':
      return { saturation: [30, 60], lightness: [35, 65] };
    case 'earthy':
      return { saturation: [25, 65], lightness: [25, 55] };
    case 'neon':
      return { saturation: [90, 100], lightness: [50, 80] };
    case 'minimal':
      return { saturation: [5, 25], lightness: [20, 80] };
    case 'warm':
      return { saturation: [40, 80], lightness: [40, 75], hueRange: [0, 60] };
    case 'cool':
      return { saturation: [40, 80], lightness: [40, 75], hueRange: [180, 300] };
    case 'dark':
      return { saturation: [20, 80], lightness: [10, 35] };
    case 'light':
      return { saturation: [10, 60], lightness: [80, 95] };
    default:
      return { saturation: [20, 90], lightness: [20, 80] };
  }
};

// Generate base color considering theme constraints
const generateBaseColor = (theme: ColorTheme = 'vibrant'): HSLColor => {
  const constraints = getThemeConstraints(theme);
  
  let hue: number;
  if (constraints.hueRange) {
    hue = random(constraints.hueRange[0], constraints.hueRange[1]);
  } else {
    hue = random(0, 360);
  }

  return {
    h: Math.round(hue),
    s: Math.round(random(constraints.saturation[0], constraints.saturation[1])),
    l: Math.round(random(constraints.lightness[0], constraints.lightness[1]))
  };
};

// Color harmony generation algorithms
export const generateColorsByHarmony = (
  baseColor: HSLColor, 
  harmony: ColorHarmony, 
  count: number,
  theme: ColorTheme = 'vibrant'
): string[] => {
  const colors: HSLColor[] = [baseColor];
  const constraints = getThemeConstraints(theme);

  switch (harmony) {
    case 'analogous':
      // Colors adjacent on color wheel (±30°)
      for (let i = 1; i < count; i++) {
        const hueShift = (i % 2 === 0 ? 1 : -1) * Math.ceil(i / 2) * random(15, 45);
        colors.push({
          h: (baseColor.h + hueShift + 360) % 360,
          s: Math.round(random(constraints.saturation[0], constraints.saturation[1])),
          l: Math.round(random(constraints.lightness[0], constraints.lightness[1]))
        });
      }
      break;

    case 'complementary':
      // Opposite colors on color wheel (180°)
      colors.push({
        h: (baseColor.h + 180) % 360,
        s: Math.round(random(constraints.saturation[0], constraints.saturation[1])),
        l: Math.round(random(constraints.lightness[0], constraints.lightness[1]))
      });
      // Fill remaining with variations
      for (let i = 2; i < count; i++) {
        const baseIndex = i % 2;
        const variation = random(-30, 30);
        colors.push({
          h: (colors[baseIndex].h + variation + 360) % 360,
          s: Math.round(random(constraints.saturation[0], constraints.saturation[1])),
          l: Math.round(random(constraints.lightness[0], constraints.lightness[1]))
        });
      }
      break;

    case 'triadic':
      // Three colors equally spaced (120°)
      if (count >= 2) {
        colors.push({ h: (baseColor.h + 120) % 360, s: baseColor.s, l: baseColor.l });
      }
      if (count >= 3) {
        colors.push({ h: (baseColor.h + 240) % 360, s: baseColor.s, l: baseColor.l });
      }
      // Fill remaining with variations
      for (let i = 3; i < count; i++) {
        const baseIndex = i % 3;
        colors.push({
          h: colors[baseIndex].h,
          s: Math.round(random(constraints.saturation[0], constraints.saturation[1])),
          l: Math.round(random(constraints.lightness[0], constraints.lightness[1]))
        });
      }
      break;

    case 'tetradic':
      // Four colors in rectangle (90°)
      if (count >= 2) colors.push({ h: (baseColor.h + 90) % 360, s: baseColor.s, l: baseColor.l });
      if (count >= 3) colors.push({ h: (baseColor.h + 180) % 360, s: baseColor.s, l: baseColor.l });
      if (count >= 4) colors.push({ h: (baseColor.h + 270) % 360, s: baseColor.s, l: baseColor.l });
      // Fill remaining with variations
      for (let i = 4; i < count; i++) {
        const baseIndex = i % 4;
        colors.push({
          h: colors[baseIndex].h,
          s: Math.round(random(constraints.saturation[0], constraints.saturation[1])),
          l: Math.round(random(constraints.lightness[0], constraints.lightness[1]))
        });
      }
      break;

    case 'monochrome':
      // Same hue, different saturation and lightness
      for (let i = 1; i < count; i++) {
        colors.push({
          h: baseColor.h,
          s: Math.round(random(constraints.saturation[0], constraints.saturation[1])),
          l: Math.round(random(constraints.lightness[0], constraints.lightness[1]))
        });
      }
      break;

    case 'split-complementary':
      // Base + two colors adjacent to complement
      if (count >= 2) {
        colors.push({ h: (baseColor.h + 150) % 360, s: baseColor.s, l: baseColor.l });
      }
      if (count >= 3) {
        colors.push({ h: (baseColor.h + 210) % 360, s: baseColor.s, l: baseColor.l });
      }
      // Fill remaining with variations
      for (let i = 3; i < count; i++) {
        const baseIndex = i % 3;
        colors.push({
          h: colors[baseIndex].h,
          s: Math.round(random(constraints.saturation[0], constraints.saturation[1])),
          l: Math.round(random(constraints.lightness[0], constraints.lightness[1]))
        });
      }
      break;

    default: // random
      for (let i = 1; i < count; i++) {
        colors.push(generateBaseColor(theme));
      }
      break;
  }

  // Ensure we have exactly the requested count
  while (colors.length < count) {
    colors.push(generateBaseColor(theme));
  }

  // Convert to hex and return
  return colors.slice(0, count).map(color => 
    hslToHex(color.h, color.s, color.l)
  );
};

// Main palette generation function
export const generatePalette = (
  count: number = 5,
  harmony: ColorHarmony = 'random',
  theme: ColorTheme = 'vibrant',
  lockedColors: { index: number; color: string }[] = []
): string[] => {
  // Generate base color or use first locked color
  const baseColor = lockedColors.length > 0 && lockedColors[0].index === 0
    ? hexToHsl(lockedColors[0].color)
    : generateBaseColor(theme);

  // Generate palette using harmony rules
  const generatedColors = generateColorsByHarmony(baseColor, harmony, count, theme);

  // Apply locked colors
  const finalColors = [...generatedColors];
  lockedColors.forEach(({ index, color }) => {
    if (index >= 0 && index < count) {
      finalColors[index] = color;
    }
  });

  return finalColors;
};

// Utility to generate single random color with theme
export const generateRandomColor = (theme: ColorTheme = 'vibrant'): string => {
  const hslColor = generateBaseColor(theme);
  return hslToHex(hslColor.h, hslColor.s, hslColor.l);
};

// Get theme display information
export const getThemeInfo = (theme: ColorTheme) => {
  const themeData = {
    vibrant: { name: 'Vibrant', description: 'Bold, saturated colors', emoji: '🌈' },
    pastel: { name: 'Pastel', description: 'Soft, muted tones', emoji: '🎨' },
    vintage: { name: 'Vintage', description: 'Retro, aged colors', emoji: '📷' },
    earthy: { name: 'Earthy', description: 'Natural, organic tones', emoji: '🌿' },
    neon: { name: 'Neon', description: 'Electric, glowing colors', emoji: '⚡' },
    minimal: { name: 'Minimal', description: 'Clean, subtle palette', emoji: '⚪' },
    warm: { name: 'Warm', description: 'Cozy, inviting colors', emoji: '🔥' },
    cool: { name: 'Cool', description: 'Calm, refreshing tones', emoji: '❄️' },
    dark: { name: 'Dark', description: 'Deep, rich colors', emoji: '🌙' },
    light: { name: 'Light', description: 'Bright, airy palette', emoji: '☀️' }
  };
  
  return themeData[theme];
};

// Get harmony display information
export const getHarmonyInfo = (harmony: ColorHarmony) => {
  const harmonyData = {
    random: { name: 'Random', description: 'Completely random colors' },
    analogous: { name: 'Analogous', description: 'Adjacent colors on the color wheel' },
    complementary: { name: 'Complementary', description: 'Opposite colors on the color wheel' },
    triadic: { name: 'Triadic', description: 'Three evenly spaced colors' },
    tetradic: { name: 'Tetradic', description: 'Four colors forming a rectangle' },
    monochrome: { name: 'Monochrome', description: 'Same hue with different saturation' },
    'split-complementary': { name: 'Split Complementary', description: 'Base + two adjacent to complement' }
  };
  
  return harmonyData[harmony];
};