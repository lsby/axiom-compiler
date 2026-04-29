import z from 'zod/v3'
import { 任意的表达式, 表达式, 计算表达式包含符号 } from './expression.js'

// 符号是占位符
export class 符号<符号名称 extends string, 预期类型zod extends z.ZodTypeAny> extends 表达式<
  符号名称,
  z.infer<预期类型zod>
> {
  public constructor(
    private 符号名称: 符号名称,
    private 符号描述: 预期类型zod,
  ) {
    super()
  }

  public override 代换<S extends 符号名称 | (string & {}), R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 表达式<Exclude<符号名称, S> | 计算表达式包含符号<R>, z.infer<预期类型zod>> {
    if (this.符号名称 === 符号名) return 替换物
    return this as any
  }
  public override 求值(): never {
    throw new Error(`符号 "${this.符号名称}" 尚未代换为具体数值, 无法求值`)
  }
  public 获得名称(): 符号名称 {
    return this.符号名称
  }

  public override 输出文本(_嵌套?: boolean): string {
    return this.符号名称
  }
  public override 输出Latex(_嵌套?: boolean): string {
    return this.获得完整输出组(_嵌套, true)
  }

  protected override 输出主体文本(): string {
    return this.符号名称
  }
  protected override 输出主体Latex(): string {
    return this.符号名称
  }

  public override 收集依赖(_池: Set<任意的表达式>): void {}
}
