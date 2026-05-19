import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Head from "next/head";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TAG_HREF = {
  Luxor: "/Luxor", Cairo: "/Cairo", Siwa: "/Siwa",
  Alexandria: "/Alexandria", Aswan: "/Aswan", "Tips & Advice": "/offerings",
};
const TAGS   = ["All", ...Object.keys(TAG_HREF)];
const SERIF  = { fontFamily: "'Playfair Display', serif" };
const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] },
});

const POSTS = [
  { id:1, type:"story",    tag:"Luxor",         img:"/images/communities/story1.jpg", category:"Luxor · Travel Story",        title:"Waking up at 4 AM for the balloon ride that changed how I see Egypt forever", excerpt:"I almost skipped it — too tired, too cold. Then we rose above the Valley of the Kings as the sun cracked the horizon.", author:"Sara Al-Masri",   initials:"SA", avatarBg:"#c0392b", date:"2 days ago",  likes:284, readTime:"4 min read" },
  { id:2, type:"story",    tag:"Siwa",          img:"/images/communities/story2.jpg", category:"Siwa · Hidden Gem",           title:"The oasis that Instagram hasn't discovered yet",                               excerpt:"3 days completely offline, salt lake sunsets, and the friendliest locals I've ever met.",                            author:"Karim Mansour",  initials:"KM", avatarBg:"#2980b9", date:"5 days ago",  likes:156, readTime:"3 min read" },
  { id:3, type:"tip",      tag:"Tips & Advice", img:"/images/communities/story3.jpg", category:"Tips & Advice · First-Timer", title:"Everything I wish I knew before my first trip to Egypt",                     excerpt:"Visas, scams to avoid, what to pack, and why you should always carry small bills.",                                  author:"Nour Fahmy",     initials:"NF", avatarBg:"#27ae60", date:"1 week ago",  likes:412, readTime:"7 min read" },
  { id:4, type:"story",    tag:"Cairo",         img:"/images/communities/story4.jpg", category:"Cairo · History",             title:"Standing inside the Great Pyramid — what the photos never show you",          excerpt:"The heat, the silence, the weight of 4,000 years pressing in. It rewires something in your brain.",                 author:"Youssef Hassan", initials:"YH", avatarBg:"#8e44ad", date:"2 weeks ago", likes:210, readTime:"5 min read" },
  { id:5, type:"question", tag:"Tips & Advice", img:"/images/communities/photo3.jpg", category:"Q&A · Planning",             title:"Is 10 days enough to see Luxor, Aswan AND Cairo?",                           excerpt:"Planning my first Egypt trip and feeling overwhelmed.",                                                               author:"Marco Bianchi",  initials:"MB", avatarBg:"#e67e22", date:"3 days ago",  likes:34,  readTime:"Discussion" },
  { id:6, type:"story",    tag:"Alexandria",    img:"/images/communities/photo2.jpg", category:"Alexandria · Local Life",    title:"Eating ful medames by the sea at sunrise — an Alexandrian morning ritual",   excerpt:"The corniche at 6 AM with a paper cup of tea. This is the city nobody tells you about.",                             author:"Layla Rizk",     initials:"LR", avatarBg:"#d35400", date:"4 days ago",  likes:98,  readTime:"3 min read" },
];

const TRENDING = [
  { tag:"Luxor", href:"/Luxor",         count:"1.2k posts", emoji:"🏛️" },
  { tag:"Cairo", href:"/Cairo",         count:"980 posts",  emoji:"🔺" },
  { tag:"Siwa",  href:"/Siwa",          count:"640 posts",  emoji:"🌴" },
  { tag:"Aswan", href:"/Aswan",         count:"530 posts",  emoji:"⛵" },
  { tag:"Sharm", href:"/SharmElSheikh", count:"490 posts",  emoji:"🤿" },
];

const POLL_OPTIONS = [
  { label:"Siwa Oasis", votes:412 }, { label:"Dahab",        votes:298 },
  { label:"El Minya",   votes:187 }, { label:"Marsa Matruh", votes:143 },
];

const TIPS = [
  { img:"/images/communities/tip1.jpg", title:"Best Time to Visit", text:"Oct–Apr is ideal. Summer in Aswan hits 45°C — temples won't wait but heat will slow you." },
  { img:"/images/communities/tip2.jpg", title:"Cash & Cards",       text:"Always carry Egyptian pounds. ATMs in Luxor & Cairo are reliable; Siwa is cash-only." },
  { img:"/images/communities/tip3.jpg", title:"Local Guides",       text:"Official guides open doors — literally. Many restricted areas are guide-access only." },
  { img:"/images/communities/tip4.jpg", title:"Dress Code",         text:"Pack a light scarf. Shoulders & knees covered at temples is respectful and required." },
];

