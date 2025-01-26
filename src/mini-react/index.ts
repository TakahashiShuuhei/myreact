export function createElement(type: string, props: any, ...children: any[]) {
  return {
    type,
    props: {
      ...props,
      children: children.flat()
    }
  }
}

export function render(element: any, container: HTMLElement) {
  const dom = document.createElement(element.type)
  
  // プロパティの設定
  Object.keys(element.props)
    .filter(key => key !== 'children')
    .forEach(name => {
      dom[name] = element.props[name]
    })
  
  // 子要素の再帰的レンダリング
  element.props.children.forEach((child: any) => {
    if (typeof child === 'string') {
      dom.appendChild(document.createTextNode(child))
    } else {
      render(child, dom)
    }
  })
  
  container.appendChild(dom)
} 