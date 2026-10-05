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
  document.getElementById("grid").innerHTML = done.slice().reverse().map(function (t) {
    return '<a class="card" href="' + esc(t.url) + '" target="_blank" rel="noopener">' +
      (t.thumb ? '<img src="' + esc(t.thumb) + '" alt="" loading="lazy">' : "") +
      "<div><small>" + md(t.date) + " · " + esc(t.domain) + "</small><strong>" + esc(t.topic) + "</strong></div></a>";
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
