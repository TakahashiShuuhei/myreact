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
export type FunctionComponent = (props: Props) => VNode;

export interface VNode {
  type: string | FunctionComponent;  // 文字列またはコンポーネント関数
  props: Props;
}

export type ValidNode = VNode | string;  // unionは別の型として定義

export type Props = {
  children?: ValidNode[];
  className?: string;
} & Partial<DOMEvents> & {
  [key: string]: any;  // その他の属性用
}

// 内部用のProps型を定義
interface InternalProps extends Props {
  lastVNode?: VNode;
}

// コンポーネントのインスタンス情報の型を定義
interface ComponentInstance {
  component: FunctionComponent;
  hooks: any[];
  props: InternalProps;
}

// WeakMapの型も更新
export const componentInstances = new WeakMap<HTMLElement, ComponentInstance>(); 