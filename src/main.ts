import { createElement, render } from './mini-react'

const element = createElement(
  'div',
  { className: 'container' },
  createElement(
    'button',
    { 
      onClick: () => alert('クリックされました！'),
      className: 'button'
    },
    'クリックしてください'
  ),
  createElement(
    'div',
    { className: 'content' },
    createElement('h1', null, 'ミニReactへようこそ'),
    createElement('p', null, 'これは自作のReactライクなライブラリです。'),
    createElement('ul', null,
      createElement('li', null, '仮想DOM'),
      createElement('li', null, 'イベントハンドリング'),
      createElement('li', null, '基本的なレンダリング')
    )
  )
)

render(element, document.getElementById('root')!) 