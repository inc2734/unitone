# unitone 設計判断記録

## この文書の目的

今後の変更でも尊重すべき設計上の決定と、その背景・理由を記録します。過去の判断をコードだけから推測して追加せず、確認できた内容だけを記録してください。

追記前にこの文書を検索し、同じ決定がある場合は新規項目を作らず既存項目を更新してください。既存の決定を変更または廃止する場合は、新しい記録から元の決定を参照し、変更理由と影響を残してください。

## 状態の目安

- `提案中`: まだ合意されていない案
- `採用`: 現在有効な決定
- `廃止`: 意図的に使用をやめた決定
- `置換`: 別の決定によって置き換えられた決定

## 記入用テンプレート

<!--
## 決定: タイトル

- 決定日: YYYY-MM-DD
- 状態: 提案中／採用／廃止／置換
- 関連領域:

### 背景

この判断が必要になった状況や問題を記述する。

### 決定内容

何を決定したかを明確に記述する。

### 理由

この決定を選んだ理由と、維持すべき判断基準を記述する。

### 検討した代替案

- 代替案:
  - 採用しなかった理由:

### 影響

- 利点:
- 欠点・トレードオフ:
- 移行や互換性への影響:

### 関連ファイル・Issue・PR

- [名称](相対パスまたは URL)
-->

## 決定: WordPress 7.1 の疑似状態スタイル UI を無効化し unitone の hover 設定を維持する

- 決定日: 2026-08-06
- 状態: 採用
- 関連領域: WordPress 7.1、ブロックエディター、状態スタイル、hover 色

### 背景

WordPress 7.1 では `core/button` と `core/navigation-link` に対して `:hover`、`:focus`、`:focus-visible`、`:active` の状態スタイルを編集する UI が追加される。unitone は従来から、unitone ブロックと `core/button` に独自の hover 色設定を提供している。

### 決定内容

- `block_editor_settings_all` の `blockStatesEditingEnabled` を `false` にして、コアの疑似状態スタイル編集 UI を無効化する。
- unitone の hover 文字色、背景色・グラデーション、枠線色の設定 UI と保存・CSS 出力を継続する。
- `core/button` でも unitone の hover UI を常時利用可能にし、既存値の有無によって UI を廃止する移行は行わない。
- レスポンシブ状態の編集は別設定であるため、この決定だけを理由に `responsiveEditingEnabled` は無効化しない。

### 理由

unitone の hover サポートは既存コンテンツとテーマの CSS カスタムプロパティによる出力に統合されている。コアと unitone の2種類の疑似状態 UI を併存させず、従来の操作方法と保存形式を維持するため。

### 影響

- コアの疑似状態スタイル編集 UI はブロックインスペクターとグローバルスタイルで表示されない。
- `theme.json`、グローバルスタイル、ブロック属性に保存済みのコア状態スタイルは、UIを無効化してもエディターとフロントで引き続き適用される。
- WordPress 7.1 対応では、unitone の hover UI をコアへの移行用 UI として扱わない。

### 関連ファイル・Issue・PR

