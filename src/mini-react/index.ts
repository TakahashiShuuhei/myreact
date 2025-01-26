import { VNode, Props, EventNames } from './types'

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

export function render(vnode: VNode, container: HTMLElement): void {
  // 文字列の場合はテキストノードを作成
  if (typeof vnode === 'string') {
    container.appendChild(document.createTextNode(vnode));
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