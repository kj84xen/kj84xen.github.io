// 공개한 토픽만 넣는다(예정 토픽은 넣지 않는다). 공개하면 url(블로그), video(유튜브), thumb(썸네일), summary(정의 1~2문장)를 채운다. url이 있는 것만 공개 토픽으로 보인다.
window.TOPICS = [
  {"date": "2026-10-05", "domain": "AI", "cat": "정보관리기술사", "topic": "RAG(검색 증강 생성)", "point": "정의, 구성(임베딩·벡터DB·검색·생성), 파인튜닝과 비교, 환각 줄이는 원리", "url": "https://kj84xen.tistory.com/15", "video": "https://youtu.be/bD_U08iG0lY", "thumb": "img/thumbs/rag.jpg", "short": "RAG", "sub": "검색 증강 생성", "summary": "질문과 관련된 외부 문서를 먼저 찾아 프롬프트에 붙이고, LLM이 그 근거로 답하게 하는 구조다. 모델을 다시 학습시키지 않고 최신 지식을 반영한다."},
];
