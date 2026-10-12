import type { Product } from './products';

export interface ParsedColor {
  name: string;
  hex: string;
}

export interface ColorVariant {
  colorName: string;
  colorHex: string;
  product: Product;
}

export interface ProductGroup {
  groupKey: string;
  baseName: string;
  primaryProduct: Product;
  variants: ColorVariant[];
  hasMultipleColors: boolean;
}

// Preset color map for luxury streetwear & accessories
export const COLOR_HEX_MAP: Record<string, string> = {
  metallic: '#d1d1d1',
  velvet: '#18181b',
  black: '#000000',
  ivory: '#e5b876',
  white: '#ffffff',
  gold: '#d4af37',
  silver: '#c0c0c0',
  grey: '#6b7280',
  gray: '#6b7280',
  obsidian: '#0b090a',
  navy: '#0f172a',
  brown: '#5e4018',
  burgundy: '#4a0404',
  emerald: '#064e3b',
  charcoal: '#27272a',
  beige: '#d4b996',
  cream: '#fdf6e2',
  bronze: '#cd7f32',
  olive: '#3f4f24',
  silk: '#e2e8f0',
  satin: '#cbd5e1',
  denim: '#1e3a8a',
};

// Preset colors available for one-click selection in Admin Editor
export const PRESET_COLORS: ParsedColor[] = [
  { name: 'Metallic', hex: '#d1d1d1' },
  { name: 'Velvet', hex: '#18181b' },
  { name: 'Obsidian', hex: '#0b090a' },
  { name: 'Black', hex: '#000000' },
  { name: 'Ivory', hex: '#e5b876' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Silver', hex: '#c0c0c0' },
  { name: 'Gold', hex: '#d4af37' },
  { name: 'Brown', hex: '#5e4018' },
  { name: 'Navy', hex: '#0f172a' },
  { name: 'Charcoal', hex: '#27272a' },
  { name: 'Burgundy', hex: '#4a0404' },
];

export function getColorHex(name: string): string {
  const lower = name.trim().toLowerCase();
  return COLOR_HEX_MAP[lower] || '#555555';
}

export function parseColor(colorStr: string): ParsedColor {
  if (!colorStr) return { name: '', hex: '#555555' };
  const parts = colorStr.split('|');
  const name = parts[0].trim();
  const hex = (parts[1] && parts[1].trim()) ? parts[1].trim() : getColorHex(name);
  return { name, hex };
}

export function formatColor(name: string, hex?: string): string {
  const cleanName = name.trim();
  const cleanHex = hex?.trim() || getColorHex(cleanName);
  return `${cleanName}|${cleanHex}`;
}

// Normalize strings for matching (e.g. "Du-Rag" -> "du rag")
export function normalizeKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Gathers all known color names from:
 * 1) Any colors explicitly saved on existing products
 * 2) Built-in preset list
 */
export function getAllKnownColorNames(products: Product[]): string[] {
  const namesSet = new Set<string>();

  // Add presets
  for (const preset of PRESET_COLORS) {
    namesSet.add(preset.name);
  }

  // Add all from products
  for (const p of products) {
    if (p.colors && p.colors.length > 0) {
      for (const c of p.colors) {
        const parsed = parseColor(c);
        if (parsed.name) namesSet.add(parsed.name);
      }
    }
  }

  // Sort descending by length so longer names match first
  return Array.from(namesSet).sort((a, b) => b.length - a.length);
}

/**
 * Detects color & base name from product info and name wildcard
 */
export function extractProductColorAndBaseName(
  product: Product,
  knownColorNames: string[]
): { color: ParsedColor; baseName: string; hasColorPrefix: boolean } {
  // If product already has a color configured
  let explicitColor: ParsedColor | null = null;
  if (product.colors && product.colors.length > 0) {
    explicitColor = parseColor(product.colors[0]);
  }

  if (knownColorNames.length > 0) {
    const escapedNames = knownColorNames.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`^(${escapedNames.join('|')})\\b[\\s\\-_]*(.*)$`, 'i');
    const match = product.name.match(regex);

    if (match) {
      const matchedPrefix = match[1].trim();
      const remainingName = match[2].trim();

      // Proper capitalization for matched color
      const colorName = explicitColor?.name || matchedPrefix.charAt(0).toUpperCase() + matchedPrefix.slice(1);
      const colorHex = explicitColor?.hex || getColorHex(colorName);

      return {
        color: { name: colorName, hex: colorHex },
        baseName: remainingName || product.name,
        hasColorPrefix: true,
      };
    }
  }

  // If no prefix matched, but product had explicit color
  if (explicitColor && explicitColor.name) {
    return {
      color: explicitColor,
      baseName: product.name,
      hasColorPrefix: false,
    };
  }

  return {
    color: { name: '', hex: '' },
    baseName: product.name,
    hasColorPrefix: false,
  };
}

/**
 * Groups a list of products by matching base name
 */
export function groupProducts(products: Product[]): ProductGroup[] {
  const knownColors = getAllKnownColorNames(products);
  const groupsMap = new Map<string, { baseName: string; variants: ColorVariant[] }>();

  for (const product of products) {
    const { color, baseName, hasColorPrefix } = extractProductColorAndBaseName(product, knownColors);
    const key = normalizeKey(baseName);

    if (!groupsMap.has(key)) {
      groupsMap.set(key, {
        baseName: hasColorPrefix ? baseName : product.name,
        variants: [],
      });
    }

    const group = groupsMap.get(key)!;
    // Keep the prettiest formatted baseName
    if (hasColorPrefix && baseName.length > 0) {
      group.baseName = baseName;
    }

    group.variants.push({
      colorName: color.name,
      colorHex: color.hex,
      product,
    });
  }

  const result: ProductGroup[] = [];

  for (const [key, val] of groupsMap.entries()) {
    // Sort variants by sortOrder or inStock
    const sortedVariants = [...val.variants].sort((a, b) => {
      const orderA = a.product.sortOrder ?? 0;
      const orderB = b.product.sortOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      if (a.product.inStock && !b.product.inStock) return -1;
      if (!a.product.inStock && b.product.inStock) return 1;
      return 0;
    });

    const primaryProduct = sortedVariants[0].product;

    result.push({
      groupKey: key,
      baseName: val.baseName,
      primaryProduct,
      variants: sortedVariants,
      hasMultipleColors: sortedVariants.length > 1,
    });
  }

  return result;
}

/**
 * Finds the group that contains a specific product ID
 */
export function getGroupForProduct(productId: string, products: Product[]): ProductGroup | null {
  const groups = groupProducts(products);
  for (const g of groups) {
    if (g.variants.some(v => v.product.id === productId)) {
      return g;
    }
  }
  return null;
}
