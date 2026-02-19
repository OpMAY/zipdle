# Zipdle 작업 환경 이전 가이드

## 프로젝트 개요

**Zipdle**: 밴드 합주, 곡 관리, 일정 조율을 위한 올인원 대시보드 웹 애플리케이션.

## 기술 스택

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Mobile-first responsive design)
- **State Management**: Zustand (예정)
- **Database**: Vercel Postgres (예정, 현재 Mock Data 사용 설계 단계)
- **UI Components**: Shadcn UI (필요시 도입 가능), Lucide React (Icons)

## 현재 진행 상황

- [x] 기본 페이지 구조 생성 (`/members`, `/repertoire`, `/schedule`, 등)
- [x] `globals.css` 및 `page.tsx` 정리 완료
- [ ] UI 및 데이터 설계 (Mock Data) 진행 중
  - `Member` 타입 정의 (`parts` enum 배열 적용) 등 데이터 구조 설계 완료

## 새 PC 환경 설정 및 작업 재개 방법

### 1. 저장소 클론 및 패키지 설치

```bash
git clone <repository-url>
cd zipdle
npm install
```

### 2. .env 설정 (필요시)

현재는 Mock Data 단계이므로 특별한 환경 변수가 필요 없으나, 추후 Vercel Postgres 연동 시 `.env.local` 설정이 필요할 수 있습니다.

### 3. AI 어시스턴트(Antigravity) 프롬프트

새로운 환경에서 AI에게 현재 상황을 인식시키고 작업을 이어가기 위해 아래 프롬프트를 입력하세요.

---

**[복사해서 사용하세요]**

```text
현재 Zipdle이라는 밴드 매니지먼트 웹 앱을 개발 중이야.
Next.js (App Router), TypeScript, Tailwind CSS를 사용하고 있어.

[현재 상태]
- 기본 페이지 라우팅(/members, /repertoire 등)은 구현되어 있어.
- Mock Data를 이용한 UI 구현 단계에 진입하려고 해.
- Member 데이터 구조는 'instrument' 대신 'parts' (Enum 배열)를 사용하기로 결정했어.
- 모바일 우선 반응형 디자인을 중요하게 생각하고 있어.

[할 일]
1. `src/lib/definitions.ts`에 데이터 타입 정의 (Member, Song, Schedule 등).
2. `src/lib/placeholder-data.ts`에 Mock Data 생성.
3. 각 페이지별 UI 구현 시작.

이전 대화 내용을 바탕으로 작업을 계속 진행해줘.
```

---
