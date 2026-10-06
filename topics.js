// 공개한 토픽만 넣는다(예정 토픽은 넣지 않는다). 공개하면 url(블로그), video(유튜브), thumb(썸네일), summary(정의 1~2문장)를 채운다. url이 있는 것만 공개 토픽으로 보인다.
window.TOPICS = [
  {"date": "2026-10-05", "domain": "AI", "cat": "정보관리기술사", "topic": "RAG(검색 증강 생성)", "point": "정의, 구성(임베딩·벡터DB·검색·생성), 파인튜닝과 비교, 환각 줄이는 원리", "url": "https://kj84xen.tistory.com/15", "video": "https://youtu.be/bD_U08iG0lY", "thumb": "img/thumbs/rag.jpg", "short": "RAG", "sub": "검색 증강 생성", "summary": "질문과 관련된 외부 문서를 먼저 찾아 프롬프트에 붙이고, LLM이 그 근거로 답하게 하는 구조다. 모델을 다시 학습시키지 않고 최신 지식을 반영한다."},
  {"date": "2026-10-06", "domain": "DB·데이터", "cat": "SQLP", "topic": "실행계획 읽는 법", "url": "https://kj84xen.tistory.com/16", "video": "https://youtu.be/OkctI4M3Di4", "thumb": "img/thumbs/plan.jpg", "summary": "옵티마이저가 통계정보로 비용을 계산해 고른 액세스 경로, 조인 순서, 조인 방식을 트리로 나타낸 것이다. 예상과 실측을 비교해 카디널리티 오추정을 찾는 것이 튜닝의 출발점이다."},
  {"date": "2026-10-06", "domain": "IT경영", "cat": "정보시스템감리사", "topic": "정보시스템 감리 개요와 감리 시점", "url": "https://kj84xen.tistory.com/17", "video": "https://youtu.be/lOOhj16Jcvc", "thumb": "img/thumbs/audit.jpg", "summary": "발주자와 사업자 이외의 제3자가 정보시스템 구축 사업을 단계별로 점검하고 시정을 요구하는 제도다. 요구정의, 설계, 종료 단계에서 점검하고 시정조치 결과까지 확인한다."},
];
