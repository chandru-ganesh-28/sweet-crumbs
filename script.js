'use strict';
/* ====== SETTINGS: change these for the real bakery ====== */
const WHATSAPP_NUMBER = '919876543210'; // country code + number, no + or spaces
const BAKERY_NAME = 'Sweet Crumbs Bakery';

const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=75`;
const CATEGORIES = [
  { key: 'Birthday', label: 'Birthday Cakes', img: U('1464349095431-e9a21285b5f3') },
  { key: 'Wedding', label: 'Wedding Cakes', img: U('1535254973040-607b474cb50d') },
  { key: 'Chocolate', label: 'Chocolate Cakes', img: U('1606313564200-e75d5e30476c') },
  { key: 'Cupcakes', label: 'Cupcakes', img: U('1587668178277-295251f900ce') },
  { key: 'Custom', label: 'Custom Cakes', img: U('1558636508-e0db3814bd1d') }
];
const PRODUCTS = [
  { id: 1, name: 'Strawberry Cream Dream', cat: 'Birthday', price: 899, img: U('1464349095431-e9a21285b5f3'), desc: 'Vanilla sponge, whipped cream and fresh strawberries.' },
  { id: 2, name: 'Rainbow Confetti Cake', cat: 'Birthday', price: 949, img: U('1558636508-e0db3814bd1d'), desc: 'Funfetti layers with buttercream and sprinkles.' },
  { id: 3, name: 'Rose Pistachio Tier', cat: 'Wedding', price: 4800, img: U('1535254973040-607b474cb50d'), desc: 'Three tiers, rose cream, pistachio, edible flowers. Serves 40.' },
  { id: 4, name: 'Classic White Pearl', cat: 'Wedding', price: 5500, img: U('1522673607200-164d1b6ce486'), desc: 'Vanilla bean sponge with fondant pearls. Serves 50.' },
  { id: 5, name: 'Belgian Truffle', cat: 'Chocolate', price: 1050, img: U('1578985545062-69928b1d9587'), desc: 'Dark chocolate ganache over moist cocoa sponge.' },
  { id: 6, name: 'Chocolate Drip Cake', cat: 'Chocolate', price: 1199, img: U('1606313564200-e75d5e30476c'), desc: 'Hazelnut crunch, salted caramel and chocolate drip.' },
  { id: 7, name: 'Red Velvet Cupcakes', cat: 'Cupcakes', price: 480, img: U('1587668178277-295251f900ce'), desc: 'Box of 6 with cream cheese frosting.' },
  { id: 8, name: 'Pastel Frosted Cupcakes', cat: 'Cupcakes', price: 420, img: U('1486427944299-d1955d23e34d'), desc: 'Box of 6 assorted vanilla and strawberry cupcakes.' },
  { id: 9, name: 'Floral Buttercream Cake', cat: 'Custom', price: 1599, img: U('1565958011703-44f9829ba187'), desc: 'Hand-piped flowers in your choice of colours.' },
  { id: 10, name: 'Photo or Theme Cake', cat: 'Custom', price: 1799, img: U('1621303837174-89787a7d4729'), desc: 'Cartoon, hobby or photo themes. Share your idea with us.' }
];
const GALLERY = ['1578985545062-69928b1d9587','1535254973040-607b474cb50d','1587668178277-295251f900ce','1556910103-1c02745aae4d','1464349095431-e9a21285b5f3','1509440159596-0249088772ff','1565958011703-44f9829ba187','1517433670267-08bbd4be890f'];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '₹' + n.toLocaleString('en-IN');
const waLink = text => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/* Replace any image that fails to load with a soft placeholder */
document.addEventListener('error', e => {
  const img = e.target;
  if (img.tagName !== 'IMG' || img.dataset.failed) return;
  img.dataset.failed = 1;
  const f = document.createElement('div');
  f.className = 'fallback'; f.textContent = '🎂';
  img.replaceWith(f);
}, true);

/* ---------- Navbar & mobile menu ---------- */
const nav = $('#nav'), menu = $('#menu'), burger = $('#burger');
const setMenu = open => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
$$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') { setMenu(false); closeCart(); closeLightbox(); } });
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) $$('#menu a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
['home', 'cakes', 'about', 'gallery', 'contact'].forEach(id => spy.observe($('#' + id)));

/* ---------- Categories + filters ---------- */
let activeCat = 'All';
$('#cats').innerHTML = CATEGORIES.map(c => {
  const n = PRODUCTS.filter(p => p.cat === c.key).length;
  return `<button class="cat" data-cat="${c.key}"><div class="ph"><img src="${c.img}" alt="${c.label}" loading="lazy"></div><h3>${c.label}</h3><small>${n} designs</small></button>`;
}).join('');
$('#filters').innerHTML = ['All', ...CATEGORIES.map(c => c.key)].map(k =>
  `<button class="chip" data-cat="${k}">${k === 'All' ? 'All cakes' : CATEGORIES.find(c => c.key === k).label}</button>`).join('');

function renderProducts() {
  $$('.chip').forEach(c => c.classList.toggle('on', c.dataset.cat === activeCat));
  const list = PRODUCTS.filter(p => activeCat === 'All' || p.cat === activeCat);
  $('#products').innerHTML = list.map((p, i) => `
    <article class="card" style="animation-delay:${i * 60}ms">
      <div class="ph"><img src="${p.img}" alt="${p.name}" loading="lazy"><span class="tag">${p.cat}</span></div>
      <div class="body"><h3>${p.name}</h3><p>${p.desc}</p>
      <div class="buy"><span class="price">${money(p.price)}</span><button class="add" data-id="${p.id}">Order Now</button></div></div>
    </article>`).join('');
}
$('#filters').addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { activeCat = b.dataset.cat; renderProducts(); } });
$('#cats').addEventListener('click', e => {
  const b = e.target.closest('.cat'); if (!b) return;
  activeCat = b.dataset.cat; renderProducts();
  $('#cakes').scrollIntoView({ behavior: 'smooth' });
});
$('#products').addEventListener('click', e => { const b = e.target.closest('.add'); if (b) addToCart(+b.dataset.id); });
renderProducts();

/* ---------- Cart ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('sc-cart')) || []; } catch (_) {}
const drawer = $('#drawer'), overlay = $('#overlay');
const openCart = () => { drawer.classList.add('open'); overlay.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); };
function closeCart() { drawer.classList.remove('open'); overlay.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
$('#cartOpen').addEventListener('click', openCart);
$('#cartClose').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); }
function addToCart(id) {
  const line = cart.find(i => i.id === id);
  line ? line.qty++ : cart.push({ id, qty: 1 });
  renderCart();
  const b = $('#cartOpen'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  toast(PRODUCTS.find(p => p.id === id).name + ' added to cart');
}
function renderCart() {
  localStorage.setItem('sc-cart', JSON.stringify(cart));
  const items = cart.map(l => ({ ...PRODUCTS.find(p => p.id === l.id), qty: l.qty }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  $('#cartCount').textContent = items.reduce((s, i) => s + i.qty, 0);
  $('#cartTotal').textContent = money(total);
  $('#checkout').disabled = !items.length;
  $('#cartItems').innerHTML = items.length ? items.map(i => `
    <div class="item"><img src="${i.img}" alt="">
      <div><h4>${i.name}</h4><small>${money(i.price)} each</small>
        <div class="qty"><button data-act="dec" data-id="${i.id}" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-act="inc" data-id="${i.id}" aria-label="Increase quantity">+</button></div></div>
      <div style="text-align:right"><b>${money(i.price * i.qty)}</b><br><button class="rm" data-act="rm" data-id="${i.id}">Remove</button></div>
    </div>`).join('') : '<p class="empty">Your cart is empty.<br>Add a cake to get started.</p>';
}
$('#cartItems').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const id = +b.dataset.id, line = cart.find(i => i.id === id);
  if (b.dataset.act === 'inc') line.qty++;
  if (b.dataset.act === 'dec') line.qty--;
  if (b.dataset.act === 'rm' || line.qty < 1) cart = cart.filter(i => i.id !== id);
  renderCart();
});
$('#checkout').addEventListener('click', () => {
  if (!cart.length) return;
  const lines = cart.map(l => { const p = PRODUCTS.find(x => x.id === l.id); return `• ${p.name} x ${l.qty} = ${money(p.price * l.qty)}`; });
  const total = cart.reduce((s, l) => s + PRODUCTS.find(x => x.id === l.id).price * l.qty, 0);
  window.open(waLink(`Hi ${BAKERY_NAME}! I'd like to order:\n${lines.join('\n')}\nTotal: ${money(total)}\n\nPlease confirm availability and delivery.`), '_blank');
});
renderCart();

