# 学一｜黒毛和牛と本場盛岡冷麺

トップ・船橋店・津田沼店の3ページ構成。静的HTML・CSS・JavaScriptで実装しています。
公開用ファイルは `dist/` です。外部パッケージのインストールは不要です。

## ローカルで表示

```sh
python3 -m http.server 3006 --bind 127.0.0.1 --directory dist
```

ブラウザで http://localhost:3006/ を開いてください。

## 検証

Node.js 22以上で実行します。

```sh
node scripts/verify.mjs
node scripts/test-motion.mjs
node --check dist/assets/site.js
```

ページ・画像・内部リンク・アンカー・店舗別の予約先、および動き軽減設定とアニメーションを検証します。

## 公開用の配置

- 配信するフォルダ：`dist`
- トップ：`dist/index.html`
- 店舗ページ：`dist/funabashi/index.html`、`dist/tsudanuma/index.html`
- 画像・スタイル・動作：`dist/assets/`

Cloudflare Pagesを使用する場合は、フレームワーク「None」、ビルドコマンド `node scripts/verify.mjs`、出力ディレクトリ `dist`、Node.js 22以上を指定します。静的サイトのため生成ビルドは不要です。

GitHub Pagesを使用する場合も、リポジトリのルートではなく `dist/` の内容を公開成果物として配信してください。内部リンクは相対パスで、プロジェクト名付きURLにも対応しています。

このリポジトリへのプッシュだけでは、新しいサイトの公開・公開先の設定変更は行われません。公開の自動処理は含めていません。

## 本公開前の確認

- 11月1日の本公開・既存ドメイン切替は未実施です。
- 津田沼店の営業時間は現行予約ページの情報を掲載しています。旧HPとの相違があるため、本公開前に店舗へ最終確認してください。
- 現在は全ページに `noindex,nofollow` を設定しています。検索掲載を開始する際は、HTMLと `scripts/verify.mjs` の検索掲載方針の検証を一緒に更新してください。
- `noindex` は閲覧制限ではありません。一般公開するタイミングは別途判断してください。

## 編集箇所

- 本文：各ページのHTML
- 共通スタイル：`style.css`、`branches.css`
- 新デザイン・アニメーション：`experience.css`
- ナビゲーション・スクロール表示：`site.js`

制作メモと、確認用ホスティングの管理情報・認証情報は含めていません。
