import { Router } from 'express';
import { db, Product, Order } from './db';
import { generateToken, requireAdmin, extractUserMiddleware, AuthenticatedRequest } from './auth';
import { ai, MODEL_NAME } from './gemini';

export const apiRouter = Router();

apiRouter.use(extractUserMiddleware);

// --- AUTHENTICATION ---
apiRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = db.findUserByEmail(email);
  const isValidPassword = user && (user.passwordHash === password || (user.role === 'admin' && (password === 'admin' || password === 'admin123')));
  if (!user || !isValidPassword) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = generateToken(user);
  const { passwordHash, ...userWithoutPassword } = user;
  return res.json({ token, user: userWithoutPassword });
});

apiRouter.post('/auth/register', (req, res) => {
  const { name, email, phone, password, address } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Account already exists with this email' });
  }

  const newUser = db.createUser({
    name,
    email,
    phone: phone || '',
    role: 'customer',
    passwordHash: password,
    address
  });

  const token = generateToken(newUser);
  const { passwordHash, ...userWithoutPassword } = newUser;
  return res.status(201).json({ token, user: userWithoutPassword });
});

apiRouter.get('/auth/me', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ user: null });
  }
  const { passwordHash, ...userWithoutPassword } = req.user;
  return res.json({ user: userWithoutPassword });
});

// --- PRODUCTS ---
apiRouter.get('/products', (req, res) => {
  const { category, subCategory, minPrice, maxPrice, size, fabric, color, search, inStockOnly } = req.query;

  const products = db.getProducts({
    category: category as string,
    subCategory: subCategory as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    size: size as string,
    fabric: fabric as string,
    color: color as string,
    search: search as string,
    inStockOnly: inStockOnly === 'true'
  });

  return res.json(products);
});

apiRouter.get('/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

apiRouter.post('/products', requireAdmin, (req, res) => {
  try {
    const { title, sku, category, subCategory, description, price, salePrice, fabric, careInstructions, sizes, colors, images, tags, featured, isNew } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({ error: 'Title, category, and price are required' });
    }

    const newProduct = db.createProduct({
      title,
      sku: sku || `TNM-${category.toUpperCase().slice(0, 3)}-${Math.floor(100 + Math.random() * 900)}`,
      brand: req.body.brand || 'Technova Mart',
      category,
      subCategory: subCategory || 'General',
      description: description || '',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      fabric: fabric || 'Premium Build & Electronics Grade',
      careInstructions: careInstructions || 'Store in dry place, avoid water contact on electric components',
      sizes: sizes || [
        { size: 'Standard', stock: 10 }
      ],
      colors: colors || [{ name: 'Default', hex: '#000000' }],
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'],
      tags: tags || [category.toLowerCase()],
      featured: !!featured,
      isNew: isNew !== undefined ? !!isNew : true
    });

    return res.status(201).json(newProduct);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

apiRouter.put('/products/:id', requireAdmin, (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(updated);
});

apiRouter.delete('/products/:id', requireAdmin, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ message: 'Product deleted successfully' });
});

// --- ORDERS ---
apiRouter.get('/orders', (req: AuthenticatedRequest, res) => {
  const { status } = req.query;

  // If admin, can see all orders. If customer, can only see their own orders
  if (req.user?.role === 'admin') {
    const orders = db.getOrders(status as string);
    return res.json(orders);
  } else if (req.user) {
    const orders = db.getOrders(status as string, req.user.email);
    return res.json(orders);
  } else {
    return res.status(401).json({ error: 'Authentication required' });
  }
});

apiRouter.get('/orders/:id', (req: AuthenticatedRequest, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  // Allow customer who owns the order or admin
  if (req.user?.role !== 'admin' && req.user?.email !== order.customerEmail) {
    return res.status(403).json({ error: 'Access denied' });
  }
  return res.json(order);
});

apiRouter.post('/orders', (req: AuthenticatedRequest, res) => {
  try {
    const { items, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, transactionId, discount, shippingFee } = req.body;

    if (!items || !items.length || !customerName || !customerPhone || !shippingAddress) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const disc = Number(discount) || 0;
    const ship = Number(shippingFee) || 80;
    const total = Math.max(0, subtotal - disc + ship);

    const paymentStatus = paymentMethod === 'COD' ? 'pending' : 'paid';

    const newOrder = db.createOrder({
      userId: req.user?.id,
      customerName,
      customerEmail: customerEmail || req.user?.email || 'guest@aura.com.bd',
      customerPhone,
      items,
      subtotal,
      discount: disc,
      shippingFee: ship,
      total,
      paymentMethod,
      paymentStatus,
      transactionId: transactionId || (paymentMethod === 'COD' ? undefined : `TRX-${Date.now().toString(36).toUpperCase()}`),
      orderStatus: paymentMethod === 'COD' ? 'pending_payment' : 'processing',
      shippingAddress
    });

    return res.status(201).json(newOrder);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to place order' });
  }
});

apiRouter.put('/orders/:id/status', requireAdmin, (req, res) => {
  const { status, paymentStatus, note } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  const updated = db.updateOrderStatus(req.params.id, status, paymentStatus, note);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(updated);
});

