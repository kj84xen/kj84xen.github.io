// 답안 연습: 문제를 보고 답안을 떠올려 적은 뒤, 원고의 키워드·목차·작성 포인트와 맞춰 본다. 기록은 이 브라우저에만 남는다.
(function () {
  var KEY = "itnote-practice", $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {} }
  var rec = load();
  var info = {}; TOPICS.forEach(function (t) { info[t.topic] = t; });
  var hasQ = {}; (window.QUESTIONS || []).forEach(function (q) { hasQ[q.topic] = 1; });
  var list = PRACTICE.slice().reverse(), cur = null, shown = false;

  // 키워드가 메모에 들어 있는지. 대소문자는 무시하고, "개인키 서명"처럼 띄어 쓴 말은 각 단어가 다 있으면, PE·PA·PEP 처럼 묶인 것은 하나만 있어도 인정한다.
  function norm(s) { return s.toLowerCase().replace(/\s+/g, ""); }
  function inMemo(k, memo) {
    var m = norm(memo); if (!m) return false;
    return k.split(/[·()]/).filter(function (x) { return norm(x).length > 1; }).some(function (part) {
      return part.trim().split(/\s+/).every(function (w) { return m.indexOf(norm(w)) >= 0; });
    });
  }
  function score(p) { var r = rec[p.topic]; return r && r.shown ? (r.hit || []).length + " / " + p.keywords.length : ""; }

  function drawList() {
    $("tul").innerHTML = list.map(function (p) {
      var t = info[p.topic] || {};
      return '<li><button type="button" data-t="' + esc(p.topic) + '"' + (cur === p ? ' aria-current="true"' : "") + '><small>' + esc((t.date || "").slice(5).replace("-", ".")) + " · " + esc(t.domain || p.cat) + "</small><span>" + esc(p.topic) + "</span><em>" + score(p) + "</em></button></li>";
    }).join("");
    $("tul").querySelectorAll("button").forEach(function (b) { b.onclick = function () { open(b.dataset.t); }; });
    $("tsel").innerHTML = list.map(function (p) { return '<option value="' + esc(p.topic) + '"' + (cur === p ? " selected" : "") + ">" + esc(p.topic) + (score(p) ? " (" + score(p) + ")" : "") + "</option>"; }).join("");
  }

  function open(topic, keepHash) {
    cur = list.filter(function (p) { return p.topic === topic; })[0] || list[0];
    var r = rec[cur.topic] || {};
    shown = !!r.shown;
    if (!keepHash) history.replaceState(null, "", "#" + encodeURIComponent(cur.topic));
    draw();
  }

  function draw() {
    var p = cur, t = info[p.topic] || {}, r = rec[p.topic] || {};
    var h =
      '<div class="meta"><span>' + esc(t.domain || "") + " · " + esc(p.cat) + "</span>" + (score(p) ? '<span class="last">지난 기록 ' + score(p) + "</span>" : "") + "</div>" +
      '<h2 class="ask"><b>문제</b>' + esc(p.q) + "</h2>" +
      '<label class="memo"><span class="sr">답안 메모</span><textarea id="memo" rows="8" placeholder="답안 메모">' + esc(r.memo || "") + "</textarea></label>";
    if (!shown) {
      h += '<div class="row"><button type="button" class="btn main" id="reveal">답안 보기</button></div>';
    } else {
      var hit = r.hit || [];
      h += '<div class="key">' +
        '<div class="sec"><h3>키워드</h3><span id="kcount">' + hit.length + " / " + p.keywords.length + "</span></div>" +
        '<div class="chips">' + p.keywords.map(function (k) {
          return '<button type="button" class="chip' + (hit.indexOf(k) >= 0 ? " on" : "") + '" aria-pressed="' + (hit.indexOf(k) >= 0) + '" data-k="' + esc(k) + '">' + esc(k) + "</button>";
        }).join("") + "</div>" +
        '<div class="sec"><h3>한 줄 정의</h3></div><p class="one">' + esc(p.one) + "</p>" +
        (p.outline.length ? '<div class="sec"><h3>답안 목차</h3></div><ol class="toc">' + p.outline.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ol>" : "") +
        (p.points.length ? '<div class="sec"><h3>작성 포인트</h3></div><ul class="pts">' + p.points.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>" : "") +
        "</div>" +
        '<div class="row">' +
          '<a class="btn ghost" href="' + esc(p.url) + '" target="_blank" rel="noopener">블로그 글</a>' +
          (t.video ? '<a class="btn ghost" href="' + esc(t.video) + '" target="_blank" rel="noopener">영상 보기</a>' : "") +
          (hasQ[p.topic] && p.cat !== "정보관리기술사" ? '<a class="btn ghost" href="cbt.html#' + encodeURIComponent(p.topic) + '">객관식 문제</a>' : "") +
          '<button type="button" class="btn ghost" id="again">다시 쓰기</button>' +
          '<button type="button" class="btn main" id="next">다음 토픽</button>' +
        "</div>";
    }
    $("work").innerHTML = h;
    drawList();

    var memo = $("memo");
    memo.oninput = function () { r.memo = memo.value; rec[p.topic] = r; save(); };
    if (!shown) {
      $("reveal").onclick = function () {
        r.memo = memo.value; r.shown = true; r.at = Date.now();
        r.hit = p.keywords.filter(function (k) { return inMemo(k, memo.value); });
        rec[p.topic] = r; save(); shown = true; draw();
        var key = document.querySelector(".key"); if (key) key.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      };
      return;
    }
    document.querySelectorAll(".chip").forEach(function (c) {
      c.onclick = function () {
        var k = c.dataset.k, i = r.hit.indexOf(k);
        if (i >= 0) r.hit.splice(i, 1); else r.hit.push(k);
        c.classList.toggle("on", i < 0); c.setAttribute("aria-pressed", i < 0);
        $("kcount").textContent = r.hit.length + " / " + p.keywords.length;
        rec[p.topic] = r; save(); drawList();
      };
    });
    $("again").onclick = function () { rec[p.topic] = { memo: "" }; save(); shown = false; draw(); $("memo").focus(); };
    $("next").onclick = function () { open(list[(list.indexOf(p) + 1) % list.length].topic); window.scrollTo(0, 0); };
  }

  $("tsel").onchange = function () { open(this.value); };
  $("pick").onclick = function () {
    var rest = list.filter(function (p) { return p !== cur; });
    open(rest[Math.floor(Math.random() * rest.length)].topic);
  };
  window.addEventListener("hashchange", function () { open(decodeURIComponent(location.hash.slice(1)), true); });
  open(decodeURIComponent(location.hash.slice(1)), true);
})();
