import { rerender, currentComponent, currentHook, incrementCurrentHook, getCurrentContainer, componentInstances } from './index';

interface StateHook<T> {
  value: T;
}

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

  const hook = instance.hooks[currentHook] as StateHook<T> || { value: initial };
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

export interface EffectHook {
  deps?: DependencyList;
  cleanup?: () => void;
  hasRun?: boolean;
}

export function useEffect(effect: () => void | (() => void), deps: DependencyList = []) {
  const container = getCurrentContainer();
  if (!container) {
    throw new Error('Component container not found');
  }

  const instance = componentInstances.get(container);
  if (!instance) {
    throw new Error('Component instance not found');
  }

  const hook = instance.hooks[currentHook] as EffectHook | undefined;
  const hookDeps = hook?.deps;
  const depsChanged = !hookDeps || !deps || 
    deps.length !== hookDeps.length || 
    deps.some((dep, i) => dep !== hookDeps[i]);

  // 初回実行時またはdepsが変更された時のみエフェクトを実行
  if (!hook?.hasRun || depsChanged) {
    // クリーンアップ関数を実行（初回以外）
    if (hook?.cleanup) {
      hook.cleanup();
    }

    // 新しいエフェクトを実行
    const cleanup = effect();
    instance.hooks[currentHook] = {
      deps,
      cleanup: cleanup || undefined,
      hasRun: true
    };
  }

  incrementCurrentHook();
} 