export interface ProductVariantSize {
  size: string;
  stock: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  sku: string;
  brand: string;
  category: 'Accessories' | 'Smartphone' | 'Laptop' | 'Earbuds' | 'Tablet' | 'Smartwatch' | 'Gadgets' | 'Personal Care' | 'Home Appliances' | 'Books';
  subCategory: string;
  description: string;
  price: number; // Regular price
  salePrice?: number; // Discounted sale price
  discountPercent?: number;
  warranty?: string;
  fabric: string; // specs or build material
  careInstructions: string;
  sizes: ProductVariantSize[];
  colors: ProductColor[];
  images: string[];
  tags: string[];
  featured?: boolean;
  isNew?: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  division: string;
  district: string;
  thana: string;
  streetAddress: string;
  postalCode?: string;
  orderNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'bKash' | 'Nagad' | 'COD' | 'SSLCommerz' | 'Upay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId?: string;
  orderStatus: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: ShippingAddress;
  createdAt: string;
  trackingHistory: {
    status: string;
    timestamp: string;
    note: string;
  }[];
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  passwordHash: string;
  createdAt: string;
  address?: ShippingAddress;
}

// 20 Exact Products from TechNova Mart reference
const TECHNOVA_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: '16 in 1 Vegetable Slicer & Cutter',
    sku: 'TNM-KIT-001',
    brand: 'Technova Mart',
    category: 'Home Appliances',
    subCategory: 'Kitchen Gadgets',
    description: 'Multifunctional 16-in-1 kitchen mandoline vegetable slicer, dicer, and grater with stainless steel rust-resistant blades, container bowl, hand protector, and drain basket.',
    price: 950,
    salePrice: 850,
    discountPercent: 10,
    warranty: '7 Days Replacement Warranty',
    fabric: 'BPA-Free Food Grade ABS Plastic & 420 Stainless Steel',
    careInstructions: 'Rinse with running water immediately after use. Dishwasher safe except clear container.',
    sizes: [{ size: 'Standard', stock: 24 }],
    colors: [{ name: 'Forest Green', hex: '#15803d' }, { name: 'Slate Gray', hex: '#475569' }],
    images: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['kitchen', 'slicer', 'cutter', 'vegetable', 'chopper'],
    featured: true,
    isNew: true,
    rating: 4.8,
    reviewsCount: 38,
    createdAt: '2026-02-01T10:00:00Z'
  },
  {
    id: 'prod-2',
    title: 'Prestige Electric Kettle 2.0 Liter',
    sku: 'TNM-APP-002',
    brand: 'Technova Mart',
    category: 'Home Appliances',
    subCategory: 'Electric Kettles',
    description: 'High-speed 1500W electric cordless kettle with 2.0 Liter capacity, automatic shut-off safety protection, 304 food-grade stainless steel interior, and ergonomic cool-touch handle.',
    price: 1450,
    salePrice: 950,
    discountPercent: 34,
    warranty: '6 Months Brand Service Warranty',
    fabric: 'Grade 304 Stainless Steel & Heat-Resistant Polymer',
    careInstructions: 'Descaling with white vinegar periodically. Do not immerse power base in water.',
    sizes: [{ size: '2.0 Liter', stock: 18 }],
    colors: [{ name: 'Silver Chrome & Black', hex: '#334155' }],
    images: [
      'https://images.unsplash.com/photo-1594213114663-ddfe3725ce7d?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['kettle', 'electric', 'prestige', 'hot water', 'tea', 'coffee'],
    featured: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 52,
    createdAt: '2026-01-20T11:00:00Z'
  },
  {
    id: 'prod-3',
    title: 'Electric Pedi Callous Remover',
    sku: 'TNM-PC-003',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Foot Care',
    description: 'Rechargeable electric vacuum foot callus remover and grinder with 2 speed modes, quartz grinding heads, and built-in dust vacuum collector for smooth salon-like heels at home.',
    price: 1050,
    salePrice: 650,
    discountPercent: 38,
    warranty: '1 Month Replacement Warranty',
    fabric: 'Ergonomic ABS with Quartz Crystal Rollers',
    careInstructions: 'Rinse roller heads under water. Charge via included USB cable.',
    sizes: [{ size: 'Universal', stock: 15 }],
    colors: [{ name: 'Rose Gold', hex: '#fb7185' }, { name: 'Pearl White', hex: '#f8fafc' }],
    images: [
      'https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['pedicure', 'callous', 'foot care', 'personal care', 'rechargeable'],
    featured: true,
    isNew: true,
    rating: 4.7,
    reviewsCount: 29,
    createdAt: '2026-01-25T14:20:00Z'
  },
  {
    id: 'prod-4',
    title: 'Digital Display Portable Dual Purpose Juicing Cup HP-189',
    sku: 'TNM-KIT-004',
    brand: 'Technova Mart',
    category: 'Home Appliances',
    subCategory: 'Portable Blenders',
    description: 'USB-C rechargeable 400ml portable smoothie blender with 6-leaf 3D stainless steel blade, smart LED digital battery screen, leakproof sports cap, and instant crushed ice capability.',
    price: 1850,
    salePrice: 1450,
    discountPercent: 21,
    warranty: '3 Months Replacement Warranty',
    fabric: 'Tritan Food-Grade Glass/Polymer & 304 Stainless Steel',
    careInstructions: 'Double click power button to blend with water and drop of soap for self-cleaning.',
    sizes: [{ size: '400 ml', stock: 12 }],
    colors: [{ name: 'Sunrise Orange', hex: '#f97316' }, { name: 'Mint Green', hex: '#10b981' }],
    images: [
      'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['blender', 'juicer', 'portable', 'smoothie', 'usb blender'],
    featured: true,
    isNew: true,
    rating: 4.8,
    reviewsCount: 44,
    createdAt: '2026-02-02T09:10:00Z'
  },
  {
    id: 'prod-5',
    title: 'Portable Calf Massager Best Price in Bangladesh',
    sku: 'TNM-PC-005',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Massagers',
    description: 'Cordless pneumatic air compression calf and leg massager with 3 pressure modes, soothing heating element, and rechargeable wireless control for muscle recovery and circulation.',
    price: 1850,
    salePrice: 1450,
    discountPercent: 21,
    warranty: '6 Months Service Warranty',
    fabric: 'Breathable Compression Fabric & Air Micro-Pumps',
    careInstructions: 'Wipe outer fabric with mild damp cloth. Do not soak.',
    sizes: [{ size: 'Adjustable Velcro', stock: 8 }],
    colors: [{ name: 'Heather Gray', hex: '#64748b' }],
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['massager', 'calf', 'leg massager', 'pain relief', 'fitness'],
    featured: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 31,
    createdAt: '2026-01-18T16:00:00Z'
  },
  {
    id: 'prod-6',
    title: 'VGR V-600 Professional Hair Clipper',
    sku: 'TNM-GM-006',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Clippers & Trimmers',
    description: 'Heavy duty turbo hair clipper with high-precision DLC carbon steel blades, LED speed/battery display, 2500mAh lithium battery for 300 minutes runtime, and guide combs (1.5-12mm).',
    price: 2250,
    salePrice: 1950,
    discountPercent: 13,
    warranty: '1 Year Service Warranty',
    fabric: 'Electroplated Metallic Body & DLC Carbon Blades',
    careInstructions: 'Clean hair with brush and apply blade lubricating oil regularly.',
    sizes: [{ size: 'Full Kit', stock: 14 }],
    colors: [{ name: 'Cyber Teal Metallic', hex: '#0d9488' }, { name: 'Gunmetal Gray', hex: '#1e293b' }],
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['vgr', 'clipper', 'trimmer', 'hair cut', 'barber', 'salon'],
    featured: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 63,
    createdAt: '2026-02-04T12:00:00Z'
  },
  {
    id: 'prod-7',
    title: 'VGR V-656 Professional Hair Clipper',
    sku: 'TNM-GM-007',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Clippers & Trimmers',
    description: 'Pro salon wireless hair clipper engineered with ceramic coated moving blades, magnetic guard attachments, ultra-quiet rotary motor, and 200-minute cordless operation.',
    price: 1950,
    salePrice: 1750,
    discountPercent: 10,
    warranty: '1 Year Service Warranty',
    fabric: 'Hardened Polymer & Ceramic Blade',
    careInstructions: 'Brush blades after every haircut.',
    sizes: [{ size: 'Standard Set', stock: 10 }],
    colors: [{ name: 'Gold & Onyx Black', hex: '#d97706' }],
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['vgr', 'clipper', 'hair', 'grooming', 'shaving'],
    featured: false,
    isNew: false,
    rating: 4.8,
    reviewsCount: 22,
    createdAt: '2026-01-22T13:40:00Z'
  },
  {
    id: 'prod-8',
    title: 'VGR V-937 Professional Hair Trimmer',
    sku: 'TNM-GM-008',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Clippers & Trimmers',
    description: 'Ultra-close zero-gapped T-blade detail trimmer with clear digital battery percentage readout, Type-C charging port, and precision hair outlining for beards and fades.',
    price: 1450,
    salePrice: 1350,
    discountPercent: 6,
    warranty: '6 Months Brand Warranty',
    fabric: 'ABS Metallic Alloy & Stainless T-Blade',
    careInstructions: 'Store in dry pouch. Apply oil to blade teeth weekly.',
    sizes: [{ size: 'Zero Gapped', stock: 16 }],
    colors: [{ name: 'Midnight Black', hex: '#0f172a' }],
    images: [
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['vgr', 'trimmer', 'zero gapped', 'beard', 'detail trimmer'],
    featured: false,
    isNew: false,
    rating: 4.7,
    reviewsCount: 35,
    createdAt: '2026-01-15T15:10:00Z'
  },
  {
    id: 'prod-9',
    title: 'Automatic Electric Yogurt Maker 1.7 Liter',
    sku: 'TNM-APP-009',
    brand: 'Technova Mart',
    category: 'Home Appliances',
    subCategory: 'Kitchen Appliances',
    description: 'Smart constant-temperature homemade yogurt maker (ঘরেই তৈরি করুন স্বাস্থ্যকর ও সুস্বাদু দই!) with 1.7L stainless steel inner pot, PTC heating system, and microcomputer timer control.',
    price: 1150,
    salePrice: 950,
    discountPercent: 17,
    warranty: '6 Months Replacement Warranty',
    fabric: 'Food Grade 304 Stainless Steel Pot & Polypropylene Shell',
    careInstructions: 'Inner steel pot is dishwasher safe. Wipe heating base with dry cloth.',
    sizes: [{ size: '1.7 Liter', stock: 11 }],
    colors: [{ name: 'Cream White', hex: '#fef3c7' }],
    images: [
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['yogurt maker', 'kitchen', 'doi maker', 'fermentation', 'appliance'],
    featured: true,
    isNew: true,
    rating: 4.9,
    reviewsCount: 47,
    createdAt: '2026-02-03T11:30:00Z'
  },
  {
    id: 'prod-10',
    title: 'Shoulder and Neck Massager',
    sku: 'TNM-PC-010',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Massagers',
    description: '3D deep-kneading Shiatsu neck and shoulder massager with infrared thermal therapy, 8 bi-directional rotation nodes, and adjustable arm straps for spine and trapezius relief.',
    price: 2450,
    salePrice: 1850,
    discountPercent: 24,
    warranty: '1 Year Service Warranty',
    fabric: 'Premium PU Leather & Breathable 3D Mesh',
    careInstructions: 'Wipe surface with slightly damp cloth. Auto shut-off after 15 min.',
    sizes: [{ size: 'Standard Ergonomic', stock: 7 }],
    colors: [{ name: 'Emerald Olive & Black', hex: '#14532d' }],
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['neck massager', 'shiatsu', 'shoulder', 'pain relief', 'relaxation'],
    featured: true,
    isNew: false,
    rating: 4.8,
    reviewsCount: 39,
    createdAt: '2026-01-12T14:00:00Z'
  },
  {
    id: 'prod-11',
    title: 'Heating Pad for Period Cramps & Vibration Slimming Massage Belt',
    sku: 'TNM-PC-011',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Thermal Care',
    description: 'Fast-heating graphene menstrual heating pad with 3 temperature modes (50°C/55°C/60°C), 4 vibration massage levels, rechargeable battery, and plush soft velvet backing.',
    price: 1350,
    salePrice: 850,
    discountPercent: 37,
    warranty: '3 Months Replacement Warranty',
    fabric: 'Soft Velvet & Flexible Graphene Heating Film',
    careInstructions: 'Do not wash directly in water. Wipe with disinfectant towel.',
    sizes: [{ size: 'Adjustable Elastic', stock: 19 }],
    colors: [{ name: 'Blush Pink', hex: '#f472b6' }, { name: 'Snow White', hex: '#ffffff' }],
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['period cramps', 'heating pad', 'massager', 'warm belt', 'women care'],
    featured: true,
    isNew: true,
    rating: 5.0,
    reviewsCount: 71,
    createdAt: '2026-02-05T10:15:00Z'
  },
  {
    id: 'prod-12',
    title: 'Electric EMS Body Massager Therapy',
    sku: 'TNM-PC-012',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'EMS Massagers',
    description: 'Butterfly micro-current EMS pulse body massager with digital LCD display, 8 massage modes, and 19 intensity levels for neck, back, waist, arms, and muscle stimulation.',
    price: 550,
    salePrice: 250,
    discountPercent: 54,
    warranty: '7 Days Check Warranty',
    fabric: 'Hydrogel Adhesive Pad & ABS Controller',
    careInstructions: 'Cover gel pad with plastic film when not in use to preserve stickiness.',
    sizes: [{ size: 'Pocket Size', stock: 45 }],
    colors: [{ name: 'Deep Blue', hex: '#1e3a8a' }],
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['ems', 'body massager', 'pulse', 'muscle stimulator', 'cheap gadget'],
    featured: true,
    isNew: false,
    rating: 4.6,
    reviewsCount: 88,
    createdAt: '2026-01-08T12:00:00Z'
  },
  {
    id: 'prod-13',
    title: 'Kemei KM-809A Trimmer Price in Bangladesh',
    sku: 'TNM-GM-013',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Clippers & Trimmers',
    description: 'Iconic professional LCD hair & beard trimmer with precision carbon steel blade, lever taper adjustment (0.8-2mm), 4 guide combs, and 240 minutes battery life.',
    price: 1550,
    salePrice: 1350,
    discountPercent: 12,
    warranty: '6 Months Service Warranty',
    fabric: 'Heavy Duty ABS Plastic & Carbon Blades',
    careInstructions: 'Brush hairs and oil blade before each use.',
    sizes: [{ size: 'Full Kit', stock: 15 }],
    colors: [{ name: 'White & Chrome', hex: '#e2e8f0' }],
    images: [
      'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['kemei', 'trimmer', 'km-809a', 'hair clipper', 'beard'],
    featured: false,
    isNew: false,
    rating: 4.8,
    reviewsCount: 54,
    createdAt: '2026-01-14T09:30:00Z'
  },
  {
    id: 'prod-14',
    title: 'Octopus Head Massager price in Bangladesh',
    sku: 'TNM-PC-014',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Head Massagers',
    description: '12-claw electric vibrating octopus scalp massager for deep stress relief, headache ease, and hair follicle blood circulation. Hands-free cordless operation with one-key control.',
    price: 1350,
    salePrice: 950,
    discountPercent: 29,
    warranty: '1 Month Replacement Warranty',
    fabric: 'Elastic TPE Claws & Lightweight Polymer Core',
    careInstructions: 'Wipe claw tips with soft cloth. Do not immerse in liquids.',
    sizes: [{ size: 'Flexible One Size', stock: 14 }],
    colors: [{ name: 'Midnight Black', hex: '#18181b' }],
    images: [
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['head massager', 'octopus', 'scalp', 'stress relief', 'headache'],
    featured: false,
    isNew: true,
    rating: 4.7,
    reviewsCount: 32,
    createdAt: '2026-01-28T16:20:00Z'
  },
  {
    id: 'prod-15',
    title: 'Fascia Gun Five Head Hit Massager DH-780',
    sku: 'TNM-PC-015',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Massagers',
    description: 'High-torque deep tissue percussion massage gun with 5 specialized interchangeable massage heads, 6 speed frequency adjustments, brushless quiet motor, and USB charging.',
    price: 1650,
    salePrice: 1450,
    discountPercent: 12,
    warranty: '6 Months Service Warranty',
    fabric: 'Impact-Resistant Polymer & Silicone Attachments',
    careInstructions: 'Insert heads securely before powering on. Wipe with micro-fiber cloth.',
    sizes: [{ size: 'Kit with 5 Heads', stock: 11 }],
    colors: [{ name: 'Carbon Black', hex: '#111827' }, { name: 'Titanium Silver', hex: '#94a3b8' }],
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['fascia gun', 'massage gun', 'muscle pain', 'percussion', 'fitness'],
    featured: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 46,
    createdAt: '2026-01-26T14:00:00Z'
  },
  {
    id: 'prod-16',
    title: 'Betterbass Wireless Speaker WYS-2301 BT',
    sku: 'TNM-AUD-016',
    brand: 'Technova Mart',
    category: 'Accessories',
    subCategory: 'Audio & Stands',
    description: '3-in-1 multifunctional Bluetooth 5.3 speaker, folding phone/tablet desk stand, and integrated 5000mAh emergency power bank with punchy heavy bass and crystal clear acoustics.',
    price: 1450,
    salePrice: 850,
    discountPercent: 41,
    warranty: '3 Months Replacement Warranty',
    fabric: 'Reinforced Aluminum Alloy & Acoustic Grill',
    careInstructions: 'Keep away from direct water spray. Charge with 5V/2A adapter.',
    sizes: [{ size: 'Foldable Desktop', stock: 20 }],
    colors: [{ name: 'Matte Black', hex: '#000000' }],
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['speaker', 'phone stand', 'bluetooth', 'betterbass', 'wireless'],
    featured: true,
    isNew: true,
    rating: 4.8,
    reviewsCount: 37,
    createdAt: '2026-02-06T15:00:00Z'
  },
  {
    id: 'prod-17',
    title: 'Bajaj Silver Cast Grinder',
    sku: 'TNM-APP-017',
    brand: 'Technova Mart',
    category: 'Home Appliances',
    subCategory: 'Mixer & Grinder',
    description: 'Heavy duty 500W pure copper motor spice and dry masala grinder with 2 stainless steel jars, razor sharp hardened blades, overload protection breaker, and anti-slip feet.',
    price: 1350,
    salePrice: 999,
    discountPercent: 26,
    warranty: '1 Year Motor Service Warranty',
    fabric: 'Cast Aluminum Body & SS304 Grinding Jars',
    careInstructions: 'Do not run empty. Wipe base with towel; jars are hand wash safe.',
    sizes: [{ size: '2 Jars Set', stock: 9 }],
    colors: [{ name: 'Cast Silver & Blue', hex: '#3b82f6' }],
    images: [
      'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['bajaj', 'grinder', 'mixer', 'spice grinder', 'masala', 'kitchen'],
    featured: true,
    isNew: false,
    rating: 4.8,
    reviewsCount: 51,
    createdAt: '2026-01-19T10:45:00Z'
  },
  {
    id: 'prod-18',
    title: 'Nova Hair Dryer NV-9032',
    sku: 'TNM-PC-018',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Hair Styling',
    description: 'High power 1800W ionic salon blow dryer with 2 speed and 3 heat settings, cool shot button, concentrator styling nozzle, and negative ion hair frizz reduction.',
    price: 1250,
    salePrice: 950,
    discountPercent: 24,
    warranty: '6 Months Service Warranty',
    fabric: 'Flame-Retardant Polycarbonate Housing',
    careInstructions: 'Clean rear air intake filter periodically to maintain airflow.',
    sizes: [{ size: '1800 Watt', stock: 13 }],
    colors: [{ name: 'Metallic Magenta & Black', hex: '#be185d' }],
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['hair dryer', 'nova', 'nv-9032', 'styling', 'blow dryer'],
    featured: false,
    isNew: false,
    rating: 4.7,
    reviewsCount: 28,
    createdAt: '2026-01-21T13:00:00Z'
  },
  {
    id: 'prod-19',
    title: 'Foldable Electric Kettle Price in Bangladesh',
    sku: 'TNM-APP-019',
    brand: 'Technova Mart',
    category: 'Home Appliances',
    subCategory: 'Travel Appliances',
    description: 'Collapsible portable travel electric kettle made of food-grade silicone with dual voltage (110V/220V), 600ml capacity, boil-dry protection, and fold-flat compact storage for luggage.',
    price: 1350,
    salePrice: 950,
    discountPercent: 29,
    warranty: '3 Months Replacement Warranty',
    fabric: 'BPA-Free Food Grade Silicone & 304 Stainless Steel Base',
    careInstructions: 'Collapse body down after cool. Descale with citric acid.',
    sizes: [{ size: '600 ml', stock: 17 }],
    colors: [{ name: 'Sky Blue & White', hex: '#38bdf8' }],
    images: [
      'https://images.unsplash.com/photo-1594213114663-ddfe3725ce7d?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['kettle', 'foldable', 'travel kettle', 'portable', 'silicone'],
    featured: true,
    isNew: true,
    rating: 4.8,
    reviewsCount: 41,
    createdAt: '2026-02-04T16:00:00Z'
  },
  {
    id: 'prod-20',
    title: 'Smart Scalp Head Massager',
    sku: 'TNM-PC-020',
    brand: 'Technova Mart',
    category: 'Personal Care',
    subCategory: 'Head Massagers',
    description: 'Cordless IPX7 waterproof 3D electric scalp massager with 4 silicone rotating kneading heads, 76 individual massage nodes, magnetic base charging, and red light therapy.',
    price: 950,
    salePrice: 750,
    discountPercent: 21,
    warranty: '6 Months Service Warranty',
    fabric: 'Waterproof IPX7 ABS & Medical Grade Silicone',
    careInstructions: 'Detachable silicone claws can be washed in warm soapy water.',
    sizes: [{ size: 'Handheld', stock: 16 }],
    colors: [{ name: 'Ivory White', hex: '#f8fafc' }],
    images: [
      'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['scalp massager', 'waterproof', 'hair growth', 'head massager'],
    featured: true,
    isNew: false,
    rating: 4.9,
    reviewsCount: 65,
    createdAt: '2026-01-29T12:00:00Z'
  }
];

const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: 'usr-admin',
    name: 'TechNova SuperAdmin',
    email: 'admin@technovamartbd.com',
    phone: '+880 1410-732067',
    role: 'admin',
    passwordHash: 'admin123',
    createdAt: '2025-10-01T00:00:00Z'
  },
  {
    id: 'usr-admin-legacy',
    name: 'TechNova Moderator',
    email: 'admin@voguebangla.com',
    phone: '+880 1410-732067',
    role: 'admin',
    passwordHash: 'admin123',
    createdAt: '2025-10-01T00:00:00Z'
  },
  {
    id: 'usr-customer-1',
    name: 'Tanvir Ahmed',
    email: 'customer@technovamartbd.com',
    phone: '+880 1712-445566',
    role: 'customer',
    passwordHash: 'customer123',
    createdAt: '2025-11-12T10:00:00Z',
    address: {
      fullName: 'Tanvir Ahmed',
      phone: '+880 1712-445566',
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Dhanmondi',
      streetAddress: '57/1, Road-7A, Dhanmondi, Dhaka',
      postalCode: '1209'
    }
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'TNM-2026-7841',
    userId: 'usr-customer-1',
    customerName: 'Arfin Hossain',
    customerEmail: 'customer@aura.com.bd',
    customerPhone: '+880 1712-445566',
    items: [
      {
        productId: 'prod-1',
        productTitle: '16 in 1 Vegetable Slicer & Cutter',
        productImage: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80',
        price: 850,
        size: 'Standard',
        color: 'Forest Green',
        quantity: 1
      },
      {
        productId: 'prod-2',
        productTitle: 'Prestige Electric Kettle 2.0 Liter',
        productImage: 'https://images.unsplash.com/photo-1594213114663-ddfe3725ce7d?auto=format&fit=crop&w=800&q=80',
        price: 950,
        size: '2.0 Liter',
        color: 'Silver Chrome & Black',
        quantity: 1
      }
    ],
    subtotal: 1800,
    discount: 100,
    shippingFee: 60,
    total: 1760,
    paymentMethod: 'bKash',
    paymentStatus: 'paid',
    transactionId: 'BK9X8712QA',
    orderStatus: 'shipped',
    shippingAddress: {
      fullName: 'Arfin Hossain',
      phone: '+880 1712-445566',
      division: 'Dhaka',
      district: 'Dhaka',
      thana: 'Dhanmondi',
      streetAddress: 'House 14, Road 7A, Dhanmondi, Dhaka',
      postalCode: '1209'
    },
    createdAt: '2026-02-05T12:30:00Z',
    trackingHistory: [
      { status: 'Order Placed', timestamp: '2026-02-05 12:30', note: 'Payment verified via bKash' },
      { status: 'Processing', timestamp: '2026-02-05 15:45', note: 'Quality check completed at Dhanmondi Hub' },
      { status: 'Shipped', timestamp: '2026-02-06 10:00', note: 'Dispatched with Same-day Dhaka Courier' }
    ]
  }
];

class MemoryDatabase {
  private products: Product[] = [...TECHNOVA_PRODUCTS];
  private orders: Order[] = [...INITIAL_ORDERS];
  private customers: CustomerUser[] = [...INITIAL_CUSTOMERS];

  getProducts(filters?: {
    category?: string;
    subCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    fabric?: string;
    color?: string;
    search?: string;
    inStockOnly?: boolean;
  }): Product[] {
    let result = [...this.products];
    if (!filters) return result;

    if (filters.category && filters.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === filters.category?.toLowerCase());
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(p => (p.salePrice ?? p.price) >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(p => (p.salePrice ?? p.price) <= filters.maxPrice!);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  createProduct(data: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>): Product {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id: string, update: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = {
      ...this.products[index],
      ...update
    };
    return this.products[index];
  }

  deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < initialLen;
  }

  deductStock(items: OrderItem[]) {
    items.forEach(item => {
      const prod = this.getProductById(item.productId);
      if (prod && prod.sizes.length > 0) {
        if (prod.sizes[0].stock >= item.quantity) {
          prod.sizes[0].stock -= item.quantity;
        } else {
          prod.sizes[0].stock = 0;
        }
      }
    });
  }

  getOrders(statusFilter?: string, userId?: string): Order[] {
    let result = [...this.orders];
    if (userId) {
      result = result.filter(o => o.userId === userId || o.customerEmail === userId);
    }
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(o => o.orderStatus === statusFilter);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id || o.orderNumber === id);
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingHistory'>): Order {
    const orderNumber = `TNM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      trackingHistory: [
        {
          status: 'Order Placed',
          timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
          note: `Order registered successfully via ${orderData.paymentMethod}`
        }
      ]
    };

    this.deductStock(newOrder.items);
    this.orders.unshift(newOrder);
    return newOrder;
  }

  updateOrderStatus(
    orderId: string,
    status: Order['orderStatus'],
    paymentStatus?: Order['paymentStatus'],
    note?: string
  ): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.orderStatus = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    order.trackingHistory.push({
      status: `Status changed to ${status.replace('_', ' ').toUpperCase()}`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
      note: note || `Order updated by TechNova Admin`
    });

    return order;
  }

  getCustomers(): CustomerUser[] {
    return this.customers.map(c => {
      const { passwordHash, ...rest } = c;
      return rest as CustomerUser;
    });
  }

  findUserByEmail(email: string): CustomerUser | undefined {
    return this.customers.find(c => c.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData: Omit<CustomerUser, 'id' | 'createdAt'>): CustomerUser {
    const newUser: CustomerUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.customers.push(newUser);
    return newUser;
  }

  getAdminStats() {
    const totalOrders = this.orders.length;
    const totalSales = this.orders
      .filter(o => o.paymentStatus === 'paid' || o.orderStatus === 'delivered' || o.orderStatus === 'shipped')
      .reduce((sum, o) => sum + o.total, 0);

    const activeCustomers = this.customers.filter(c => c.role === 'customer').length;

    let outOfStockCount = 0;
    let lowStockCount = 0;
    const inventoryAlerts: any[] = [];

    this.products.forEach(p => {
      p.sizes.forEach(s => {
        if (s.stock === 0) {
          outOfStockCount++;
          inventoryAlerts.push({ productId: p.id, title: p.title, sku: p.sku, size: s.size, stock: 0 });
        } else if (s.stock < 5) {
          lowStockCount++;
          inventoryAlerts.push({ productId: p.id, title: p.title, sku: p.sku, size: s.size, stock: s.stock });
        }
      });
    });

    const categorySales: Record<string, number> = {
      'Home Appliances': 14800,
      'Personal Care': 26400,
      'Accessories': 9500
    };

    const monthlyRevenue = [
      { month: 'Sep', revenue: 145000, orders: 120 },
      { month: 'Oct', revenue: 210000, orders: 165 },
      { month: 'Nov', revenue: 290000, orders: 230 },
      { month: 'Dec', revenue: 410000, orders: 320 },
      { month: 'Jan', revenue: 380000, orders: 295 },
      { month: 'Feb (Mtd)', revenue: totalSales > 0 ? totalSales : 340000, orders: totalOrders || 270 }
    ];

    return {
      totalSales,
      totalOrders,
      activeCustomers,
      outOfStockCount,
      lowStockCount,
      inventoryAlerts: inventoryAlerts.slice(0, 10),
      categorySales,
      monthlyRevenue,
      recentOrders: this.orders.slice(0, 6)
    };
  }
}

export const db = new MemoryDatabase();
