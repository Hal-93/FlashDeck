![image](https://img.shields.io/badge/-React-555.svg?logo=react&style=flat) 
![image](https://img.shields.io/badge/-TypeScript-007ACC.svg?logo=typescript&style=flat)
![image](https://img.shields.io/badge/-Bootstrap-563D7C.svg?logo=bootstrap&style=flat)

# <img src="https://github.com/user-attachments/assets/62f632cd-0dd2-4581-8052-69c2731da83a" alt="Image" width="30" height="30">  FlashDeck v1.2.1 
FlashDeckは、Reactベースで作られた単語カードとテストが一体化した暗記支援アプリです。

# Usage
## 問題集
単語カードのグループとして問題集を作ることができ、問題集ごとに単語カードを管理することができます。

<img width="1014" alt="スクリーンショット 2024-08-17 18 11 39" src="https://github.com/user-attachments/assets/6f0e1b3e-cca9-4db2-acbc-7030ad5f147e">

## 単語カード作成
問題集の中に単語カードを作成できます。単語カードの追加・削除は自由に行うことができます。
<img width="976" alt="スクリーンショット 2024-08-17 18 15 03" src="https://github.com/user-attachments/assets/cf775c45-aaf8-482b-bbd4-b7a3b3f7f55c">

## 学習
選択した問題集の単語カードを網羅する形で学習を行います。カード下部には進行状況を表すバーが表示されます。
- カードをひっくり返すことで問題と解答の表示を切り替えます
- フラグをつけることで後でカードを見返すことができます
<img width="987" alt="スクリーンショット 2024-08-17 18 17 11" src="https://github.com/user-attachments/assets/8fc578ba-ccd0-4d01-8417-757a78a04e76">

## 反復
フラグをつけた単語カードだけを反復学習することができます。ここに表示されるものは、自分でフラグをつけた単語カードと、確認テストで不正解だった単語カードです。  
反復学習中に単語カードごとにフラグを解除することもでき、反復学習の終了時に一括でフラグを解除することもできます。

## 確認テスト
2択または4択の選択式クイズが出題されます。問題集に含まれる単語カードが5個以下であれば2択、それ以外であれば4択で出題が行われます。
選択肢は同じ問題集の単語カードの解答からランダムで構成されます。

<img width="963" alt="スクリーンショット 2024-08-17 18 21 51" src="https://github.com/user-attachments/assets/998727cb-e750-4fe6-beda-5d63800e0d36">

テストが終了すると、成績が表示されます。このテストで不正解だった問題にはフラグが付与され、「反復」に表示されるので繰り返し練習してもう一度テストに臨みましょう。
<img width="957" alt="スクリーンショット 2024-08-17 18 22 07" src="https://github.com/user-attachments/assets/0cfb66cd-d3d0-460a-9f4a-7861c6148140">
