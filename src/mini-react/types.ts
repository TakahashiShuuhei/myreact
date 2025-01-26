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

export interface VNode {
  type: string;
  props: Props;
}

export type ValidNode = VNode | string;  // unionは別の型として定義

export type Props = {
  children?: ValidNode[];
  className?: string;
} & Partial<DOMEvents> & {
  [key: string]: any;  // その他の属性用
} 