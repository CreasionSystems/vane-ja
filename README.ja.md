# Vane 日本語版

[Vane](https://github.com/ItzCrazyKns/Vane)（旧 Perplexica。自分のマシンで動かせる AI 回答エンジン）を、日本語で使いやすいように改変した**非公式フォーク**です。CreasionSystems が保守しています。本家プロジェクトとは無関係で、本家の承認を受けたものではありません。

## 本家との違い

設定 → 基本設定 →「言語」（English / 日本語）の1つの設定で、次の3つをまとめて切り替えます。

| 項目 | 内容 |
|---|---|
| 画面 | すべての画面を日本語で表示します。ブラウザのタブ名、日付や「5 分前」などの相対時刻、天気・株価ウィジェットも含みます |
| 回答 | 日本語設定のときは、検索結果が英語でも日本語で回答します。固有名詞、コード、引用番号 `[1]` は原形のまま残します |
| 検索 | ウェブ検索で SearXNG に `language=ja` を渡し、日本語のソースが上位に来やすくします。検索クエリは「日本ローカルの話題は日本語、国際的な技術の話題は英語」で書くよう指示します。学術（arXiv など）とソーシャル（Reddit）は英語圏のソースが中心なので、あえて言語で絞っていません |
| Discover | 日本語設定では ITmedia、日経、美術手帖、日刊スポーツ、ナタリーなど国内のソースを使います |

英語設定のときは、プロンプトに言語の指示を一切足さないので、本家と同じ動作になります。

## 本家から直した不具合

- **Docker イメージが起動直後に落ちる問題**: 本家の Dockerfile は実行ステージで `yarn add playwright` を実行し、lockfile を無視して Next.js を最新版に上げていました。ビルド時の Next.js と実行時の Next.js がずれ、起動時に `Cannot read properties of undefined (reading 'validationLevel')` で落ちます。ビルドステージの `node_modules` をそのままコピーするよう修正しました
- **SearXNG の秘密鍵が公開済みの固定値だった問題**: 本家の `searxng/settings.yml` には `secret_key` の固定値が書かれています。さらに SearXNG は `sudo` で起動するため、`SEARXNG_SECRET` を設定しても SearXNG に届きませんでした。コンテナの起動時に `SEARXNG_SECRET`（未設定ならランダムな値）を設定ファイルへ書き込むよう修正しました

## 使い方（Docker）

```bash
docker compose up -d --build
```

http://localhost:3000 を開き、初回セットアップで AI プロバイダの接続とモデルを設定します。そのあと、設定 → 基本設定 →「言語」で日本語を選びます。

AI プロバイダは本家と同じく、OpenAI、Anthropic、Gemini、Groq、Ollama、LM Studio などに対応しています。日本語での検索精度を上げるには、埋め込みモデルに多言語対応のもの（Gemini の埋め込みモデルなど）を選んでください。英語中心の埋め込みモデルでは、日本語の検索結果が関連度の足切りで落ちやすくなります。

### 環境変数

| 変数 | 説明 |
|---|---|
| `SEARXNG_SECRET` | 任意。同梱の SearXNG の秘密鍵です。英数字・`_`・`-` のみ使えます。未設定ならコンテナの起動ごとにランダムな値を使います |

## 制限事項

- 初回セットアップ画面は英語です。言語の設定は、セットアップ完了後に設定画面から変更できます
- PDF への書き出しでは日本語が表示されません。PDF 生成ライブラリ（jsPDF）の内蔵フォントが欧文のみのためです。Markdown への書き出しは日本語に対応しています
- AI プロバイダの接続設定にある項目の説明文（「Your OpenAI API key」など）は、プロバイダ名を含むため英語のままです

## 本家の更新を取り込む

```bash
git remote add upstream https://github.com/ItzCrazyKns/Vane.git
git fetch upstream
git merge upstream/master
```

画面の文言は `src/lib/i18n/locales/en.ts` と `ja.ts` にあります。

## ライセンス

[MIT License](./LICENSE) です。原著作権は ItzCrazyKns（Copyright (c) 2026）に帰属します。日本語化などの改変部分は CreasionSystems によるもので、同じく MIT License で提供します。
