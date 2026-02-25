# 🎨 Style Guide — LearningFE

> File này ghi lại các quy tắc về phong cách code và thiết kế UI.
> Khi bắt đầu đoạn chat mới hoặc dùng AI khác, hãy đọc file này trước.
> Nếu trong quá trình code, có bất kì yêu cầu nào làm ảnh hưởng, định hình đến việc code thì lưu lại vào đây
> **Cập nhật lần cuối**: 2026-02-23

---

## 1. Quy tắc màu sắc

### Color Theory: Complementary

Sử dụng **bảng màu đối xứng (Complementary)** — hai màu đối diện trên vòng tròn màu.

- **Primary**: Violet (`#7c3aed` / violet-600)
- **Complementary**: Amber/Gold (`#f59e0b` / amber-500)

### Quy tắc áp dụng

- **KHÔNG dùng gradient** cho background chính hoặc button. Dùng màu solid.
- Primary dùng cho: buttons, links, active states, badges
- Complementary dùng cho: highlights, accents, decorations, icons nổi bật
- Neutral: gray scale cho text, borders, backgrounds

### Glassmorphism

Áp dụng hiệu ứng **kính mờ (frosted glass)** cho các card và panel:

```
bg-white/50 backdrop-blur-xl border border-white/50 shadow-xl
```

- Card/panel nền bán trong suốt + `backdrop-blur`
- Phía sau cần có **color blobs** (`bg-primary/5`, `bg-accent/10`, `blur-3xl`) để hiệu ứng rõ
- Dùng cho: form cards, feature cards, illustration wrapper
- **KHÔNG dùng** cho footer, navbar (navbar dùng `bg-white/80 backdrop-blur-lg` khi scroll)

### Hover Animation

- **KHÔNG dùng `hover:scale`** cho button hay element khi hover. Thay vào đó dùng:
  - `hover:shadow-md` / `hover:shadow-sm` — thêm bóng nhẹ
  - `active:brightness-95` — tối nhẹ khi nhấn
  - `hover:bg-...` / `hover:text-...` — đổi màu nền/chữ
  - `group-hover:rotate-3` — xoay nhẹ cho icon decorative

### CSS Variables

Tất cả màu được định nghĩa tại `src/index.css` dưới dạng CSS variables theo chuẩn shadcn/ui.

---

## 2. Quy tắc layout

### Bento Box Layout

Homepage sử dụng **Bento Box layout** (inspirated by Apple, Linear):

- Grid bất đối xứng (asymmetric grid)
- Các card/box có kích thước khác nhau (span 1 hoặc 2 cột/hàng)
- Tạo cảm giác hiện đại, không nhàm chán
- Mỗi box là một "feature" hoặc "content block" độc lập

### Grid chuẩn

- Desktop: `grid-cols-3` hoặc `grid-cols-4`
- Tablet: `grid-cols-2`
- Mobile: `grid-cols-1`

---

## 3. Quy tắc component

### shadcn/ui

- **BẮT BUỘC** ưu tiên dùng component từ shadcn/ui thay vì tự code HTML.
- Cài component mới: `npx shadcn@latest add <component-name>`
- Style: `new-york`, Icon library: `lucide-react`

### Naming

- Components: PascalCase (`HeroSection.tsx`)
- Constants/data: UPPER_SNAKE_CASE (`HERO_CONTENT`)
- Files: camelCase hoặc PascalCase theo convention React

### Data tách riêng

- Toàn bộ text/data cho mỗi trang nằm trong `src/constants/`
- Component chỉ render, không hardcode text

---

## 4. Ngôn ngữ UI

- Giao diện mặc định: **Tiếng Việt**
- Labels, placeholders, error messages, toast đều bằng tiếng Việt
- Chưa cần i18n

---

## 5. Auth / Security

- Access token lưu **in-memory** (Zustand), KHÔNG lưu localStorage
- Refresh token qua **HttpOnly cookie**
- Interceptor tự refresh khi 401

---

## 6. Tổng kết quy tắc

| Hạng mục   | Quy tắc                                        |
| ---------- | ---------------------------------------------- |
| Màu sắc    | Complementary (Violet + Amber), KHÔNG gradient |
| Background | Glassmorphism (frosted glass + color blobs)    |
| Layout     | Bento Box (grid bất đối xứng)                  |
| Components | Ưu tiên shadcn/ui                              |
| Text/Data  | Tách vào `src/constants/`                      |
| Ngôn ngữ   | Tiếng Việt                                     |
| Token      | In-memory + HttpOnly cookie                    |
