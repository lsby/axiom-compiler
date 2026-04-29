import { 任意的表达式, 表达式, 计算表达式包含符号 } from './expression.js'

// 条件表达式: 惰性求值的 if-then-else
export class 条件表达式<条件符号 extends string, 真符号 extends string, 假符号 extends string, 返回值> extends 表达式<
  条件符号 | 真符号 | 假符号,
  返回值
> {
  public constructor(
    private 条件: 表达式<条件符号, boolean>,
    private 真分支: 表达式<真符号, 返回值>,
    private 假分支: 表达式<假符号, 返回值>,
  ) {
    super()
  }

  public override 代换<S extends (条件符号 | 真符号 | 假符号) | (string & {}), R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 条件表达式<
    Exclude<条件符号, S> | 计算表达式包含符号<R>,
    Exclude<真符号, S> | 计算表达式包含符号<R>,
    Exclude<假符号, S> | 计算表达式包含符号<R>,
    返回值
  > {
    return new 条件表达式(
      this.条件.代换(符号名, 替换物),
      this.真分支.代换(符号名, 替换物),
      this.假分支.代换(符号名, 替换物),
    ) as any
  }

  public override 求值(): 返回值 {
    return this.条件.求值() ? this.真分支.求值() : this.假分支.求值()
  }

  public 获得条件(): 表达式<条件符号, boolean> {
    return this.条件
  }
  public 获得真分支(): 表达式<真符号, 返回值> {
    return this.真分支
  }
  public 获得假分支(): 表达式<假符号, 返回值> {
    return this.假分支
  }

  public override 输出文本(嵌套?: boolean): string {
    return `(${this.条件.输出文本(true)} ? ${this.真分支.输出文本(true)} : ${this.假分支.输出文本(true)})`
  }
  public override 输出Latex(嵌套?: boolean): string {
    return this.获得完整输出组(嵌套, true)
  }

  protected override 输出主体文本(): string {
    return `(${this.条件.输出文本(true)} ? ${this.真分支.输出文本(true)} : ${this.假分支.输出文本(true)})`
  }
  protected override 输出主体Latex(): string {
    let 列表 = this.获得Latex分支列表()
    let 每一项 = 列表.条件与结果.map(([c, r]) => `${r} & \\text{if } ${c}`).join(' \\\\ ')
    return String.raw`\begin{cases} ${每一项} \\ ${列表.最终结果} & \text{otherwise} \end{cases}`
  }

  private 获得Latex分支列表(): { 条件与结果: [string, string][]; 最终结果: string } {
    let 结果: [string, string][] = [[this.条件.输出Latex(true), this.真分支.输出Latex(true)]]
    if (this.假分支 instanceof 条件表达式) {
      let 下级 = this.假分支.获得Latex分支列表()
      结果.push(...下级.条件与结果)
      return { 条件与结果: 结果, 最终结果: 下级.最终结果 }
    } else {
      return { 条件与结果: 结果, 最终结果: this.假分支.输出Latex(true) }
    }
  }

  public override 收集依赖(池: Set<任意的表达式>): void {
    this.条件.收集依赖(池)
    this.真分支.收集依赖(池)
    this.假分支.收集依赖(池)
  }
}
