/* ===== Password protection ===== */
(function () {
  var KEY = 'ir_auth', PASS = 'iceco1234';
  if (sessionStorage.getItem(KEY) !== '1') {
    var input = prompt('パスワードを入力してください');
    if (input !== PASS) {
      document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif;">アクセスが拒否されました。</p>';
      return;
    }
    sessionStorage.setItem(KEY, '1');
  }
}());

(function () {
  'use strict';

  /* ===== Hamburger menu ===== */
  var hamburger = document.querySelector('.hamburger');
  var gnav = document.querySelector('#gnav');

  if (hamburger && gnav) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('is-open');
      gnav.classList.toggle('is-open');
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !gnav.contains(e.target)) {
        hamburger.classList.remove('is-open');
        gnav.classList.remove('is-open');
      }
    });
  }

  /* ===== Sidebar sub-toggles (all viewports) ===== */
  document.querySelectorAll('.menu-toggle-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var body = btn.nextElementSibling;
      var isOpen = body.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });

  /* ===== IR News filter ===== */
  (function () {
    var yearSel = document.getElementById('irnews-year');
    var catSel  = document.getElementById('irnews-cat');
    if (!yearSel || !catSel) return;
    function filterNews() {
      var year = yearSel.value;
      var cat  = catSel.value;
      document.querySelectorAll('.irnews-list li').forEach(function (li) {
        var date    = (li.querySelector('.list-date') || {}).textContent || '';
        var catText = (li.querySelector('.list-cat')  || {}).textContent || '';
        var showYear = !year || date.startsWith(year);
        var showCat  = !cat  || catText.trim() === cat;
        li.style.display = (showYear && showCat) ? '' : 'none';
      });
    }
    yearSel.addEventListener('change', filterNews);
    catSel.addEventListener('change', filterNews);
  }());

  /* ===== SP Collapsibles ===== */
  document.querySelectorAll('.sp-coll-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.innerWidth > 768) return;
      var body = btn.nextElementSibling;
      var isOpen = body.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });

  /* ===== Tab component ===== */
  document.querySelectorAll('.tab-nav').forEach(function (nav) {
    nav.querySelectorAll('.tab-btn').forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        var wrap = nav.closest('.tab-wrap');
        wrap.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
        wrap.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        var panels = wrap.querySelectorAll('.tab-panel');
        if (panels[i]) { panels[i].classList.add('active'); }
      });
    });
  });

}());

/* ===== Ownership pie chart (SVG + hover) ===== */
(function () {
  var container = document.getElementById('ownership-pie');
  if (!container) return;

  var data = [
    { label: '金融機関',     pct: 28.5, color: '#003366' },
    { label: '個人・その他', pct: 24.3, color: '#0066cc' },
    { label: '外国法人等',   pct: 31.2, color: '#5599cc' },
    { label: '証券会社',     pct: 10.8, color: '#27ae60' },
    { label: '自己株式他',   pct:  5.2, color: '#e67e22' },
  ];

  var cx = 90, cy = 90, r = 80;
  var NS = 'http://www.w3.org/2000/svg';

  var title = document.createElement('p');
  title.style.cssText = 'font-size:11px;font-weight:bold;color:#003366;margin-bottom:6px;';
  title.textContent = '所有者別分布';

  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 180 180');
  svg.setAttribute('width', '180');
  svg.setAttribute('height', '180');
  svg.style.cssText = 'display:block;margin:0 auto 10px;overflow:visible;';

  var legend = document.createElement('ul');
  legend.className = 'pie-legend';

  var slices = [], items = [];
  var startAngle = -Math.PI / 2;

  data.forEach(function (d, i) {
    var sweep = (d.pct / 100) * 2 * Math.PI;
    var endAngle = startAngle + sweep;
    var midAngle = startAngle + sweep / 2;

    var x1 = cx + r * Math.cos(startAngle);
    var y1 = cy + r * Math.sin(startAngle);
    var x2 = cx + r * Math.cos(endAngle);
    var y2 = cy + r * Math.sin(endAngle);

    var path = document.createElementNS(NS, 'path');
    path.setAttribute('d', [
      'M', cx, cy,
      'L', x1.toFixed(2), y1.toFixed(2),
      'A', r, r, 0, (sweep > Math.PI ? 1 : 0), 1, x2.toFixed(2), y2.toFixed(2),
      'Z'
    ].join(' '));
    path.setAttribute('fill', d.color);
    path.setAttribute('stroke', '#fff');
    path.setAttribute('stroke-width', '2');
    path.style.cssText = 'cursor:pointer;transition:opacity .15s,transform .15s;';
    path._tx = (10 * Math.cos(midAngle)).toFixed(2);
    path._ty = (10 * Math.sin(midAngle)).toFixed(2);

    svg.appendChild(path);
    slices.push(path);

    var li = document.createElement('li');
    li.innerHTML = '<span class="l-color" style="background:' + d.color + '"></span>' +
      d.label + ' ' + d.pct + '%';
    li.style.cssText = 'cursor:pointer;transition:opacity .15s;';
    legend.appendChild(li);
    items.push(li);

    startAngle = endAngle;
  });

  function activate(idx) {
    slices.forEach(function (p, i) {
      if (i === idx) {
        p.setAttribute('transform', 'translate(' + p._tx + ',' + p._ty + ')');
        p.style.opacity = '1';
        items[i].style.cssText = 'cursor:pointer;transition:opacity .15s;font-weight:bold;opacity:1;';
      } else {
        p.setAttribute('transform', '');
        p.style.opacity = '0.3';
        items[i].style.cssText = 'cursor:pointer;transition:opacity .15s;font-weight:normal;opacity:0.5;';
      }
    });
  }

  function deactivate() {
    slices.forEach(function (p, i) {
      p.setAttribute('transform', '');
      p.style.opacity = '1';
      items[i].style.cssText = 'cursor:pointer;transition:opacity .15s;font-weight:normal;opacity:1;';
    });
  }

  slices.forEach(function (p, i) {
    p.addEventListener('mouseenter', function () { activate(i); });
    p.addEventListener('mouseleave', deactivate);
  });
  items.forEach(function (li, i) {
    li.addEventListener('mouseenter', function () { activate(i); });
    li.addEventListener('mouseleave', deactivate);
  });

  container.appendChild(title);
  container.appendChild(svg);
  container.appendChild(legend);
}());
