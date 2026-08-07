# Core と unitone の `min-width` サポートを分離する

- 決定日: 2026-08-06
- 状態: 採用
- 関連領域: ブロックサポート、Dimensions、CSS カスタムプロパティ

## 決定

unitone の `unitone.minWidth` は `--unitone--min-width` をテーマ CSS から利用する機能であり、`min-width` を直接出力するコアの `style.dimensions.minWidth` へ移行しない。unitone の対象コアブロックではコア側を無効化し、重複 UI を表示しない。

## 理由

保存先と CSS 出力の意味が異なり、機械的な移行では既存レイアウトが参照するカスタムプロパティを失うため。

## 関連情報

- [`inc/block-supports.php`](../../../inc/block-supports.php)
- [WordPress 7.1 対応 Issue](https://github.com/inc2734/unitone/issues/829)
