# Mermaid Live Editor

Mermaid 다이어그램 코드를 실시간으로 편집하고 미리보기할 수 있는 웹 에디터입니다.

## 기능

- **실시간 미리보기** — 코드 입력 즉시 다이어그램이 자동 렌더링
- **코드 에디터** — CodeMirror 6 기반, 구문 강조 및 히스토리(Undo/Redo) 지원
- **줌 / 패닝** — 마우스 휠 확대·축소, 드래그 이동, `+` / `-` / `Fit` / `Reset` 버튼
- **다이어그램 테마** — Default / Dark / Forest / Neutral / Base 5가지 선택
- **다크 · 라이트 테마** — 시스템 설정 자동 감지, 토글 전환
- **내보내기** — SVG · PNG · JPG · PDF 형식 지원
- **패널 리사이즈** — 에디터 / 미리보기 비율을 드래그로 조절, 새로고침 후에도 유지
- **로컬 저장** — 코드 · 테마 · 패널 비율이 브라우저 localStorage에 자동 저장

## 기술 스택

| 분류 | 라이브러리 |
|---|---|
| 프레임워크 | Vue 3.x (Composition API, `<script setup>`) |
| 빌드 | Vite 5 |
| 언어 | TypeScript |
| 상태관리 | Pinia |
| 스타일 | SCSS |
| 다이어그램 렌더링 | mermaid 11 |
| 코드 에디터 | CodeMirror 6 |
| 이미지 내보내기 | html-to-image |
| PDF 내보내기 | jsPDF |
| 유틸 | @vueuse/core |

## 프로젝트 구조

```
src/
├── components/
│   ├── editor/
│   │   └── MermaidEditor.vue       # CodeMirror 6 에디터 패널
│   ├── preview/
│   │   ├── MermaidPreview.vue      # SVG 렌더링 + 줌/패닝 영역
│   │   └── ZoomControls.vue        # +/−/Fit/Reset 컨트롤 버튼
│   └── toolbar/
│       ├── AppToolbar.vue          # 상단 툴바 (테마 선택, 다크모드 토글)
│       └── ExportMenu.vue          # 내보내기 드롭다운 메뉴
├── composables/
│   ├── useMermaid.ts               # mermaid 렌더링 로직 + 에러 파싱
│   ├── useZoom.ts                  # CSS transform 기반 줌/패닝 구현
│   └── useExport.ts                # SVG·PNG·JPG·PDF 내보내기 로직
├── stores/
│   └── editor.ts                   # Pinia store (code, theme, error, panelRatio)
├── styles/
│   ├── _variables.scss             # 색상, 간격, 타이포그래피 토큰
│   ├── _mixins.scss                # SCSS 믹스인 (flex, icon-btn 등)
│   ├── _reset.scss                 # 전역 리셋
│   └── main.scss                   # CSS 커스텀 프로퍼티 (테마 토큰)
├── types/
│   └── index.ts                    # Theme, ExportFormat, MermaidTheme 타입 정의
├── App.vue                         # 루트 레이아웃 (드래그 리사이즈 패널)
└── main.ts                         # 앱 진입점, Pinia 등록
```

## 시작하기

### 요구사항

- Node.js 18 이상

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

개발 서버 실행 후 [http://localhost:5173](http://localhost:5173) 에서 확인합니다.

## 사용 방법

1. **코드 입력** — 좌측 에디터에 Mermaid 문법으로 다이어그램 코드를 입력합니다.
2. **미리보기** — 우측 패널에 실시간으로 다이어그램이 렌더링됩니다.
3. **줌 조작** — 마우스 휠 또는 하단 `+` / `-` 버튼으로 확대·축소, 드래그로 이동합니다.
4. **전체 보기** — `Fit` 버튼을 누르면 다이어그램이 화면에 맞게 자동 조절됩니다.
5. **내보내기** — 상단 `내보내기` 버튼에서 원하는 형식(SVG · PNG · JPG · PDF)을 선택합니다.
6. **테마 변경** — 상단에서 다이어그램 테마(5종) 및 다크/라이트 UI 테마를 변경합니다.

## Mermaid 문법 예시

```
flowchart TD
    A[시작] --> B{조건 확인}
    B -->|Yes| C[성공 처리]
    B -->|No| D[실패 처리]
    C --> E[완료]
    D --> E
```

```
sequenceDiagram
    Client->>Server: 요청
    Server->>DB: 쿼리
    DB-->>Server: 결과
    Server-->>Client: 응답
```

```
gantt
    title 프로젝트 일정
    section 기획
    요구사항 분석 :a1, 2024-01-01, 7d
    section 개발
    구현 :a2, after a1, 14d
```

지원하는 전체 다이어그램 유형은 [Mermaid 공식 문서](https://mermaid.js.org/intro/)를 참고하세요.
