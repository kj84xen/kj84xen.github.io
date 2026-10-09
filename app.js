(function () {
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function md(date) { return date.slice(5).replace("-", "."); }

  var done = TOPICS.filter(function (t) { return t.url; });
  var latest = done[done.length - 1];

  // 오늘의 토픽: 가장 최근에 공개한 것
  if (latest) {
    document.getElementById("today-date").textContent = latest.date + " · " + done.length + "번째";
    document.getElementById("today-box").innerHTML =
      (latest.thumb ? '<a href="' + esc(latest.video || latest.url) + '" target="_blank" rel="noopener"><img src="' + esc(latest.thumb) + '" alt="' + esc(latest.topic) + ' 영상 썸네일"></a>' : "") +
      '<div><div class="tag">' + esc(latest.domain) + " · " + esc(latest.cat) + "</div>" +
      "<h3>" + esc(latest.topic) + "</h3><p>" + esc(latest.summary) + "</p>" +
      '<div class="cta">' +
      (latest.video ? '<a class="btn ghost" href="' + esc(latest.video) + '" target="_blank" rel="noopener">영상 보기</a>' : "") +
      '<a class="btn ghost" href="' + esc(latest.url) + '" target="_blank" rel="noopener">블로그 글</a>' +
      '<a class="btn ghost" href="practice.html#' + encodeURIComponent(latest.topic) + '">답안 연습</a></div></div>';
  }

  // 공개한 토픽 목록 (최신순)
  document.getElementById("done-count").textContent = done.length + "개";
  var ico = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="currentColor" d="M10 9.2v5.6l4.8-2.8z"/></svg>',
    blog: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 20h4L19 9a2.83 2.83 0 0 0-4-4L4 16v4zM13.5 6.5l4 4"/></svg>',
    cbt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5"/></svg>'
  };
  function link(href, label, svg, ext) {
    return '<a href="' + esc(href) + '" aria-label="' + label + '" title="' + label + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + svg + "</a>";
  }
  document.getElementById("grid").innerHTML = done.slice().reverse().map(function (t) {
    var main = t.video || t.url;
    return '<div class="card">' +
      (t.thumb ? '<a class="thumb" href="' + esc(main) + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="' + esc(t.thumb) + '" alt="" loading="lazy"></a>' : "") +
      "<div><small>" + md(t.date) + " · " + esc(t.domain) + "</small><strong>" + esc(t.topic) + "</strong>" +
      '<nav class="go">' +
      (t.video ? link(t.video, "영상 보기", ico.play, true) : "") +
      link(t.url, "블로그 글", ico.blog, true) +
      link("practice.html#" + encodeURIComponent(t.topic), "답안 연습", ico.cbt) +
      "</nav></div></div>";
  }).join("");

  // 답안 연습 숫자와 미리보기
  var rec = {}; try { rec = JSON.parse(localStorage.getItem("itnote-practice")) || {}; } catch (e) {}
  var tried = PRACTICE.filter(function (p) { return rec[p.topic] && rec[p.topic].shown; });
  document.getElementById("p-count").textContent = PRACTICE.length;
  document.getElementById("p-done").textContent = tried.length;
  if (tried.length) {
    var hit = 0, all = 0;
    tried.forEach(function (p) { hit += (rec[p.topic].hit || []).length; all += p.keywords.length; });
    document.getElementById("p-rate").textContent = Math.round(hit / all * 100) + "%";
  }
  var pv = PRACTICE[PRACTICE.length - 1];
  if (pv) {
    var box = document.getElementById("p-preview");
    box.href = "practice.html#" + encodeURIComponent(pv.topic);
    box.innerHTML = '<div class="meta"><span>' + esc(pv.cat) + "</span><span>" + esc(pv.topic) + '</span></div><h3 class="ask"><b>문제</b>' + esc(pv.q) + '</h3><div class="lines" aria-hidden="true"><i></i><i></i><i></i></div><span class="btn main">답안 쓰기</span>';
  }
})();
