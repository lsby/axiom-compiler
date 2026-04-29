import { 任意的表达式, 表达式 } from './expression.js'
import { 符号 } from './symbol.js'

// 操作类似函数, 表示一种计算
export class 操作<操作名称 extends string, const 参数类型 extends any[], 返回值类型> extends 表达式<never, never> {
  public constructor(
    protected 操作名称: 操作名称,
    private 实现: (...参数: [...参数类型]) => 返回值类型,
    private 选项?: { 体?: 表达式<any, any>; 参数符号?: 符号<any, any>[] },
  ) {
    super()
  }

  public override 获得是否隐藏(): boolean {
    return false
  }

  public 调用(...参数: [...参数类型]): 返回值类型 {
    return this.实现(...参数)
  }

  public override 代换<S extends never | (string & {}), R extends 任意的表达式>(
    _符号名: S,
    _替换物: R,
  ): 表达式<never, never> {
    return this
  }
  public override 求值(): never {
    throw new Error(`操作 "${this.操作名称}" 无法直接求值, 请通过 "调用" 类来执行该操作`)
  }

  public 获得名称(): string {
    return this.操作名称
  }

  public override 获得依赖名称(): string | undefined {
    return this.获得名称()
  }
  public override 获得依赖定义文本(): string | undefined {
    return this.输出定义文本()
  }
  public override 获得依赖定义Latex(): string | undefined {
    return this.输出定义Latex()
  }

  public override 输出文本(_嵌套?: boolean): string {
    return this.操作名称
  }
  public override 输出Latex(_嵌套?: boolean): string {
    return this.获得完整输出组(_嵌套, true)
  }

  protected override 输出主体文本(): string {
    return this.操作名称
  }
  protected override 输出主体Latex(): string {
    return `\\mathrm{${this.操作名称}}`
  }

  public 输出定义文本(): string {
    if (this.选项?.体 !== undefined && this.选项.参数符号 !== undefined) {
      let 参数文本 = this.选项.参数符号.map((p) => p.输出文本(true)).join(', ')
      return `let ${this.操作名称} = (${参数文本}) => ${this.选项.体.输出文本(true)}`
    }
    return `let ${this.操作名称} = <算子实现>`
  }
  public 输出定义Latex(): string {
    if (this.选项?.体 !== undefined && this.选项.参数符号 !== undefined) {
      let 参数文本 = this.选项.参数符号.map((p) => p.输出Latex(true)).join(', ')
      return `\\mathrm{${this.操作名称}}(${参数文本}) &= ${this.选项.体.输出Latex(true)}`
    }
    return `\\mathrm{${this.操作名称}} &= [\\text{operator implementation}]`
  }

  public 格式化纯文本(参数: 任意的表达式[]): string {
    return `${this.操作名称}(${参数.map((p) => p.输出文本(true)).join(', ')})`
  }
  public 格式化Latex(参数: 任意的表达式[]): string {
    return `\\mathrm{${this.操作名称}}(${参数.map((p) => p.输出Latex(true)).join(', ')})`
  }

  public override 收集依赖(池: Set<任意的表达式>): void {
    if (池.has(this)) return
    池.add(this)
  }
}

export type 计算操作参数类型<A> = A extends 操作<any, infer Arr, any> ? Arr : never
export type 计算操作返回值类型<A> = A extends 操作<any, any, infer X> ? X : never
