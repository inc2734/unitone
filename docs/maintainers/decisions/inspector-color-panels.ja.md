# 汎用色関連サポートを用途別パネルに配置する

- 決定日: 2026-08-06
- 更新日: 2026-08-17
- 状態: 採用
- 関連領域: ブロックエディター、Inspector、色、Dimensions

## 決定

- hover 文字色、背景色・グラデーション、枠線色は、関連設定をまとめるため従来の「色」パネルへ配置する。
- 通常のテキスト色・背景色は、対応する `unitone/*` ブロックの `color.__experimentalDefaultControls` を有効にしてコアの用途別パネルへ表示する。
- 汎用のレイアウト／コンテンツコンテナでは、コアの `color.heading`／`color.button` サポートを有効にし、内部の見出しと標準ボタンの色を「要素」パネルで設定できるようにする。
- 不透明度は汎用ブロックサポートとして「Dimensions」へ配置する。
- 内部要素固有の色と専用機能の色は、それぞれ従来の色パネルまたは専用パネルに残す。
- 「すべてリセット」は、そのパネルに配置した unitone 設定だけを対象にする。

## 理由

コアの情報設計に合わせて通常色を見つけやすくしつつ、hover と内部要素固有の設定対象を誤認させないため。UI の配置だけを変更し、既存属性と CSS 出力は移行しない。

## 関連情報

- [`src/js/editor/hooks/color/color.js`](../../../src/js/editor/hooks/color/color.js)
- [WordPress 7.1 対応 Issue](https://github.com/inc2734/unitone/issues/829)
