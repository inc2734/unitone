# Swiper 関連ブロックの設定属性を用途に応じて分ける

## 判断

`unitone/swiper` は `attributes.settings` を維持する。レスポンシブ階層、設定間の制約、フロントへの JSON 受け渡し、`swiper-track` へのブロックコンテキスト提供を一つの設定モデルとして扱うためである。

次の子ブロックは、設定を `attributes.settings` にまとめず、型とデフォルトを `block.json` の個別属性として定義する。

- `unitone/swiper-autoplay-progress`
- `unitone/swiper-scrollbar`
- `unitone/swiper-pagination`

これらは少数の独立した属性から、必要な Swiper オプション、`data-*` 属性、CSS カスタムプロパティを生成できる。個別属性にすることで、保存スキーマとデフォルトを `block.json` から確認できる状態を優先する。

## 互換性

保存済みの `settings` object を変更するときは、旧属性スキーマ、旧デフォルト、旧保存処理を `deprecated` 定義に固定し、`migrate()` で個別属性へ変換する。移行時は supports が生成する属性も保持する。

## 今後の基準

Swiper 関連という理由だけで設定を object にまとめない。レスポンシブ階層やコンテキストを含む設定一式を単一モデルとして解決・受け渡す場合は object、少数の独立した動作・表示設定は個別属性を選ぶ。
