# `dividerType` の未指定と「無し」を区別する

- 決定日: 2026-07-21
- 状態: 採用
- 関連領域: unitone 独自ブロックサポート、区切り設定

## 決定

- `dividerType: ''` はユーザーが明示的に選んだ「無し」として保存する。
- `dividerType: undefined` は未指定とし、ブロックにデフォルト値があれば適用する。
- 個別リセットと「すべてリセット」は `undefined` に戻す。
- 動的ブロックもエディターとフロントで同じデフォルト値を解決する。

## 理由

明示的なユーザー選択とリセット状態を区別し、ブロック固有のデフォルトを共通の区切りサポートで扱うため。

## 関連情報

- [`src/js/editor/hooks/divider-line/divider-type.js`](../../../src/js/editor/hooks/divider-line/divider-type.js)