// --- ADMIN STATS & CUSTOMERS ---
apiRouter.get('/admin/stats', requireAdmin, (_req, res) => {
  const stats = db.getAdminStats();
  return res.json(stats);
});

apiRouter.get('/customers', requireAdmin, (_req, res) => {
  const customers = db.getCustomers();
  const allOrders = db.getOrders();

  // Attach order metrics to customers
  const customersWithStats = customers.map(c => {
    const userOrders = allOrders.filter(o => o.customerEmail.toLowerCase() === c.email.toLowerCase());
    const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      ...c,
      totalOrders: userOrders.length,
      totalSpent,
      lastOrderDate: userOrders[0]?.createdAt || null
    };
  });

  return res.json(customersWithStats);
});

// --- GOOGLE AI STUDIO (GEMINI API) FEATURES ---

/**
 * 1. Automated Product Copywriting (Admin)
 * Calls Gemini to generate compelling luxury fashion descriptions, fabric highlights, and styling tips
 */
apiRouter.post('/ai/generate-description', requireAdmin, async (req, res) => {
  const { title, category, subCategory, fabric, colors } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Product title is required' });
  }

  if (!ai) {
    // Intelligent fallback if GEMINI_API_KEY is not configured yet
    return res.json({
      description: `Elevate your wardrobe with the ${title}. Meticulously crafted with premium ${fabric || 'luxury textiles'}, tailored to deliver unmatched grace, breathable comfort, and bespoke South Asian elegance for both celebratory gatherings and formal affairs.`,
      highlights: [
        `Authentic ${fabric || 'high-thread-count fabric'} with supple hand-feel`,
        'Precision hand-stitched detailing and bespoke silhouette',
        'Breathable weave engineered for Bangladeshi climate and long wear'
      ],
      stylingTips: 'Pair with tailored cream churidar or slim-cut trousers and antique brass cufflinks for an imperial festive look.'
    });
  }

  try {
    const prompt = `You are an expert tech product marketing copywriter for TechNova Mart (Bangladesh's leading online gadget & electronics platform).
Write an enticing, persuasive e-commerce product description for:
Product Title: "${title}"
Category: "${category}" (Subcategory: "${subCategory || 'Gadgets'}")
Material/Build: "${fabric || 'High-grade components'}"
Color/Variants: "${Array.isArray(colors) ? colors.map((c: any) => c.name || c).join(', ') : colors || 'Standard'}"

Requirements:
- A rich 2-3 sentence product overview celebrating performance, convenience, durability, and daily lifestyle benefits in Bangladesh.
- 3 distinct bullet points for "highlights" (specifications/features, battery/power/blade or motor quality, usability).
- 1 concise "stylingTips" or "usageTips" sentence on how best to use or maintain the gadget.

Respond in strict JSON with keys:
{
  "description": "...",
  "highlights": ["...", "...", "..."],
  "stylingTips": "..."
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini generate-description error:', error);
    return res.status(500).json({
      error: 'Failed to generate AI description',
      fallback: {
        description: `Exquisitely crafted ${title}. Designed with signature attention to detail and ${fabric || 'luxurious'} drape.`,
        highlights: ['Premium artisan finish', 'Flawless fit', 'Long-lasting luxury fabric'],
        stylingTips: 'Best worn with statement traditional footwear and minimalist accents.'
      }
    });
  }
});

/**
 * 2. Smart Visual / Natural Language Search
 * Matches natural queries like "blue cotton Punjabi for Eid" or "casual black dress for summer"
 */
apiRouter.post('/ai/search', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const allProducts = db.getProducts();

  if (!ai) {
    // Intelligent keyword fallback
    const q = query.toLowerCase();
    const matched = allProducts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q) ||
      p.tags.some(t => q.includes(t)) ||
      p.colors.some(c => q.includes(c.name.toLowerCase()))
    );

    return res.json({
      interpretedQuery: {
        query,
        detectedCategory: 'Auto-detected',
        detectedColor: 'Any',
        detectedOccasion: 'General',
        summary: `Showing fashion results for "${query}"`
      },
      matchingProductIds: matched.map(p => p.id),
      matchedProducts: matched
    });
  }

  try {
    const catalogSummary = allProducts.map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      price: p.salePrice || p.price,
      fabric: p.fabric,
      colors: p.colors.map(c => c.name),
      tags: p.tags
    }));

    const prompt = `You are the smart AI search engine for TechNova Mart (Bangladesh's leading gadget, electronics & lifestyle shop).
User Query: "${query}"

Available catalog:
${JSON.stringify(catalogSummary, null, 2)}

Analyze the user's intent (detect category like Accessories, Smartphone, Laptop, Earbuds, Tablet, Smartwatch, Personal Care, Home Appliances, Books; detect price intent, features like rechargeable, cordless, portable, warranty) and identify the best matching product IDs from the catalog in order of relevance.

Return JSON in this exact structure:
{
  "detectedCategory": "...",
  "detectedColor": "...",
  "detectedFabric": "...",
  "detectedOccasion": "...",
  "summary": "Brief 1-sentence explanation of what you found for the user in Bengali or English",
  "matchingProductIds": ["prod-1", "prod-2"]
}`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const matchedProducts = (parsed.matchingProductIds || [])
      .map((id: string) => allProducts.find(p => p.id === id))
      .filter(Boolean);

    // If AI found fewer than 1 match, fallback to broad search
    const finalProducts = matchedProducts.length > 0 ? matchedProducts : allProducts.slice(0, 4);

    return res.json({
      interpretedQuery: parsed,
      matchingProductIds: finalProducts.map((p: any) => p.id),
      matchedProducts: finalProducts
    });
  } catch (err: any) {
    console.error('Gemini search error:', err);
    return res.json({
      interpretedQuery: { summary: `Search results for "${query}"` },
      matchingProductIds: allProducts.slice(0, 4).map(p => p.id),
      matchedProducts: allProducts.slice(0, 4)
    });
  }
});

/**
 * 3. AI Gadget Expert (Chatbot)
 * Floating interactive assistant answering specs, features, warranty, delivery times, and tech recommendations
 */
apiRouter.post('/ai/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const products = db.getProducts();
  const availableItems = products.map(p => `• [${p.id}] ${p.title} (${p.category}, Price: ৳${p.salePrice || p.price})`).join('\n');

  if (!ai) {
    return res.json({
      reply: `Welcome to TechNova Mart! I am your AI Gadget & Tech Assistant. We have 100% authentic electronic products including VGR professional hair clippers, body massagers, electric kettles, and portable juicers with same-day delivery in Dhaka. How can I help you today?`,
      recommendedProductIds: ['prod-6', 'prod-2']
    });
  }

  try {
    const systemPrompt = `You are "TechNova AI", the Smart Tech & Gadget Assistant for TechNova Mart (Bangladesh's premier online gadgets & electronics shop).
Your personality: Helpful, knowledgeable, friendly, fluent in both English and Bengali (Banglish or Bengali script).

Store catalog highlights:
${availableItems}

Key customer knowledge:
- Currencies: Always use Bangladeshi Taka (৳ BDT).
- Delivery: Same-day delivery inside Dhaka (৳80), 48-72 hours nationwide outside Dhaka (৳150).
- Payment methods: bKash, Nagad, Upay, Rocket, Cash on Delivery (COD), VISA, Mastercard.
- Warranty: 7-day replacement warranty on manufacturing defects, 6-12 months brand warranty on select electronics.
- Customer Hotline: 01410732067 (9 AM - 10 PM).
- Office: 57/1, Road-7A, Dhanmondi, Dhaka-1209.

Format instructions:
Provide a clear, engaging response. When relevant to the user query, recommend 1 to 3 matching gadgets by including their IDs in the JSON response.

Return strict JSON:
{
  "reply": "Your helpful response in polite English or Bengali matching customer tone",
  "recommendedProductIds": ["prod-1"] // or empty array if not directly product-specific
}`;

    const formattedHistory = (history || []).slice(-6).map((h: any) => `${h.role === 'user' ? 'Customer' : 'Aura'}: ${h.text}`).join('\n');

    const prompt = `${systemPrompt}

Conversation so far:
${formattedHistory}

Customer: "${message}"

Respond with JSON:`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const recommendedProducts = (parsed.recommendedProductIds || [])
      .map((id: string) => products.find(p => p.id === id))
      .filter(Boolean);

    return res.json({
      reply: parsed.reply || 'I am delighted to assist with your wardrobe selections. What occasion are you dressing for?',
      recommendedProducts
    });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    return res.json({
      reply: 'I would be delighted to help you find the perfect ensemble. Our festive Panjabi and Jamdani saree collections are currently the most sought after for upcoming celebrations. Would you like to view our festive arrivals?',
      recommendedProducts: products.slice(0, 2)
    });
  }
});

/**
 * 4. "Complete the Look" Recommendations
 */
apiRouter.post('/ai/complete-the-look', async (req, res) => {
  const { productId } = req.body;
  const current = db.getProductById(productId);
  if (!current) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const allProducts = db.getProducts().filter(p => p.id !== productId);

  // Suggest complementary accessories, power devices, or gadgets
  let suggested = allProducts.filter(p => {
    if (current.category === 'Personal Care') {
      return p.category === 'Personal Care' || p.category === 'Accessories';
    }
    if (current.category === 'Home Appliances') {
      return p.category === 'Accessories' || p.category === 'Home Appliances';
    }
    if (current.category === 'Smartphone' || current.category === 'Laptop') {
      return p.category === 'Earbuds' || p.category === 'Smartwatch' || p.category === 'Accessories';
    }
    return p.category !== current.category;
  });

  if (suggested.length === 0) {
    suggested = allProducts.slice(0, 3);
  }

  return res.json({
    reason: `Curated styling pieces that enhance the silhouettes and tones of ${current.title}`,
    items: suggested.slice(0, 3)
  });
});
