import { createElement, render } from './mini-react'

const element = createElement(
  'div',
  { className: 'container' },
  createElement('h1', null, 'Hello, Mini React!'),
  createElement('p', null, 'これは自作のReactライクなライブラリです。')
)

render(element, document.getElementById('root')!) 