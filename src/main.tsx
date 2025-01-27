import { render } from './mini-react'
import { useState } from './mini-react/hooks'
import { ValidNode } from './mini-react/types'

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
        onInput={(e) => setText(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>
    </div>
  );
}

// アプリケーション
const element = (
  <div className="container">
    <Button onClick={() => alert('クリックされました！')}>
      クリックしてください
    </Button>
    <Content />
    <Counter />
    <Counter />
  </div>
);

render(element, document.getElementById('root')!) 