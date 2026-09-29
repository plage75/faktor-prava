// ФАКТОР ПРАВА — shared front-end behaviour
// NOTE: forms below simulate submission on the client only.
// For production, wire them to a real endpoint / Telegram or email
// notification service as described in the technical brief (see TZ 3.2–3.3).

document.addEventListener('DOMContentLoaded', function () {

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
    });
  });

  /* ---------- Accordion: only allow reasonable number open on mobile (perf/UX no-op placeholder) ---------- */
  // Native <details> handles expand/collapse; no extra JS required.
});
