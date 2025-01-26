import { render } from './mini-react'
import { useState } from './mini-react/hooks'

// Buttonコンポーネント
function Button({ onClick, children }: { onClick: () => void, children: ValidNode[] }) {
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
  
  return (
    <div>
      <p>Count: {String(count)}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
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
  </div>
);

render(element, document.getElementById('root')!) 