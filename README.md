# 한푼

지출만 빠르게 기록하는 아이폰용 웹앱입니다. Safari에서 열고 공유 → "홈 화면에 추가"하면 앱처럼 전체 화면으로 실행되고, 오프라인에서도 열립니다.

- 앱 주소: https://junsince99.github.io/IosExpense/
- 기록은 각 기기 안(브라우저 저장소)에만 저장되며 이 저장소에는 올라가지 않습니다.

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/app.html` | 앱 화면 원본 (스타일·스크립트 포함) |
| `public/` | 매니페스트와 아이콘 |
| `tools/sw.template.js` | 오프라인용 서비스 워커 템플릿 |
| `tools/make-icons.cjs` | 아이콘 PNG 생성 스크립트 (Playwright 필요) |
| `build.mjs` | `dist/`에 배포용 파일을 만드는 빌드 스크립트 |

## 빌드와 배포

```bash
node build.mjs
```

`main`에 푸시하면 GitHub Actions가 빌드해서 `gh-pages` 브랜치에 올리고, GitHub Pages가 그 브랜치를 서비스합니다 (Settings → Pages → Deploy from a branch → `gh-pages` / root).
