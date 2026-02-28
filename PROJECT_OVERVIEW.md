# 📘 LearningFE — Project Overview

> **Mục đích**: File tham chiếu nhanh cho AI hoặc developer mới. Đọc file này thay vì phải scan toàn bộ project.
>
> **Cập nhật lần cuối**: 2026-02-28

---

## 1. Tech Stack

| Category   | Tech                                  | Version            |
| ---------- | ------------------------------------- | ------------------ |
| Framework  | React                                 | 19.2               |
| Build tool | Vite                                  | 7.3                |
| Language   | TypeScript                            | 5.9                |
| Styling    | TailwindCSS v4 (Vite plugin)          | 4.1                |
| UI Library | shadcn/ui (new-york style)            | via `radix-ui` 1.4 |
| Icons      | @phosphor-icons/react                 | 2.x                |
| Routing    | react-router                          | 7.13               |
| State      | Zustand                               | 5.0                |
| HTTP       | Axios                                 | 1.13               |
| Forms      | react-hook-form + @hookform/resolvers | 7.71 / 5.2         |
| Validation | Zod v4                                | 4.3                |
| Toasts     | Sonner                                | 2.0                |

---

## 2. Project Structure

```
LearningFE/
├── index.html                # Vite entry HTML
├── vite.config.ts            # Vite + TailwindCSS plugin + path alias @/
├── tsconfig.app.json         # TS config — strict, paths: @/* → ./src/*
├── components.json           # shadcn config — new-york, phosphor, aliases
├── package.json
│
└── src/
    ├── main.tsx              # React root render (StrictMode)
    ├── App.tsx               # BrowserRouter, Routes, Toaster, auth init
    ├── index.css             # TailwindCSS imports, CSS variables (Midnight Blue & Ice Gray theme)
    │
    ├── components/
    │   ├── ui/               # shadcn components (button, input, label, card, form)
    │   ├── auth/
    │   │   ├── LoginForm.tsx
    │   │   └── RegisterForm.tsx
    │   ├── layout/
    │   │   ├── Navbar.tsx          # Landing page navbar (sticky, blur-on-scroll)
    │   │   ├── ProtectedRoute.tsx  # Redirect to /login if not auth'd
    │   │   └── GuestRoute.tsx      # Redirect to /dashboard if auth'd
    │   └── illustrations/
    │       └── StudyIllustration.tsx  # SVG illustration (multi-language theme)
    │
    ├── pages/
    │   ├── HomePage.tsx       # Landing page (hero, features, how-it-works, CTA, footer)
    │   ├── LoginPage.tsx      # Split layout: illustration + form
    │   ├── RegisterPage.tsx   # Split layout: illustration + form
    │   └── DashboardPage.tsx  # [Placeholder — chưa implement]
    │
    ├── services/
    │   ├── api.ts             # Axios instance (baseURL, withCredentials)
    │   ├── authService.ts     # Auth API calls (login, register, refresh, logout)
    │   └── setupInterceptors.ts  # Request/response interceptors + token refresh queue
    │
    ├── stores/
    │   └── authStore.ts       # Zustand auth state (token in-memory, init, login, logout)
    │
    ├── types/
    │   ├── api.ts             # ApiResponse<T>, error codes → Vietnamese messages
    │   └── auth.ts            # LoginRequest, RegisterRequest, AuthDTO
    │
    └── lib/
        ├── utils.ts           # cn() — clsx + tailwind-merge
        └── validations/
            └── auth.ts        # Zod schemas for login & register forms
```

---

## 3. Configuration Chi Tiết

### Vite (`vite.config.ts`)

- Plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`
- Path alias: `@/` → `./src/`

### TypeScript (`tsconfig.app.json`)

- Target: ES2022, Module: ESNext, JSX: react-jsx
- Strict mode ON (`noUnusedLocals`, `noUnusedParameters`)
- Path mapping: `@/*` → `./src/*`

### shadcn (`components.json`)

- Style: `new-york`
- RSC: `false` (client-side React)
- Icon library: `@phosphor-icons/react`
- UI components path: `@/components/ui`
- Cài thêm component: `npx shadcn@latest add <component-name>`

### CSS Theme (`index.css`)

- Color scheme: **Midnight Blue & Ice Gray**
- Primary: `oklch(0.25 0.11 264)` ≈ `#191970` (Midnight Blue)
- Accent: `oklch(0.94 0.005 250)` ≈ `#ECEFF1` (Ice Gray / Blue Gray 50)
- CSS variables theo chuẩn shadcn + semantic theme tokens (vocabulary, grammar, highlight)
- Dark mode variables đã có nhưng chưa kích hoạt

---

## 4. Architecture Patterns

### API Layer

```
Component → authStore (Zustand) → authService → api (Axios) → Backend
```

- **`api.ts`**: Base Axios instance, `withCredentials: true` để gửi HttpOnly cookies
- **`authService.ts`**: Pure HTTP calls, không có business logic
- **`setupInterceptors.ts`**:
  - **Request**: Tự gắn `Authorization: Bearer {token}` header
  - **Response**: Bắt 401 → refresh token → retry request
  - Dùng **queue pattern**: nhiều request 401 cùng lúc → chỉ 1 refresh call

### State Management

- **Zustand** (không cần Provider wrapper)
- `accessToken` lưu **in-memory** (mất khi refresh page → gọi `/auth/refresh` để restore)
- `isInitialized` flag ngăn UI flicker khi đang check session

### Auth Flow

1. App mount → `initialize()` → `POST /auth/refresh` (cookie) → set token
2. Login → `POST /auth/login` → nhận accessToken (**response body**), refreshToken (**HttpOnly cookie**)
3. 401 response → interceptor refresh → retry
4. Logout → `POST /auth/logout` → clear token + cookie

### Form Validation

- Schemas centralized tại `lib/validations/auth.ts`
- Sử dụng **Zod v4** + `zodResolver` (auto-detected by `@hookform/resolvers` v5)
- Error messages bằng **tiếng Việt**

### Error Handling

- Backend trả `message` field chứa error code (vd: `"Invalid_400"`)
- Map tại `types/api.ts` → `ERROR_MESSAGES` → Vietnamese user-facing string
- Components catch error và hiện toast qua Sonner

### Route Protection

- `GuestRoute`: chưa đăng nhập → cho vào, đã đăng nhập → redirect `/dashboard`
- `ProtectedRoute`: đã đăng nhập → cho vào, chưa → redirect `/login`
- Cả hai đều show loading spinner trong khi `isInitialized === false`

---

## 5. Backend API

- **Base URL**: `http://localhost:5246`
- **Auth endpoints**:
  - `POST /auth/login` → `ApiResponse<AuthDTO>`
  - `POST /auth/register` → `ApiResponse<boolean>`
  - `POST /auth/refresh` → `ApiResponse<AuthDTO>` (dùng HttpOnly cookie)
  - `POST /auth/logout` → `ApiResponse<boolean>`
  - `POST /auth/forget-password?email=...` → `ApiResponse<boolean>`

### API Response Format

```json
{
  "code": 200,
  "success": true/false,
  "message": "Error_Code_Here" | null,
  "data": <T>,
  "metaData": { "total": N, "page": N, "pageSize": N } | null
}
```

### Error Codes (backend trả về)

| Code                | Vietnamese message             |
| ------------------- | ------------------------------ |
| `Common_404`        | Không tìm thấy dữ liệu         |
| `Common_400`        | Dữ liệu không hợp lệ           |
| `Common_401`        | Phiên đăng nhập đã hết hạn     |
| `Common_405`        | Không có quyền thực hiện       |
| `Common_505`        | Lỗi server                     |
| `Invalid_400`       | Email hoặc mật khẩu không đúng |
| `Email_Exist_409`   | Email đã được sử dụng          |
| `Token_Expried_409` | Phiên đăng nhập hết hạn        |

---

## 6. UI / Design Conventions

- **Ngôn ngữ UI**: Tiếng Việt (labels, placeholders, errors, toast messages)
- **Color theme**: Midnight Blue & Ice Gray (xem section 3)
- **Auth pages**: Split-screen layout (illustration bên trái, form bên phải)
- **Homepage**: Landing page với Hero, Features grid, How-it-works, CTA banner, Footer
- **Component library**: shadcn/ui — cài qua `npx shadcn@latest add <name>`
- **Icons**: @phosphor-icons/react
- **Class names**: Tailwind utility classes, cn() helper để merge conditionally

---

## 7. Scripts

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc -b && vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```

---

## 8. Những Gì Chưa Implement (TODO)

- [ ] Dashboard page (hiện chỉ là placeholder)
- [ ] Deck management (CRUD bộ thẻ)
- [ ] Card management (CRUD thẻ trong bộ thẻ)
- [ ] Study/Review session (flashcard flip, SRS)
- [ ] User settings / profile
- [ ] Dark mode toggle
- [ ] Responsive testing toàn diện
- [ ] i18n (nếu cần hỗ trợ đa ngôn ngữ UI)
