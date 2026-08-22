# 블로그 인사이트 자동 갱신

홈페이지의 `인사이트` 영역은 네이버 블로그 `yniccyk`의 공개 RSS에서 최신 게시글 세 건을 읽어 표시한다. 대표 현장 기록 카드는 의도적으로 고정하며 이 자동 갱신 대상에 포함하지 않는다.

`Refresh latest blog insights` 작업은 매일 한국 시간 오전 1시(UTC 전날 16:00)에 실행된다. 새 글이 확인될 때만 `insights.json`을 변경·커밋하고, GitHub Pages는 `main` 브랜치 루트의 변경을 감지해 `bizedulab.co.kr`을 다시 배포한다.

새 글을 올린 직후 바로 반영하려면 GitHub의 `hanma1id/bizedu-lab-pages` 저장소에서 **Actions → Refresh latest blog insights → Run workflow**를 실행한다. RSS 응답이나 변환 형식에 문제가 있으면 파일을 변경하지 않아 기존 인사이트 세 건이 계속 노출된다.
