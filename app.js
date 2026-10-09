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
      '<a class="btn ghost" href="cbt.html#' + encodeURIComponent(latest.topic) + '">이 토픽 문제</a></div></div>';
  }

  // 공개한 토픽 목록 (최신순)
  document.getElementById("done-count").textContent = done.length + "개";
  var ico = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="currentColor" d="M10 9.2v5.6l4.8-2.8z"/></svg>',
    blog: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 20h4L19 9a2.83 2.83 0 0 0-4-4L4 16v4zM13.5 6.5l4 4"/></svg>',
    cbt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M9 11l2 2 4-4M5 4h14v16H5z"/></svg>'
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
      link("cbt.html#" + encodeURIComponent(t.topic), "이 토픽 문제", ico.cbt) +
      "</nav></div></div>";
  }).join("");

  // CBT 숫자와 미리보기 문제
  var topics = {};
  QUESTIONS.forEach(function (q) { topics[q.topic] = 1; });
  document.getElementById("q-count").textContent = QUESTIONS.length;
  document.getElementById("q-topics").textContent = Object.keys(topics).length;
  var rate = CBT.rate();
  if (rate !== null) document.getElementById("my-rate").textContent = rate + "%";
  CBT.render(document.getElementById("preview"), QUESTIONS[0], { index: 1, total: QUESTIONS.length });
})();
