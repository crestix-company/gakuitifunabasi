# 学一｜黒毛和牛と本場盛岡冷麺

トップ・船橋店・津田沼店の3ページ構成。静的HTML・CSS・JavaScriptで実装しています。
公開用ファイルは `dist/` です。外部パッケージのインストールは不要です。

GitHub Pages：https://crestix-company.github.io/gakuitifunabasi/

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
node scripts/test-pages.mjs
node --check dist/assets/site.js
```

ページ・画像・内部リンク・アンカー・店舗別の予約先、および動き軽減設定とアニメーションを検証します。`test-pages.mjs` は公開用フォルダを実際のプロジェクトパス `/gakuitifunabasi/` で一時配信し、3ページと参照素材のHTTP応答を検証します。

## 公開用の配置

- 配信するフォルダ：`dist`
- トップ：`dist/index.html`
- 店舗ページ：`dist/funabashi/index.html`、`dist/tsudanuma/index.html`
- 画像・スタイル・動作：`dist/assets/`

Cloudflare Pagesを使用する場合は、フレームワーク「None」、ビルドコマンド `node scripts/verify.mjs`、出力ディレクトリ `dist`、Node.js 22以上を指定します。静的サイトのため生成ビルドは不要です。

GitHub Pagesは `.github/workflows/pages.yml` で、`main` へのプッシュ時に検証を行い、`dist/` だけを配信します。リポジトリ設定の **Pages → Source は GitHub Actions** を使用してください。ブランチのルート配信に戻すと、サイトではなくREADMEが表示されます。

GitHub上の「Actions」で検証・配信の成功を確認できます。内部リンクは相対パスで、プロジェクト名付きURLにも対応しています。README・検証スクリプトは公開ページには配信しません。

## 本公開前の確認

- GitHub Pagesでサイトを閲覧できます。11月1日の正式公開・既存ドメイン切替は未実施です。
- 津田沼店の営業時間は現行予約ページの情報を掲載しています。旧HPとの相違があるため、本公開前に店舗へ最終確認してください。
- 現在は全ページに `noindex,nofollow` を設定しています。検索掲載を開始する際は、HTMLと `scripts/verify.mjs` の検索掲載方針の検証を一緒に更新してください。
- `noindex` は閲覧制限ではありません。GitHub PagesのURLを知っている方は閲覧できます。

## 編集箇所

- 本文：各ページのHTML
- 共通スタイル：`style.css`、`branches.css`
- 新デザイン・アニメーション：`experience.css`
- ナビゲーション・スクロール表示：`site.js`

制作メモと、確認用ホスティングの管理情報・認証情報は含めていません。
