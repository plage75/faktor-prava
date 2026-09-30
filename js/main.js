// ФАКТОР ПРАВА — shared front-end behaviour
// NOTE: forms below simulate submission on the client only.
// For production, wire them to a real endpoint / Telegram or email
// notification service as described in the technical brief (see TZ 3.2–3.3).

document.addEventListener('DOMContentLoaded', function () {

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.textContent = '☰';
      });
    });
  }

  /* ---------- Order-a-call dialog ---------- */
  var dialog = document.getElementById('call-dialog');
  document.querySelectorAll('[data-open-call]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });
  document.querySelectorAll('[data-close-call]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (dialog) dialog.close();
    });
  });

  /* ---------- Chat widget ---------- */
  var chatDock = document.getElementById('chat-toggle');
  var chatPanel = document.getElementById('chat-panel');
  var chatCloseBtn = document.getElementById('chat-close');
  if (chatDock && chatPanel) {
    chatDock.addEventListener('click', function () {
      chatPanel.classList.toggle('is-open');
    });
  }
  if (chatCloseBtn && chatPanel) {
    chatCloseBtn.addEventListener('click', function () {
      chatPanel.classList.remove('is-open');
    });
  }
  var chatAskBtn = document.getElementById('chat-ask-btn');
  var chatCallForm = document.getElementById('chat-callform');
  if (chatAskBtn && chatCallForm) {
    chatAskBtn.addEventListener('click', function () {
      chatCallForm.classList.add('is-visible');
      chatAskBtn.parentElement.style.display = 'none';
    });
  }

  /* ---------- Floating contact card ---------- */
  var floatCard = document.getElementById('floating-contact');
  var floatTab = document.getElementById('floating-contact-tab');
  var floatClose = document.getElementById('floating-contact-close');
  if (floatCard && floatTab) {
    var floatDismissed = false;
    var showFloat = function () {
      if (floatDismissed) return;
      floatTab.classList.add('is-hidden');
      floatCard.classList.add('is-visible');
    };
    var hideFloat = function () {
      floatCard.classList.remove('is-visible');
      floatTab.classList.remove('is-hidden');
    };
    floatTab.addEventListener('click', showFloat);
    if (floatClose) {
      floatClose.addEventListener('click', function () {
        hideFloat();
        floatDismissed = true;
        setTimeout(function () { floatDismissed = false; }, 30000);
      });
    }
    // Auto-invite once, after the visitor has scrolled a little way down.
    var invited = false;
    window.addEventListener('scroll', function () {
      if (invited || floatDismissed) return;
      if (window.scrollY > window.innerHeight * 0.9) {
        invited = true;
        showFloat();
      }
    }, { passive: true });
  }

  /* ---------- Generic "fake submit" for all demo forms ---------- */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var successEl = form.querySelector('.form-success');
      if (successEl) {
        successEl.classList.add('is-visible');
        successEl.textContent = 'Заявка отправлена. Мы свяжемся с вами в ближайшее рабочее время.';
      }
      form.reset();
      if (dialog && form.closest('dialog') === dialog) {
        setTimeout(function () { dialog.close(); }, 1400);
      }
      if (floatCard && form.closest('#floating-contact') === floatCard) {
        setTimeout(function () { floatCard.classList.remove('is-visible'); }, 1600);
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealSelectors = '.direction-card, .advantage, .testimonial, .value-card, .side-card, .registry-group > h2, .registry-group > .section-lede, .hero-panel, .gcard, .split-card, .stat-item, .apply-panel, .faq-item';
  var revealEls = document.querySelectorAll(revealSelectors);
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('reveal', 'is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () { el.classList.add('is-visible'); }, (i % 6) * 70);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
    // Safety net: guarantee visibility even if an element never intersects
    // (unusual viewport/layout edge cases) so content is never stuck hidden.
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }, 3000);
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-counter]');
  var animateCounter = function (el) {
    var target = parseInt(el.getAttribute('data-counter'), 10);
    if (isNaN(target)) return;
    var start = 0;
    var duration = 900;
    var startTime = null;
    var step = function (ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      el.textContent = Math.round(start + (target - start) * progress);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-counter'); });
    } else {
      var cIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            cIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cIo.observe(el); });
    }
  }

  /* ---------- Subtle hero motif parallax on pointer move (desktop only) ---------- */
  var heroMotif = document.querySelector('.hero-motif');
  var hero = document.querySelector('.hero');
  if (heroMotif && hero && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      heroMotif.style.transform = 'translate(' + (x * -14) + 'px,' + (y * -10) + 'px)';
    });
    hero.addEventListener('mouseleave', function () {
      heroMotif.style.transform = 'translate(0,0)';
    });
  }

  /* Native <details> handles expand/collapse; no extra JS required. */
});
