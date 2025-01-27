import { VNode } from "./types";

declare global {
  namespace JSX {
    interface Element extends VNode {}  // JSXの要素の型を定義
    interface IntrinsicElements {       // HTML要素の型を定義
      // 具体的なHTML要素の型を定義
      div: any;
      button: any;
      input: any;
      p: any;
      h1: any;
      ul: any;
      li: any;
      // 必要に応じて他のHTML要素を追加
    }
  }
}

// 型定義のみなのでエクスポートは不要
export {} 