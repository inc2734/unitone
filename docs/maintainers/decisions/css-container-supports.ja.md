# CSS コンテナー関連設定の適用範囲と保存値の互換性を維持する

- 決定日: 2026-09-08
- 状態: 採用
- 関連領域: CSS コンテナーパネル、ブロックサポート、動的レスポンシブ CSS

## 決定

- `responsiveContext` は同じブロックの `containerType="inline-size"` と組み合わせ、子孫の流体値と対応するレスポンシブ CSS の基準を切り替える。`queryContext` は対象ブロック自身のクエリー方式だけを指定する。
- `queryContext` は UI で有効にすると `true`、解除すると未指定として保存する。既存の文字列 `'container'` も有効とし、どちらも `@container` トークンを出力する。グリッド・レスポンシブ切り替えブロックの動的 CSS もこのトークンで判定する。
- ブロック固有のレスポンシブ CSS は、unitone-css と同じセレクター条件で自身の `@container` または先祖の有効な `responsiveContext` を判定する。静的 CSS は `responsive-query` ミックスインを利用し、グリッド・レスポンシブ切り替えブロックの動的 CSS は同等のセレクターを生成する。エディターのブロックツリーや PHP の先祖属性の取得に依存せず、DOM 上の設定変更にも追従する。コンテナーを基準にする場合はメディアクエリーを適用せず、条件不一致時に画面幅へフォールバックしない。
- `fluidReference` のサポートを継続するブロックでは、既存値がある場合だけ非推奨設定として表示し、従来の出力を維持する。`responsiveContext` へ自動移行しない。
- `containerType` をサポートし、unitone-css 側でコンテナータイプを適用しない独自ブロックは、既存のブロック CSS で `--unitone--container-type: initial` と `container-type: var(--unitone--container-type)` を定義する。要素ごとの初期化により、未設定の子ブロックが先祖の値を継承してコンテナーになることを防ぐ。
- `center`・`popover-content`・`dialog-content`・`both-sides-content`・`texture`・`gutters`・`marquee`・`reel`・`cluster`・`cluster-divided-content`・`both-sides` には `containerType`／`fluidReference`／`responsiveContext` を提供しない。内容に応じた幅決定との相性やブロックの主目的を考慮し、設定対象を絞る。これらのブロックでは、保存済みの属性値があっても3設定の UI・属性トークンを出力しない。

## 理由

保存済みコンテンツのクエリー方式を変えず、エディターとフロントの表示を一致させるため。`fluidReference` は指定要素自身で流体値を生成し、`responsiveContext` は子要素で生成するため、同じブロック上で設定を置き換えると適用範囲が変わる。

## 関連情報

- [unitone-css Issue #30](https://github.com/inc2734/unitone-css/issues/30)
- [unitone Issue #848](https://github.com/inc2734/unitone/issues/848)
- [`src/js/editor/hooks/css-container/`](../../../src/js/editor/hooks/css-container/)
