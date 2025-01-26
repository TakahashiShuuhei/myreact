import { render } from './mini-react'

const element = (
  <div className="container">
    <button 
      onClick={() => alert('クリックされました！')}
      className="button"
    >
      クリックしてください
    </button>
    <div className="content">
      <h1>ミニReactへようこそ</h1>
      <p>これは自作のReactライクなライブラリです。</p>
      <ul>
        <li>仮想DOM</li>
        <li>イベントハンドリング</li>
        <li>基本的なレンダリング</li>
      </ul>
    </div>
  </div>
)

render(element, document.getElementById('root')!) 