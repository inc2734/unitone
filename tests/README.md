# プリセット参照の回帰テスト

JavaScript の正規化、パレット照合、共有部品の保存形式は次のコマンドで確認する。

```sh
npm run test:js:presets
```

PHP 側は unitone を有効にした WordPress 環境で実行する。プリセットの正規化、保存済み HTML の互換処理、ナビゲーションの出力を確認し、投稿や設定は変更しない。

```sh
npm run wp -- eval-file tests/preset.php
```

両言語で `fixtures/preset-slugs.json` を共有し、WordPress の PHP が生成する識別子との一致を確認する。

## ナビゲーションのサブメニュー

オーバーレイ内のアコーディオンで、合成マウスイベントを含む `mousedown` 時のフォーカス移動をクリック後まで遅らせる処理を確認する。他のスタイルや通常表示には作用しない。

```sh
npm run test:js:navigation
```
