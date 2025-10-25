import React, { useEffect, useMemo, useState } from 'react'

// ==========================================================
// MZ RESELLS — Animated, single-file React app (Tailwind)
// - Home: hero + money rain effect + 4 featured bundles
// - Shop: all bundles (Catalogue removed)
// - Bundle: details page
// - Tools: Profit calc + Description builder
// - Prices updated (All Premium £35; others £12.99/£15)
// - Image mapping + onError fallback
// - Compare-at (strikethrough) price + live price
// - Profit range (underlined) per bundle
// - "Free guide included" badges
// - No "High ROI" tags
// ==========================================================

// ------------------------- THEME -------------------------
const s = {
  page: 'min-h-screen bg-black text-white font-sans',
  wrap: 'max-w-6xl mx-auto px-6',
  card: 'bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4',
  btn: 'bg-emerald-400 text-black font-semibold py-2 px-4 rounded-lg transition hover:scale-105',
  ghost: 'border border-emerald-400 text-emerald-300 font-semibold py-2 px-4 rounded-lg transition hover:bg-emerald-400 hover:text-black',
}

// ------------------------- DATA --------------------------
// (Removed bundles earlier requested to drop: all-regular-supplier-links-bundle, branded-shirt-suppliers, vintage-jacket-suppliers)
const BUNDLES = [
  { slug: 'all-premium-suppliers-links-bundle', name: 'All Premium Suppliers Links Bundle', price: '£35.00', tag: 'Authentic Private Suppliers', desc: 'Premium supplier links for Bape, Stussy, Supreme and more.' },
  { slug: 'full-ralph-lauren-supplier-bundle', name: 'Full Ralph Lauren Supplier Bundle', price: '£15.00', tag: 'Authentic Private Suppliers', desc: 'Complete suite of vetted Ralph Lauren suppliers across categories.' },
  { slug: 'ysl-stone-island-knitwear-suppliers', name: 'YSL & Stone Island Knitwear Suppliers', price: '£15.00', tag: 'Authentic Private Suppliers', desc: 'Direct knitwear suppliers for YSL and Stone Island.' },
  { slug: 'ralph-lauren-knitwear-suppliers', name: 'Ralph Lauren Knitwear Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Reliable knitwear suppliers for RL jumpers and cardigans.' },
  { slug: 'burberry-suppliers', name: 'Burberry Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Trusted sources for Burberry coats, shirts and more.' },
  { slug: 'burberry-scarf-supplier', name: 'Burberry Scarf Supplier', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Direct contacts for Burberry scarves.' },
  { slug: 'stone-island-suppliers', name: 'Stone Island Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Consistent Stone Island sources with frequent restocks.' },
  { slug: 'north-face-fleece-suppliers', name: 'North Face Fleece Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Warm fleeces from vetted The North Face suppliers.' },
  { slug: 'vintage-bape-suppliers', name: 'Vintage Bape Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Vintage Bape tees, hoodies and accessories suppliers.' },
  { slug: 'vintage-stussy-suppliers', name: 'Vintage Stussy Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Curated Stüssy suppliers for tees, hoodies and accessories with reliable grading and fast turnarounds.' },
  { slug: 'vintage-designer-handbag-supplier', name: 'Vintage Designer HandBag Supplier', price: '£15.00', tag: 'Authentic Private Suppliers', desc: 'Designer handbag sources with graded stock.' },
  { slug: 'polo-shirt-suppliers', name: 'Polo Shirt Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Bulk and small-batch polo shirt suppliers.' },
  { slug: 'branded-knitwear-suppliers', name: 'Branded Knitwear Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Mixed-brand knitwear suppliers with steady margins.' },
  { slug: 'branded-windbreaker-suppliers', name: 'Branded WindBreaker Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Windbreaker sources across top brands.' },
  { slug: 'vintage-branded-track-shell-jacket-suppliers', name: 'Vintage Branded Track/Shell Jacket Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Track and shell jacket suppliers popular in vintage niches.' },
  { slug: 'vintage-football-shirt-suppliers', name: 'Vintage Football Shirt Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Retro football shirt sources, rotating leagues and eras.' },
  { slug: 'ralph-lauren-zip-supplier', name: 'Ralph Lauren Zip Supplier', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'RL zips and full-zips direct from vetted suppliers.' },
  { slug: 'ralph-lauren-quarter-zip-suppliers', name: 'Ralph Lauren Quarter Zip Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Quarter-zip focused RL suppliers.' },
  { slug: 'ralph-lauren-crew-neck-suppliers', name: 'Ralph Lauren Crew Neck Suppliers', price: '£12.99', tag: 'Authentic Private Suppliers', desc: 'Vetted crew-neck knitwear suppliers for genuine-feel RL pieces, consistent sizing and steady restocks.' },
  { slug: 'winters-best-sellers-bundle', name: "Winter's Best Sellers Bundle", price: '£15.00', tag: 'Authentic Private Suppliers', desc: 'Seasonal high-demand suppliers curated for winter flips.' },
]

// Profit-focused micro copy
const DESC_BY_SLUG = {
  'all-premium-suppliers-links-bundle': 'Master list spanning streetwear and designer. Expect quick conversions and repeatable flips.',
  'full-ralph-lauren-supplier-bundle': 'Covers knitwear, zips, polos and more. Great for RL-heavy shops in A/W.',
  'ysl-stone-island-knitwear-suppliers': 'Targeted knitwear lines; reliable sizing for higher-ticket winter listings.',
  'ralph-lauren-knitwear-suppliers': 'Crews, v-necks and cardigans with dependable grading notes.',
  'burberry-suppliers': 'Outerwear and shirting from trusted sources; pattern & fabric checks noted.',
  'burberry-scarf-supplier': 'Scarves with clear fabric notes—fast Q4–Q1 turnover.',
  'stone-island-suppliers': 'Core SI items & staples; frequent restocks for steady listings.',
  'north-face-fleece-suppliers': 'Fleece & outer layers—strong winter margin profile.',
  'vintage-bape-suppliers': 'Vintage Bape staples with sizing expectations and grading cues.',
  'vintage-stussy-suppliers': 'Classic Stüssy demand for tees and hoodies year-round.',
  'vintage-designer-handbag-supplier': 'Designer bags with graded stock and condition tiers.',
  'polo-shirt-suppliers': 'Staple polos in bulk/small runs—dependable warm-season flips.',
  'branded-knitwear-suppliers': 'Mixed-brand knitwear pack for reliable winter margins.',
  'branded-windbreaker-suppliers': 'Light outerwear that sells year-round with low shipping cost.',
  'vintage-branded-track-shell-jacket-suppliers': 'Track & shell jackets loved across vintage niches.',
  'vintage-football-shirt-suppliers': 'Retro shirts across leagues/eras with evergreen demand.',
  'ralph-lauren-zip-supplier': 'Zips/full-zips from consistent lines—easy style descriptions.',
  'ralph-lauren-quarter-zip-suppliers': 'Quarter-zips with strong sell-through in colder months.',
  'ralph-lauren-crew-neck-suppliers': 'Crew neck RL knitwear with consistent fit/materials.',
  'winters-best-sellers-bundle': 'Hand-picked seasonal winners to move quickly during peak.',
}

// ------------------ Images & fallback -------------------
const FALLBACK_IMG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="288" height="288"><rect width="100%" height="100%" fill="%2318181b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14">Image</text></svg>'

const IMG_BY_SLUG = {
  'all-premium-suppliers-links-bundle': 'https://vintedresells.com/cdn/shop/files/stussy-Photoroom_4.jpg?v=1733868380&width=1280',
  'full-ralph-lauren-supplier-bundle': 'https://vintedresells.com/cdn/shop/files/F67A6299-2_7.png?v=1759192094&width=3088',
  'ysl-stone-island-knitwear-suppliers': 'https://vintedresells.com/cdn/shop/files/replicate-prediction-2d1y18c9c9rgc0ck63tt147e78.png?v=1733868335&width=3200',
  'ralph-lauren-knitwear-suppliers': 'https://vintedresells.com/cdn/shop/files/replicate-prediction-e053znydc9rga0cmqgdt4mnw5w.png?v=1738323097&width=3200',
  'burberry-suppliers': 'https://vintedresells.com/cdn/shop/files/replicate-prediction-efdftztjjsrg80cmq25rqrz0tg.png?v=1738265618&width=3200',
  'burberry-scarf-supplier': 'https://vintedresells.com/cdn/shop/files/F67A6299-2_9.png?v=1759956445&width=3088',
  'stone-island-suppliers': 'https://vintedresells.com/cdn/shop/files/stussy-Photoroom_2_5e3c207a-7ae2-489b-a182-965e5536dd57.jpg?v=1733868374&width=1280',
  'north-face-fleece-suppliers': 'https://vintedresells.com/cdn/shop/files/F67A6299-2_5.png?v=1759190932&width=3088',
  'vintage-bape-suppliers': 'https://vintedresells.com/cdn/shop/files/IMG-2135polo-Photoroom-Photoroom_3.jpg?v=1759078614&width=1280',
  'vintage-stussy-suppliers': 'https://vintedresells.com/cdn/shop/files/stussy-Photoroom_4.jpg?v=1733868380&width=1280',
  'vintage-designer-handbag-supplier': 'https://vintedresells.com/cdn/shop/files/F67A6299-2_8.png?v=1759956067&width=3088',
  'polo-shirt-suppliers': 'https://vintedresells.com/cdn/shop/files/replicate-prediction-xa2e54vbj5rge0ck6hav0dv400.png?v=1733868453&width=3200',
  'branded-knitwear-suppliers': 'https://vintedresells.com/cdn/shop/files/IMG-2135shirts-Photoroom_3.jpg?v=1733868423&width=1264',
  'branded-windbreaker-suppliers': 'https://vintedresells.com/cdn/shop/files/hoodies-Photoroom_2.jpg?v=1733868369&width=800',
  'vintage-branded-track-shell-jacket-suppliers': 'https://vintedresells.com/cdn/shop/files/hoodies-Photoroom_2.jpg?v=1733868369&width=800',
  'vintage-football-shirt-suppliers': 'https://vintedresells.com/cdn/shop/files/IMG-2135polo-Photoroom-Photoroom_3.jpg?v=1759078614&width=1280',
  'ralph-lauren-zip-supplier': 'https://vintedresells.com/cdn/shop/files/F67A6299-2_6.png?v=1759190932&width=3088',
  'ralph-lauren-quarter-zip-suppliers': 'https://vintedresells.com/cdn/shop/files/F67A6299-2_2.png?v=1759163698&width=3088',
  'ralph-lauren-crew-neck-suppliers': 'https://vintedresells.com/cdn/shop/files/replicate-prediction-e053znydc9rga0cmqgdt4mnw5w.png?v=1738323097&width=3200',
  'winters-best-sellers-bundle': 'https://vintedresells.com/cdn/shop/files/hoodies-Photoroom_2.jpg?v=1733868369&width=800',
}

// --------------------- Pricing helpers ------------------
function displayPrice(p){
  let n = parseFloat(String(p).replace(/[^0-9.]/g,''))
  if(!isFinite(n)) return p
  const out = Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.00$/,'')
  return `£${out}`
}
function toNumber(p){ const n = parseFloat(String(p).replace(/[^0-9.]/g,'')); return isFinite(n)? n : 0 }
function formatGBP(n, forceDecimals=false){
  if(!isFinite(n)) return '£0.00'
  const out = forceDecimals ? n.toFixed(2) : (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.00$/,''))
  return `£${out}`
}
function comparePrice(p){
  const n = toNumber(p)
  let comp = Math.max(n*1.8, n+10)
  comp = Math.ceil(comp) - 0.01 // e.g. 62.99
  return comp
}
function profitRange(slug){
  const s = String(slug)
  if(s.includes('all-premium')) return [150, 400]
  if(s.includes('full-ralph')||s.includes('ysl')||s.includes('winters')) return [70, 180]
  if(s.includes('handbag')) return [80, 220]
  if(s.includes('zip')||s.includes('quarter-zip')||s.includes('crew-neck')||s.includes('polo')) return [50, 140]
  return [40, 120]
}
function profitRangeText(slug){ const [lo, hi] = profitRange(slug); return `${formatGBP(lo, true)}–${formatGBP(hi, true)}` }
function getDesc(slug, fallback){ return DESC_BY_SLUG[slug] || fallback || '' }