const PHOTOS = [
  { img:"/images/communities/photo1.jpg", label:"Valley of the Kings · @sara.travels", wide:true, href:"/Luxor" },
  { img:"/images/communities/photo2.jpg", label:"Aswan sunset · @karim.m",                        href:"/Aswan" },
  { img:"/images/communities/photo3.jpg", label:"Siwa Oasis · @nour.f",                           href:"/Siwa" },
  { img:"/images/communities/photo4.jpg", label:"Sharm reefs · @youssef.h",                       href:"/SharmElSheikh" },
  { img:"/images/communities/photo5.jpg", label:"Cairo nights · @layla.r",                        href:"/Cairo" },
];

const QA = [
  { q:"What is the best time of year to visit Egypt?",         a:"October to April is the sweet spot — 18–28°C across Luxor, Cairo, and Aswan. Avoid June–August in Upper Egypt; Aswan regularly exceeds 45°C." },
  { q:"Do I need a visa to visit Egypt?",                      a:"Most nationalities can get a visa on arrival at Cairo, Hurghada, or Sharm airports (~$25 USD), or apply via visa2egypt.gov.eg." },
  { q:"Is Egypt safe to travel solo, especially as a woman?",  a:"Generally safe. Dress modestly, use reputable guides and licensed taxis or Uber, and trust your instincts. Siwa and Luxor are widely considered the most relaxed." },
  { q:"How do I get from Cairo to Luxor or Aswan?",            a:"Take the overnight sleeper train (9–10 hrs) or an EgyptAir flight (often under $50 one-way if booked ahead)." },
  { q:"Should I carry cash or can I use cards in Egypt?",      a:"Always carry Egyptian pounds. ATMs are reliable in cities; Siwa is cash-only. Use bank ATMs to avoid high fees." },
  { q:"What should I wear when visiting temples and mosques?", a:"Cover shoulders and knees. A lightweight scarf doubles as sun protection. Comfortable closed-toe shoes are wise for uneven ancient floors." },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function TagBar({ active, onChange }) {
  const ref     = useRef(null);
  const btnRefs = useRef({});
  const [ind, setInd] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const btn = btnRefs.current[active];
    if (btn && ref.current) {
      const cR = ref.current.getBoundingClientRect();
      const bR = btn.getBoundingClientRect();
      setInd({ left: bR.left - cR.left, width: bR.width });
    }
  }, [active]);

  return (
    <div ref={ref} className="relative flex flex-wrap gap-1.5 mb-7">
      <motion.div animate={ind} transition={{ type:"spring", stiffness:400, damping:36 }}
        className="absolute top-0 h-full bg-yellow-400 rounded-full pointer-events-none z-0" />
      {TAGS.map(tag => (
        <button key={tag} ref={el => (btnRefs.current[tag] = el)} onClick={() => onChange(tag)}
          className={`relative z-10 px-4 py-1.5 rounded-full text-[13px] font-medium border whitespace-nowrap cursor-pointer transition-colors
            ${active === tag ? "border-yellow-400 text-gray-900" : "border-gray-200 text-gray-500 hover:border-yellow-300"}`}
          style={{ background:"transparent" }}>
          {tag}
        </button>
      ))}
    </div>
  );
}

