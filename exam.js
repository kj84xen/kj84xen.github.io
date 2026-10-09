// CBT 화면: 문제지와 답안 표기란. 표기한 답은 이 화면에서만 기억하고, 채점 결과만 CBT 기록에 남긴다.
(function () {
  var esc = CBT.esc, $ = function (id) { return document.getElementById(id); };
  var NUM = "①②③④", PREF = "itnote-exam";
  var domainOf = {};
  TOPICS.forEach(function (t) { domainOf[t.topic] = t.domain; });

  var pref = (function () { try { return JSON.parse(localStorage.getItem(PREF)) || {}; } catch (e) { return {}; } })();
  function savePref() { try { localStorage.setItem(PREF, JSON.stringify(pref)); } catch (e) {} }

  // 문제마다 섞은 보기 순서, 표기한 답, 채점 여부. 검색으로 목록이 바뀌어도 유지한다.
  var order = {}, mark = {}, graded = {};
  var set = [], cur = 0;

  function shuffled(n) {
    var a = []; for (var i = 0; i < n; i++) a.push(i);
    for (var j = n - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)), t = a[j]; a[j] = a[k]; a[k] = t; }
    return a;
  }
  function item(q) {
    var id = CBT.id(q);
    if (!order[id]) order[id] = shuffled(q.choices.length);
    return { id: id, q: q, choices: order[id].map(function (i) { return q.choices[i]; }), answer: order[id].indexOf(q.answer) };
  }

  // 검색·토픽·틀린 문제 조건
  var kw = $("kw"), scope = $("scope"), onlyWrong = $("only-wrong"), instant = $("instant");
  (function fillScope() {
    var by = {};
    QUESTIONS.forEach(function (q) { var d = domainOf[q.topic] || "기타"; (by[d] = by[d] || []); if (by[d].indexOf(q.topic) < 0) by[d].push(q.topic); });
    var h = '<option value="all">전체 토픽 ' + QUESTIONS.length + "</option>";
    Object.keys(by).forEach(function (d) {
      h += '<optgroup label="' + esc(d) + '"><option value="d:' + esc(d) + '">' + esc(d) + " 전체</option>";
      by[d].forEach(function (t) { h += '<option value="t:' + esc(t) + '">' + esc(t) + "</option>"; });
      h += "</optgroup>";
    });
    scope.innerHTML = h;
  })();
  function fromHash() {
    var t = "t:" + decodeURIComponent(location.hash.slice(1));
    if (scope.querySelector('option[value="' + t.replace(/"/g, '\\"') + '"]')) scope.value = t;
  }
  fromHash();
  window.addEventListener("hashchange", function () { fromHash(); build(); });
  instant.checked = !!pref.instant;

  function words() { return kw.value.trim().toLowerCase().split(/\s+/).filter(Boolean); }
  function build() {
    var w = words(), s = scope.value, wrong = onlyWrong.checked ? CBT.wrongIds() : null, was = set[cur] && set[cur].id;
    set = QUESTIONS.filter(function (q) {
      if (s.indexOf("t:") === 0 && q.topic !== s.slice(2)) return false;
      if (s.indexOf("d:") === 0 && (domainOf[q.topic] || "기타") !== s.slice(2)) return false;
      if (wrong && wrong.indexOf(CBT.id(q)) < 0) return false;
      var text = (q.topic + " " + q.q + " " + q.choices.join(" ") + " " + q.why).toLowerCase();
      return w.every(function (x) { return text.indexOf(x) >= 0; });
    }).map(item);
    // 보던 문제가 새 목록에도 있으면 그 자리에 머문다
    cur = Math.max(0, set.findIndex(function (it) { return it.id === was; }));
    draw();
  }

  function hl(s) {
    var out = esc(s), w = words();
    w.forEach(function (x) {
      var re = new RegExp("(" + esc(x).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![^<]*>)", "gi");
      out = out.replace(re, "<mark>$1</mark>");
    });
    return out;
  }

  // 문제지
  function drawPaper() {
    var paper = $("paper");
    if (!set.length) {
      paper.innerHTML = '<div class="empty">' + (onlyWrong.checked && !words().length ? "틀린 문제가 없어요." : "검색 결과가 없어요.") + "</div>";
      return;
    }
    var it = set[cur], g = graded[it.id], m = mark[it.id];
    paper.innerHTML =
      '<div class="meta"><span>' + esc(domainOf[it.q.topic] || "") + " · " + hl(it.q.topic) + '</span><span class="pos">' + (cur + 1) + " / " + set.length + "</span></div>" +
      '<h2><b>' + (cur + 1) + ".</b> " + hl(it.q.q) + "</h2>" +
      '<div class="opts" role="radiogroup" aria-label="보기">' +
      it.choices.map(function (c, i) {
        var cls = "opt" + (m === i ? " on" : "") + (g && i === it.answer ? " ok" : "") + (g && m === i && i !== it.answer ? " no" : "");
        return '<button type="button" role="radio" aria-checked="' + (m === i) + '" class="' + cls + '" data-i="' + i + '"' + (g ? " disabled" : "") + "><b>" + NUM[i] + "</b><span>" + hl(c) + "</span></button>";
      }).join("") + "</div>" +
      (g ? '<div class="why"><strong>' + (m === it.answer ? "정답" : m == null ? "안 푼 문제 · 정답 " + NUM[it.answer] : "오답 · 정답 " + NUM[it.answer]) + "</strong>" + hl(it.q.why) + "</div>" : "") +
      '<div class="move"><button type="button" class="btn ghost" id="prev"' + (cur ? "" : " disabled") + '>이전</button><button type="button" class="btn ' + (cur < set.length - 1 ? "main" : "ghost") + '" id="next"' + (cur < set.length - 1 ? "" : " disabled") + ">다음</button></div>";
    paper.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { choose(+b.dataset.i); }; });
    $("prev").onclick = function () { go(cur - 1); };
    $("next").onclick = function () { go(cur + 1); };
  }

  // 답안 표기란
  function drawSheet() {
    var left = set.filter(function (it) { return mark[it.id] == null && !graded[it.id]; }).length;
    $("left").textContent = set.length ? "안 푼 문제 " + left : "";
    $("d-count").textContent = set.length ? (cur + 1) + " / " + set.length : "";
    $("omr").innerHTML = set.map(function (it, n) {
      var g = graded[it.id], m = mark[it.id];
      var row = (n === cur ? " cur" : "") + (g ? (m === it.answer ? " ok" : " no") : "");
      return '<li class="' + row.trim() + '"><button type="button" class="no-btn" data-go="' + n + '" aria-label="' + (n + 1) + '번 문제로">' + (n + 1) + "</button>" +
        [0, 1, 2, 3].map(function (i) {
          var c = (m === i ? "on" : "") + (g && i === it.answer ? " ans" : "");
          return '<button type="button" class="bub ' + c + '" data-n="' + n + '" data-i="' + i + '" aria-label="' + (n + 1) + "번 " + (i + 1) + '번 표기"' + (g ? " disabled" : "") + ">" + (i + 1) + "</button>";
        }).join("") + "</li>";
    }).join("");
    $("omr").querySelectorAll("[data-go]").forEach(function (b) { b.onclick = function () { go(+b.dataset.go); closeSheet(); }; });
    $("omr").querySelectorAll(".bub").forEach(function (b) { b.onclick = function () { cur = +b.dataset.n; choose(+b.dataset.i); }; });
    var cr = $("omr").querySelector(".cur");
    if (cr && cr.scrollIntoViewIfNeeded) cr.scrollIntoViewIfNeeded(false);

    var all = set.length && set.every(function (it) { return graded[it.id]; });
    var foot = "";
    if (set.length) {
      var right = set.filter(function (it) { return graded[it.id] && mark[it.id] === it.answer; }).length;
      var done = set.filter(function (it) { return graded[it.id]; }).length;
      if (done) foot += '<p class="score"><b>' + right + "</b> / " + (all ? set.length : done) + "</p>";
      if (!all && !instant.checked) foot += '<button type="button" class="btn main" id="submit">채점하기</button>';
      if (done) {
        if (right < done) foot += '<button type="button" class="btn ghost" id="retry-wrong">틀린 문제 다시 풀기</button>';
        foot += '<button type="button" class="btn ghost" id="reset">처음부터 다시</button>';
      }
    }
    $("sheet-foot").innerHTML = foot;
    if ($("submit")) $("submit").onclick = submit;
    if ($("reset")) $("reset").onclick = function () { reset(set); };
    if ($("retry-wrong")) $("retry-wrong").onclick = function () {
      var w = set.filter(function (it) { return mark[it.id] !== it.answer; });
      reset(w); set = w.map(function (it) { return item(it.q); }); cur = 0; draw();
    };
  }

  function draw() { drawPaper(); drawSheet(); }
  function go(n) { if (n < 0 || n >= set.length) return; cur = n; draw(); }

  function grade(it) { graded[it.id] = true; CBT.record(it.q, mark[it.id] === it.answer); }
  function choose(i) {
    var it = set[cur]; if (!it || graded[it.id]) return;
    mark[it.id] = i;
    if (instant.checked) grade(it);
    draw();
  }
  function submit() {
    var left = set.filter(function (it) { return mark[it.id] == null; }).length;
    if (left && !confirm("안 푼 문제가 " + left + "개 있어요. 채점할까요?")) return;
    set.forEach(function (it) { if (!graded[it.id]) grade(it); });
    cur = 0; draw();
  }
  function reset(list) {
    list.forEach(function (it) { delete mark[it.id]; delete graded[it.id]; delete order[it.id]; });
    set = set.map(function (it) { return item(it.q); }); cur = 0; draw();
  }

  // 글자 크기
  function zoom(z) {
    document.body.dataset.z = z; pref.zoom = z; savePref();
    document.querySelectorAll(".zoom button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.z == z); });
  }
  document.querySelectorAll(".zoom button").forEach(function (b) { b.onclick = function () { zoom(+b.dataset.z); }; });
  zoom(pref.zoom || 0);

  // 모바일 답안 표기란
  function closeSheet() { document.body.classList.remove("sheet-open"); }
  $("d-sheet").onclick = function () { document.body.classList.add("sheet-open"); };
  $("sheet-close").onclick = closeSheet;
  $("d-prev").onclick = function () { go(cur - 1); };
  $("d-next").onclick = function () { go(cur + 1); };

  var t;
  kw.addEventListener("input", function () { clearTimeout(t); t = setTimeout(build, 150); });
  scope.onchange = onlyWrong.onchange = build;
  instant.onchange = function () { pref.instant = instant.checked; savePref(); draw(); };
  document.addEventListener("keydown", function (e) {
    if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key >= "1" && e.key <= "4") choose(+e.key - 1);
    else if (e.key === "ArrowRight") go(cur + 1);
    else if (e.key === "ArrowLeft") go(cur - 1);
    else if (e.key === "Escape") closeSheet();
  });
  build();
})();
