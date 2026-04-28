import z from 'zod/v3'

export type 类型限制<布尔, 预期类型, 错误提示> = 布尔 extends true ? 预期类型 : { _err: 错误提示 }
export type 等于<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
export type 继承<A, B> = A extends B ? true : false

// 所有一切都是表达式
export abstract class 表达式<包含符号 extends string, 返回值> {
  declare protected _类型保持: [包含符号, 返回值]

  // todo: 可以考虑限制替换物的类型 extends 表达式<any, 计算符号返回值<S>>>
  public abstract 代换<S extends 包含符号, R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 表达式<Exclude<包含符号, S> | 计算表达式包含符号<R>, 返回值>

  public abstract 求值(): 返回值
  public abstract 转纯文本(): string
  public abstract 转Latex(): string
}
type 任意的表达式 = 表达式<any, any>
type 计算表达式包含符号<A> = A extends 表达式<infer X, any> ? X : never
type 计算表达式返回值<A> = A extends 表达式<any, infer X> ? X : never
type 计算表达式数组包含符号<A> = A extends []
  ? never
  : A extends [infer X, ...infer XS]
    ? 计算表达式包含符号<X> | 计算表达式数组包含符号<XS>
    : never

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

  public override 代换<S extends 符号名称, R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 表达式<计算表达式包含符号<R>, z.infer<预期类型zod>> {
    if (this.符号名称 === 符号名) return 替换物
    return this as any
  }
  public override 求值(): never {
    throw new Error('符号没有返回值')
  }
  public override 转纯文本(): string {
    return this.符号名称
  }
  public override 转Latex(): string {
    return this.符号名称
  }
}
// type 任意的符号 = 符号<any, any>

// 暂时只有数字可以封装为值
export class 值<const 值类型 extends number> extends 表达式<never, 值类型> {
  public constructor(private 值: 值类型) {
    super()
  }

  public override 代换<S extends never, R extends 任意的表达式>(_符号名: S, _替换物: R): 表达式<never, 值类型> {
    return this
  }
  public override 求值(): 值类型 {
    return this.值
  }
  public override 转纯文本(): string {
    return String(this.值)
  }
  public override 转Latex(): string {
    return String(this.值)
  }
}
// type 任意的值 = 值<any>

// 操作类似函数, 表示一种计算
export class 操作<操作名称 extends string, const 参数类型 extends any[], 返回值类型> extends 表达式<never, never> {
  public constructor(
    private 操作名称: 操作名称,
    private 实现: (...参数: [...参数类型]) => 返回值类型,
    private 纯文本格式化: (参数: string[]) => string,
    private Latex格式化: (参数: string[]) => string,
  ) {
    super()
  }

  public 获得实现(): (...参数: [...参数类型]) => 返回值类型 {
    return this.实现
  }

  public override 代换<S extends never, R extends 任意的表达式>(_符号名: S, _替换物: R): 表达式<never, never> {
    return this
  }
  public override 求值(): never {
    throw new Error('操作没有返回值')
  }
  public 格式化纯文本(参数: string[]): string {
    return this.纯文本格式化(参数)
  }
  public 格式化Latex(参数: string[]): string {
    return this.Latex格式化(参数)
  }
  public override 转纯文本(): string {
    return this.操作名称
  }
  public override 转Latex(): string {
    return this.操作名称
  }
}
// type 任意的操作 = 操作<any, any, any>
// type 计算操作参数长度<A> = A extends 操作<any, infer Arr, any> ? Arr['length'] : never
type 计算操作参数类型<A> = A extends 操作<any, infer Arr, any> ? Arr : never
type 计算操作返回值类型<A> = A extends 操作<any, any, infer X> ? X : never

// 数据是表达式的数组
export class 数据<const 值类型 extends 任意的表达式[]> extends 表达式<计算表达式数组包含符号<值类型>, 值类型> {
  public constructor(private 值: [...值类型]) {
    super()
  }

  public override 代换<S extends 计算表达式数组包含符号<值类型>, R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 表达式<Exclude<计算表达式数组包含符号<值类型>, S> | 计算表达式包含符号<R>, 值类型> {
    return new 数据(this.值.map((a) => a.代换(符号名, 替换物))) as any
  }
  public override 求值(): 值类型 {
    return this.值
  }
  public 转各项纯文本(): string[] {
    return this.值.map((a) => a.转纯文本())
  }
  public 转各项Latex(): string[] {
    return this.值.map((a) => a.转Latex())
  }
  public override 转纯文本(): string {
    return this.值.map((a) => a.转纯文本()).join(', ')
  }
  public override 转Latex(): string {
    return this.值.map((a) => a.转Latex()).join(', ')
  }
}
type 任意的数据 = 数据<any>
// type 计算数据长度<A> = A extends 数据<infer Arr> ? Arr['length'] : never
type 计算数据返回值类型<T> = T extends 数据<infer Arr> ? { [K in keyof Arr]: 计算表达式返回值<Arr[K]> } : never
type 计算数据包含符号<T> = T extends 数据<infer Arr> ? 计算表达式数组包含符号<Arr> : never

// 调用是操作与参数组成的结构
export class 调用<
  操作类型 extends 类型限制<继承<计算数据返回值类型<参数类型>, 计算操作参数类型<操作类型>>, any, '参数不匹配'>,
  const 参数类型 extends 任意的数据,
> extends 表达式<计算数据包含符号<参数类型>, 计算操作返回值类型<操作类型>> {
  public constructor(
    private 操作: 操作类型,
    private 参数: 参数类型,
  ) {
    super()
  }
  public override 代换<S extends 计算数据包含符号<参数类型>, R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 表达式<Exclude<计算数据包含符号<参数类型>, S> | 计算表达式包含符号<R>, 计算操作返回值类型<操作类型>> {
    return new 调用(this.操作, this.参数.代换(符号名, 替换物) as any) as any
  }
  public override 求值(): 计算操作返回值类型<操作类型> {
    return (this.操作.获得实现() as Function)(...this.参数.求值().map((项: any) => 项.求值()))
  }
  public override 转纯文本(): string {
    return this.操作.格式化纯文本(this.参数.转各项纯文本())
  }
  public override 转Latex(): string {
    return this.操作.格式化Latex(this.参数.转各项Latex())
  }
}
