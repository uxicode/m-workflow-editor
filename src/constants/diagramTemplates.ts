export interface DiagramTemplate {
  id: string
  label: string
  icon: string
  code: string
}

export const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
  {
    id: 'flowchart',
    label: 'Flowchart',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="17" width="18" height="4" rx="1"/><path d="M12 7v10M8 12H4M16 12h4"/></svg>`,
    code: `flowchart TD
    A([시작]) --> B[데이터 입력]
    B --> C{유효성 검사}
    C -->|통과| D[처리]
    C -->|실패| E[오류 표시]
    E --> B
    D --> F[(DB 저장)]
    F --> G([완료])`,
  },
  {
    id: 'flowchart-lr',
    label: 'Flowchart LR',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="8" width="6" height="8" rx="1"/><rect x="17" y="8" width="6" height="8" rx="1"/><path d="M7 12h10M14 9l3 3-3 3"/></svg>`,
    code: `flowchart LR
    A([클라이언트]) -->|HTTP 요청| B[API Gateway]
    B --> C{인증}
    C -->|성공| D[서비스 레이어]
    C -->|실패| E[401 응답]
    D --> F[(데이터베이스)]
    F -->|결과| D
    D -->|응답| A`,
  },
  {
    id: 'sequence',
    label: 'Sequence',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="4" x2="4" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="20" y1="4" x2="20" y2="20"/><path d="M4 8h8M16 12h4M8 16H4"/></svg>`,
    code: `sequenceDiagram
    actor U as 사용자
    participant C as 클라이언트
    participant S as 서버
    participant D as 데이터베이스

    U->>C: 로그인 요청
    C->>S: POST /auth/login
    S->>D: 사용자 조회
    D-->>S: 사용자 정보
    S-->>C: JWT 토큰 발급
    C-->>U: 로그인 성공`,
  },
  {
    id: 'class',
    label: 'Class',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="2" y1="14" x2="22" y2="14"/></svg>`,
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound() void
        +move() void
    }
    class Dog {
        +String breed
        +fetch() void
        +makeSound() void
    }
    class Cat {
        +bool isIndoor
        +purr() void
        +makeSound() void
    }
    Animal <|-- Dog : 상속
    Animal <|-- Cat : 상속`,
  },
  {
    id: 'state',
    label: 'State',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="12" r="2"/><circle cx="20" cy="12" r="2"/><path d="M6 12h3M15 12h3"/></svg>`,
    code: `stateDiagram-v2
    [*] --> 대기중
    대기중 --> 처리중 : 작업 시작
    처리중 --> 완료 : 성공
    처리중 --> 오류 : 실패
    오류 --> 대기중 : 재시도
    완료 --> [*]

    state 처리중 {
        [*] --> 검증
        검증 --> 실행
        실행 --> [*]
    }`,
  },
  {
    id: 'er',
    label: 'ER Diagram',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="8" height="14" rx="1"/><rect x="14" y="5" width="8" height="14" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
    code: `erDiagram
    USER {
        int id PK
        string name
        string email
        datetime created_at
    }
    ORDER {
        int id PK
        int user_id FK
        string status
        decimal total
    }
    PRODUCT {
        int id PK
        string name
        decimal price
        int stock
    }
    ORDER_ITEM {
        int order_id FK
        int product_id FK
        int quantity
    }

    USER ||--o{ ORDER : "주문"
    ORDER ||--|{ ORDER_ITEM : "포함"
    PRODUCT ||--o{ ORDER_ITEM : "담김"`,
  },
  {
    id: 'gantt',
    label: 'Gantt',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="3" y2="18"/><rect x="5" y="5" width="10" height="3" rx="1"/><rect x="5" y="10" width="14" height="3" rx="1"/><rect x="9" y="15" width="8" height="3" rx="1"/></svg>`,
    code: `gantt
    title 웹 서비스 개발 일정
    dateFormat YYYY-MM-DD
    section 기획
        요구사항 분석   :a1, 2024-01-01, 7d
        UI/UX 디자인   :a2, after a1, 10d
    section 개발
        백엔드 구축    :b1, after a2, 14d
        프론트엔드 구현 :b2, after a2, 14d
        API 연동       :b3, after b1, 7d
    section 검수
        테스트         :c1, after b3, 7d
        버그 수정      :c2, after c1, 5d
        배포           :c3, after c2, 2d`,
  },
  {
    id: 'pie',
    label: 'Pie Chart',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>`,
    code: `pie title 기술 스택 비율
    "Vue.js" : 35
    "TypeScript" : 25
    "Node.js" : 20
    "Python" : 12
    "기타" : 8`,
  },
  {
    id: 'gitgraph',
    label: 'Git Graph',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8M6 8c0-2 12-2 12 0v4"/></svg>`,
    code: `gitGraph
    commit id: "초기 커밋"
    commit id: "기본 구조 세팅"
    branch feature/auth
    checkout feature/auth
    commit id: "로그인 구현"
    commit id: "회원가입 구현"
    checkout main
    branch feature/dashboard
    commit id: "대시보드 레이아웃"
    checkout main
    merge feature/auth id: "auth 병합"
    merge feature/dashboard id: "dashboard 병합"
    commit id: "v1.0 릴리즈" tag: "v1.0"`,
  },
  {
    id: 'mindmap',
    label: 'Mindmap',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>`,
    code: `mindmap
  root((프론트엔드))
    프레임워크
      Vue
        Pinia
        Vue Router
      React
        Redux
        Next.js
    스타일링
      CSS
        SCSS
        Tailwind
      CSS-in-JS
    빌드 도구
      Vite
      Webpack
    테스트
      Vitest
      Playwright`,
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="2" y1="12" x2="22" y2="12"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>`,
    code: `timeline
    title 웹 기술의 역사
    section 1990년대
        1991 : 월드 와이드 웹 탄생
        1995 : JavaScript 출시
        1996 : CSS 1.0 발표
    section 2000년대
        2005 : Ajax 부상
        2006 : jQuery 출시
        2009 : Node.js 출시
    section 2010년대
        2013 : React 공개
        2014 : Vue.js 출시
        2017 : WebAssembly 도입
    section 2020년대
        2020 : Vite 출시
        2022 : Turbopack 발표`,
  },
  {
    id: 'journey',
    label: 'Journey',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6c5 0 5 6 10 6s5-6 10-6"/></svg>`,
    code: `journey
    title 사용자 온보딩 여정
    section 방문
        랜딩 페이지 확인: 5: 방문자
        기능 살펴보기: 4: 방문자
    section 가입
        회원가입 폼 작성: 3: 방문자
        이메일 인증: 2: 방문자, 시스템
        프로필 설정: 4: 신규사용자
    section 활성화
        첫 프로젝트 생성: 5: 신규사용자
        팀원 초대: 4: 신규사용자
        첫 작업 완료: 5: 신규사용자, 팀원`,
  },
  {
    id: 'quadrant',
    label: 'Quadrant',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
    code: `quadrantChart
    title Feature Priority Matrix
    x-axis Easy --> Difficult
    y-axis Low Value --> High Value
    quadrant-1 Do First
    quadrant-2 Plan Ahead
    quadrant-3 Reconsider
    quadrant-4 Optional
    Dark Mode: [0.2, 0.8]
    Realtime Alert: [0.75, 0.9]
    Social Login: [0.3, 0.65]
    Multilingual: [0.6, 0.6]
    Offline Mode: [0.85, 0.5]
    Custom Theme: [0.4, 0.3]`,
  },
  {
    id: 'xychart',
    label: 'XY Chart',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 17 9 11 13 15 21 7"/><line x1="3" y1="21" x2="3" y2="3"/><line x1="3" y1="21" x2="21" y2="21"/></svg>`,
    code: `xychart-beta
    title "월별 매출 현황 (단위: 억원)"
    x-axis ["1월", "2월", "3월", "4월", "5월", "6월"]
    y-axis "매출" 0 --> 100
    bar [45, 52, 48, 61, 73, 68]
    line [45, 52, 48, 61, 73, 68]`,
  },
  {
    id: 'sankey',
    label: 'Sankey',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 5h6v14H2zM16 9h6v6h-6z"/><path d="M8 8c4 0 4 4 8 4M8 16c4 0 4-4 8-4"/></svg>`,
    code: `sankey-beta
    수입,생활비,40
    수입,저축,25
    수입,투자,20
    수입,여가,15
    생활비,식비,18
    생활비,주거비,15
    생활비,교통비,7
    저축,적금,15
    저축,비상금,10
    투자,주식,12
    투자,부동산,8`,
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="7" height="7" rx="1"/><rect x="15" y="3" width="7" height="7" rx="1"/><rect x="2" y="14" width="7" height="7" rx="1"/><rect x="15" y="14" width="7" height="7" rx="1"/><path d="M9 6.5h6M9 17.5h6M5.5 10v4M18.5 10v4"/></svg>`,
    code: `architecture-beta
    group api[API 서버]
    group db[데이터베이스]

    service client(internet)[클라이언트]
    service gateway(server)[API Gateway] in api
    service auth(server)[인증 서비스] in api
    service core(server)[핵심 서비스] in api
    service cache(disk)[Redis 캐시] in db
    service rdb(database)[PostgreSQL] in db

    client:R --> L:gateway
    gateway:R --> L:auth
    gateway:B --> T:core
    core:R --> L:cache
    core:B --> T:rdb`,
  },
]
