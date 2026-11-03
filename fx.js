/* Trolley Market — effects layer. Safe: if anything fails, the site works as before. */
(function(){
'use strict';
var root=document.documentElement,PAGES={'page-home':'HOME','page-categories':'CATEGORIES','page-catalog':'OFFERS','page-about':'ABOUT'};
var SEL='.product-card,.section-header,.static-banner,.split-banners,.swipe-slider-container,.catalog-page,.category-filter-bar';
function yes(k){try{return TM.S[k]!=='لا'}catch(e){return true}}
function S_(k,d){try{return TM.S[k]||d}catch(e){return d}}
root.classList.add('fx');

/* 1) scroll reveal */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -6% 0px'});
function arm(scope){(scope||document).querySelectorAll(SEL).forEach(function(el){
  if(el.__fx)return;el.__fx=1;
  var i=Array.prototype.indexOf.call(el.parentNode.children,el);
  el.style.setProperty('--d',(i%6)*0.06+'s');el.classList.add('fx-reveal');io.observe(el)})}

/* 2) mp4/webm in Excel image cells -> muted looping video */
function vids(scope){(scope||document).querySelectorAll('img[src$=".mp4"],img[src$=".webm"]').forEach(function(im){
  var v=document.createElement('video');v.src=im.getAttribute('src');v.preload='metadata';v.muted=true;v.loop=true;v.autoplay=true;v.playsInline=true;v.setAttribute('playsinline','');
  v.className=(im.className+' fx-vid').trim();v.style.cssText=im.style.cssText;im.replaceWith(v);v.play&&v.play().catch(function(){})})}

/* 3) hero — supermarket style */
var COL=['#DE5718','#DE5718','#DE5718','#DE5718','#DE5718','#9C3B12'];
var ICON=[['فواك','apple-whole'],['خضر','carrot'],['ألبان','cheese'],['لحوم','drumstick-bite'],['منظف','spray-can-sparkles'],['مكسر','cookie-bite'],['تسالي','cookie-bite'],['سناكس','cookie'],['بقال','cart-shopping'],['مشروب','bottle-water']];
function icon(n){for(var i=0;i<ICON.length;i++)if(n.indexOf(ICON[i][0])>-1)return ICON[i][1];return 'tag'}
function hero(){
  var home=document.getElementById('page-home');if(!home||home.querySelector('.fx-hero')||!yes('إظهار الهيرو'))return;
  if(!window.TM||!TM.cats.length)return;
  var h=document.createElement('section');h.className='fx-hero fx-hero-img';
  var dsk=S_('صورة الهيرو','images/hero.svg'),mob=S_('صورة الهيرو (موبايل)','images/hero-mobile.svg'),lnk=S_('رابط الهيرو','#categories')||'#categories';
  h.innerHTML='<a class="fx-hero-link" href="'+lnk.replace(/"/g,'')+'"><picture><source media="(max-width:700px)"><img alt="ترولي ماركت" decoding="async" fetchpriority="high"></picture></a>';
  var pic=h.querySelector('picture'),im=pic.querySelector('img'),so=pic.querySelector('source');
  if(mob)so.setAttribute('srcset',mob);else so.remove();
  if(dsk)im.src=dsk;else if(mob)im.src=mob;else h.style.display='none';
  im.onerror=function(){if(!im.dataset.fb){im.dataset.fb=1;so&&so.remove();im.src='images/hero.svg'}else h.classList.add('fx-noart')};
  window.__fxCats=null;
  home.insertBefore(h,home.firstChild);
  if(false&&yes('إظهار الشريط المتحرك')){var t=document.createElement('div');t.className='fx-ticker';
    var o=TM.offers.slice(0,12).map(function(p){try{return String(p['الاسم']||'').trim()+' '+TM.fmt(TM.priceInfo(p).price)+' '+TM.cur()}catch(e){return ''}}).filter(Boolean);
    var words=(o.length?'عروض اليوم:  '+o.join('  •  '):S_('نص الشريط المتحرك',''))+'   •   ';
    t.innerHTML='<span></span>';t.firstChild.textContent=words+words+words;home.insertBefore(t,h.nextSibling)}
  if(window.__fxCats)h.after(window.__fxCats);
  arm(home);
}

/* 3b) عروض اليوم = البرتقالي الثابت | وإعدادات الألوان من data.xlsx */
function offers(){var h=document.getElementById('today-offers');if(!h||h.dataset.of)return;h.dataset.of=1;h.classList.add('fx-offers-head');var g=h.nextElementSibling;if(g)g.classList.add('fx-offers-grid')}
function themeSet(){if(!window.TM||!TM.S)return;var ok=function(c){return /^#[0-9a-f]{3,8}$/i.test(String(c||'').trim())};
  var o=S_('لون عروض اليوم',''),c=S_('لون زر السلة',''),t1=S_('لون نقاط الثقة (فوق الزر الأول)',''),t2=S_('لون نقاط الثقة (فوق الزر الثاني)','');if(ok(t1))root.style.setProperty('--tc1',String(t1).trim());if(ok(t2))root.style.setProperty('--tc2',String(t2).trim());
  if(ok(o))root.style.setProperty('--offer',String(o).trim());if(ok(c))root.style.setProperty('--cartbtn',String(c).trim());
  var hs=S_('قوة الهالات','متوسطة');root.style.setProperty('--ha',hs==='خفيفة'?'16%':hs==='قوية'?'42%':'26%');document.body.classList.toggle('fx-nohalo',S_('هالات الألوان','نعم')==='لا');document.body.classList.toggle('fx-mono',S_('تلوين الأقسام بألوانها','نعم')==='لا');document.body.classList.toggle('fx-nav-flat',S_('شكل شريط التنقل السفلي','ملتصق')==='ملتصق')}


/* 3d) طريقة الدفع في السلة */
function payInit(){var sel=document.getElementById('cust-pay'),box=document.getElementById('pay-box');if(!sel||sel.dataset.ok||!window.TM||!TM.S)return;sel.dataset.ok=1;
  if(S_('إظهار طريقة الدفع','نعم')==='لا'){box.style.display='none';sel.innerHTML='';return}
  var list=String(S_('طرق الدفع','الدفع عند الاستلام')).split(/[,،]/).map(function(x){return x.trim()}).filter(Boolean);
  sel.innerHTML='';list.forEach(function(x){var o=document.createElement('option');o.textContent=x;sel.appendChild(o)});
  var note=document.getElementById('pay-note'),txt=S_('ملاحظة الدفع الإلكتروني','');
  function sync(){var cod=/عند الاستلام|كاش عند|نقد/.test(sel.value);note.textContent=(!cod&&txt)?txt:'';note.style.display=note.textContent?'block':'none'}
  sel.addEventListener('change',sync);sync()}

/* 3e) الفوتر الثابت (في كل الصفحات) */
function footer(){if(document.getElementById('fx-footer')||!window.TM||!TM.S||!TM.cats.length)return;if(S_('إظهار الفوتر','نعم')==='لا')return;
  var nm=S_('اسم المتجر','ترولي ماركت'),ph=S_('رقم التليفون المعروض',''),wa=String(S_('رقم الواتساب','')).replace(/\D/g,''),hrs=S_('ساعات العمل',''),ad=S_('العنوان','');
  var soc=[['رابط فيسبوك','fab fa-facebook-f'],['رابط إنستجرام','fab fa-instagram'],['رابط تيك توك','fab fa-tiktok'],['رابط يوتيوب','fab fa-youtube'],['رابط تيليجرام','fab fa-telegram'],['رابط تويتر','fab fa-twitter'],['رابط الخريطة','fas fa-location-dot']].filter(function(x){return /^https?:\/\//i.test(String(S_(x[0],'')).trim())});
  var f=document.createElement('footer');f.id='fx-footer';f.className='fx-footer';
  f.innerHTML='<div class="ft-in"><div class="ft-brand"><h3></h3><p></p><div class="ft-soc"></div></div><div class="ft-col"><h4>روابط سريعة</h4><nav></nav></div><div class="ft-col ft-contact"><h4>تواصل</h4><div></div></div></div><div class="ft-copy"></div>';
  f.querySelector('.ft-brand h3').textContent=nm;f.querySelector('.ft-brand p').textContent=S_('وصف الفوتر','');
  var sc=f.querySelector('.ft-soc');soc.forEach(function(x){var a=document.createElement('a');a.href=S_(x[0],'')||'#';a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',x[0]);a.innerHTML='<i class="'+x[1]+'"></i>';sc.appendChild(a)});
  var nav=f.querySelector('nav');[['#home','اسم صفحة الرئيسية','الرئيسية'],['#categories','اسم صفحة الأقسام','الأقسام'],['#catalog','عروض اليوم','عروض اليوم'],['#catalog','اسم صفحة المجلة','المجلة'],['#about','اسم صفحة حول','حول']].forEach(function(l,i){
    if(i===2){var a2=document.createElement('a');a2.href='#home';a2.textContent=S_('عنوان قسم العروض','عروض اليوم');a2.dataset.off=1;nav.appendChild(a2);return}
    var a=document.createElement('a');a.href=l[0];a.textContent=S_(l[1],l[2]);nav.appendChild(a)});
  var c=f.querySelector('.ft-contact div');
  function line(txt,href,ic,ltr){var el=document.createElement(href?'a':'span');if(href)el.href=href;el.innerHTML='<i class="'+ic+'"></i> ';var t=document.createElement('bdi');t.dir=ltr?'ltr':'auto';t.textContent=txt;el.appendChild(t);c.appendChild(el)}
  if(ph)line(ph,'tel:'+ph.replace(/[^\d+]/g,''),'fas fa-phone',1);if(wa)line('واتساب','https://wa.me/'+wa,'fab fa-whatsapp');if(hrs)line(hrs,'','fas fa-clock');if(ad)line(ad,'','fas fa-location-dot');
  f.querySelector('.ft-copy').textContent='© '+new Date().getFullYear()+' '+nm+' — '+S_('حقوق الفوتر','جميع الحقوق محفوظة');
  var old=document.getElementById('site-footer');(old&&old.parentNode?old.parentNode:document.body).insertBefore(f,old?old.nextSibling:null);
  f.querySelectorAll('.ft-col nav a').forEach(function(a){a.addEventListener('click',function(){setTimeout(function(){window.scrollTo(0,0)},60)})});
  var offA=f.querySelector('a[data-off]');if(offA)offA.addEventListener('click',function(){setTimeout(function(){var t=document.getElementById('today-offers');if(t)t.scrollIntoView({behavior:'smooth'})},120)})}

/* 3f) اقتراحات البحث = الأقسام (مع زر إخفاء) */
function searchChips(){var m=document.getElementById('search-modal');if(!m||m.querySelector('.fx-chips')||!window.TM||!TM.cats.length)return;if(S_('إظهار اقتراحات البحث','نعم')==='لا')return;
  var box=document.createElement('div');box.className='fx-chips';box.innerHTML='<div class="fx-chips-h"><span>اقتراحات</span><button type="button" class="fx-chips-x">إخفاء الأقسام ✕</button></div><div class="fx-chips-l"></div>';
  var l=box.querySelector('.fx-chips-l');TM.cats.forEach(function(c){var a=document.createElement('a');a.href='#categories/'+encodeURIComponent(c);a.textContent=c;a.style.setProperty('--fc',catColor(c));a.addEventListener('click',function(){var x=document.querySelector('.close-search');if(x)setTimeout(function(){x.click()},30)});l.appendChild(a)});
  var x=box.querySelector('.fx-chips-x');x.onclick=function(){var h=l.classList.toggle('off');x.textContent=h?'إظهار الأقسام':'إخفاء الأقسام ✕'};
  var hd=m.querySelector('.search-header');hd.parentNode.insertBefore(box,hd.nextSibling)}

/* 3g) ألوان الهوية من الإعدادات */
function palette(){if(!window.TM||!TM.S)return;var ok=function(c){return /^#[0-9a-f]{3,8}$/i.test(String(c||'').trim())};
  [['درجة الأخضر الداكن','--p-dark'],['درجة الأخضر','--p-green'],['درجة الأخضر الفاتح','--p-lgreen'],['درجة الأخضر الأفتح','--p-llgreen'],['درجة البرتقالي','--p-orange'],['درجة الأصفر','--p-yellow'],['درجة الأحمر','--p-red'],['درجة الكريمي الفاتح','--p-cream1'],['درجة الكريمي','--p-cream2']].forEach(function(p){var v=S_(p[0],'');if(ok(v))root.style.setProperty(p[1],String(v).trim())})}

/* 3h) صورة بديلة لو ملف الصورة مش موجود: رمز المنتج على دايرة بلون القسم */
var EMO={"موز":["🍌","#DE5718"],"تفاح أحمر":["🍎","#DE5718"],"برتقال":["🍊","#DE5718"],"فراولة":["🍓","#DE5718"],"عنب أخضر":["🍇","#DE5718"],"ليمون":["🍋","#DE5718"],"بطيخ":["🍉","#DE5718"],"طماطم":["🍅","#DE5718"],"خيار":["🥒","#DE5718"],"بطاطس":["🥔","#DE5718"],"بصل أحمر":["🧅","#DE5718"],"جزر":["🥕","#DE5718"],"أرز مصري":["🍚","#DE5718"],"مكرونة":["🍝","#DE5718"],"سكر":["🥄","#DE5718"],"زيت عباد الشمس":["🌻","#DE5718"],"دقيق أبيض":["🌾","#DE5718"],"عدس أصفر":["🥣","#DE5718"],"فول مدمس":["🥣","#DE5718"],"تونة":["🐟","#DE5718"],"شاي":["🍵","#DE5718"],"قهوة":["☕","#DE5718"],"صلصة طماطم":["🥫","#DE5718"],"مربى فراولة":["🍯","#DE5718"],"لبن كامل الدسم":["🥛","#DE5718"],"لبن خالي الدسم":["🥛","#DE5718"],"زبادي طبيعي":["🥣","#DE5718"],"جبنة رومي":["🧀","#DE5718"],"جبنة بيضاء":["🧀","#DE5718"],"جبنة مثلثات":["🧀","#DE5718"],"قشطة":["🍶","#DE5718"],"زبدة":["🧈","#DE5718"],"بيض بلدي":["🥚","#DE5718"],"كريمة طبخ":["🍶","#DE5718"],"لبنة":["🥣","#DE5718"],"موزاريلا":["🧀","#DE5718"],"عيش بلدي":["🥙","#DE5718"],"عيش فينو":["🥖","#DE5718"],"توست":["🍞","#DE5718"],"كرواسون":["🥐","#DE5718"],"باجيت":["🥖","#DE5718"],"بقسماط":["🥨","#DE5718"],"عيش شامي":["🥙","#DE5718"],"رولز صغير":["🥯","#DE5718"],"لب سوبر":["🌻","#DE5718"],"لب أسمر":["🌻","#DE5718"],"فول سوداني":["🥜","#DE5718"],"لوز":["🌰","#DE5718"],"كاجو":["🥜","#DE5718"],"فستق":["🥜","#DE5718"],"بندق":["🌰","#DE5718"],"عين جمل":["🌰","#DE5718"],"زبيب":["🍇","#DE5718"],"تمر":["🌴","#DE5718"],"حمص الشام":["🥣","#DE5718"],"مكس مكسرات":["🥜","#DE5718"],"شيبسي ملح":["🍟","#DE5718"],"بطاطس بالجبنة":["🍟","#DE5718"],"بوشار":["🍿","#DE5718"],"لبان":["🍬","#DE5718"],"نودلز":["🍜","#DE5718"],"ذرة مشوية":["🌽","#DE5718"],"بسكويت بالتمر":["🍪","#DE5718"],"مياه معدنية":["💧","#DE5718"],"عصير برتقال":["🍊","#DE5718"],"عصير مانجو":["🥭","#DE5718"],"كولا":["🥤","#DE5718"],"ليمون غازي":["🍋","#DE5718"],"مشروب طاقة":["⚡","#DE5718"],"شاي مثلج":["🧋","#DE5718"],"لبن بالشوكولاتة":["🍫","#DE5718"],"مياه غازية كبيرة":["🥤","#DE5718"],"قهوة باردة":["☕","#DE5718"],"كركديه":["🌺","#DE5718"],"سوبيا":["🍶","#DE5718"],"كمون":["🌿","#DE5718"],"كزبرة ناشفة":["🌿","#DE5718"],"فلفل أسود":["🌶️","#DE5718"],"ملح طعام":["🧂","#DE5718"],"شطة":["🌶️","#DE5718"],"كركم":["🌿","#DE5718"],"قرفة":["🍂","#DE5718"],"بهارات مشكلة":["🥫","#DE5718"],"ورق لورا":["🍃","#DE5718"],"هيل":["🌱","#DE5718"],"زنجبيل بودر":["🌿","#DE5718"],"ثوم بودر":["🧄","#DE5718"],"شوكولاتة بالحليب":["🍫","#DE5718"],"ويفر":["🧇","#DE5718"],"أصابع شوكولاتة":["🍫","#DE5718"],"جيلي":["🍬","#DE5718"],"كاندي ملون":["🍭","#DE5718"],"كيكة فانيلا":["🍰","#DE5718"],"دونات":["🍩","#DE5718"],"كوكيز شوكولاتة":["🍪","#DE5718"],"مافن":["🧁","#DE5718"],"مانجو عويس":["🥭","#DE5718"],"جوافة":["🍐","#DE5718"],"رمان":["🍎","#DE5718"],"كمثرى":["🍐","#DE5718"],"كوسة":["🥒","#DE5718"],"باذنجان":["🍆","#DE5718"],"فلفل رومي":["🫑","#DE5718"],"خس":["🥬","#DE5718"],"مكرونة ريجينا 400 جم":["🍝","#DE5718"],"أرز العلمين 1 كجم":["🍚","#DE5718"],"زيت كريستال عباد الشمس":["🌻","#DE5718"],"زيت عافية ذرة":["🌽","#DE5718"],"شاي العروسة 40 جم":["🍵","#DE5718"],"شاي ليبتون 40 جم":["🍵","#DE5718"],"نسكافيه كلاسيك 50 جم":["☕","#DE5718"],"فول معبأ":["🥣","#DE5718"],"دقيق معبأ":["🌾","#DE5718"],"لبن جهينة كامل الدسم":["🥛","#DE5718"],"لبن جهينة خالي الدسم":["🥛","#DE5718"],"زبادي جهينة":["🥣","#DE5718"],"جبنة دومتي فيتا":["🧀","#DE5718"],"جبنة كيري مثلثات":["🧀","#DE5718"],"بيض أبيض":["🥚","#DE5718"],"زبدة لورباك":["🧈","#DE5718"],"توست بيمبو أبيض":["🍞","#DE5718"],"كرواسون بالجبنة":["🥐","#DE5718"],"بيتي فور":["🍪","#DE5718"],"بيجل بالسمسم":["🥯","#DE5718"],"جوز هند مبشور":["🥥","#DE5718"],"سمسم أبيض":["🌰","#DE5718"],"عباد شمس مقشر":["🌻","#DE5718"],"شيبسي بطاطس كبير":["🍟","#DE5718"],"دوريتوس جبنة":["🧀","#DE5718"],"شيتوس":["🍟","#DE5718"],"بسكويت أولكر":["🍪","#DE5718"],"بيبسي":["🥤","#DE5718"],"كوكاكولا":["🥤","#DE5718"],"سفن أب":["🥤","#DE5718"],"مياه نستله بيور لايف":["💧","#DE5718"],"عصير جهينة بيور مانجو":["🥭","#DE5718"],"ريد بول":["⚡","#DE5718"],"عصير فريش برتقال":["🍊","#DE5718"],"كاري":["🌿","#DE5718"],"خلطة شاورما":["🌶️","#DE5718"],"نعناع مجفف":["🍃","#DE5718"],"شوكولاتة جلاكسي":["🍫","#DE5718"],"كيت كات":["🍫","#DE5718"],"بسكويت أوريو":["🍪","#DE5718"],"مولتو":["🥐","#DE5718"],"نوتيلا":["🍫","#DE5718"],"حلاوة طحينية":["🍯","#DE5718"]};
var CATEMO={'الفاكهة':['🍎','#DE5718'],'الخضار':['🥬','#DE5718'],'البقالة':['🛒','#DE5718'],'الألبان':['🥛','#DE5718'],'المخبوزات':['🍞','#DE5718'],'اللب والمكسرات':['🥜','#DE5718'],'التسالي':['🍟','#DE5718'],'المشروبات':['🥤','#DE5718'],'التوابل والبهارات':['🌶️','#DE5718'],'حلويات':['🍫','#DE5718']};
window.tmFallbackSrc=function(name,cat){var e=EMO[(name||'').trim()]||CATEMO[cat]||['🛒','#DE5718'];var c='DE5718';function mix(a){var r=[0,2,4].map(function(i){var v=parseInt(c.substr(i,2),16);return Math.round(255-(255-v)*a)});return 'rgb('+r.join(',')+')'}
  var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="'+mix(.1)+'"/><circle cx="200" cy="200" r="150" fill="'+mix(.22)+'"/><circle cx="200" cy="200" r="118" fill="#fff"/><text x="200" y="248" font-size="136" text-anchor="middle" font-family="Segoe UI Emoji,Apple Color Emoji,Noto Color Emoji,sans-serif">'+e[0]+'</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)};
window.tmFallback=function(img){return window.tmFallbackSrc(img.alt,'')};

/* 4) progress bar */
var bar=document.createElement('div');bar.id='fx-bar';document.body.appendChild(bar);
function tick(){var m=document.documentElement.scrollHeight-innerHeight;bar.style.width=(m>0?scrollY/m*100:0)+'%'}
addEventListener('scroll',function(){requestAnimationFrame(tick)},{passive:true});


function shareCatalog(){var u=location.origin+location.pathname+'#catalog',n=S_('اسم المتجر','ترولي ماركت'),tx='شوف مجلة عروض '+n+':\n'+u;
  if(navigator.share)navigator.share({title:'مجلة عروض '+n,text:tx,url:u}).catch(function(){});else window.open('https://wa.me/?text='+encodeURIComponent(tx),'_blank')}
/* 4c) cart: drawer -> full page, floating button */
function cartExtras(){
  var sb=document.getElementById('cart-sidebar');if(!sb||document.getElementById('fx-full'))return;
  var cb=document.getElementById('checkout-btn');
  if(cb)cb.insertAdjacentHTML('beforebegin','<button id="fx-full" type="button" class="fx-fullbtn"><i class="fas fa-clipboard-check"></i> إتمام الطلب</button>');
  document.getElementById('fx-full').onclick=function(){sb.classList.add('fx-full')};
  var mq=window.matchMedia('(max-width:768px)'),ttl=sb.querySelector('.cart-header h3');
  function sync(){var full=sb.classList.contains('fx-full'),open=sb.classList.contains('open');if(ttl)ttl.textContent=sb.classList.contains('fx-full')?'فاتورة الطلب':'سلة المشتريات'}
  new MutationObserver(sync).observe(sb,{attributes:true,attributeFilter:['class']});
  new MutationObserver(function(){if(sb.classList.contains('fx-full')&&!sb.classList.contains('open'))sb.classList.remove('fx-full')}).observe(sb,{attributes:true,attributeFilter:['class']});

}

/* 4d) category colours / icons + page heads */
function catColor(n){var m=(window.TM&&TM.catMeta||{})[n]||{};if(/^#[0-9a-f]{3,8}$/i.test(m.color||''))return m.color;var i=TM.cats.indexOf(n);return COL[(i<0?0:i)%COL.length]}
function catIco(n){var m=(TM.catMeta||{})[n]||{};if(false&&m.img&&/^(data:image\/|https?:|[\w.\-\/%]+$)/i.test(m.img)){var im=document.createElement('img');im.src=m.img;im.alt='';im.className='fx-cico';return im}
  var i=document.createElement('i');i.className='fas fa-'+(m.icon||icon(n))+' fx-cico-i';return i}
function paint(){if(!window.TM||!TM.cats.length)return;
  document.body.classList.toggle('fx-hide-olddesc',S_('إظهار وصف صفحة حول القديم','لا')!=='نعم');
  document.querySelectorAll('.section-header[data-cat]:not([data-pt])').forEach(function(h){h.dataset.pt=1;var n=h.dataset.cat,col=catColor(n);
    var sec=h.closest('.products-section')||h.parentNode;sec.style.setProperty('--acc',col);h.style.setProperty('--hc',col);h.insertBefore(catIco(n),h.firstChild)});
  document.querySelectorAll('.cat-filter-btn:not([data-pt])').forEach(function(b){b.dataset.pt=1;var n=b.dataset.cat||b.textContent.trim();if(TM.cats.indexOf(n)>-1)b.style.setProperty('--fc',catColor(n))})}
function lum(h){h=String(h||'').replace('#','');if(h.length===3)h=h.replace(/(.)/g,'$1$1');var r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16);if(isNaN(r+g+b))return 0;return(0.299*r+0.587*g+0.114*b)/255}
function ink(c){return lum(c)>0.62?'#DE5718':'#fff'}
function tiles(n,all){var tl=document.createElement('div');tl.className='fx-tiles';
  if(all){var a0=document.createElement('a');a0.className='fx-tile';a0.href='#categories';a0.dataset.cat='';a0.style.setProperty('--tc','#3B3F45');a0.innerHTML='<i class="fas fa-border-all fx-cico-i"></i><span>الكل</span>';tl.appendChild(a0)}
  TM.cats.slice(0,n).forEach(function(c){var a=document.createElement('a');a.className='fx-tile';a.href='#categories/'+encodeURIComponent(c);a.dataset.cat=c;a.style.setProperty('--tc',catColor(c));a.style.setProperty('--ti',ink(catColor(c)));
    a.appendChild(catIco(c));var s=document.createElement('span');s.textContent=(TM.catLabel?TM.catLabel(c):c);a.appendChild(s);if((window.TM_DISABLED||[]).indexOf(c)>-1){a.classList.add('off');var o=document.createElement('em');o.textContent='غير متوفر حاليًا';a.appendChild(o)}tl.appendChild(a)});return tl}
var allFlag=false;
function syncTiles(){var h='';try{h='#'+decodeURIComponent((window.TM&&TM.route)||'')}catch(e){}var cat=h.indexOf('#categories/')===0?h.slice(12):'';
  document.querySelectorAll('.fx-pagehead .fx-tile:not([data-view])').forEach(function(t){var d=t.dataset.cat||'';t.classList.toggle('on',cat?d===cat:d==='')});
  var pc=document.getElementById('page-categories');if(pc)pc.style.setProperty('--pc',cat?catColor(cat):'#DE5718');
  var hint=document.getElementById('fx-cat-hint');if(hint)hint.textContent=cat?'اضغط على القسم تاني عشان ترجع لكل الأقسام':'اختار القسم اللي عايزه وابدأ التسوق';
  var sl=document.querySelector('.sort-bar label');if(sl&&!sl.dataset.fx){sl.dataset.fx=1;sl.innerHTML='<i class="fas fa-arrow-down-wide-short"></i> رتّب حسب'}}
addEventListener('popstate',function(){setTimeout(syncTiles,30)});
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.fx-tile');if(t&&!t.dataset.view&&t.closest('.fx-pagehead')&&t.classList.contains('on')&&t.dataset.cat){e.preventDefault();TM.navigate('categories');return}
  if(t&&!t.dataset.view){allFlag=(t.dataset.cat===''&&!!t.closest('.fx-pagehead'));setTimeout(syncTiles,60)}});
function heads(){if(!window.TM||!TM.cats.length)return;
  [['page-categories','اسم صفحة الأقسام','الأقسام','اختار القسم اللي عايزه وابدأ التسوق',1],['page-catalog','','','',0]].forEach(function(d){
    var p=document.getElementById(d[0]);if(!p||p.querySelector('.fx-pagehead'))return;
    var h=document.createElement('section');h.className='fx-pagehead'+(d[4]?'':' fx-offhead');
    if(d[4]){h.innerHTML='<div><h2></h2><p></p></div>';h.querySelector('h2').textContent=S_(d[1],d[2]);h.querySelector('p').textContent=d[3];h.querySelector('p').id='fx-cat-hint'}
    else h.appendChild(offerTiles());
    if(d[4])h.appendChild(tiles(99,false));p.insertBefore(h,p.firstChild)})}

function offerTiles(){var w=document.createElement('div');w.className='fx-tiles fx-otiles';
  [['mag','العروض','fa-tags'],['bundles','باقات العروض','fa-gift']].forEach(function(x,i){var a=document.createElement('a');a.className='fx-tile'+(i?'':' on');a.setAttribute('role','button');a.tabIndex=0;a.dataset.view=x[0];a.innerHTML='<i class="fas '+x[2]+' fx-cico-i"></i><span>'+x[1]+'</span>';w.appendChild(a)});return w}
function setView(v){var p=document.getElementById('page-catalog');if(!p)return;p.dataset.view=v;p.querySelectorAll('.fx-tile[data-view]').forEach(function(x){x.classList.toggle('on',x.dataset.view===v)})}
function viewFix(){var p=document.getElementById('page-catalog');if(!p)return;var m=!!p.querySelector('.mag2'),b=!!p.querySelector('.bundles'),v=p.dataset.view;
  p.querySelectorAll('.fx-tile[data-view]').forEach(function(x){x.style.display=(x.dataset.view==='mag'?m:b)?'':'none'});
  var row=p.querySelector('.fx-otiles');if(row)row.style.display=(m&&b)?'':'none';
  if(!v||(v==='mag'&&!m&&b)||(v==='bundles'&&!b))setView(m||!b?'mag':'bundles')}
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.fx-tile[data-view]');if(t)setView(t.dataset.view)});
document.addEventListener('keydown',function(e){if(e.key!=='Enter')return;var t=e.target.closest&&e.target.closest('.fx-tile[data-view]');if(t)setView(t.dataset.view)});

/* 4b) about page */
function about(){
  var p=document.getElementById('page-about');if(!p||p.querySelector('.ab-wrap')||!window.TM||!TM.products.length)return;
  var n=TM.products.length,c=TM.cats.length,fr=parseFloat(S_('حد التوصيل المجاني',0))||0,cur=S_('رمز العملة','ج');
  var feats=[1,2,3,4].map(function(i){return (S_('ميزة '+i,'')||'').split('|')}).filter(function(f){return f[0]});
  var abs=[['من نحن','قصتنا'],['هدفنا','هدفنا'],['رؤيتنا','رؤيتنا']].map(function(k){return [S_(k[1]+' (عنوان)',k[0]),S_(k[1]+' (نص)','')]}).filter(function(a){return a[1]});
  var w=document.createElement('div');w.className='ab-wrap';
  var h='<div class="ab-stats"><div><b>'+n+'+</b><span>منتج</span></div><div><b>'+c+'</b><span>قسم</span></div><div><b>'+String(S_('إحصائية 3 (رقم)','24/7')).replace(/[<>&]/g,'')+'</b><span>'+String(S_('إحصائية 3 (نص)','اطلب في أي وقت')).replace(/[<>&]/g,'')+'</span></div></div>';
  h+=(abs.length?'<div class="ab-about">'+abs.map(function(){return '<div class="ab-card"><h3></h3><p></p></div>'}).join('')+'</div>':'')+'<div class="ab-grid">'+feats.map(function(){return '<div class="ab-card"><h3></h3><p></p></div>'}).join('')+'</div>';
  h+=(function(){var st=[1,2,3].map(function(k){return String(S_('خطوة '+k,['اختار منتجاتك','راجع السلة','ابعت الطلب واتساب'][k-1])).trim()}).filter(Boolean);return /^(لا|no)$/i.test(String(S_('إظهار خطوات الطلب','نعم')).trim())||!st.length?'':'<div class="ab-steps">'+st.map(function(t,i){return '<div><i>'+(i+1)+'</i>'+t.replace(/[<>&]/g,'')+'</div>'}).join('')+'</div>'})();
  w.innerHTML=h;
  w.querySelectorAll('.ab-about .ab-card').forEach(function(el,i){el.querySelector('h3').textContent=abs[i][0];el.querySelector('p').textContent=abs[i][1]});
  w.querySelectorAll('.ab-grid .ab-card').forEach(function(el,i){el.querySelector('h3').textContent=feats[i][0];el.querySelector('p').textContent=feats[i][1]||''});
  var ct=p.querySelector('.about-container'),gd=ct&&ct.querySelector('.about-grid');if(ct&&gd)ct.insertBefore(w,gd);else p.insertBefore(w,p.firstChild);arm(p);
}
/* 5) watch dynamic content */
function debounced(f){var t=0;return function(){if(t)return;t=setTimeout(function(){t=0;f()},90)}}
/* اللوجو: العربلة تقف جنب طرف الكلمة بنفس المسافة في العربي والإنجليزي (بتتقاس من عرض الكلمة الفعلي) */
function fitLogo(){var sw=document.querySelector('header.navbar .logo-swap'),ar=document.getElementById('logo-name'),en=document.getElementById('logo-en'),ct=sw&&sw.querySelector('.lg-cart');if(!sw||!ar||!en||!ct)return;
  function tr(el){var r=document.createRange();r.selectNodeContents(el);return r.getBoundingClientRect()}
  var b=sw.getBoundingClientRect(),a=tr(ar),e=tr(en),h=ct.getBoundingClientRect().width/2;if(!b.width||!a.width||!e.width||!h)return;
  var cur=parseFloat(sw.style.getPropertyValue('--lgs'))||1,nat=e.width/cur,cx=(e.left+e.right)/2-b.left,avail=2*(b.width-cx-(2*h+8)),sc=Math.min(1,avail/nat);
  if(Math.abs(sc-cur)>0.015){sw.style.setProperty('--lgs',sc.toFixed(3));requestAnimationFrame(fitLogo);return}   // لو الإنجليزي مش واسع مع العربة: نصغّره شوية
  var g=h+6,pl=Math.max(h,a.left-b.left-g),pr=Math.min(b.width-h,e.right-b.left+g);
  sw.style.setProperty('--pl',pl.toFixed(1)+'px');sw.style.setProperty('--pr',pr.toFixed(1)+'px')}
window.addEventListener('resize',debounced(fitLogo));if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitLogo);
/* كبسولة البحث (من settings: شكل البحث) */
function capsule(){if(!window.TM||!TM.S)return;var mode=S_('شكل البحث','كبسولة');document.body.classList.toggle('fx-sc',mode!=='أيقونة');
  var ac=document.getElementById('app-content');if(!ac)return;var r=ac.querySelector('.search-capsule-row');
  if(!r){r=document.createElement('div');r.className='search-capsule-row';r.innerHTML='<button class="search-capsule" data-action="toggle-search" aria-label="بحث"><i class="fas fa-search"></i><span></span></button>';ac.insertBefore(r,ac.firstChild)}
  var t=r.querySelector('span'),v=S_('نص خانة البحث','ابحث عن منتج...');if(t.textContent!==v)t.textContent=v}
var mo=new MutationObserver(debounced(function(){arm();vids();hero();capsule();heads();about();cartExtras();paint();offers();themeSet();palette();payInit();footer();searchChips();syncTiles();viewFix()}));
function boot(){arm();vids();hero();capsule();tick();mo.observe(document.getElementById('app-content')||document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
var n=0,iv=setInterval(function(){fitLogo();hero();capsule();heads();about();cartExtras();paint();offers();themeSet();palette();payInit();footer();searchChips();viewFix();arm();vids();tick();if(++n>40)clearInterval(iv)},500);
})();
/* ترولي ماركت فيرجن 17 */
