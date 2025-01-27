import { rerender, currentComponent, currentHook, incrementCurrentHook, getCurrentContainer, componentInstances } from './index';

export function useState<T>(initial: T): [T, (newValue: T) => void] {
  if (!currentComponent) {
    throw new Error('useState must be used within a component');
  }

  const container = getCurrentContainer();
  if (!container) {
    throw new Error('Component container not found');
  }

  const instance = componentInstances.get(container);
  if (!instance) {
    throw new Error('Component instance not found');
  }


  const hook = instance.hooks[currentHook] || { value: initial };
  instance.hooks[currentHook] = hook;
  
  const setState = (newValue: T) => {
    hook.value = newValue;
    rerender(container);
  };
  
  incrementCurrentHook();
  return [hook.value, setState];
}

type DependencyList = any[];

interface MemoHook<T> {
  value: T;
  deps: DependencyList;
}

export function useMemo<T>(factory: () => T, deps: DependencyList): T {
  const container = getCurrentContainer();
  if (!container) {
    throw new Error('Component container not found');
  }

  const instance = componentInstances.get(container);
  if (!instance) {
    throw new Error('Component instance not found');
  }

  const hook = instance.hooks[currentHook] as MemoHook<T> | undefined;
  const depsChanged = !hook?.deps || !deps.every((dep, i) => dep === hook.deps[i]);

  // 初回実行時、または依存配列が変更された時のみ計算を実行
  const newHook: MemoHook<T> = depsChanged
    ? { value: factory(), deps }
    : hook;

  instance.hooks[currentHook] = newHook;
  incrementCurrentHook();

  return newHook.value;
}

export function useCallback<T extends Function>(callback: T, deps: DependencyList): T {
  return useMemo(() => callback, deps);
} 