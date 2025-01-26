import { VNode } from "./types";

declare global {
  namespace JSX {
    interface Element extends VNode {}  // JSXの要素の型を定義
    interface IntrinsicElements {       // HTML要素の型を定義
      [elemName: string]: any;
    }
  }
}

// 型定義のみなのでエクスポートは不要
export {} 