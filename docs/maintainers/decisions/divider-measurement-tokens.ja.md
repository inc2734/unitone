# divider の計測トークンでインライン方向の外寸を変えない

- 決定日: 2026-08-04
- 状態: 採用
- 関連領域: Divided ブロック、折返し計測、RTL

## 決定

- `-bol`／`-linewrap`／`-stack` の付け外しで、子要素のインライン方向の外寸や列数を決める親の gap を変えない。
- divider 幅を含む一定の gap を先に確保し、原則としてボックスサイズに影響しない疑似要素で線を描画する。
- 余白自体が装飾となる場合も、すべての子要素に同じインライン padding を確保し、計測トークンでは線の表示だけを切り替える。
- ブロック方向の調整は、インライン方向の折返し条件を変えない範囲に限る。

## 理由

計測前後の行構成を一定にし、境界幅でトークンと折返し位置が循環または振動することを防ぐため。

## 関連情報

- [`src/blocks/flex-divided/style.scss`](../../../src/blocks/flex-divided/style.scss)
- [`src/blocks/grid-divided/style.scss`](../../../src/blocks/grid-divided/style.scss)
