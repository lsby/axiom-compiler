import { 任意的表达式, 表达式 } from './expression.js'

export class 值<值类型> extends 表达式<never, 值类型> {
  public constructor(private 值: 值类型) {
    super()
  }

  public override 代换<S extends never | (string & {}), R extends 任意的表达式>(
    _符号名: S,
    _替换物: R,
  ): 表达式<never, 值类型> {
    return this
  }
  public override 求值(): 值类型 {
    return this.值
  }

  public override 输出文本(_嵌套?: boolean): string {
    if (Array.isArray(this.值)) return `[${this.值.join(', ')}]`
    return String(this.值)
  }
  public override 输出Latex(_嵌套?: boolean): string {
    return this.获得完整输出组(_嵌套, true)
  }

  protected override 输出主体文本(): string {
    if (Array.isArray(this.值)) return `[${this.值.join(', ')}]`
    return String(this.值)
  }
  protected override 输出主体Latex(): string {
    if (Array.isArray(this.值)) return `[${this.值.join(', ')}]`
    return String(this.值)
  }

  public override 收集依赖(_池: Set<任意的表达式>): void {}
}
