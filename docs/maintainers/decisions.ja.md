# unitone 設計判断索引

複数ファイルにまたがり、実装が変わっても維持すべき判断だけを一覧にします。最初にこの索引だけを確認し、現在の作業に関係する記録だけを開いてください。

## 採用中

- [WordPress 7.1 の状態スタイル UI と unitone の hover 設定を使い分ける](decisions/wp-7-1-block-state-hover.ja.md): コアの状態 UI を優先しつつ、既存値と unitone ブロックを維持する。
- [Core と unitone の `min-width` サポートを分離する](decisions/core-and-unitone-min-width.ja.md): 保存先と CSS 出力が異なるため移行しない。
- [コアブロックのレスポンシブスタイルを CSS カスタムプロパティで適用する](decisions/responsive-styles-for-some-core-blocks.ja.md): viewport 別 CSS 変数を使って既存の表示設計を維持する。
- [汎用色関連サポートを用途別パネルに配置する](decisions/inspector-color-panels.ja.md): 通常色はコアの情報設計に合わせ、hover 設定は一か所にまとめる。
- [`dividerType` の未指定と「無し」を区別する](decisions/divider-type-empty-value.ja.md): `undefined` は未指定、空文字は明示的な「無し」とする。
- [divider の計測トークンでインライン方向の外寸を変えない](decisions/divider-measurement-tokens.ja.md): 計測前後の折返し条件を一定に保つ。
- [Swiper 関連ブロックの設定属性を用途に応じて分ける](decisions/swiper-settings-attributes.ja.md): 複合的な親設定は object、少数の子ブロック設定は個別属性で保持する。

## 追加・更新時の注意

単一の実装に閉じる短い理由は、個別記録を作らずソースコメントに置いてください。調査経緯や置換前の案は Issue／PR に残し、この索引には現在有効な判断と一行要約だけを記載します。
