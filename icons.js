// 상단·하단 아이콘 링크. 두 페이지가 같이 쓴다.
window.LINKS = [
  { id: "blog", label: "블로그", href: "https://kj84xen.tistory.com",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 20h4L19 9a2.83 2.83 0 0 0-4-4L4 16v4zM13.5 6.5l4 4"/></svg>' },
  { id: "youtube", label: "유튜브", href: "https://www.youtube.com/@kj84xen",
    svg: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="currentColor" d="M10 9.2v5.6l4.8-2.8z"/></svg>' },
  { id: "github", label: "GitHub", href: "https://github.com/kj84xen",
    svg: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>' }
];
document.querySelectorAll("[data-links]").forEach(function (box) {
  box.insertAdjacentHTML("beforeend", LINKS.map(function (l) {
    return '<a href="' + l.href + '" aria-label="' + l.label + '" title="' + l.label + '" target="_blank" rel="noopener">' + l.svg + '</a>';
  }).join(""));
});
