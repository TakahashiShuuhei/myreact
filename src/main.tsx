import { render } from './mini-react'
import { useState, useMemo, useCallback, useEffect } from './mini-react/hooks'
import { ValidNode } from './mini-react/types'
import { createRoot } from './mini-react'

// Buttonコンポーネント
function Button({ onClick, children }: { 
  onClick: () => void, 
  children?: ValidNode | ValidNode[] 
}) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

// Contentコンポーネント
function Content() {
  return (
    <div className="content">
      <h1>ミニReactへようこそ</h1>
      <p>これは自作のReactライクなライブラリです。</p>
      <ul>
        <li>仮想DOM</li>
        <li>コンポーネントシステム</li>
        <li>イベントハンドリング</li>
      </ul>
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState<string>('');  // 2つ目のstate
  
  return (
    <div>
      <p>Count: {String(count)}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <input 
        value={text}
        onInput={(e: InputEvent) => setText((e.target as HTMLInputElement).value)}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>
    </div>
  );
}

function ExpensiveComponent({ data }: { data: number[] }) {
  const [count, setCount] = useState(0);
  const sum = useMemo(() => {
    console.log('Calculating sum...');
    return data.reduce((a, b) => a + b, 0);
  }, [data]);  // countが変更されても再計算されない

  return (
    <div>
      <div>Sum: {String(sum)}</div>
      <button onClick={() => setCount(count + 1)}>
        Count: {String(count)} (click me!)
      </button>
    </div>
  );
}

function CallbackComponent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    console.log('Button clicked!');
    setCount(count + 1);
  }, [count]);  // countが変わるたびに関数を再生成

  const handleReset = useCallback(() => {
    console.log('Reset clicked!');
    setCount(0);
  }, []);  // 依存配列が空なので関数は再生成されない

  return (
    <div>
      <p>Count: {String(count)}</p>
      <button onClick={handleClick}>Increment</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

function EffectComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Effect ran, count is:', count);
    
    // クリーンアップ関数
    return () => {
      console.log('Cleaning up, count was:', count);
    };
  }, [count]);  // countが変更されたときだけ実行

  return (
    <div>
      <p>Count: {String(count)}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="container">
      <Button onClick={() => alert('クリックされました！')}>
        クリックしてください
      </Button>
      <Content />
      <Counter />
      <Counter />
      <ExpensiveComponent data={[1, 2, 3, 4, 5]} />
      <CallbackComponent />
      <EffectComponent />
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />); 