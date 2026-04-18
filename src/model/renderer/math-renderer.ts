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
        if (节点.应该为子项加括号文本(项)) {
          return `(${文本})`
        }
        return 文本
      })

      return 节点.生成文本表示(子项文本)
    }

    throw new Error('渲染失败')
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
      let 子项Latex = 节点.参数们.map((项) => {
        let latex = 数学渲染器.渲染为Latex(项)
        if (节点.应该为子项加括号Latex(项)) {
          return `(${latex})`
        }
        return latex
      })

      return 节点.生成Latex表示(子项Latex)
    }

    throw new Error('渲染失败')
  }
}
