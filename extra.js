/* Photos from code + feedback form (Web3Forms). Runs after script.js */

// ---------- Photos from code ----------
function loadUrl(src, i) {
  return new Promise(res => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => {
      const f = frames[i], c = f.cv.getContext('2d'), w = f.cv.width, h = f.cv.height;
      const s = Math.max(w / im.width, h / im.height);
      c.drawImage(im, (w - im.width * s) / 2, (h - im.height * s) / 2, im.width * s, im.height * s);
      f.tex.needsUpdate = true; f.custom = true; res(true);
    };
    im.onerror = () => { console.warn('Photo not found:', src); res(false); };
    im.src = src;
  });
}
(async () => {
  for (let i = 0; i < MUSEUM_PHOTOS.length && i < frames.length; i++) {
    const p = MUSEUM_PHOTOS[i];
    const src = typeof p === 'string' ? p : p.src;
    if (p.cap) frames[i].cap = p.cap;
    await loadUrl(src, i);
  }
})();

// ---------- Feedback form ----------
(() => {
  const fb = $('#fb'), form = $('#fbForm'), msg = $('#fbMsg'), send = $('#fbSend');
  let rating = 0;
  const paint = n => [...$('#stars').children].forEach((b, k) => b.classList.toggle('on', k < n));
  $('#stars').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    rating = +b.dataset.v; paint(rating);
  });
  const open = () => { fb.hidden = false; msg.textContent = ''; };
  const close = () => { fb.hidden = true; };
  $('#bFb').onclick = open;
  $('#fbClose').onclick = close;
  fb.addEventListener('pointerdown', e => { if (e.target === fb) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !fb.hidden) close(); });
  // stop museum keys (WASD etc.) while typing in the form
  fb.addEventListener('keydown', e => e.stopPropagation());

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (WEB3FORMS_KEY === 'YOUR_ACCESS_KEY_HERE') { msg.textContent = 'Add your Web3Forms key in config.js first.'; return; }
    if (!rating) { msg.textContent = 'Please tap a star rating.'; return; }
    const fd = new FormData(form);
    const body = {
      access_key: WEB3FORMS_KEY,
      subject: 'New Museum feedback: ' + rating + '/5',
      from_name: 'Our Museum',
      name: fd.get('name') || 'Anonymous',
      rating: rating + ' / 5',
      enjoyed: fd.get('enjoyed'),
      message: fd.get('message'),
      botcheck: fd.get('botcheck') ? 'yes' : ''
    };
    send.disabled = true; send.textContent = 'Sending...'; msg.textContent = '';
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      });
      const j = await r.json();
      if (j.success) {
        msg.textContent = 'Thank you! Your feedback was sent ❤';
        form.reset(); rating = 0; paint(0);
        setTimeout(close, 1800);
      } else { msg.textContent = 'Could not send: ' + (j.message || 'try again'); }
    } catch (err) { msg.textContent = 'Network error. Please try again.'; }
    send.disabled = false; send.textContent = 'Send feedback';
  });

  // auto prompt once after entering
  $('#go').addEventListener('click', () => {
    if (FEEDBACK_AFTER_SECONDS > 0) setTimeout(() => { if (fb.hidden) { open(); } }, FEEDBACK_AFTER_SECONDS * 1000);
  });
})();