import { Props, FunctionComponent, VNode } from './types';
import { getCurrentContainer, componentInstances } from './framework';

export function memo<P extends Props>(
  Component: FunctionComponent<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  // デフォルトの比較関数
  const defaultAreEqual = (prev: P, next: P): boolean => {
    return Object.keys(prev).every(key => prev[key] === next[key]);
  };

  const compareProps = areEqual || defaultAreEqual;

  return function MemoComponent(props: P): VNode {
    const container = getCurrentContainer();
    if (!container) {
      return Component(props);  // コンテナがない場合は通常通り実行
    }

    const instance = componentInstances.get(container);
    if (!instance) {
      return Component(props);  // インスタンスがない場合は通常通り実行
    }

    // メモ化された結果がある場合は比較
    if (instance.memoized?.props) {
      if (compareProps(instance.memoized.props as P, props)) {
        return instance.memoized.result;  // propsが同じなら前回の結果を再利用
      }
    }

    // 新しい結果を計算してメモ化
    const result = Component(props);
    instance.memoized = {
      props,
      result
    };

    return result;
  };
} 