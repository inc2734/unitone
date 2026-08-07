# コアブロックのレスポンシブスタイルを CSS カスタムプロパティで適用する

- 決定日: 2026-08-07
- 状態: 採用
- 関連領域: レスポンシブ状態スタイル、viewport、`core/post-terms`、`core/tag-cloud`

## 決定

- badge／outline スタイルでは、通常状態と `style.@tablet`／`style.@mobile` の背景・枠線を CSS 変数へ変換し、リンクなどの内部要素へ適用する。
- breakpoint は固定値を持たず、WordPress が `WP_Theme_JSON::get_viewport_media_queries()` で解決した media query を PHP とエディターで共有する。
- `@tablet` は `--unitone--md-*`、`@mobile` は `--unitone--sm-*` に対応させる。mobile は tablet ではなく通常状態へフォールバックする。
- フロントの動的 CSS は `global-styles` へ追加し、エディターでは iframe 内で評価されるよう `useStyleOverride()` を使用する。

## 理由

背景・枠線を内部要素へ移す既存の表示設計を維持しながら、変更可能な viewport 境界とエディター／フロントの両方に追従するため。

## 保守上の注意

変換対象のプロパティを追加する場合は、PHP とエディター JS の抽出・フォールバック定義を同時に更新する。

## 関連情報

- [`src/js/editor/wp-blocks/border-css-vars.js`](../../../src/js/editor/wp-blocks/border-css-vars.js)
- [WordPress 7.1 対応 Issue](https://github.com/inc2734/unitone/issues/829)
