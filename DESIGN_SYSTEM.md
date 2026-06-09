# PromptNote Design System

**Version:** 3.0**Theme:** Neutral Ink · Light Mode（shadcn/ui Neutral 灰色体系）**Base:** Pure Neutral Gray (色相 0°)　|　**Accent:** `#171717`**Last updated:** 2026-03-20

> 本文档是 PromptNote 项目的唯一设计真相源（Single Source of Truth），
> 涵盖 Design Tokens、排版系统、间距体系、组件规范和布局约定。
> CSS 变量定义在 `src/styles/global.css` 的 `:root` 中。

---

## 目录

1. [色阶参考](#1-色阶参考)
2. [颜色 Tokens](#2-颜色-tokens)
3. [排版系统](#3-排版系统)
4. [间距与尺寸](#4-间距与尺寸)
5. [圆角](#5-圆角)
6. [阴影 / 层级](#6-阴影--层级)
7. [布局体系](#7-布局体系)
8. [组件规范](#8-组件规范)
9. [动效规范](#9-动效规范)
10. [平台适配](#10-平台适配)
11. [设计原则](#11-设计原则)

---

## 1. 色阶参考

所有颜色 Token 均从 shadcn/ui Neutral 色板中取值：

| 色阶          | HEX         | 典型用途                          |
| ------------- | ----------- | --------------------------------- |
| **50**  | `#FAFAFA` | 侧边栏底色、on-primary 前景       |
| **100** | `#F5F5F5` | Secondary / Muted / Accent 背景   |
| **200** | `#E5E5E5` | 默认边框、输入框边框、active 背景 |
| **300** | `#D4D4D4` | 悬停态边框、强调边框              |
| **400** | `#A3A3A3` | 焦点环、占位符、禁用态            |
| **500** | `#737373` | 三级文字、辅助说明                |
| **600** | `#525252` | 次级图标                          |
| **700** | `#404040` | 二级文字                          |
| **800** | `#262626` | 主色悬停态                        |
| **900** | `#171717` | Primary 主色、默认图标            |
| **950** | `#0A0A0A` | 一级文字（Foreground）            |

---

## 2. 颜色 Tokens

### 2.1 Brand / Primary

| Token                     | Value       | 色阶 | 用途                      |
| ------------------------- | ----------- | ---- | ------------------------- |
| `--color-primary`       | `#171717` | 900  | 主色按钮、头像、强调元素  |
| `--color-primary-hover` | `#262626` | 800  | 主色悬停态                |
| `--color-primary-light` | `#F5F5F5` | 100  | 主色浅底                  |
| `--color-on-primary`    | `#FAFAFA` | 50   | 主色上前景色（文字/图标） |

### 2.2 Secondary / Accent

| Token                       | Value       | 色阶 | 用途                |
| --------------------------- | ----------- | ---- | ------------------- |
| `--color-secondary`       | `#F5F5F5` | 100  | 次要按钮 / 标签背景 |
| `--color-secondary-hover` | `#E5E5E5` | 200  | 次要悬停态          |
| `--color-on-secondary`    | `#171717` | 900  | 次要色前景          |
| `--color-accent`          | `#F5F5F5` | 100  | 强调行 / 选中行背景 |
| `--color-accent-hover`    | `#E5E5E5` | 200  | 强调行悬停态        |
| `--color-on-accent`       | `#171717` | 900  | 强调行前景          |

### 2.3 Surface / Background

| Token                   | Value       | 色阶  | 用途                      |
| ----------------------- | ----------- | ----- | ------------------------- |
| `--color-bg-page`     | `#FFFFFF` | white | 页面底色                  |
| `--color-bg-sidebar`  | `#FAFAFA` | 50    | 侧边栏背景                |
| `--color-bg-card`     | `#FFFFFF` | white | 卡片 / 弹窗 / 面板背景    |
| `--color-bg-elevated` | `#FFFFFF` | white | 浮层（popover、dropdown） |
| `--color-bg-muted`    | `#F5F5F5` | 100   | 弱化区域                  |
| `--color-bg-icon`     | `#F5F5F5` | 100   | 图标容器背景              |
| `--color-bg-hover`    | `#F5F5F5` | 100   | 通用悬停态背景            |
| `--color-bg-active`   | `#E5E5E5` | 200   | 通用选中 / 按下态背景     |

### 2.4 Typography Colors

| Token                        | Value       | 色阶 | 用途              |
| ---------------------------- | ----------- | ---- | ----------------- |
| `--color-text-primary`     | `#0A0A0A` | 950  | 标题 / 正文一级   |
| `--color-text-secondary`   | `#404040` | 700  | 副标题 / 正文二级 |
| `--color-text-tertiary`    | `#737373` | 500  | 描述 / 辅助说明   |
| `--color-text-placeholder` | `#A3A3A3` | 400  | 输入框占位符      |
| `--color-text-disabled`    | `#A3A3A3` | 400  | 禁用态文字        |

### 2.5 Iconography

| Token                      | Value       | 色阶 | 用途       |
| -------------------------- | ----------- | ---- | ---------- |
| `--color-icon-default`   | `#171717` | 900  | 默认图标   |
| `--color-icon-secondary` | `#525252` | 600  | 次级图标   |
| `--color-icon-disabled`  | `#A3A3A3` | 400  | 禁用态图标 |

### 2.6 Border / Divider

| Token                     | Value       | 色阶 | 用途       |
| ------------------------- | ----------- | ---- | ---------- |
| `--color-border`        | `#E5E5E5` | 200  | 默认边框   |
| `--color-border-light`  | `#F5F5F5` | 100  | 轻量分割线 |
| `--color-border-hover`  | `#D4D4D4` | 300  | 悬停态边框 |
| `--color-border-strong` | `#D4D4D4` | 300  | 强调边框   |
| `--color-input`         | `#E5E5E5` | 200  | 输入框边框 |
| `--color-ring`          | `#A3A3A3` | 400  | 焦点环颜色 |

### 2.7 Semantic / Status

| Token                      | Value       | 来源       | 用途              |
| -------------------------- | ----------- | ---------- | ----------------- |
| `--color-success`        | `#16A34A` | Green-600  | 成功 — 文字/图标 |
| `--color-success-bg`     | `#F0FDF4` | Green-50   | 成功 — 背景      |
| `--color-success-border` | `#BBF7D0` | Green-200  | 成功 — 边框      |
| `--color-danger`         | `#DC2626` | Red-600    | 危险 — 文字/图标 |
| `--color-danger-bg`      | `#FEF2F2` | Red-50     | 危险 — 背景      |
| `--color-danger-border`  | `#FECACA` | Red-200    | 危险 — 边框      |
| `--color-warning`        | `#CA8A04` | Yellow-600 | 警告 — 文字/图标 |
| `--color-warning-bg`     | `#FEFCE8` | Yellow-50  | 警告 — 背景      |
| `--color-warning-border` | `#FEF08A` | Yellow-200 | 警告 — 边框      |
| `--color-info`           | `#2563EB` | Blue-600   | 信息 — 文字/图标 |
| `--color-info-bg`        | `#EFF6FF` | Blue-50    | 信息 — 背景      |
| `--color-info-border`    | `#BFDBFE` | Blue-200   | 信息 — 边框      |

### 2.8 Sidebar 专属

| Token                                  | Value       | 用途              |
| -------------------------------------- | ----------- | ----------------- |
| `--color-sidebar`                    | `#FAFAFA` | 侧边栏背景        |
| `--color-sidebar-foreground`         | `#0A0A0A` | 侧边栏前景文字    |
| `--color-sidebar-primary`            | `#171717` | 侧边栏主色        |
| `--color-sidebar-primary-foreground` | `#FAFAFA` | 侧边栏主色前景    |
| `--color-sidebar-accent`             | `#F5F5F5` | 侧边栏悬停/高亮行 |
| `--color-sidebar-accent-foreground`  | `#171717` | 侧边栏高亮行文字  |
| `--color-sidebar-border`             | `#E5E5E5` | 侧边栏边框        |
| `--color-sidebar-ring`               | `#A3A3A3` | 侧边栏焦点环      |

---

## 3. 排版系统

### 3.1 字体族

| Token                     | Value                                                                                                                        | 用途        |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `--font-family`         | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif` | 正文 / UI   |
| `--font-family-display` | `'Outfit', var(--font-family)`                                                                                             | 品牌 / 展示 |
| `--font-family-mono`    | `'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace`                                                               | 代码 / 等宽 |

> 字体加载：通过 Google Fonts CDN 引入 Inter (400/500/600/700) 和 Outfit (500)。

### 3.2 字号等级

| 等级                | font-size | font-weight | line-height  | 使用场景                      |
| ------------------- | --------- | ----------- | ------------ | ----------------------------- |
| **Display**   | 24px      | 700         | 32px         | 页面标题（"我的提示词"）      |
| **Heading**   | 20px      | 600         | —           | 空态标题、弹窗标题            |
| **Title**     | 16px      | 600         | 24px         | 卡片标题                      |
| **Logo**      | 16px      | 700         | —           | 侧边栏品牌名                  |
| **Body**      | 14px      | 400         | 21px         | 正文                          |
| **Label**     | 14px      | 500         | 20px         | 按钮文字、导航项、标签页      |
| **Card Desc** | 13px      | 400         | 19.5px       | 卡片描述                      |
| **Small**     | 13px      | 500         | 20px         | 状态栏按钮、badge 文字        |
| **Caption**   | 11px      | 400–500    | 16.5px–20px | 标签胶囊、脚注、状态指示      |
| **Avatar**    | 20px      | 500         | 20px         | 侧边栏头像文字（Outfit 字体） |

### 3.3 字重规范

| Weight   | 值  | 用途               |
| -------- | --- | ------------------ |
| Regular  | 400 | 正文、描述、脚注   |
| Medium   | 500 | 按钮、导航项、标签 |
| Semibold | 600 | 卡片标题、空态标题 |
| Bold     | 700 | 页面大标题、品牌名 |

### 3.4 文本截断

| 模式           | CSS 属性                                                                      | 使用场景       |
| -------------- | ----------------------------------------------------------------------------- | -------------- |
| 单行省略       | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`            | 标题、导航标签 |
| 多行省略 (3行) | `display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical` | 卡片描述       |

---

## 4. 间距与尺寸

### 4.1 间距基准

项目使用 **4px 基准网格**，常用间距值如下：

| 值  | 像素 | 使用场景                                             |
| --- | ---- | ---------------------------------------------------- |
| 1   | 4px  | 图标间距、下拉菜单内边距、导航列表 gap               |
| 1.5 | 6px  | 按钮内图标-文字间距、标签页 gap                      |
| 2   | 8px  | 按钮组 gap、底部区域 gap                             |
| 2.5 | 10px | 标签 gap、页面标题图标-文字 gap                      |
| 3   | 12px | 导航项 gap、内容区 gap                               |
| 4   | 16px | 卡片网格 gap、按钮水平内边距                         |
| 5   | 20px | 卡片内边距、工具栏下间距、按钮大号内边距、侧边栏边距 |
| 6   | 24px | 页面标题下间距                                       |
| 8   | 32px | 底部留白                                             |
| 10  | 40px | 内容区底部 padding                                   |
| 20  | 80px | 内容区水平最小 padding                               |

### 4.2 固定尺寸

| 元素           | 宽度   | 高度 | 说明                       |
| -------------- | ------ | ---- | -------------------------- |
| 侧边栏（展开） | 240px  | 100% | 固定宽度                   |
| 侧边栏（折叠） | 68px   | 100% | 仅显示图标                 |
| 状态栏         | 100%   | 56px | 顶部固定高度               |
| Logo 行        | 100%   | 52px | 侧边栏顶部                 |
| 导航项         | 100%   | 40px | 侧边栏导航按钮             |
| 导航项（折叠） | 40px   | 40px | 正方形图标按钮             |
| 导航图标容器   | 28px   | —   | flex 居中，含图标          |
| 折叠按钮       | 28px   | 28px | 侧边栏折叠/展开切换        |
| 头像           | 28px   | 28px | 圆形，50% border-radius    |
| 卡片操作按钮   | 32px   | 32px | hover 显示的收藏/复制/更多 |
| 空态图标容器   | 80px   | 80px | 占位页图标容器             |
| 内容区最大宽度 | 1440px | —   | 居中约束                   |

### 4.3 响应式内容 Padding

```
padding: 0 max(80px, 5vw) 40px max(80px, 5vw)
```

| 窗口宽度  | 水平 padding | 说明           |
| --------- | ------------ | -------------- |
| ≤ 1600px | 80px         | 最小保底值     |
| > 1600px  | 5vw          | 随视口等比增长 |

---

## 5. 圆角

| Token             | Value      | 使用场景                               |
| ----------------- | ---------- | -------------------------------------- |
| `--radius-xs`   | `4px`    | 小元素（tag、badge 内部）              |
| `--radius-sm`   | `6px`    | 按钮、输入框                           |
| `--radius-md`   | `8px`    | 折叠按钮、状态栏按钮、操作按钮、下拉项 |
| `--radius-lg`   | `12px`   | 卡片、导航项、下拉菜单、用户区域       |
| `--radius-xl`   | `16px`   | 大型容器、空态图标包裹                 |
| `--radius-full` | `9999px` | 药丸按钮、圆形头像、标签页按钮         |

**约定：**

- 标签页按钮 / 主操作按钮 / 下载按钮：`20px`（接近 `--radius-full`）
- 标签胶囊：`14px`
- 头像：`50%`（纯圆）

---

## 6. 阴影 / 层级

| Token           | Value                                                                        | 使用场景           |
| --------------- | ---------------------------------------------------------------------------- | ------------------ |
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.05)`                                            | 卡片操作按钮默认态 |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)`   | 下拉菜单           |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)` | 卡片 hover、模态框 |

**卡片 hover 渐变叠加：**

```css
background: linear-gradient(135deg, rgba(0,0,0,0.05) 0%, transparent 50%, transparent 100%),
            var(--color-bg-card);
```

### z-index 层级

| 层级     | 值  | 元素     |
| -------- | --- | -------- |
| Base     | 0   | 页面内容 |
| Dropdown | 100 | 下拉菜单 |

---

## 7. 布局体系

### 7.1 整体布局

```
┌──────────────────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────────────────┐ │
│ │          │ │ StatusBar (h: 48px)             │ │
│ │ Sidebar  │ ├─────────────────────────────────┤ │
│ │ (w: 240) │ │                                 │ │
│ │          │ │    Content (scrollable)         │ │
│ │          │ │    ┌───────────────────────┐    │ │
│ │          │ │    │ contentInner          │    │ │
│ │          │ │    │ (max-w: 1440px)       │    │ │
│ │          │ │    │ (margin: 0 auto)      │    │ │
│ │          │ │    └───────────────────────┘    │ │
│ │          │ │                                 │ │
│ └──────────┘ └─────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

- **容器**：`display: flex`，全屏高度
- **侧边栏**：固定宽度，`flex-shrink: 0`，右侧 `1px solid --color-border-light`
- **主区域**：`flex: 1`，纵向 flex 分为 StatusBar + Content
- **Content**：`overflow: auto`，`scrollbar-gutter: stable`（防止切换页面时滚动条消失抖动），内部 `contentInner` 居中，限宽 1440px

### 7.2 卡片网格

```css
display: grid;
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
gap: 16px;
```

| 属性     | 值                          | 说明                     |
| -------- | --------------------------- | ------------------------ |
| 最小列宽 | 280px                       | 卡片不会比这更窄         |
| 最大列宽 | 1fr（CSS max-width: 480px） | 弹性分配，卡片最宽 480px |
| 间距     | 16px                        | 卡片之间的水平和垂直间距 |

### 7.3 侧边栏内部结构

```
┌────────────────────────────┐
│ Logo Row (h: 52px)         │  padding: 0 12px 0 28px
├────────────────────────────┤
│ Nav List                   │  padding: 4px 12px, gap: 4px
│   ├─ Nav Item (h: 40px)   │  padding: 0 16px, gap: 12px
│   ├─ Nav Item              │
│   └─ Nav Item              │
├────────────────────────────┤
│ Bottom Section             │  padding: 8px 12px 12px, gap: 8px
│   └─ User Section (h: 40) │  padding: 0 16px, gap: 12px
└────────────────────────────┘
```

---

## 8. 组件规范

### 8.1 按钮

#### 主按钮（Primary）

| 属性        | 值                        |
| ----------- | ------------------------- |
| background  | `--color-primary`       |
| color       | `--color-on-primary`    |
| hover       | `--color-primary-hover` |
| padding     | `10px 20px`             |
| border      | none                      |
| radius      | `20px`                  |
| font-size   | 14px                      |
| font-weight | 500                       |

#### 标签页按钮（Tab）

| 属性           | 值                                                                  |
| -------------- | ------------------------------------------------------------------- |
| background     | `--color-bg-card`（默认）/ `--color-bg-sidebar`（active/hover） |
| border         | `1px solid --color-border`                                        |
| padding        | `10px 16px`                                                       |
| radius         | `20px`                                                            |
| font-size      | 14px                                                                |
| active weight  | 600                                                                 |
| default weight | 400                                                                 |

#### 状态栏按钮（Small）

| 属性        | 值                    |
| ----------- | --------------------- |
| padding     | `4px 10px`          |
| radius      | `--radius-md` (8px) |
| font-size   | 12px                  |
| font-weight | 500                   |

#### 下载桌面端按钮（Pill）

| 属性        | 值                                                  |
| ----------- | --------------------------------------------------- |
| padding     | `6px 16px`                                        |
| border      | `1px solid --color-border`                        |
| radius      | `--radius-full`                                   |
| background  | `--color-bg-muted` → hover `--color-bg-active` |
| font-size   | 13px                                                |
| font-weight | 500                                                 |

### 8.2 提示词卡片

```
┌──────────────────────────────────────┐
│                    [❤️] [📋] [···]  │  ← hover 时显示操作按钮
│  Card Title (16px/600)               │
│                                      │
│  Description text that can span      │  ← 13px, --color-text-tertiary
│  up to three lines before being      │
│  truncated with ellipsis...          │
│                                      │
│  #标签1  #标签2  #标签3              │  ← marginTop: auto (底部对齐)
└──────────────────────────────────────┘
```

| 属性          | 值                                                        |
| ------------- | --------------------------------------------------------- |
| padding       | 20px                                                      |
| border        | `1px solid --color-border`                              |
| border-radius | `--radius-lg` (12px)                                    |
| background    | `--color-bg-card`                                       |
| gap (内部)    | 12px                                                      |
| min-width     | 280px                                                     |
| max-width     | 480px                                                     |
| hover border  | `--color-border-hover`                                  |
| hover shadow  | `--shadow-lg`                                           |
| hover bg      | 135° 渐变叠加                                            |
| transition    | `box-shadow 0.25s, border-color 0.25s, background 0.3s` |

#### 操作按钮（hover 时显示）

| 属性       | 值                                                          |
| ---------- | ----------------------------------------------------------- |
| 尺寸       | 32px × 32px                                                |
| border     | `1px solid --color-border`                                |
| background | `--color-bg-card`                                         |
| radius     | `--radius-md` (8px)                                       |
| shadow     | `--shadow-sm`                                             |
| icon color | `--color-text-tertiary` → hover `--color-text-primary` |
| 出现动画   | `opacity 0.18s ease`                                      |

#### 标签胶囊

| 属性        | 值                        |
| ----------- | ------------------------- |
| font-size   | 11px                      |
| font-weight | 400                       |
| line-height | 16.5px                    |
| color       | `--color-text-tertiary` |
| background  | `--color-secondary`     |
| padding     | `1px 6px`               |
| radius      | 14px                      |

### 8.3 下拉菜单

| 属性       | 值                                |
| ---------- | --------------------------------- |
| background | `--color-bg-elevated`           |
| border     | `1px solid --color-border`      |
| radius     | `--radius-lg` (12px)            |
| shadow     | `--shadow-md`                   |
| padding    | 4px                               |
| min-width  | 140px                             |
| z-index    | 100                               |
| offset     | `calc(100% + 6px)` from trigger |

#### 下拉项

| 属性       | 值                        |
| ---------- | ------------------------- |
| padding    | `8px 12px`              |
| radius     | 8px                       |
| gap        | 8px                       |
| hover bg   | `--color-bg-muted`      |
| active bg  | `--color-bg-hover`      |
| transition | `background 0.12s ease` |

### 8.4 侧边栏导航项

| 状态 | background            | font-weight | color                      |
| ---- | --------------------- | ----------- | -------------------------- |
| 默认 | transparent           | 500         | `--color-text-secondary` |
| 悬停 | `--color-bg-hover`  | 500         | `--color-text-secondary` |
| 选中 | `--color-bg-active` | 500         | `--color-text-secondary` |

### 8.5 空态占位

| 元素     | 样式                                               |
| -------- | -------------------------------------------------- |
| 图标容器 | 80px × 80px,`--radius-xl`, `--color-bg-muted` |
| 标题     | 20px/600,`--color-text-primary`, max-w 300px     |
| 副标题   | 14px,`--color-text-tertiary`                     |
| Badge    | 13px/500,`--radius-full`, `--color-bg-muted`   |

### 8.6 提示词详情页

```
┌──────────────────────────────────────────────────────────┐
│ [← 返回]                            [❤️] [✏️] [🗑️]    │  ← 顶部导航栏
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Prompt Title (24px/700)                                 │
│                                                          │
│  Description body text (14px/400)                        │  ← --color-text-secondary
│                                                          │
│  #标签1  #标签2  #标签3                                    │
│                                                          │
│  📅 创建于 2026-03-10    🕐 更新于 3 天前                   │  ← 元信息
│                                                          │
│  ──────────────────── 分隔线 ─────────────────────────    │
│                                                          │
│  提示词内容 (16px/600)                    [ 📋 复制 ]   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │  提示词完整内容（pre-wrap 排版）                       │  │  ← Muted 背景块
│  │  14px/400, --color-text-primary                    │  │
│  │  line-height: 24px                                 │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| 区域         | 属性                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------- |
| 容器最大宽度 | 800px                                                                                     |
| 顶部栏       | flex, space-between, margin-bottom: 24px                                                  |
| 返回按钮     | 6px 12px,`--radius-md`, 14px/500                                                        |
| 操作按钮     | 36px × 36px,`--radius-md`                                                              |
| 标题         | Display 级 — 24px/700,`--color-text-primary`                                           |
| 描述         | Body 级 — 14px/400,`--color-text-secondary`                                            |
| 元信息       | 13px/400,`--color-text-placeholder`, gap: 16px                                          |
| 分隔线       | 1px,`--color-border`, margin: 24px 0                                                    |
| 内容区标题   | Title 级 — 16px/600                                                                      |
| 复制按钮     | 6px 14px,`--radius-full`, `--color-bg-muted`, 13px/500                                |
| 内容块       | `--color-bg-sidebar`(#FAFAFA), `--radius-lg`, `--color-border-light`, padding: 24px |
| 内容文字     | 14px/400, line-height: 24px, pre-wrap,`--font-family`                                   |

#### 操作按钮状态

| 按钮   | 默认                   | 悬停                  |
| ------ | ---------------------- | --------------------- |
| 返回   | transparent            | `--color-bg-hover`  |
| 收藏   | transparent            | `--color-bg-hover`  |
| 编辑   | transparent            | `--color-bg-hover`  |
| 删除   | transparent            | `--color-danger-bg` |
| 复制   | `--color-bg-muted`   | `--color-bg-active` |
| 已复制 | `--color-success-bg` | —                    |

---

## 9. 动效规范

| 场景            | 属性                     | 时长  | 缓动函数                         |
| --------------- | ------------------------ | ----- | -------------------------------- |
| 按钮悬停        | background, border-color | 0.15s | `ease`                         |
| 卡片悬停        | box-shadow, border-color | 0.25s | `ease`                         |
| 卡片背景渐变    | background               | 0.3s  | `ease`                         |
| 操作按钮出现    | opacity                  | 0.18s | `ease`                         |
| 下拉项悬停      | background               | 0.12s | `ease`                         |
| 侧边栏折叠/展开 | width, padding           | 0.25s | `cubic-bezier(0.4, 0, 0.2, 1)` |
| 图标旋转        | transform                | 0.2s  | `ease`                         |
| Chevron 旋转    | transform                | 0.2s  | `ease`                         |

---

## 10. 平台适配

PromptNote 通过 `PlatformProvider` 上下文自动检测运行平台：

| 特性           | Web 端             | Desktop 端 (Electron)                 |
| -------------- | ------------------ | ------------------------------------- |
| 标题栏         | 无                 | `hiddenInset` + 红绿灯按钮          |
| 窗口拖拽区域   | 无                 | `.drag-region` (-webkit-app-region) |
| StatusBar 内容 | 「下载桌面端」按钮 | 「新版本」+「问题反馈」               |
| 路由模式       | HashRouter         | HashRouter (file:// 兼容)             |

---

## 11. 设计原则

1. **纯灰无偏色**：所有灰阶色相均为 0°（纯 Neutral），保持专业中性感
2. **阶梯均匀**：严格基于 shadcn/ui Neutral 50–950 色阶取值，层级过渡自然
3. **语义化分层**：Primary → Secondary → Accent → Muted 四层语义，覆盖所有组件场景
4. **轻量阴影**：阴影 opacity 保持低值，营造轻盈通透的视觉层次
5. **收敛圆角**：默认圆角 8px，整体克制精致
6. **4px 网格**：所有间距基于 4px 倍数，保持视觉节奏统一
7. **渐显交互**：操作按钮 hover 渐显，不干扰阅读态
8. **平台自适应**：通过 PlatformProvider 实现同一套组件在 Web/Desktop 端差异化呈现

---

## 附录：完整 CSS 变量

```css
:root {
  /* ── Brand / Primary ─────────────────────────────────────────── */
  --color-primary:            #171717;
  --color-primary-hover:      #262626;
  --color-primary-light:      #F5F5F5;
  --color-on-primary:         #FAFAFA;

  /* ── Secondary / Accent ──────────────────────────────────────── */
  --color-secondary:          #F5F5F5;
  --color-secondary-hover:    #E5E5E5;
  --color-on-secondary:       #171717;
  --color-accent:             #F5F5F5;
  --color-accent-hover:       #E5E5E5;
  --color-on-accent:          #171717;

  /* ── Surface / Background ────────────────────────────────────── */
  --color-bg-page:            #FFFFFF;
  --color-bg-sidebar:         #FAFAFA;
  --color-bg-card:            #FFFFFF;
  --color-bg-elevated:        #FFFFFF;
  --color-bg-muted:           #F5F5F5;
  --color-bg-icon:            #F5F5F5;
  --color-bg-hover:           #F5F5F5;
  --color-bg-active:          #E5E5E5;

  /* ── Typography ──────────────────────────────────────────────── */
  --color-text-primary:       #0A0A0A;
  --color-text-secondary:     #404040;
  --color-text-tertiary:      #737373;
  --color-text-placeholder:   #A3A3A3;
  --color-text-disabled:      #A3A3A3;

  /* ── Iconography ─────────────────────────────────────────────── */
  --color-icon-default:       #171717;
  --color-icon-secondary:     #525252;
  --color-icon-disabled:      #A3A3A3;

  /* ── Border / Divider ────────────────────────────────────────── */
  --color-border:             #E5E5E5;
  --color-border-light:       #F5F5F5;
  --color-border-hover:       #D4D4D4;
  --color-border-strong:      #D4D4D4;
  --color-input:              #E5E5E5;
  --color-ring:               #A3A3A3;

  /* ── Elevation / Shadow ──────────────────────────────────────── */
  --shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.08),
                0 2px 4px -2px rgba(0, 0, 0, 0.06);
  --shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.08),
                0 4px 6px -4px rgba(0, 0, 0, 0.04);

  /* ── Semantic / Status ───────────────────────────────────────── */
  --color-success:            #16A34A;
  --color-success-bg:         #F0FDF4;
  --color-success-border:     #BBF7D0;
  --color-danger:             #DC2626;
  --color-danger-bg:          #FEF2F2;
  --color-danger-border:      #FECACA;
  --color-warning:            #CA8A04;
  --color-warning-bg:         #FEFCE8;
  --color-warning-border:     #FEF08A;
  --color-info:               #2563EB;
  --color-info-bg:            #EFF6FF;
  --color-info-border:        #BFDBFE;

  /* ── Radius ──────────────────────────────────────────────────── */
  --radius-xs:    4px;
  --radius-sm:    6px;
  --radius-md:    8px;
  --radius-lg:    12px;
  --radius-xl:    16px;
  --radius-full:  9999px;

  /* ── Typography / Font ───────────────────────────────────────── */
  --font-family:         'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
                         'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  --font-family-display: 'Outfit', var(--font-family);
  --font-family-mono:    'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace;

  /* ── Sidebar ─────────────────────────────────────────────────── */
  --color-sidebar:                    #FAFAFA;
  --color-sidebar-foreground:         #0A0A0A;
  --color-sidebar-primary:            #171717;
  --color-sidebar-primary-foreground: #FAFAFA;
  --color-sidebar-accent:             #F5F5F5;
  --color-sidebar-accent-foreground:  #171717;
  --color-sidebar-border:             #E5E5E5;
  --color-sidebar-ring:               #A3A3A3;
}
```
