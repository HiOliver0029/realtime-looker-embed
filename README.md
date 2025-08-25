## 專案名稱

**Google Forms + Google Sheets + Looker Studio 即時分析系統**

## 專案簡介

本專案設計用來：

- 每週寄出不同的 **Google Form** 給專家填答。
- 將各週回覆自動彙整到一份 **總表（MasterResponses）**。
- 利用 **Looker Studio** 即時分析，並在網站上展示結果。
- 可依 **週次（WeekLabel）** 區分，快速查看不同週次的結果。

---

## 系統架構
flowchart TD
    A[Google Form 每週問卷] --> B[分表 Responses Sheet]
    B -->|App Script 自動同步| C[MasterResponses 總表]
    C --> D[Looker Studio 報表]
    D --> E[Next.js 網站嵌入]

## 功能特色

- 📩 **寄送問卷**：自動化寄信給 email list（專家名單）。
- 📊 **即時分析**：表單回覆自動更新到總表，Looker Studio 自動刷新。
- 📅 **週次區分**：自動計算週次，讓報表能依週次篩選。
- 🌍 **網站展示**：透過 Next.js 部署，任何人輸入網址即可查看最新結果。

---

## 環境需求

- Node.js 18+
- npm 或 pnpm
- Google 帳號（用於 Form / Sheet / Looker Studio / Apps Script）

---

## 安裝與部署

### 1. 安裝專案

```bash
git clone https://github.com/yourname/realtime-looker-embed.git
cd realtime-looker-embed
npm install

```

### 2. 啟動開發伺服器

```bash
npm run dev

```

瀏覽器開啟 [http://localhost:3000](http://localhost:3000/)。

### 3. 建置與部署

```bash
npm run build
npm start

```

可選擇部署到：

- Vercel（推薦，支援 Next.js 無痛部署）
- Netlify / Cloudflare Pages 亦可

目前我將網站部署在 Vercel，點擊 [此連結](https://realtime-looker-embed.vercel.app/) 可以看到目前專案圖表的範例。

## Google Sheets & Forms 設定

### 1. 建立總表

- 新建一份 Google Sheet：**MasterResponses**。
- 新增欄位：`Timestamp | 問題1 | 問題2 | ... | WeekLabel`

### 2. 每週新增分表

- 建立一份 Google Form。
- 點選「回覆」 → 「連結至新的試算表」（分表）。

### 3. Apps Script 自動同步

設定好總表的 **Apps Script**，自動同步各週分表到總表，並計算週次，這是總表的 App Script [連結](https://script.google.com/u/0/home/projects/1G6wt2IFBEaE33cWe8lPp-S5pXenQ9ou760MyBiAI3o-q0hBzDkeQ8Qxw/triggers)。

### 4. 設定觸發器

- 在 Apps Script → 點「鬧鐘」圖示（觸發器）。
- 新增觸發器：
    - 函式：`syncAllResponses`
    - 事件：時間驅動
    - 頻率：自訂

---

## Looker Studio 報表設定

1. 新建 Looker Studio 報表。
2. 資料來源 → 連接 **MasterResponses 總表**。
3. 插入圖表：
    - **Q1 統計**：長條圖，顯示各選項有多少人回答。
    - **加權信心值**：指標設定為該項「Q2 信心總分 ÷ 填答人數」，再畫長條圖。
4. 加入篩選器 → 新增維度 `Week`。

---

## 網站嵌入報表

在 `app/page.tsx` 裡嵌入 Looker Studio 報表：
```typescript
const LOOKER_STUDIO_EMBED_URL = "https://lookerstudio.google.com/embed/reporting/4f544129-1f6f-4a88-97ea-b7ee4aed6f54/page/pXfVF"; //需使用embed連結而非一般連結

export default function Page() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <iframesrc={LOOKER_STUDIO_EMBED_URL}
        width="100%"
        height="100%"
        allowFullScreen
      />
    </div>
  );
}
```


## 工讀生使用手冊

### 每週工作流程

1. **建立新問卷**
    - 用 Google Form 建立當週題目。
    - 連結新的試算表分表。
2. **更新分表清單**
    - 複製分表網址 → 從網址取得試算表 ID，例如 'https://docs.google.com/spreadsheets/d/16bkYdLw48e8R7UzbNxg3JTcbqmme2eD4nty4s3FSE50/edit?resourcekey=&gid=2001542632#gid=2001542632' 這個試算表的 ID 是 '16bkYdLw48e8R7UzbNxg3JTcbqmme2eD4nty4s3FSE50'。
    - 貼到總表的分表清單「FormList」工作表。
3. **寄信給專家**
    - 使用 Gmail + Apps Script，自動寄信給 EmailList 工作表清單上的郵件。已設定每周寄信，若更改清單從 google sheet 做刪減即可，若更改時間需從 Apps Script 的觸發條件改，[連結點此](https://script.google.com/u/0/home/projects/1G6wt2IFBEaE33cWe8lPp-S5pXenQ9ou760MyBiAI3o-q0hBzDkeQ8Qxw/triggers)。
    - 信件內包含 Google Form 連結。
4. **確認同步**
    - Apps Script 每隔一段時間會自動把分表資料同步到總表。
    - 若不同步，可手動執行總表 Apps Script的 `syncAllResponses()`。
5. **查看報表**
    - [點擊此連結](https://realtime-looker-embed.vercel.app/)可以看到經濟專家系統即時報表，點選手動刷新以確認看到的資料是最新。
5. **修改報表**
    - 打開 Looker Studio 報表。
    - 用「週次」篩選即可查看不同週次的數據。