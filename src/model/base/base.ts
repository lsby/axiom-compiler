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
}

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
  ): 条件表达式<Exclude<条件符号, S> | 计算表达式包含符号<R>, Exclude<真符号, S> | 计算表达式包含符号<R>, Exclude<假符号, S> | 计算表达式包含符号<R>, 返回值> {
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
}

// 不动点注册表: 全局映射 自引用符号名 → 不动点实例
let 不动点注册表 = new Map<string, 不动点<any, any, any>>()

// 延迟调用: 持有操作表达式和参数表达式, 求值时才执行调用
// 操作位可以是操作、符号(引用不动点)、或不动点自身
export class 延迟调用<返回值类型> extends 表达式<any, 返回值类型> {
  public constructor(
    private 操作表达式: 任意的表达式,
    private 参数列表: 任意的表达式[],
  ) {
    super()
  }

  public override 代换<S extends string, R extends 任意的表达式>(符号名: S, 替换物: R): 延迟调用<返回值类型> {
    return new 延迟调用(
      this.操作表达式.代换(符号名, 替换物),
      this.参数列表.map((项) => 项.代换(符号名, 替换物)),
    )
  }

  public override 求值(): 返回值类型 {
    let 求值后参数 = this.参数列表.map((项) => 项.求值())
    let 操作目标 = this.操作表达式
    // 如果操作位是操作(含构造子), 直接调用
    if (操作目标 instanceof 操作) return 操作目标.调用(...求值后参数) as 返回值类型
    // 如果操作位是不动点, 对其进行应用
    if (操作目标 instanceof 不动点) return 操作目标.应用(求值后参数)
    // 如果操作位是符号, 从注册表查找不动点
    if (操作目标 instanceof 符号) {
      let 目标不动点 = 不动点注册表.get(操作目标.获得名称())
      if (目标不动点 !== undefined) return 目标不动点.应用(求值后参数)
      throw new Error(`延迟调用的操作位符号 "${操作目标.获得名称()}" 未在不动点注册表中找到`)
    }
    throw new Error('延迟调用的操作位无法求值')
  }

  public 获得操作(): 任意的表达式 {
    return this.操作表达式
  }
  public 获得参数列表(): 任意的表达式[] {
    return this.参数列表
  }
}

// 不动点: fix(自引用符号, 参数符号列表, 体)
// 不做自引用代换(避免循环引用), 而是通过注册表在运行时解析
export class 不动点<自引用符号 extends string, 体符号 extends string, 返回值> extends 表达式<
  Exclude<体符号, 自引用符号>,
  返回值
> {
  public constructor(
    private 自引用符号名: 自引用符号,
    private 参数符号列表: 符号<any, any>[],
    private 体: 表达式<体符号, 返回值>,
  ) {
    super()
    // 注册到全局注册表
    不动点注册表.set(自引用符号名, this)
  }

  public override 代换<S extends Exclude<体符号, 自引用符号> | (string & {}), R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 不动点<自引用符号, Exclude<体符号, S> | 计算表达式包含符号<R>, 返回值> {
    // 保护自引用符号和参数符号
    if ((符号名 as string) === (this.自引用符号名 as string)) return this as any
    let 是参数符号 = this.参数符号列表.some((符号) => 符号.获得名称() === (符号名 as string))
    if (是参数符号) return this as any
    // 其他符号正常传播
    return new 不动点(this.自引用符号名, this.参数符号列表, this.体.代换(符号名, 替换物)) as any
  }

  public override 求值(): 返回值 {
    throw new Error(`不动点 "${this.自引用符号名}" 需要通过 应用 方法传入参数来求值`)
  }

  // 带参数的应用: 只代换参数符号, 自引用通过注册表运行时解析
  public 应用(参数值: any[]): 返回值 {
    let 当前表达式: 任意的表达式 = this.体
    for (let i = 0; i < this.参数符号列表.length; i++) {
      let 当前符号 = this.参数符号列表[i]
      if (当前符号 === undefined) throw new Error('意外的空值')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      当前表达式 = 当前表达式.代换(当前符号.获得名称(), new 值(参数值[i]))
    }
    return 当前表达式.求值()
  }

  public 获得自引用符号名(): 自引用符号 {
    return this.自引用符号名
  }
  public 获得参数符号列表(): 符号<any, any>[] {
    return this.参数符号列表
  }
  public 获得体(): 表达式<体符号, 返回值> {
    return this.体
  }
}
