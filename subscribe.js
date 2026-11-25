/* "Get each new edition by email": the report's subscribe blocks post to the DVC Mailchimp audience
   (Davidovs, us5) through Mailchimp's JSONP endpoint, so the static page needs no server.
   Mailchimp's own reply text is never inserted into the page; the reader sees fixed messages. */
(function () {
  'use strict';
  // tags=4585635 is the Mailchimp tag "state-of-ai", so report subscribers can be told apart in the audience.
  var ACTION = 'https://davidovs.us5.list-manage.com/subscribe/post-json?u=8e1abc47a24dbf1b221ae3782&id=f1fd16d180&tags=4585635';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var MSG = {
    invalid: 'Please enter a valid email address.',
    busy: 'Subscribing…',
    done: 'Thanks, you are on the list. The next edition will come to your inbox.',
    already: 'You are already on the list.',
    error: 'Something went wrong. Please try again in a minute.'
  };

  function track(name, params) { if (window.soaiTrack) window.soaiTrack(name, params); }

  function jsonp(url, cb) {
    var name = 'soaiMc' + Date.now() + Math.floor(Math.random() * 1e6), script = document.createElement('script'), settled = false;
    function finish(data) {
      if (settled) return;
      settled = true;
      try { delete window[name]; } catch (e) { window[name] = undefined; }
      script.remove();
      cb(data);
    }
    window[name] = finish;
    script.onerror = function () { finish(null); };
    script.src = url + '&c=' + name;
    document.head.appendChild(script);
    setTimeout(function () { finish(null); }, 12000);
  }

  function init() {
    document.querySelectorAll('.d-subscribe').forEach(function (box) {
      var form = box.querySelector('form'), input = form.querySelector('input[type="email"]'), trap = form.querySelector('.d-hp'),
          status = box.querySelector('.d-subscribe-status'), button = form.querySelector('button'), placement = box.getAttribute('data-placement') || '';
      function say(state, text) { box.setAttribute('data-state', state); status.textContent = text; }
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = input.value.trim();
        if (!EMAIL_RE.test(email)) { say('error', MSG.invalid); input.focus(); return; }
        if (trap && trap.value) return;
        button.disabled = true;
        say('busy', MSG.busy);
        track('subscribe_submit', { placement: placement });
        jsonp(ACTION + '&EMAIL=' + encodeURIComponent(email), function (data) {
          button.disabled = false;
          if (data && data.result === 'success') { say('done', MSG.done); form.reset(); track('subscribe_result', { placement: placement, status: 'success' }); }
          else if (data && /already subscribed/i.test(String(data.msg || ''))) { say('done', MSG.already); track('subscribe_result', { placement: placement, status: 'already' }); }
          else { say('error', MSG.error); track('subscribe_result', { placement: placement, status: data ? 'rejected' : 'network' }); }
        });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