function HoverButton({ className='', onClick, children }){ return <button onClick={onClick} className={className}>{children}</button> }

// ------------------------- APP -------------------------
export default function App(){
  return (
    <ErrorBoundary>
      <InnerApp/>
    </ErrorBoundary>
  )
}

function InnerApp(){
  const [page,setPage]=useState('home') // home|shop|bundle|tools
  const [param,setParam]=useState(null)
  const go=(p,prm=null)=>{ setPage(p); setParam(prm); if(typeof window!=='undefined') window.scrollTo(0,0) }

  return (
    <div className={s.page}>
      {/* ticker keyframes */}
      <style>{`
        @keyframes tickerMarq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marq { animation: tickerMarq 18s linear infinite; }
      `}</style>
      <header className={`${s.wrap} sticky top-0 z-40 backdrop-blur bg-black/60 flex justify-between items-center py-4 border-b border-zinc-900`}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=>go('home')}>
          <div className="w-7 h-7 rounded bg-emerald-900/30 border border-emerald-500/60"/>
          <div className="text-2xl font-extrabold text-emerald-400">MZ Resells</div>
        </div>
        <nav className="flex gap-4 text-sm">
          <HoverButton className="hover:text-emerald-300" onClick={()=>go('home')}>Home</HoverButton>
          <HoverButton className="hover:text-emerald-300" onClick={()=>go('shop')}>Shop</HoverButton>
          <HoverButton className="hover:text-emerald-300" onClick={()=>go('tools')}>Seller Tools</HoverButton>
        </nav>
      </header>

      {page==='home' && <Home go={go} />}
      {page==='shop' && <Shop go={go} />}
      {page==='bundle' && <Bundle slug={param} go={go} />}
      {page==='tools' && <Tools />}

      <Ticker />
      <footer className="text-center text-gray-500 py-6 border-t border-zinc-900 mt-0">© {new Date().getFullYear()} MZ Resells. All rights reserved.</footer>
    </div>
  )
}

