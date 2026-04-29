import { 任意的数据, 替换数据符号, 计算数据包含符号, 计算数据返回值类型 } from './data.js'
import { 任意的表达式, 表达式, 计算表达式包含符号 } from './expression.js'
import { 操作, 计算操作参数类型, 计算操作返回值类型 } from './operation.js'
import { 类型限制, 继承 } from './types.js'

// 调用是操作与参数组成的结构
export class 调用<
  操作类型 extends 类型限制<
    继承<计算数据返回值类型<参数类型>, 计算操作参数类型<操作类型>>,
    any,
    {
      错误: '调用参数类型不匹配'
      操作名称: 操作类型 extends 操作<infer N, any, any> ? N : '未知操作'
      期待的参数类型: 计算操作参数类型<操作类型>
      实际传入的参数类型: 计算数据返回值类型<参数类型>
    }
  >,
  const 参数类型 extends 任意的数据,
> extends 表达式<计算数据包含符号<参数类型>, 计算操作返回值类型<操作类型>> {
  public constructor(
    private 操作: 操作类型,
    private 参数: 参数类型,
  ) {
    super()
  }
  public override 代换<S extends 计算数据包含符号<参数类型> | (string & {}), R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 调用<操作类型, 替换数据符号<参数类型, S, 计算表达式包含符号<R>>> {
    return new 调用(this.操作, this.参数.代换(符号名, 替换物) as any) as any
  }
  public override 求值(): 计算操作返回值类型<操作类型> {
    return this.操作.调用(...this.参数.求值().map((项: any) => 项.求值()))
  }

  public override 输出文本(嵌套?: boolean): string {
    return this.操作.格式化纯文本(this.参数.获得各项())
  }
  public override 输出Latex(嵌套?: boolean): string {
    return this.获得完整输出组(嵌套, true)
  }

  protected override 输出主体文本(): string {
    return this.操作.格式化纯文本(this.参数.获得各项())
  }
  protected override 输出主体Latex(): string {
    return this.操作.格式化Latex(this.参数.获得各项())
  }

  public override 收集依赖(池: Set<任意的表达式>): void {
    this.操作.收集依赖(池)
    this.参数.收集依赖(池)
  }
}
