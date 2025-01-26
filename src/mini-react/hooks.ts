import { rerender, currentComponent, currentHook, incrementCurrentHook, getCurrentContainer, componentInstances } from './index';
import { FunctionComponent } from './types';

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

  const hooks = instance.hooks;
  const hook = hooks[currentHook] || { value: initial };
  hooks[currentHook] = hook;
  
  const setState = (newValue: T) => {
    hook.value = newValue;
    rerender(container);  // コンテナを直接渡す
  };
  
  incrementCurrentHook();
  return [hook.value, setState];
} 