/* EDDA STUDIO — comportamenti condivisi del sito */
(function(){
  'use strict';

  /* ---- Navbar: stato attivo + menu mobile ---- */
  function initNav(){
    var nav = document.querySelector('.nav');
    if(!nav) return;
    var toggle = nav.querySelector('.nav-toggle');
    if(toggle){
      toggle.addEventListener('click', function(){ nav.classList.toggle('open'); });
    }
    // chiudi menu al click su un link (mobile)
    nav.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('click', function(){ nav.classList.remove('open'); });
    });
    // marca la voce attiva in base al file corrente
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if(here === '') here = 'index.html';
    nav.querySelectorAll('.nav-links a').forEach(function(a){
      var href = (a.getAttribute('href')||'').toLowerCase();
      if(href === here) a.classList.add('active');
    });
  }

  /* ---- Reveal allo scroll ---- */
  function initReveal(){
    var els = document.querySelectorAll('.reveal');
    if(!els.length) return;
    if(!('IntersectionObserver' in window)){
      els.forEach(function(e){ e.classList.add('in'); }); return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var el = en.target;
          var d = el.getAttribute('data-delay');
          if(d) el.style.transitionDelay = d + 'ms';
          el.classList.add('in');
          io.unobserve(el);
        }
      });
    }, { threshold:0.08, rootMargin:'0px 0px -6% 0px' });
    els.forEach(function(e){ io.observe(e); });
    // Failsafe: se l'observer non scatta (es. iframe non visibile / contesti di cattura
    // dove le transizioni CSS vengono messe in pausa), rivela tutto SENZA transizione,
    // così il contenuto è sempre visibile e mai bloccato a opacity 0.
    setTimeout(function(){
      els.forEach(function(e){
        if(!e.classList.contains('in')){
          e.style.transition = 'none';
          e.classList.add('in');
        }
      });
    }, 500);
  }

  /* ---- Accordion FAQ ---- */
  function initFaq(){
    document.querySelectorAll('.faq-item').forEach(function(item){
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if(!q || !a) return;
      q.addEventListener('click', function(){
        var open = item.classList.contains('open');
        if(open){
          a.style.maxHeight = a.scrollHeight + 'px';
          requestAnimationFrame(function(){ a.style.maxHeight = '0px'; });
          item.classList.remove('open');
        } else {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
          var clear = function(){ if(item.classList.contains('open')) a.style.maxHeight='none'; a.removeEventListener('transitionend', clear); };
          a.addEventListener('transitionend', clear);
        }
      });
    });
  }

  /* ---- Form newsletter / iscrizione (stato "iscritto") ---- */
  function initForms(){
    document.querySelectorAll('form[data-edda-form]').forEach(function(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var input = form.querySelector('input[type=email]');
        if(input && !input.checkValidity()){ input.reportValidity(); return; }
        var msg = form.getAttribute('data-success') || 'Sei in casa. Ti abbiamo scritto una mail di conferma.';
        var dark = form.classList.contains('on-dark') || form.closest('.dark');
        var done = document.createElement('div');
        done.className = 'form-done' + (dark? ' on-dark':'');
        done.innerHTML = '<span class="red">→</span> ' + msg;
        form.replaceWith(done);
      });
    });

    // form contatti completo
    document.querySelectorAll('form[data-edda-contact]').forEach(function(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        if(!form.checkValidity()){ form.reportValidity(); return; }
        var done = document.createElement('div');
        done.className = 'form-done';
        done.style.fontSize = '1.05rem';
        done.innerHTML = '<span class="red">→</span> Grazie. La tua lettera è arrivata in casa Edda.<br>Ti rispondiamo personalmente, entro tre giorni lavorativi.';
        form.replaceWith(done);
      });
    });
  }

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){ initNav(); initReveal(); initFaq(); initForms(); });
})();
