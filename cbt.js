// 문제 카드 그리기와 기록 저장. 기록은 이 브라우저(localStorage)에만 남는다.
window.CBT = (function () {
  var KEY = "itnote-cbt";
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(rec) { try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {} }
  function id(q) { return q.topic + "|" + q.q; }

  // 문제마다 마지막 결과만 기억한다: { id: true/false }
  function record(q, ok) { var r = load(); r[id(q)] = ok; save(r); }
  function wrongIds() { var r = load(); return Object.keys(r).filter(function (k) { return r[k] === false; }); }
  function rate() {
    var r = load(), keys = Object.keys(r);
    if (!keys.length) return null;
    return Math.round(keys.filter(function (k) { return r[k]; }).length / keys.length * 100);
  }

  // box에 문제 하나를 그린다. opts: {index, total, onNext}
  function shuffle(q) {
    var order = q.choices.map(function (_, i) { return i; });
    for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
    return { topic: q.topic, q: q.q, why: q.why, choices: order.map(function (i) { return q.choices[i]; }), answer: order.indexOf(q.answer), src: q };
  }

  function render(box, q0, opts) {
    opts = opts || {};
    var q = shuffle(q0);
    box.innerHTML =
      '<div class="meta"><span>' + esc(q.topic) + " · 객관식</span><span>" + (opts.index || 1) + " / " + (opts.total || 1) + "</span></div>" +
      "<h3>" + esc(q.q) + "</h3>" +
      q.choices.map(function (c, i) { return '<button type="button" class="opt" data-i="' + i + '"><b>' + "①②③④"[i] + "</b><span>" + esc(c) + "</span></button>"; }).join("") +
      '<div class="why" aria-live="polite"></div>' +
      (opts.onNext ? '<div class="act" hidden><button type="button" class="btn main q-next">다음 문제</button></div>' : "");
    var opts$ = box.querySelectorAll(".opt");
    opts$.forEach(function (b) {
      b.addEventListener("click", function () {
        var pick = +b.dataset.i, ok = pick === q.answer;
        opts$.forEach(function (x) { x.disabled = true; if (+x.dataset.i === q.answer) x.classList.add("ok"); });
        if (!ok) b.classList.add("no");
        box.querySelector(".why").innerHTML = "<strong>" + (ok ? "정답이에요. " : "정답은 " + "①②③④"[q.answer] + "번이에요. ") + "</strong>" + esc(q.why);
        record(q0, ok);
        if (opts.onResult) opts.onResult(ok);
        var act = box.querySelector(".act");
        if (act) { act.hidden = false; act.querySelector(".q-next").onclick = opts.onNext; act.querySelector(".q-next").focus(); }
      });
    });
  }
  return { render: render, rate: rate, wrongIds: wrongIds, id: id, record: record, esc: esc };
})();
