import { rerender, currentComponent, currentHook, incrementCurrentHook } from './index';
import { FunctionComponent } from './types';

// コンポーネントごとのフック状態を保存
const componentHooks = new WeakMap<FunctionComponent, any[]>();

export function useState<T>(initial: T): [T, (newValue: T) => void] {
  if (!currentComponent) {
    throw new Error('useState must be used within a component');
  }

  const component = currentComponent;

  let hooks = componentHooks.get(component);
  if (!hooks) {
    hooks = [];
    componentHooks.set(component, hooks);
  }
  
  const hook = hooks[currentHook] || { value: initial };
  hooks[currentHook] = hook;
  
  const setState = (newValue: T) => {
    hook.value = newValue;
    rerender(component);
  };
  
  incrementCurrentHook();
  return [hook.value, setState];
} 