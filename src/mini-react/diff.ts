import { VNode, Props, ValidNode, EventNames } from "./types";
import { render } from "./index";
import { eventMap } from "./index";

// 差分検出と更新を行う関数
export function diff(oldVNode: VNode, newVNode: VNode, container: HTMLElement) {

  // 1. タイプが異なる場合は完全に置き換え
  if (oldVNode.type !== newVNode.type) {
    const temp = document.createElement('div');
    render(newVNode, temp);
    container.replaceWith(temp.firstChild!);
    return;
  }

  // 2. プロパティの差分更新
  updateProps(container, oldVNode.props, newVNode.props);

  // 3. 子要素の差分更新
  const oldChildren = oldVNode.props.children || [];
  const newChildren = newVNode.props.children || [];
  reconcileChildren(container, oldChildren, newChildren);
}

// プロパティの更新
function updateProps(element: HTMLElement, oldProps: Props, newProps: Props) {
  // 古いプロパティの削除
  for (const key in oldProps) {
    if (key === 'children') continue;
    if (!(key in newProps)) {
      element.removeAttribute(key);
    }
  }

  // 新しいプロパティの設定
  for (const key in newProps) {
    if (key === 'children') continue;
    if (oldProps[key] !== newProps[key]) {
      // イベントハンドラの更新
      if (key in eventMap) {
        const eventName = eventMap[key as EventNames];
        element.removeEventListener(eventName, oldProps[key]);
        element.addEventListener(eventName, newProps[key]);
      } else {
        element.setAttribute(key, newProps[key]);
      }
    }
  }
}

// 子要素の差分更新
function reconcileChildren(
  parent: HTMLElement,
  oldChildren: ValidNode[],
  newChildren: ValidNode[]
) {
  const maxLength = Math.max(oldChildren.length, newChildren.length);
  
  for (let i = 0; i < maxLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    // 文字列の更新を追加
    if (typeof oldChild === 'string' || typeof newChild === 'string') {
      if (oldChild !== newChild) {
        parent.childNodes[i].textContent = String(newChild);
      }
      continue;
    }

    // 新しい子要素の追加
    if (!oldChild && newChild) {
      render(newChild, parent);
      continue;
    }

    // 古い子要素の削除
    if (oldChild && !newChild) {
      parent.removeChild(parent.childNodes[i]);
      continue;
    }

    // 両方存在する場合は差分更新
    if (typeof oldChild === 'object' && typeof newChild === 'object') {
      diff(oldChild, newChild, parent.childNodes[i] as HTMLElement);
    }
  }
} 