# 汎用色関連サポートを用途別パネルに配置する

- 決定日: 2026-08-06
- 更新日: 2026-09-03
- 状態: 採用
- 関連領域: ブロックエディター、Inspector、色

## 決定

- hover 文字色、背景色・グラデーション、枠線色は、関連設定をまとめるため従来の「色」パネルへ配置する。
- 通常のテキスト色・背景色は、対応する `unitone/*` ブロックの `color.__experimentalDefaultControls` を有効にしてコアの用途別パネルへ表示する。
- 汎用のレイアウト／コンテンツコンテナでは、コアの `color.heading`／`color.button` サポートを有効にし、内部の見出しと標準ボタンの色を「要素」パネルで設定できるようにする。
- 内部要素固有の色と専用機能の色は、それぞれ従来の色パネルまたは専用パネルに残す。
- 「すべてリセット」は、そのパネルに配置した unitone 設定だけを対象にする。
- 通常の背景グラデーションは `background.gradient` を使用する。ただし、既存コンテンツの `gradient` と `style.color.gradient` を引き続き認識・描画するため、Core ブロックと同様に `color.gradients` も併存させる。既存値の一括変換は行わず、Core の編集処理による `style.background.gradient` への移行に委ねる。

## 理由

コアの情報設計に合わせて通常色を見つけやすくしつつ、hover と内部要素固有の設定対象を誤認させないため。既存の色属性と CSS 出力は維持する。背景グラデーションは、背景画像と共存できる新しい保存先を新規編集時に使用しながら、旧保存形式との後方互換性を保つ。

## 関連情報

- [`src/js/editor/hooks/color/color.js`](../../../src/js/editor/hooks/color/color.js)
- [`src/js/utils/background.js`](../../../src/js/utils/background.js)
- [WordPress 7.1 対応 Issue](https://github.com/inc2734/unitone/issues/829)
