# プリセットのスラッグと CSS 識別子の正規化が一致しない

WordPress がプリセットの CSS 変数・クラスを生成するときの正規化に対し、unitone の独自生成処理には保存スラッグをそのまま連結する箇所がある。`custom-` を参照しても定義側が `custom` になるなど、色・グラデーション・影・文字組み・余白で参照先が一致しない場合がある。PHP の `unitone_get_preset_css_var()` と JavaScript の `getPresetCssVar()` も正規化していない。

修正範囲を判断するときは、次の unitone 固有の依存関係に注意する。

- 共通変換関数だけでなく、ブロック・書式の直接生成と `has-…` クラス生成も対象になる。
- `getFontSizePresetSlugFromValue()` は CSS への変換をスラッグ抽出にも利用している。CSS 出力の正規化を保存値の識別・パレット照合に持ち込まない。
- `save()` や書式が保存した CSS 参照は、生成処理を修正しただけでは既存コンテンツに反映されない。旧 HTML の検証・移行とフロント表示を別に確認する。
- スライダーの `deprecated.js` は現行の `components.js` を共有する。共通部品の変更が旧保存形式の再現まで変えないようにする。
- 旧色スラッグの `/` とフォントサイズの `unitone-2xl` などには既存の互換処理があるため、正規化を理由に削除しない。

非 ASCII スラッグについては WordPress の PHP と JavaScript の変換結果も常に同じとは限らないため、利用する変換関数ごとに確認する。

関連: [オーバーレイ背景色の報告](https://unitone.2inc.org/forums/topic/ナビゲーションブロックのオーバーレイ背景色が/)、[WordPress のプリセット変数生成](https://developer.wordpress.org/reference/classes/wp_theme_json/get_settings_values_by_slug/)。
