import { EffectHook } from "./hooks";

// DOMイベントの型定義
type DOMEvents = {
  onClick: (event: MouseEvent) => void;
  onChange: (event: Event) => void;
  onInput: (event: InputEvent) => void;
  onSubmit: (event: SubmitEvent) => void;
  // 必要に応じて追加
}

// イベントハンドラーの名前を型として取得
export type EventNames = keyof DOMEvents;

// 関数コンポーネントの型定義を追加
export type FunctionComponent<P = Props> = (props: P) => VNode;

export interface VNode {
  type: string | FunctionComponent;  // 文字列またはコンポーネント関数
  props: Props;
  children?: ValidNode[] | ValidNode;  // 配列または単一の値を許容
}

export type ValidNode = VNode | string;

export type Props = {
  children?: ValidNode[] | ValidNode;  // ここも同様に修正
  className?: string;
} & Partial<DOMEvents> & {
  [key: string]: any;  // その他の属性用
}

// 内部用のProps型を定義
interface InternalProps extends Props {
  lastVNode?: VNode;
}

// フックの値の型を定義
interface StateHook<T> {
  value: T;
}

interface MemoHook<T> {
  value: T;
  deps: any[];
}

// フックの種類をユニオン型で表現
export type Hook = StateHook<any> | MemoHook<any> | EffectHook;

// コンポーネントのインスタンス情報の型を定義
export interface ComponentInstance {
  component: FunctionComponent;
  hooks: Hook[];
  props: InternalProps;
  mounted: boolean;
  memoized?: {
    props: Props;
    result: VNode;
  };
}

// WeakMapの型も更新
// export const componentInstances = new WeakMap<HTMLElement, ComponentInstance>(); // 削除 