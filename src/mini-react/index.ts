import { VNode, Props, EventNames, FunctionComponent, ValidNode } from './types'

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
  hooks: any[];
}>();

// コンポーネントの最後のpropsを保存
const componentProps = new WeakMap<FunctionComponent, Props>();

// 現在のコンポーネントのコンテナを取得
export function getCurrentContainer(): HTMLElement | null {
  return currentContainer;
}

// 現在のコンテナを追跡
let currentContainer: HTMLElement | null = null;

function renderComponent(component: FunctionComponent, props: Props, container?: HTMLElement) {
  currentComponent = component;
  currentHook = 0;
  
  componentProps.set(component, props);
  
  if (container) {
    const componentContainer = document.createElement('div');
    // インスタンス情報を保存
    componentInstances.set(componentContainer, {
      component,
      hooks: []
    });
    currentContainer = componentContainer;  // ここで設定
    const vnode = component(props);
    render(vnode, componentContainer);
    container.appendChild(componentContainer);
  } else {
    currentContainer = null;
    const vnode = component(props);
    return vnode;
  }
  
  currentComponent = null;
  currentContainer = null;  // クリア
}

// 再レンダリング関数を追加
export function rerender(container: HTMLElement) {
  const instance = componentInstances.get(container);
  if (!instance) return;

  const props = componentProps.get(instance.component);
  if (!props) return;

  // コンテナの中身をクリア
  container.innerHTML = '';
  
  // 再レンダリング前にコンテナを設定
  currentContainer = container;
  currentComponent = instance.component;
  currentHook = 0;

  // コンポーネントを再レンダリング
  const vnode = instance.component(props);
  render(vnode, container);

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