- [`inc/assets.php`](../../inc/assets.php)
- [`inc/block-supports.php`](../../inc/block-supports.php)
- [`src/js/editor/hooks/color/color.js`](../../src/js/editor/hooks/color/color.js)
- [WordPress 7.1 対応 Issue](https://github.com/inc2734/unitone/issues/829)
- [WordPress エディター設定フィルター](https://github.com/WordPress/gutenberg/blob/wp/7.1/docs/reference-guides/filters/editor-filters.md)

## 決定: Core と unitone の `min-width` サポートを別機能として維持する

- 決定日: 2026-08-06
- 状態: 採用
- 関連領域: WordPress 7.1、ブロックサポート、Dimensions、CSS カスタムプロパティ

### 背景

WordPress 7.1 では Dimensions ブロックサポートに `minWidth` が追加される。コアのサポートは `min-width` プロパティを直接出力する一方、unitone の独自サポートは `--unitone--min-width` を出力し、テーマの CSS から利用する。

### 決定内容

- unitone の `unitone.minWidth` と既存属性をコアの `style.dimensions.minWidth` へ移行しない。
- unitone の `min-width` サポートとコアの Dimensions `minWidth` サポートを、出力と用途が異なる別機能として維持する。
- unitone の `minWidth` を提供するコアブロックでは、コアの `dimensions.minWidth` を無効化し、重複する UI を表示しない。
- unitone の対象ではないコアブロックがコアの `minWidth` をサポートすることは妨げない。

### 理由

保存先と CSS 出力の意味が異なり、機械的に移行すると unitone のレイアウト CSS が参照するカスタムプロパティを失うため。

### 影響

- 既存コンテンツの属性と CSS カスタムプロパティは維持される。
- WordPress が将来 unitone の対象コアブロックへ `dimensions.minWidth` を追加した場合も、unitone 側で明示的に無効化する必要がある。

### 関連ファイル・Issue・PR

- [`inc/block-supports.php`](../../inc/block-supports.php)
- [`inc/unitone-block-supports.php`](../../inc/unitone-block-supports.php)
- [`src/js/editor/hooks/layout/min-width.js`](../../src/js/editor/hooks/layout/min-width.js)
- [WordPress 7.1 対応 Issue](https://github.com/inc2734/unitone/issues/829)

## 決定: unitone の汎用色関連サポートを意味別の Inspector パネルに配置する

- 決定日: 2026-08-06
- 状態: 採用
- 関連領域: WordPress 7.1、ブロックエディター、Inspector、色、Dimensions

### 背景

WordPress 7.1 では、従来「色」にまとめられていたコアの色関連設定が、設定対象の意味に応じて「タイポグラフィ」「背景」「枠線」「要素」などへ分割された。unitone の汎用ブロックサポートにも同じ意味を持つ設定がある一方、ブロック内部要素に固有の色設定も存在する。

### 決定内容

- hover 文字色は「タイポグラフィ」、hover 背景色・グラデーションは「背景」、hover 枠線色は「枠線」、リストのマーカー色は「要素」に配置する。
- 不透明度は汎用ブロックサポートとして、コアの「Dimensions」に配置する。
- Table、Navigation、Timeline、Mega Menu などの内部要素固有色は「色」に残し、Slider、Texture など専用設定を持つものはその専用パネルに残す。
- パネルの「すべてリセット」は、そのパネルへ配置した unitone 設定だけをリセット対象にする。

### 理由

コアの情報設計に合わせて汎用設定を見つけやすくしつつ、ブロック固有の内部要素色を無理に一般化せず、設定対象の違いを保つため。

### 影響

- 変更対象は Inspector UI の配置とリセット範囲であり、既存属性、保存形式、PHP レンダリング、CSS 出力は移行しない。
- 新しい汎用色関連サポートを追加する場合も、色そのものではなく設定対象の意味に応じて配置先を決める。

### 関連ファイル・Issue・PR

- [`src/js/editor/hooks/color/color.js`](../../src/js/editor/hooks/color/color.js)
- [`src/js/editor/hooks/dimensions/dimensions.js`](../../src/js/editor/hooks/dimensions/dimensions.js)
- [`src/js/editor/hooks/dimensions/opacity.js`](../../src/js/editor/hooks/dimensions/opacity.js)
- [WordPress 7.1 対応 Issue](https://github.com/inc2734/unitone/issues/829)

## 決定: 独自ブロックサポートの Inspector UI を複数選択に対応させる

- 決定日: 2026-07-16
- 状態: 採用
- 関連領域: ブロックエディター、unitone 独自ブロックサポート、表示性能

### 背景

`editor.BlockEdit` フィルターで `isSelected` が偽の場合に unitone 独自ブロックサポートのパネル生成を省略すると、複数のブロックを選択した際にコアのブロックサポート UI は表示される一方、unitone の UI は表示されなかった。`isSelected` による制限が過去に導入された目的は確認できておらず、表示性能の改善が目的だった可能性は仮説にとどまる。

### 決定内容

unitone 独自ブロックサポートの Inspector UI は、`isSelected` のみを条件に生成を省略しない。表示対象の判定は WordPress コアの `InspectorControls` に委ね、同じ種類のブロックを複数選択した場合にも UI を表示して、変更を選択中のブロックへ反映できる状態を維持する。

将来この領域の表示性能を改善する場合も、複数選択時の UI を失わせる `isSelected` の短絡条件は再導入しない。別の最適化を行う場合は、単一選択と複数選択の両方で表示と属性反映を確認する。

### 理由

WordPress コアの `InspectorControls` は、単一選択および同じ種類のブロックの複数選択に応じて Fill の表示を制御する。unitone 側でそれより前に `isSelected` だけを使って除外すると、コアが提供する複数選択の仕組みを利用できないため。

### 検討した代替案

- `isSelected` による生成制限を維持する:
  - 複数選択時に unitone 独自ブロックサポートの UI が表示されないため採用しない。
- unitone 側で複数選択専用の Inspector UI と属性更新処理を実装する:
  - コアの表示制御および選択ブロックへの属性更新と重複し、保守範囲が増えるため採用しない。

### 影響

- 利点: コアのブロックサポートと同様に、同じ種類のブロックを複数選択した状態で unitone 独自ブロックサポートを操作できる。
- 欠点・トレードオフ: 選択されていないブロックについても unitone のパネルコンポーネントが評価されるため、性能改善ではこの範囲を考慮する必要がある。
- 移行や互換性への影響: `InspectorControls` の複数選択時の挙動に依存する。WordPress／Gutenberg 更新時には、単一選択と同一種類の複数選択を確認する。

### 確認

- 2026-07-16: ローカルのブロックエディターで、複数選択時の UI 表示と動作に問題がないことを確認。

### 関連ファイル・Issue・PR

- [`src/js/editor/hooks/style.js`](../../src/js/editor/hooks/style.js)

## 決定: `dividerType` の未指定と「無し」を区別する

- 決定日: 2026-07-21
- 状態: 採用
- 関連領域: unitone 独自ブロックサポート、区切り設定、`unitone/child-pages`

### 背景

`dividerType` の「無し」を空文字から `undefined` へ変換すると、デフォルト値を持つブロックでは「無し」とリセット後の未指定を区別できず、どちらもデフォルト値へフォールバックする。また、Child Pages のようにレイアウトに応じて動的なデフォルト値を持つブロックでは、エディターとフロントで解釈がずれる原因になる。

### 決定内容

- `dividerType` の空文字 `''` は、明示的な「無し」として保存する。
- `dividerType` の `undefined` は未指定として扱い、ブロックにデフォルト値があれば適用する。
- 個別リセットと「すべてリセット」は `dividerType` を `undefined` に戻す。
- 動的ブロックは、エディターとフロントの両方で同じデフォルト値を解決する。Child Pages は Cluster／Stack Divided ブロックの登録済みメタデータをデフォルト値の根拠とする。

### 理由

明示的なユーザー選択とリセット状態を異なる値で表現することで、専用のリセット値やブロック固有のリセット処理を追加せず、共通の区切りサポートのデフォルト解決を利用できるため。

### 影響

- 「無し」は空文字を含む `unitone` 属性として保存される。
- デフォルト値を持たないブロックでは、リセット後も従来どおり区切りなしになる。
- デフォルト値を持つブロックでは、リセット後にそのデフォルト値が適用される。

### 関連ファイル・Issue・PR

- [`src/js/editor/hooks/divider-line/divider-type.js`](../../src/js/editor/hooks/divider-line/divider-type.js)
- [`src/blocks/child-pages/index.js`](../../src/blocks/child-pages/index.js)
- [`src/blocks/child-pages/index.php`](../../src/blocks/child-pages/index.php)

## 決定: divider の計測トークンでインライン方向の外寸を変えない

- 決定日: 2026-08-04
- 状態: 採用
- 関連領域: unitone-css、Divided ブロック、折返し計測、RTL

### 背景

divider behavior は、計測前に子要素から `-bol`／`-linewrap` を、親要素から `-stack` を外して行構成を計測し、結果に応じて再付与する。これらのトークンに応じて padding、margin、width、flex-basis、column-gap などのインライン方向の外寸を変えると、計測時と付与後で折返し位置が変わり、最終配置と一致しないトークンが残る可能性がある。

### 決定内容

- `-bol`／`-linewrap`／`-stack` の付け外しでは、子要素のインライン方向の外寸および列数を決める親要素の gap を変えない。
- `divide` のような要素間の区切りは、原則として divider 幅を含む一定の gap を先に確保し、その中へボックスサイズに影響しない疑似要素で線を描画する。
- `stripe`／`bordered` のように余白が装飾の一部である場合は、すべての子要素に同じインライン padding を確保し、計測トークンでは疑似要素の border 表示だけを切り替える。
- `-linewrap` や `-stack` によるブロック方向の padding、margin、border の調整は、インライン方向の折返し条件を変えない範囲で許容する。

この決定は unitone 内で divider スタイルを独自実装するコードに適用する。divider 本体を unitone-css のレイアウトプリミティブへ委譲するブロックは、unitone-css 側の同じ原則に従う。

### 理由

計測トークンを装飾状態だけに限定すると、計測前後の行構成が安定し、ResizeObserver や属性変更による再計測が誤った状態へ収束する循環を防げるため。また、一定の gap 内へ疑似要素を配置すれば、既存の区切り表現を保ちながら、border を子要素自身のボックスサイズから分離できるため。

### 検討した代替案

- 行頭要素だけ padding を増減して border 分を相殺する:
  - `-bol` の付与自体が折返し条件を変えるため採用しない。
- トークン付与後に行構成が変わった場合だけ繰り返し再計測する:
  - 境界幅で状態が振動する可能性があり、装飾と計測条件を分離する方が安定するため採用しない。

### 影響

- 利点: 幅の拡大縮小、非表示の先頭要素、divider の動的変更でも、最終行構成と `-bol`／`-linewrap`／`-stack` が一致しやすくなる。
- 欠点・トレードオフ: `stripe`／`bordered` では、線を非表示にする側にも同じ padding を残す必要がある。
- 移行や互換性への影響: ブロック API とマークアップは変更しない。

### 確認

- 2026-08-04: unitone-css 1.2.0 と Google Chrome の実ブラウザ検証で、Flex Divided と Grid Divided について、幅の拡大縮小、非表示の先頭要素、RTL、縦方向 Flex、divider の動的変更、計測前後のインライン寸法と最終行構成を確認した。

### 関連ファイル・Issue・PR

- [`src/blocks/flex-divided/style.scss`](../../src/blocks/flex-divided/style.scss)
- [`src/blocks/grid-divided/style.scss`](../../src/blocks/grid-divided/style.scss)
