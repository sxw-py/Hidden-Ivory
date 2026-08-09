export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  details: string[];
  category: string;
  sizes?: string[];
  inStock: boolean;
  isFeatured?: boolean;
}

export const products: Product[] = [
  {
    id: 'signature-stitch-balaclava',
    name: 'Signature Stitch Balaclava',
    price: 250,
    images: ['/balaclava_front_1785736504737.png', '/balaclava_side.png', '/balaclava_back.png'],
    description: 'The piece that started it all. Our iconic balaclava crafted from premium stretch fabric with subtle Hidden Ivory embroidery at the crown. Designed to be worn multiple ways.',
    details: ['Premium stretch-knit fabric', 'Subtle gold embroidery', 'One size fits most', 'Machine washable'],
    category: 'accessories',
    inStock: true,
  },
  {
    id: 'signature-stitch-crop-top',
    name: 'Signature Stitch Crop Top',
    price: 350,
    images: ['/croptop_front_1785736515500.png', '/placeholder-products.png'],
    description: 'Structured yet supple — our crop top features the signature gold brand mark at the chest. Cut for a bold silhouette that sits just above the waist.',
    details: ['100% heavy cotton jersey', 'Gold-tone embroidered logo', 'Sizes: XS — XL', 'Pre-shrunk'],
    category: 'tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'signature-stitch-tee',
    name: 'Signature Stitch T-Shirt',
    price: 500,
    images: ['/tshirt_front_1785736525831.png', '/placeholder-products.png', '/placeholder-products.png'],
    description: 'The flagship piece. Heavy-weight black jersey with the Hidden Ivory monogram centred at the chest and a small brand mark on the back collar.',
    details: ['280gsm heavy cotton jersey', 'Embroidered HI monogram', 'Sizes: XS — 2XL', 'Oversized fit — size down for regular'],
    category: 'tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    inStock: true,
  },
  {
    id: 'ivory-cargo-pants',
    name: 'Ivory Utility Cargos',
    price: 850,
    images: ['/cargos_front_1785736535458.png', '/placeholder-products.png'],
    description: 'Engineered for movement. Relaxed fit utility pants featuring articulated knees and hidden cargo pockets. Finished in our signature matte obsidian with gold accents.',
    details: ['Heavyweight cotton blend', 'Concealed cargo pockets', 'Adjustable hem drawcords', 'Relaxed fit'],
    category: 'bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'heritage-leather-jacket',
    name: 'Heritage Leather Moto',
    price: 2200,
    images: ['/leather_jacket_front_1785736544846.png', '/placeholder-products.png', '/placeholder-products.png'],
    description: 'The ultimate statement piece. A tailored motorcycle jacket constructed from ethically sourced premium leather, featuring custom gold-tone hardware and our embossed logo.',
    details: ['100% genuine leather', 'Custom gold hardware', 'Embossed back logo', 'Tailored fit'],
    category: 'outerwear',
    sizes: ['M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'monogram-tote-bag',
    name: 'Monogram Canvas Tote',
    price: 450,
    images: ['/tote_bag_front_1785736555578.png'],
    description: 'Carry the brand. A heavyweight canvas tote bag designed for daily utility. Features reinforced straps and an oversized, subtle tonal monogram print.',
    details: ['Heavyweight cotton canvas', 'Reinforced straps', 'Interior zip pocket', 'Dimensions: 40x45cm'],
    category: 'accessories',
    inStock: true,
  },
  {
    id: 'obsidian-heavyweight-hoodie',
    name: 'Obsidian Heavyweight Hoodie',
    price: 950,
    images: ['/hoodie_front_1785736565963.png', '/placeholder-products.png'],
    description: 'A true winter essential. This oversized hoodie is constructed from ultra-heavyweight fleece for maximum warmth and structure. Features our signature gold-tone hardware on the drawstrings and a subtle tonal logo across the chest.',
    details: ['450gsm heavyweight fleece', 'Gold-tone drawstring aglets', 'Kangaroo pocket', 'Oversized drop-shoulder fit'],
    category: 'tops',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'ivory-monogram-cap',
    name: 'Ivory Monogram Cap',
    price: 300,
    images: ['/cap_front_1785736577212.png'],
    description: 'The perfect finishing touch. A classic 6-panel baseball cap constructed from durable cotton twill, featuring a raised 3D embroidery of the Hidden Ivory monogram on the front.',
    details: ['100% cotton twill', 'Raised 3D monogram embroidery', 'Adjustable metal buckle closure', 'One size fits all'],
    category: 'accessories',
    inStock: true,
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
