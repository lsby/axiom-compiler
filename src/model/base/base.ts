import z from 'zod/v3'
import { 类型限制, 继承 } from './types.js'

// 所有一切都是表达式
export abstract class 表达式<包含符号 extends string, 返回值> {
  declare protected _类型保持: [包含符号, 返回值]

  // todo: 可以考虑限制替换物的类型 extends 表达式<any, 计算符号返回值<S>>>
  public abstract 代换<S extends 包含符号 | (string & {}), R extends 任意的表达式>(符号名: S, 替换物: R): any // 防止无限递归检查
  public abstract 代换<S extends 包含符号 | (string & {}), R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 表达式<Exclude<包含符号, S> | 计算表达式包含符号<R>, 返回值>

  public abstract 求值(): 返回值
}
export type 任意的表达式 = 表达式<any, any>
export type 计算表达式包含符号<A> = A extends 表达式<infer X, any> ? X : never
export type 计算表达式返回值<A> = A extends 表达式<any, infer X> ? X : never
export type 移除表达式符号<A, S extends string> =
  A extends 表达式<infer 包含符号, infer 返回值> ? 表达式<Exclude<包含符号, S>, 返回值> : never
export type 添加表达式符号<输入表达式, 符号 extends string> =
  输入表达式 extends 表达式<infer 包含符号, infer 返回值> ? 表达式<包含符号 | 符号, 返回值> : never
export type 替换表达式符号<输入表达式, 旧符号 extends string, 新符号 extends string> = 添加表达式符号<
  移除表达式符号<输入表达式, 旧符号>,
  新符号
>

export type 计算表达式们包含符号<表达式> = 表达式 extends []
  ? never
  : 表达式 extends [infer X, ...infer XS]
    ? 计算表达式包含符号<X> | 计算表达式们包含符号<XS>
    : never
export type 替换表达式们符号<表达式们, 旧符号 extends string, 新符号 extends string> = 表达式们 extends []
  ? 表达式们
  : 表达式们 extends [infer X, ...infer XS]
    ? [替换表达式符号<X, 旧符号, 新符号>, ...替换表达式们符号<XS, 旧符号, 新符号>]
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
}
// export type 任意的符号 = 符号<any, any>

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
}
// export type 任意的值 = 值<any>

// 操作类似函数, 表示一种计算
export class 操作<操作名称 extends string, const 参数类型 extends any[], 返回值类型> extends 表达式<never, never> {
  public constructor(
    private 操作名称: 操作名称,
    private 实现: (...参数: [...参数类型]) => 返回值类型,
  ) {
    super()
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
}
// export type 任意的操作 = 操作<any, any, any>
// export type 计算操作参数长度<A> = A extends 操作<any, infer Arr, any> ? Arr['length'] : never
export type 计算操作参数类型<A> = A extends 操作<any, infer Arr, any> ? Arr : never
export type 计算操作返回值类型<A> = A extends 操作<any, any, infer X> ? X : never

// 数据是表达式的数组
export class 数据<const 值类型 extends 任意的表达式[]> extends 表达式<计算表达式们包含符号<值类型>, 值类型> {
  public constructor(private 值: [...值类型]) {
    super()
  }

  public override 代换<S extends 计算表达式们包含符号<值类型> | (string & {}), R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 数据<替换表达式们符号<值类型, S, 计算表达式包含符号<R>>> {
    return new 数据(this.值.map((a) => a.代换(符号名, 替换物))) as any
  }
  public override 求值(): 值类型 {
    return this.值
  }
  public 获得各项(): [...值类型] {
    return this.值
  }
}
export type 任意的数据 = 数据<any>
// export type 计算数据长度<A> = A extends 数据<infer Arr> ? Arr['length'] : never
export type 计算数据值类型<T> = T extends 数据<infer Arr> ? Arr : never
export type 计算数据返回值类型<T> = T extends 数据<infer Arr> ? { [K in keyof Arr]: 计算表达式返回值<Arr[K]> } : never
export type 计算数据包含符号<T> = T extends 数据<infer Arr> ? 计算表达式们包含符号<Arr> : never
export type 替换数据符号<输入数据, 旧符号 extends string, 新符号 extends string> = 数据<
  替换表达式们符号<计算数据值类型<输入数据>, 旧符号, 新符号>
>

// 调用是操作与参数组成的结构
export class 调用<
  操作类型 extends 类型限制<
    继承<计算数据返回值类型<参数类型>, 计算操作参数类型<操作类型>>,
    any,
    {
      错误: '调用操作时参数类型不匹配'
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
}
