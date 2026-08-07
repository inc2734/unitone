# WordPress 7.1 の状態スタイル UI と unitone の hover 設定を使い分ける

- 決定日: 2026-08-07
- 状態: 採用
- 関連領域: ブロックエディター、状態スタイル、hover 色

## 決定

- `blockStatesEditingEnabled` は無効化せず、`core/button` の新規状態別色設定にはコアの UI を使用する。
- `core/button` の unitone hover UI は、既存値がある場合だけ通常状態の「色」パネルへ表示し、編集・解除を可能にする。
- コアの状態スタイルに対応しない `unitone/*` ブロックでは、unitone hover UI を引き続き新規設定にも使用する。
- `core/button` の疑似状態またはレスポンシブ状態を編集中は、状態別保存に未対応の unitone Inspector UI を表示しない。
- 既存属性、保存形式、CSS 出力は移行しない。

## 理由

コアと unitone の重複 UI を避けながら、保存済みコンテンツの編集手段と、コアの状態スタイルを利用できない unitone ブロックの設定手段を維持するため。

## 保守上の注意

状態の選択判定は WordPress 7.1 時点で非公開セレクターに依存する。WordPress／Gutenberg 更新時は、通常・疑似・レスポンシブ各状態で Inspector の表示条件を確認する。

## 関連情報

- [`src/js/editor/hooks/block-style-state.js`](../../../src/js/editor/hooks/block-style-state.js)
- [WordPress 7.1 対応 Issue](https://github.com/inc2734/unitone/issues/829)