// --------------------- ERROR BOUNDARY -------------------
class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error){ return { hasError: true, error } }
  componentDidCatch(error, info){ console.error('App error:', error, info) }
  render(){
    if(this.state.hasError){
      return (
        <div className="min-h-screen bg-black text-white p-6">
          <h2 className="text-2xl font-bold text-red-400">Something went wrong.</h2>
          <pre className="mt-3 text-sm text-red-300 whitespace-pre-wrap">{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

// --------------------------- PAGES ----------------------
function Home({ go }){
  const [showIntro, setShowIntro] = useState(true)
  useEffect(() => { const t = setTimeout(() => setShowIntro(false), 900); return () => clearTimeout(t) }, [])

  const LOGO_URL = 'https://i.postimg.cc/2SZKvS1q/Chat-GPT-Image-Oct-13-2025-08-47-05-PM-removebg-preview.png'
  const featured = useMemo(() => BUNDLES.slice(0, 4), [])

  return (
    <section className={`${s.wrap} relative py-16 flex flex-col items-center text-center`}>
      {showIntro && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-200 bg-clip-text text-transparent">MZ Resells</h1>
        </div>
      )}

      {/* Money behind logo; fades before headline/buttons */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-6 w-[520px] h-[260px] z-10 pointer-events-none select-none"
        style={{ WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)' }}
      >
        <MoneyRain count={30} heightPx={240} loop />
      </div>

      {/* Logo */}
      <div className="relative z-20 mb-6">
        <div className="w-32 h-32 rounded-full bg-black overflow-hidden grid place-items-center">
          <img src={LOGO_URL} alt="MZ Resells logo" className="w-full h-full object-contain" />
        </div>
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">Flip <span className="text-emerald-400">premium</span> pieces for real profit</h1>
      <p className="text-gray-400 mt-4 max-w-2xl">One-time purchases. Instant access. Built-in tools to list faster and price smarter.</p>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <HoverButton className={s.btn} onClick={()=>go('shop')}>Shop Bundles</HoverButton>
        <HoverButton className={s.ghost} onClick={()=>go('tools')}>Seller Tools</HoverButton>
      </div>

      {/* Featured Bundles row (fixed 4) */}
      <div className="mt-10 grid gap-4 md:grid-cols-4 w-full">
        {featured.map(b => (
          <div key={b.slug} onClick={() => go('bundle', b.slug)} className={`${s.card} cursor-pointer hover:border-emerald-500/40`}>
            <div className="w-full aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-black">
              {IMG_BY_SLUG[b.slug] ? (
                <img src={IMG_BY_SLUG[b.slug]} alt={b.name} className="w-full h-full object-cover" onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=FALLBACK_IMG; }} />
              ) : (
                <div className="w-full h-full bg-zinc-900 grid place-items-center text-gray-500">Image</div>
              )}
            </div>
            <div className="mt-2 font-semibold">{b.name}</div>
            <div className="text-sm">
              <span className="text-gray-500 line-through mr-2">{formatGBP(comparePrice(b.price), true)}</span>
              <span className="text-emerald-400 font-semibold">{displayPrice(b.price)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews strip */}
      <div className="w-full mt-12">
        <h3 className="text-left text-xl font-extrabold mb-3">What buyers are saying</h3>
        <ReviewsStrip />
      </div>
    </section>
  )
}

function Shop({ go }){
  return (
    <section className={`${s.wrap} py-8`}>
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-2xl font-extrabold">Shop</h3>
          <p className="text-gray-400">One-time purchases. Instant access after checkout.</p>
        </div>
      </div>

      <h4 className="mt-6 font-bold">Bundles</h4>
      <div className="grid gap-4 md:grid-cols-2">
        {BUNDLES.map(b=> (
          <div key={b.slug} onClick={()=>go('bundle', b.slug)} className={`${s.card} grid grid-cols-[128px_1fr] gap-4 items-center cursor-pointer hover:border-emerald-500/40`}>
            <div className="w-32 h-32 rounded-xl overflow-hidden border border-zinc-800 bg-black">
              {IMG_BY_SLUG[b.slug] ? (
                <img src={IMG_BY_SLUG[b.slug]} alt={b.name} className="w-full h-full object-cover" onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=FALLBACK_IMG; }} />
              ) : (
                <div className="w-full h-full bg-zinc-900 grid place-items-center text-gray-500">Image</div>
              )}
            </div>
            <div>
              {b.tag && <span className="text-xs text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded mr-2">{b.tag}</span>}
              <span className="text-xs text-black bg-emerald-300 px-2 py-0.5 rounded font-semibold">Free guide included</span>
              <div className="font-semibold mt-1">{b.name}</div>
              <div className="text-sm text-gray-400">{getDesc(b.slug, b.desc)}</div>
              <div className="text-xs text-emerald-300 mt-1">Typical profit per flip: <span className="underline decoration-emerald-400 decoration-2 underline-offset-2">{profitRangeText(b.slug)}</span></div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 line-through">{formatGBP(comparePrice(b.price), true)}</span>
                  <span className="text-emerald-400 font-bold">{displayPrice(b.price)}</span>
                </div>
                <HoverButton className={s.btn} onClick={(e)=>{e.stopPropagation(); go('bundle', b.slug)}}>View Bundle</HoverButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Bundle({ slug, go }){
  const bundle = BUNDLES.find(b=>b.slug===slug) || BUNDLES[0]
  return (
    <section className={`${s.wrap} py-8`}>
      <button onClick={()=>go('shop')} className="text-sm text-emerald-300 border-b border-dashed border-emerald-400">← Back to Shop</button>
      <div className={`${s.card} mt-3`}>
        <div className="grid md:grid-cols-[320px_1fr] gap-4 items-stretch">
          <div className="w-full h-80 rounded-xl overflow-hidden border border-zinc-800 bg-black grid place-items-center">
            {IMG_BY_SLUG[bundle.slug] ? (
              <img src={IMG_BY_SLUG[bundle.slug]} alt={bundle.name} className="w-full h-full object-cover" onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=FALLBACK_IMG; }} />
            ) : (
              <div className="w-full h-full bg-zinc-900 grid place-items-center text-gray-500">Image</div>
            )}
          </div>
          <div>
            <p className="uppercase tracking-widest text-emerald-300 text-xs">{bundle.tag || 'Bundle'}</p>
            <h2 className="text-2xl font-extrabold">{bundle.name}</h2>
            <p className="text-gray-400 mt-2">{getDesc(bundle.slug, bundle.desc)}</p>
            <p className="text-emerald-300 text-sm mt-1">Typical profit per flip: <span className="underline decoration-emerald-400 decoration-2 underline-offset-2">{profitRangeText(bundle.slug)}</span></p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-gray-500 line-through mr-2">{formatGBP(comparePrice(bundle.price), true)}</span>
              <span className="text-emerald-400 font-extrabold">{displayPrice(bundle.price)}</span>
              <span className="text-xs text-black bg-emerald-300 px-2 py-0.5 rounded font-semibold">Free guide on how to order included</span>
            </div>
            <div className="flex gap-3 mt-4">
              <HoverButton className={s.btn} onClick={()=>alert('Checkout wiring goes here')}>Buy Bundle</HoverButton>
              <HoverButton className={s.ghost} onClick={()=>go('shop')}>Continue Browsing</HoverButton>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-bold">What you get</h4>
          <p className="text-zinc-300 mt-2 text-sm">You’ll receive a curated set of authentic private supplier links relevant to this bundle’s category.</p>
        </div>
      </div>
    </section>
  )
}

function Tools(){
  return (
    <section className={`${s.wrap} py-8`}>
      <h3 className="text-2xl font-extrabold">Seller Tools</h3>
      <p className="text-gray-400">Speed up pricing and write cleaner listings.</p>
      <div className={`${s.card} mt-4 max-w-2xl`}>
        <h4 className="font-bold">Profit & Pricing Calculator</h4>
        <Calc/>
      </div>
      <div className={`${s.card} mt-4 max-w-2xl`}>
        <h4 className="font-bold">Description Builder</h4>
        <DescBuilder/>
      </div>
    </section>
  )
}

// ----------------- SMALL UTIL COMPONENTS ----------------
function Calc(){
  const [cost,setCost]=useState(12.5)
  const [sell,setSell]=useState(39.99)
  const [ship,setShip]=useState(3.99)
  const base=(+cost||0)+(+ship||0); const revenue=(+sell||0)
  const profit=Math.max(0,revenue-base); const margin=revenue>0?(profit/revenue)*100:0; const roi=base>0?(profit/base)*100:0
  return (
    <div className="mt-2">
      <div className="grid grid-cols-3 gap-2">
        <label className="text-sm">Item Cost (£)<input type="number" step="0.01" value={cost} onChange={e=>setCost(parseFloat(e.target.value)||0)} className="w-full mt-1 px-2 py-2 rounded bg-zinc-950 border border-zinc-800"/></label>
        <label className="text-sm">Sell Price (£)<input type="number" step="0.01" value={sell} onChange={e=>setSell(parseFloat(e.target.value)||0)} className="w-full mt-1 px-2 py-2 rounded bg-zinc-950 border border-zinc-800"/></label>
        <label className="text-sm">Shipping Fees (£)<input type="number" step="0.01" value={ship} onChange={e=>setShip(parseFloat(e.target.value)||0)} className="w-full mt-1 px-2 py-2 rounded bg-zinc-950 border border-zinc-800"/></label>
      </div>
      <div className={`bg-zinc-950/70 border border-zinc-800 rounded-2xl p-3 mt-3 grid grid-cols-3 gap-2 text-center`}>
        <div><div className="text-zinc-400 text-sm">Profit</div><div className="font-bold">£{profit.toFixed(2)}</div></div>
        <div><div className="text-zinc-400 text-sm">Margin</div><div className="font-bold">{margin.toFixed(0)}%</div></div>
        <div><div className="text-zinc-400 text-sm">ROI</div><div className="font-bold">{roi.toFixed(0)}%</div></div>
      </div>
    </div>
  )
}

function DescBuilder(){
  const [name,setName]=useState('')
  const [desc,setDesc]=useState('')
  function gen(n){
    if(!n.trim()) return 'Enter an item name to generate a description.'
    const lower=n.toLowerCase(); const feats=[]
    if(/(puffer|down|parka)/.test(lower)) feats.push('warm insulated build')
    if(/(beanie|hat|cap)/.test(lower)) feats.push('soft knit and comfy fit')
    if(/(wallet|cardholder)/.test(lower)) feats.push('sleek profile with just-right storage')
    if(/(sneaker|shoe|trainer)/.test(lower)) feats.push('lightweight feel and everyday comfort')
    if(/(belt)/.test(lower)) feats.push('durable strap and clean hardware')
    const line=feats.length?`Featuring ${feats.join(', ')}.`:'Premium look. Reliable quality.'
    return `${n} — brand-new with tags. ${line} Perfect for daily wear and easy to style. Ships within 48 hours.`
  }
  return (
    <div className="mt-2">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Goyard Cardholder (Black)" className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800"/>
        <button onClick={()=>setDesc(gen(name))} className={s.btn}>Generate</button>
      </div>
      <textarea rows={6} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Your generated description will appear here." className="w-full mt-2 p-3 rounded bg-zinc-950 border border-zinc-800"/>
    </div>
  )
}

// ---------------------- MONEY + REVIEWS ------------------
function MoneyRain({ count = 30, heightPx = 240, loop = true }) {
  const items = useMemo(
    () => Array.from({ length: count }).map((_, i) => ({
      id: `bill-${i}-${Math.random().toString(36).slice(2)}`,
      left: Math.random() * 100,
      delay: Math.random() * 1.0,
      dur: 2.4 + Math.random() * 1.1,
      rot: (Math.random() - 0.5) * 40,
      size: 16 + Math.random() * 16,
    })),
    [count]
  )

  return (
    <div className="relative w-full h-full">
      {items.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            left: `${b.left}%`,
            top: -70,
            fontSize: b.size,
            transform: `rotate(${b.rot}deg)`,
            animation: `${b.id}-fall ${b.dur}s linear ${b.delay}s ${loop ? 'infinite' : 'forwards'}`,
            filter: 'drop-shadow(0 0 8px rgba(52,211,153,.45))',
          }}
        >
          💵
          <style>{`
            @keyframes ${b.id}-fall {
              0% { transform: translateY(-70px) rotate(${b.rot}deg); opacity: 0; }
              15% { opacity: 1; }
              100% { transform: translateY(${heightPx}px) rotate(${b.rot + 360}deg); opacity: 0; }
            }
          `}</style>
        </div>
      ))}
    </div>
  )
}

function ReviewsStrip(){
  const items = [
    { n: 'Lewis P.', p: 'Manchester, UK', s: 5, t: 'Pulled two quick flips in 72 hours. Solid bundle.' },
    { n: 'Sofia M.', p: 'London, UK', s: 5, t: 'Instant access + great margins. Exactly what I needed.' },
    { n: 'Ibrahim K.', p: 'Birmingham, UK', s: 4, t: 'Links were clean and converted. Tools helped pricing.' },
    { n: 'Ava R.', p: 'Dublin, IE', s: 5, t: 'High ROI picks. Paid for itself in a weekend.' },
    { n: 'Noah T.', p: 'Glasgow, UK', s: 5, t: 'Fast delivery of links and helpful tips.' },
  ]
  const Star = ({ filled }) => <span className={filled? 'text-emerald-400' : 'text-zinc-600'}>★</span>

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map((r,i)=> (
        <div key={i} className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-emerald-200">{r.n}</div>
            <div className="text-xs text-zinc-400">{r.p}</div>
          </div>
          <div className="mt-1">
            {[1,2,3,4,5].map(k=> <Star key={k} filled={k<=r.s} />)}
          </div>
          <p className="text-zinc-300 mt-2 text-sm">“{r.t}”</p>
        </div>
      ))}
    </div>
  )
}

// ---------------------- BOTTOM TICKER --------------------
function Ticker(){
  const items = [
    'Over 50,000+ customers',
    '$500,000 revenue generated this year',
    'High quality vendor links'
  ]
  return (
    <div className="w-full bg-zinc-950 border-t border-zinc-800 overflow-hidden">
      <div className="py-3">
        <div className="flex items-center gap-4 whitespace-nowrap marq text-emerald-300 text-sm font-semibold">
          {items.concat(items).map((text, i) => (
            <React.Fragment key={i}>
              <span className="">{text}</span>
              {i !== items.length * 2 - 1 && <span className="text-gray-500 text-lg">•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <style>{`@keyframes marq { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}
