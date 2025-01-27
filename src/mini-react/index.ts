import { diff } from './diff';
import { VNode, Props, EventNames, FunctionComponent, ValidNode, Hook } from './types'

export function createElement(
  type: string,
  props: Props | null,
  ...children: VNode[]
): VNode {
  return {
    type,
    props: {
      ...props,
      children: children.flat()
    }
  }
}

// イベント名とDOMイベント名のマッピング
const eventMap: Record<EventNames, string> = {
  onClick: 'click',
  onChange: 'change',
  onInput: 'input',
  onSubmit: 'submit'
  // 必要に応じて追加
};

// currentComponentをexport
export let currentComponent: FunctionComponent | null = null;
export let currentHook = 0;

// currentHookを更新する関数を追加
export function incrementCurrentHook() {
  currentHook++;
}

// コンポーネントのインスタンス情報を保持
export const componentInstances = new WeakMap<HTMLElement, {
  component: FunctionComponent;
  hooks: Hook[];
  props: Props;  // propsもインスタンス情報に含める
}>();

// コンポーネントの最後のpropsを保存
// const componentProps = new WeakMap<FunctionComponent, Props>();

// 現在のコンポーネントのコンテナを取得
export function getCurrentContainer(): HTMLElement | null {
  return currentContainer;
}

// 現在のコンテナを追跡
let currentContainer: HTMLElement | null = null;

function renderComponent(component: FunctionComponent, props: Props, container?: HTMLElement) {
  currentComponent = component;
  currentHook = 0;
  
  if (container) {
    const componentContainer = document.createElement('div');
    currentContainer = componentContainer;
    
    // インスタンス情報を先に設定
    const instance = {
      component,
      hooks: [],  // 空の配列で初期化
      props: { ...props }
    };
    componentInstances.set(componentContainer, instance);
    
    const vnode = component(props);
    instance.props.lastVNode = vnode;
    
    render(vnode, componentContainer);
    container.appendChild(componentContainer);
    
    currentComponent = null;
    currentContainer = null;
    return vnode;
  } else {
    const vnode = component(props);
    return vnode;
  }
}

// 再レンダリング関数を追加
export function rerender(container: HTMLElement) {
  const instance = componentInstances.get(container);
  if (!instance) return;

  // インスタンスからpropsを取得
  const { props } = instance;

  // フォーカスと選択範囲を記憶
  const activeElement = document.activeElement as HTMLInputElement;
  const activeElementIndex = Array.from(container.querySelectorAll('input, textarea, select'))
    .indexOf(activeElement);
  const selectionStart = activeElement?.selectionStart;
  const selectionEnd = activeElement?.selectionEnd;

  // 新しいVNodeを生成
  currentContainer = container;
  currentComponent = instance.component;
  currentHook = 0;  // hooksのインデックスをリセット
  const newVNode = instance.component(props);

  // 前回のVNodeと比較して差分更新
  const oldVNode = props.lastVNode;
  if (oldVNode) {
    diff(oldVNode, newVNode, container.firstChild as HTMLElement);
  } else {
    container.innerHTML = '';
    render(newVNode, container);
  }

  // 新しいpropsを保存
  const { lastVNode: _, ...restProps } = props;
  instance.props = {
    ...restProps,
    lastVNode: newVNode
  };

  // フォーカスと選択範囲を復元
  if (activeElementIndex >= 0) {
    const inputs = container.querySelectorAll('input, textarea, select');
    const input = inputs[activeElementIndex] as HTMLInputElement;
    input?.focus();
    if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
      input.setSelectionRange(selectionStart, selectionEnd);
    }
  }

  // クリーンアップ
  currentContainer = null;
  currentComponent = null;
}

export function render(vnode: ValidNode, container: HTMLElement): void {
  if (typeof vnode === 'string') {
    container.appendChild(document.createTextNode(vnode));
    return;
  }

  if (typeof vnode.type === 'function') {
    renderComponent(vnode.type, vnode.props, container);
    return;
  }

  // 要素の作成
  const dom = document.createElement(vnode.type);
  
  // プロパティの設定
  const props = vnode.props || {};
  Object.entries(props).forEach(([name, value]) => {
    if (name === 'children') return;
    
    // イベントハンドラの処理
    if (name in eventMap) {
      const eventName = eventMap[name as EventNames];
      dom.addEventListener(eventName, value);
    } 
    // クラス名の処理
    else if (name === 'className') {
      dom.setAttribute('class', value);
    }
    // その他の属性
    else {
      dom.setAttribute(name, value);
    }
  });
  
  // 子要素の再帰的レンダリング
  if (props.children) {
    props.children.forEach(child => {
      render(child, dom);
    });
  }
  
  container.appendChild(dom);
} 

export { eventMap };

export function createRoot(container: HTMLElement) {
  return {
    render(element: VNode) {
      render(element, container);
    }
  };
}
