import { render } from './mini-react'

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

// アプリケーション
const element = (
  <div className="container">
    <Button onClick={() => alert('クリックされました！')}>
      クリックしてください
    </Button>
    <Content />
  </div>
);

render(element, document.getElementById('root')!) 