/* ---------- Gallery + lightbox ---------- */
$('#galleryGrid').innerHTML = GALLERY.map((id, i) =>
  `<figure><img src="https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${i % 3 === 0 ? 700 : 600}&q=75" alt="Sweet Crumbs gallery photo ${i + 1}" loading="lazy"></figure>`).join('');
const lb = $('#lightbox');
function closeLightbox() { lb.classList.remove('open'); }
$('#galleryGrid').addEventListener('click', e => { const im = e.target.closest('img'); if (im) { $('img', lb).src = im.src.replace(/w=\d+/, 'w=1400'); lb.classList.add('open'); } });
lb.addEventListener('click', closeLightbox);

/* ---------- Custom order form ---------- */
const form = $('#orderForm'), dateEl = $('#date');
const d = new Date(); d.setDate(d.getDate() + 1);
dateEl.min = d.toISOString().split('T')[0];
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name (at least 2 letters).',
  phone: v => /^(\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')) || 'Enter a valid 10-digit Indian mobile number.',
  type: v => !!v || 'Choose a cake type.',
  flavour: v => !!v || 'Choose a flavour.',
  date: v => (!!v && v >= dateEl.min) || 'Pick a delivery date from tomorrow onwards.'
};
function check(id) {
  const el = $('#' + id), res = rules[id](el.value), wrap = el.closest('label');
  wrap.classList.toggle('invalid', res !== true);
  $('.err', wrap).textContent = res === true ? '' : res;
  return res === true;
}
Object.keys(rules).forEach(id => $('#' + id).addEventListener('blur', () => check(id)));
Object.keys(rules).forEach(id => $('#' + id).addEventListener('input', () => $('#' + id).closest('label').classList.contains('invalid') && check(id)));
form.addEventListener('submit', e => {
  e.preventDefault();
  const ok = Object.keys(rules).map(check).every(Boolean);
  const msg = $('#formOk');
  if (!ok) { msg.classList.remove('show'); $('.invalid input, .invalid select', form).focus(); return; }
  const v = id => $('#' + id).value.trim();
  const text = `Hi ${BAKERY_NAME}! I'd like to place a custom order.\n\nName: ${v('name')}\nPhone: ${v('phone')}\nCake type: ${v('type')}\nFlavour: ${v('flavour')}\nDelivery date: ${v('date')}\n` + (v('notes') ? `Notes: ${v('notes')}` : '');
  msg.textContent = `Thank you, ${v('name')}! Opening WhatsApp to send your order.`;
  msg.classList.add('show');
  window.open(waLink(text), '_blank');
  form.reset();
});

/* ---------- WhatsApp buttons ---------- */
const general = `Hi ${BAKERY_NAME}! I'd like to know more about your cakes.`;
$('#waDirect').href = waLink(general);
$('#waFloat').href = waLink(general);

/* ---------- Scroll reveal ---------- */
$$('.head, .about-text, .cat, blockquote, form, .order-copy, .gallery figure').forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

$('#year').textContent = new Date().getFullYear();