function PostCard({ post, index, onLike, liked }) {
  const typeColor = { story:"bg-amber-600", tip:"bg-emerald-600", question:"bg-violet-700" };
  return (
    <Link href={TAG_HREF[post.tag] || "/Destination"}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:index*0.07}}
        whileHover={{y:-4}} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer flex flex-col h-full">
        <div className="h-48 overflow-hidden relative shrink-0">
          <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <span className={`absolute top-3 left-3 ${typeColor[post.type]} text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full`}>{post.type}</span>
          <span className="absolute bottom-2.5 right-3 text-white/80 text-[11px]">{post.readTime}</span>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-600 mb-1.5">{post.category}</p>
          <h3 className="font-bold text-sm text-gray-900 leading-snug mb-2 flex-1" style={SERIF}>{post.title}</h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-3">{post.excerpt}</p>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{background:post.avatarBg}}>{post.initials}</div>
            <div><p className="text-[13px] font-semibold text-gray-900">{post.author}</p><p className="text-[11px] text-gray-400">{post.date}</p></div>
          </div>
          <div className="pt-2.5 border-t border-gray-100">
            <button onClick={e => { e.preventDefault(); onLike(post.id); }}
              className={`flex items-center gap-1.5 text-xs cursor-pointer border-none bg-transparent p-0 transition-colors ${liked ? "text-rose-500" : "text-gray-400 hover:text-rose-400"}`}>
              <motion.span animate={liked ? {scale:[1,1.5,1]}:{scale:1}} transition={{duration:0.3}}>{liked ? "❤️":"🤍"}</motion.span>
              {post.likes + (liked ? 1:0)} likes
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function Poll() {
  const [voted,  setVoted]  = useState(null);
  const [counts, setCounts] = useState(POLL_OPTIONS.map(o => o.votes));
  const total = counts.reduce((s,v) => s+v, 0);
  const vote  = i => { if (voted!==null) return; setVoted(i); setCounts(p => p.map((v,j) => j===i ? v+1:v)); };
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">Weekly Poll</span>
      <h3 className="text-sm font-bold text-gray-900 mt-2.5 mb-4 leading-snug" style={SERIF}>Which Egyptian destination deserves more attention?</h3>
      {POLL_OPTIONS.map((opt,i) => {
        const pct = Math.round((counts[i]/total)*100);
        return (
          <div key={i} onClick={() => vote(i)}
            className={`relative rounded-xl border overflow-hidden cursor-pointer transition-colors mb-2.5 ${voted===i ? "border-yellow-400":"border-gray-200"}`}
            style={{background:"#fafafa"}}>
            {voted!==null && <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.6}} className={`absolute inset-0 z-0 ${voted===i ? "bg-yellow-50":"bg-gray-100"}`} />}
            <div className="relative z-10 flex items-center justify-between px-3.5 py-2.5">
              <span className={`text-[13px] ${voted===i ? "font-semibold":""} text-gray-900`}>{opt.label}</span>
              {voted!==null && <span className="text-xs font-semibold text-gray-400">{pct}%</span>}
            </div>
          </div>
        );
      })}
      <p className="text-[11px] text-gray-400 mt-1">{total.toLocaleString()} votes · {voted===null ? "Click to vote":"Thanks!"}</p>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-[13px] font-bold text-gray-900 mb-4">🔥 Trending destinations</h3>
        {TRENDING.map((t,i) => (
          <Link href={t.href} key={t.tag}>
            <div className="flex items-center justify-between hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors cursor-pointer">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{t.emoji}</span>
                <div><p className="text-[13px] font-semibold text-gray-900">{t.tag}</p><p className="text-[11px] text-gray-400">{t.count}</p></div>
              </div>
              <span className="text-[11px] text-gray-400">#{i+1}</span>
            </div>
          </Link>
        ))}
      </div>
      <Poll />
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="text-[13px] font-bold text-gray-900 mb-2">🗺️ Explore Egypt</h3>
        <p className="text-[12px] text-gray-400 leading-relaxed mb-4">Ready to plan your trip? Browse all destinations and curated experiences.</p>
        <Link href="/Destination">
          <motion.button whileHover={{scale:1.04}} whileTap={{scale:0.96}}
            className="w-full bg-yellow-400 text-gray-900 py-2.5 rounded-full text-[13px] font-bold border-none cursor-pointer hover:bg-yellow-300 transition-colors">
            View Destinations →
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

