# プリセットの CSS 識別子を正規化し、保存値と旧 HTML を維持する

unitone が生成するプリセットの CSS 変数・クラスは、WordPress の PHP 側の `_wp_to_kebab_case()` に合わせる。JavaScript 側も同じ規則を用いる。WordPress の JavaScript の変換 API とは日本語などの非 ASCII スラッグで結果が異なるため、PHP が生成する変数名を基準にする。

パレットのスラッグと保存属性は変更せず、CSS 出力時だけ正規化する。フォントサイズなどのパレット照合では、元のスラッグを抽出する処理と CSS 識別子への変換を分離する。

既存ブロックの検証を壊さないため、`save()` と `deprecated` の出力形式を維持し、保存済みの unitone 独自 CSS 参照は `render_block` で補正する。スライダーとテクスチャのように編集画面と保存処理が部品を共有する場合は、編集画面だけ正規化を有効にする。インライン書式の新規生成は正規化し、保存済みの参照は同じ表示時処理で補正する。

表示時の補正は unitone 独自の宣言（旧スライダーの `--swiper-*` を含む）に限定する。有効な旧変数名には正規化後の変数へのフォールバックを追加し、独自 CSS が旧変数に値を設定している場合はその値を優先する。旧色スラッグの `/` とフォントサイズの `unitone-2xl` などに対応する既存の互換変数も削除しない。

関連: [オーバーレイ背景色の報告](https://unitone.2inc.org/forums/topic/ナビゲーションブロックのオーバーレイ背景色が/)、[WordPress のプリセット変数生成](https://developer.wordpress.org/reference/classes/wp_theme_json/get_settings_values_by_slug/)。
