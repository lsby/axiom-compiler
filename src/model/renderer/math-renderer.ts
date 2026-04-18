import { 参数引用, 数, 表达式, 运算 } from '../math/math.js'

export class 数学渲染器 {
  /**
   * 将表达式转换为纯文本格式，例如 "a * b + 10"
   */
  public static 渲染为文本(节点: 表达式<string[]>): string {
    if (节点 instanceof 数) {
      return 节点.值.toString()
    }

    if (节点 instanceof 参数引用) {
      return 节点.值
    }

    if (节点 instanceof 运算) {
      let 子项文本 = 节点.参数们.map((项) => {
        let 文本 = 数学渲染器.渲染为文本(项)
        // 如果子项是运算且优先级可能产生歧义，可以加上括号
        if (项 instanceof 运算 && 数学渲染器.获取优先级(项.符号) < 数学渲染器.获取优先级(节点.符号)) {
          return `(${文本})`
        }
        return 文本
      })

      return 子项文本.join(` ${节点.符号} `)
    }

    return ''
  }

  /**
   * 将表达式转换为 LaTeX 格式，例如 "a \cdot b + 10" 或 "\frac{a}{b}"
   */
  public static 渲染为Latex(节点: 表达式<string[]>): string {
    if (节点 instanceof 数) {
      return 节点.值.toString()
    }

    if (节点 instanceof 参数引用) {
      return 节点.值
    }

    if (节点 instanceof 运算) {
      let 子项Latex = 节点.参数们.map((项) => 数学渲染器.渲染为Latex(项))

      switch (节点.符号) {
        case '+':
          return 子项Latex.join(' + ')
        case '-':
          return 子项Latex.join(' - ')
        case '*':
          return 子项Latex.join(' \\cdot ')
        case '/':
          // 除法在 LaTeX 中通常渲染为分数
          return `\\frac{${子项Latex[0]}}{${子项Latex[1]}}`
      }
    }

    return ''
  }

  private static 获取优先级(符号: string): number {
    if (符号 === '+' || 符号 === '-') return 1
    if (符号 === '*' || 符号 === '/') return 2
    return 0
  }
}