function QASection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="px-4 md:px-20 pb-12 max-w-[1200px] mx-auto">
      <div className="rounded-3xl p-6 md:p-8" style={{background:"linear-gradient(135deg,#06122e 0%,#0b1f46 50%,#102554 100%)"}}>
        <div className="flex items-start justify-between gap-6 flex-wrap mb-7">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-1" style={SERIF}>Common questions about Egypt</h3>
            <p className="text-[13px] text-gray-500">Everything travelers ask most — answered.</p>
          </div>
          <Link href="/offerings" className="text-[13px] text-yellow-400 border-b border-yellow-400/30 pb-0.5 hover:border-yellow-400 transition-colors whitespace-nowrap">Browse all offerings →</Link>
        </div>
        {QA.map((item,i) => (
          <div key={i} className={`rounded-xl border overflow-hidden transition-colors mb-2 ${open===i ? "border-yellow-400":"border-gray-700"}`} style={{background:"rgba(255,255,255,0.05)"}}>
            <button onClick={() => setOpen(open===i ? null:i)} className="w-full flex items-center justify-between px-4 py-3.5 bg-transparent border-none cursor-pointer text-left gap-3">
              <span className="text-[13px] md:text-[14px] font-semibold text-gray-100 leading-snug flex-1">{item.q}</span>
              <motion.span animate={{rotate:open===i ? 45:0}} transition={{type:"spring",stiffness:400,damping:28}} className="text-yellow-400 text-xl shrink-0 inline-block leading-none">+</motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open===i && (
                <motion.div key="a" initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.22}} className="overflow-hidden">
                  <p className="px-4 pb-4 text-[13px] text-gray-400 leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Community() {
  const [activeTag, setActiveTag] = useState("All");
  const [liked,     setLiked]     = useState({});
  const filtered   = activeTag === "All" ? POSTS : POSTS.filter(p => p.tag === activeTag);
  const toggleLike = id => setLiked(p => ({ ...p, [id]: !p[id] }));

  return (
    <>
      <Head>
        <title>Community — Kemet Travel</title>
        <meta name="description" content="Stories, tips and questions from real Egypt travelers." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        .btn-gold { background:linear-gradient(135deg,#FFCE2A 0%,#e8b800 100%); box-shadow:0 4px 14px rgba(255,206,42,.35); transition:transform .18s,box-shadow .18s; }
        .btn-gold:hover { transform:translateY(-2px); }
      `}</style>

      <main className="font-sans bg-gray-50">

        {/* ── HERO ── */}
        <section className="px-4 md:px-20 pt-10 pb-4">
          <motion.div {...fadeUp(0.1)} className="relative rounded-3xl overflow-hidden"
            style={{backgroundImage:"url('/images/communities/hero-bg.jpg')",backgroundSize:"cover",backgroundPosition:"center"}}>
            <div className="absolute inset-0" style={{background:"linear-gradient(135deg,rgba(26,18,9,.88) 0%,rgba(45,37,25,.82) 60%,rgba(61,48,32,.78) 100%)"}} />
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none" style={{background:"radial-gradient(circle,rgba(245,197,24,.18) 0%,transparent 70%)",transform:"translate(60px,-60px)"}} />
            <div className="relative z-10 px-5 md:px-12 py-10 md:py-14">
              <motion.span {...fadeUp(0.15)} className="inline-block mb-4 md:mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-400 bg-yellow-400/15 px-4 py-1.5 rounded-full">Community Hub</motion.span>
              <motion.h1 {...fadeUp(0.22)} className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-xl mb-4" style={SERIF}>
                Where every traveler becomes a <em className="not-italic text-yellow-400">storyteller</em>
              </motion.h1>
              <motion.p {...fadeUp(0.3)} className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed mb-7 md:mb-8">
                Join thousands of explorers sharing their real Egypt experiences — from Siwa sunsets to Luxor nights.
              </motion.p>
              <motion.div {...fadeUp(0.38)} className="flex gap-3 flex-wrap">
                <Link href="/Destination"><button className="btn-gold rounded-full px-6 py-3 md:px-8 md:py-3.5 font-semibold text-gray-900 text-sm border-none cursor-pointer">Explore Destinations</button></Link>
                <button onClick={() => document.getElementById("community-feed")?.scrollIntoView({behavior:"smooth"})}
                  className="rounded-full px-6 py-3 md:px-8 md:py-3.5 font-medium text-white text-sm cursor-pointer border border-white/25 bg-transparent hover:bg-white/10 transition-colors">
                  Browse Community
                </button>
              </motion.div>
              <motion.div {...fadeUp(0.46)} className="flex flex-wrap gap-6 md:gap-12 mt-8 md:mt-10 pt-6 border-t border-white/10">
                {[["12,400+","Members"],["6,200+","Posts"],["840+","Questions Answered"],["6","Destinations"]].map(([num,label]) => (
                  <div key={label}>
                    <div className="text-xl md:text-2xl font-extrabold text-white" style={SERIF}>{num}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── FEED + SIDEBAR ── */}
        <section id="community-feed" className="px-4 md:px-20 py-10 md:py-12 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
            <div>
              <TagBar active={activeTag} onChange={setActiveTag} />
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-16">
                  {filtered.map((post,i) => <PostCard key={post.id} post={post} index={i} onLike={toggleLike} liked={!!liked[post.id]} />)}
                </div>
              </AnimatePresence>
            </div>
            <div className="lg:sticky lg:top-6"><Sidebar /></div>
          </div>
        </section>

        {/* ── TIPS ── */}
        <section className="px-4 md:px-20 pb-12 max-w-[1200px] mx-auto">
          <div className="bg-yellow-50 rounded-3xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900" style={SERIF}>Essential Egypt Travel Tips</h2>
              <Link href="/offerings" className="text-[13px] text-amber-600 border-b border-yellow-200 hover:border-amber-400 transition-colors self-start sm:self-auto">All tips →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {TIPS.map(tip => (
                <Link href="/offerings" key={tip.title}>
                  <motion.div whileHover={{y:-4}} className="bg-white rounded-2xl border border-yellow-100 overflow-hidden cursor-pointer shadow-sm">
                    <img src={tip.img} alt={tip.title} className="w-full h-36 object-cover" />
                    <div className="p-3.5">
                      <h4 className="text-[13px] font-semibold text-gray-900 mb-1">{tip.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{tip.text}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── PHOTO WALL ── */}
        <section className="px-4 md:px-20 pb-12 max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900" style={SERIF}>Community Photo Wall</h2>
            <Link href="/hidden-gems" className="text-[13px] text-gray-400 border-b border-gray-200 hover:text-yellow-600 hover:border-yellow-400 transition-colors self-start sm:self-auto">Explore hidden gems →</Link>
          </div>
          {/* Desktop: 4-col fixed grid */}
          <div className="hidden md:grid gap-2.5" style={{gridTemplateColumns:"repeat(4, 1fr)",gridTemplateRows:"repeat(2, 160px)"}}>
            {PHOTOS.map((photo,i) => (
              <Link key={i} href={photo.href} style={{gridColumn:photo.wide?"span 2":undefined,gridRow:photo.wide?"span 2":undefined}}>
                <motion.div whileHover={{scale:1.02}} className="relative rounded-2xl overflow-hidden h-full cursor-pointer">
                  <img src={photo.img} alt={photo.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className="absolute bottom-0 left-0 right-0 text-white text-[11px] font-semibold px-3 py-2">{photo.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
          {/* Mobile: simple 2-col grid */}
          <div className="grid md:hidden grid-cols-2 gap-2.5 auto-rows-[140px]">
            {PHOTOS.map((photo,i) => (
              <Link key={i} href={photo.href} className={i===0 ? "col-span-2":""}>
                <motion.div whileHover={{scale:1.02}} className="relative rounded-2xl overflow-hidden h-full cursor-pointer">
                  <img src={photo.img} alt={photo.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className="absolute bottom-0 left-0 right-0 text-white text-[11px] font-semibold px-3 py-2">{photo.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Q&A ── */}
        <QASection />

        {/* ── SIGN IN CTA (replaces newsletter) ── */}
        <section className="px-4 md:px-20 pb-16 max-w-[1200px] mx-auto">
          <div className="rounded-3xl text-center px-5 py-10 md:px-6 md:py-14 relative overflow-hidden"
            style={{background:"linear-gradient(135deg,#FFCE2A 0%,#f5c000 50%,#e8a800 100%)"}}>
            {/* Decorative circles */}
            <div className="absolute left-0 top-0 w-64 h-64 rounded-full pointer-events-none" style={{background:"rgba(255,255,255,0.12)",transform:"translate(-80px,-80px)"}} />
            <div className="absolute right-0 bottom-0 w-48 h-48 rounded-full pointer-events-none" style={{background:"rgba(255,255,255,0.10)",transform:"translate(60px,60px)"}} />

            <div className="relative z-10 max-w-xl mx-auto">
              <span className="inline-block mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-900/70 bg-yellow-900/10 px-3 py-1 rounded-full">
                Stay in the loop
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight" style={SERIF}>
                Get the weekly Egypt digest
              </h3>
              <p className="text-yellow-900/70 text-sm mb-8 leading-relaxed">
                New stories, hidden gems, meetups, and community highlights — straight to your inbox.
              </p>
              <Link href="/auth/auth">
                <motion.button
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full px-10 py-3.5 text-sm font-bold text-white border-none cursor-pointer"
                  style={{ background:"#06122e", boxShadow:"0 4px 14px rgba(6,18,46,.35)" }}>
                  Sign In →
                </motion.button>
              </Link>
             
            </div>
          </div>
        </section>

      </main>
    </>
  );
}