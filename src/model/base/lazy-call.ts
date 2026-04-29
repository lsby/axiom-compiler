import { 任意的表达式, 表达式, 计算表达式符号映射 } from './expression.js'
import { 不动点 } from './fixed-point.js'
import { 操作 } from './operation.js'
import { 符号 } from './symbol.js'

// 延迟调用: 持有操作表达式和参数表达式, 求值时才执行调用
// 操作位可以是操作或不动点
export class 延迟调用<符号映射 extends Record<string, any>, 返回值类型> extends 表达式<符号映射, 返回值类型> {
  public constructor(
    private 操作表达式: 表达式<any, any>,
    private 参数列表: 表达式<any, any>[],
  ) {
    super()
  }

  public override 代换<
    S extends Extract<keyof 符号映射, string> | (string & {}),
    R extends 表达式<any, S extends keyof 符号映射 ? 符号映射[S] : any>,
  >(符号名: S, 替换物: R): 延迟调用<Omit<符号映射, S> & 计算表达式符号映射<R>, 返回值类型> {
    return new 延迟调用(
      this.操作表达式.代换(符号名 as any, 替换物),
      this.参数列表.map((项) => 项.代换(符号名 as any, 替换物)),
    ) as any
  }

  public override 求值(): 返回值类型 {
    let 求值后参数 = this.参数列表.map((项) => 项.求值())
    let 操作目标 = this.操作表达式
    // 如果操作位是操作(含算子), 直接调用
    if (操作目标 instanceof 操作) return 操作目标.调用(...求值后参数) as 返回值类型
    // 如果操作位是不动点, 对其进行应用
    if (操作目标 instanceof 不动点) return 操作目标.应用(求值后参数)
    throw new Error('延迟调用的操作位无法求值')
  }

  public 获得操作(): 任意的表达式 {
    return this.操作表达式
  }
  public 获得参数列表(): 任意的表达式[] {
    return this.参数列表
  }

  public override 输出文本(_嵌套?: boolean): string {
    let 操作目标 = this.操作表达式
    if (操作目标 instanceof 操作) return 操作目标.格式化纯文本(this.参数列表)
    if (操作目标 instanceof 不动点) return 操作目标.格式化纯文本(this.参数列表)
    if (操作目标 instanceof 符号)
      return `${操作目标.获得名称()}(${this.参数列表.map((p) => p.输出文本(true)).join(', ')})`
    return `<延迟调用>`
  }
  public override 输出Latex(嵌套?: boolean): string {
    return this.获得完整输出组(嵌套, true)
  }

  protected override 输出主体文本(): string {
    let 操作目标 = this.操作表达式
    if (操作目标 instanceof 操作) return 操作目标.格式化纯文本(this.参数列表)
    if (操作目标 instanceof 不动点) return 操作目标.格式化纯文本(this.参数列表)
    if (操作目标 instanceof 符号)
      return `${操作目标.获得名称()}(${this.参数列表.map((p) => p.输出文本(true)).join(', ')})`
    return `<延迟调用>`
  }
  protected override 输出主体Latex(): string {
    let 操作目标 = this.操作表达式
    if (操作目标 instanceof 操作) return 操作目标.格式化Latex(this.参数列表)
    if (操作目标 instanceof 不动点) return 操作目标.格式化Latex(this.参数列表)
    if (操作目标 instanceof 符号)
      return `\\mathrm{${操作目标.获得名称()}}(${this.参数列表.map((p) => p.输出Latex(true)).join(', ')})`
    return `\\text{<延迟调用>}`
  }

  public override 收集符号(池: Set<任意的表达式>): void {
    for (let 项 of this.参数列表) {
      项.收集符号(池)
    }
  }

  public override 收集依赖(池: Set<任意的表达式>): void {
    this.操作表达式.收集依赖(池)
    this.参数列表.forEach((p) => p.收集依赖(池))
  }
}
