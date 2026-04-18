// 基本
export type 类型限制<布尔, 预期类型, 错误提示> = 布尔 extends true ? 预期类型 : { _err: 错误提示 }
export type 等价<A, B> = A extends B ? (B extends A ? true : false) : false
export type 包含<Arr, A> = Arr extends []
  ? false
  : Arr extends [infer X, ...infer XS]
    ? 等价<A, X> extends true
      ? true
      : 包含<XS, A>
    : never
export type 子集<子, 父> = 子 extends []
  ? true
  : 子 extends [infer X, ...infer XS]
    ? 包含<父, X> extends true
      ? 子集<XS, 父>
      : false
    : never
export type 去重<Arr> = Arr extends []
  ? []
  : Arr extends [infer X, ...infer XS]
    ? 包含<XS, X> extends true
      ? 去重<XS>
      : [X, ...去重<XS>]
    : never
export type 差集<子, 父> = 子 extends []
  ? []
  : 子 extends [infer X, ...infer XS]
    ? 包含<父, X> extends true
      ? 差集<XS, 父>
      : [X, ...差集<XS, 父>]
    : never

// 函数
export class 函数<参数们类型 extends 参数<string>[], 表达式类型 extends 表达式<string[]>> {
  public constructor(
    public readonly 符号: 类型限制<
      子集<计算表达式允许的变量们<表达式类型>, 计算参数们允许的名称们<参数们类型>>,
      string,
      {
        _错误: '表达式使用了意外的参数'
        _多出的参数: 差集<计算表达式允许的变量们<表达式类型>, 计算参数们允许的名称们<参数们类型>>
      }
    >,
    public readonly 参数们: [...参数们类型],
    public readonly 表达式: 表达式类型,
  ) {}
}
export class 参数<参数类型 extends string> {
  public constructor(public readonly 值: 参数类型) {}
}
type 计算参数允许的名称们<输入参数> = 输入参数 extends 参数<infer X> ? X : never
type 计算参数们允许的名称们<输入参数们> = 去重<
  输入参数们 extends []
    ? []
    : 输入参数们 extends [infer X, ...infer XS]
      ? [计算参数允许的名称们<X>, ...计算参数们允许的名称们<XS>]
      : never
>

// 表达式
const _类型保持符号: unique symbol = Symbol()
const _表达式烙印: unique symbol = Symbol()
export abstract class 表达式<变量们 extends string[]> {
  declare private [_类型保持符号]: 变量们
  private [_表达式烙印] = true
  public constructor() {}
}
export class 数 extends 表达式<[]> {
  public constructor(public readonly 值: number) {
    super()
  }
}
export class 参数引用<值类型 extends string> extends 表达式<[值类型]> {
  public constructor(public readonly 值: 值类型) {
    super()
  }
}
export abstract class 运算<参数们泛型 extends 表达式<string[]>[]> extends 表达式<计算表达式们允许的变量们<参数们泛型>> {
  public constructor(public readonly 参数们: [...参数们泛型]) {
    super()
  }

  public 应该为子项加括号文本(子项: 表达式<string[]>): boolean {
    if (子项 instanceof 运算) {
      return 子项.获得运算优先级() < this.获得运算优先级()
    }
    return false
  }

  public 应该为子项加括号Latex(子项: 表达式<string[]>): boolean {
    if (子项 instanceof 运算) {
      return 子项.获得运算优先级() < this.获得运算优先级()
    }
    return false
  }

  public abstract 生成文本表示(子项文本们: string[]): string
  public abstract 生成Latex表示(子项Latex们: string[]): string
  public abstract 获得运算优先级(): number
  public abstract 计算(运算分量: number[]): number
}

type 计算表达式允许的变量们<输入表达式> = 输入表达式 extends 表达式<infer X> ? X : never
type 计算表达式们允许的变量们<输入表达式们> = 去重<
  输入表达式们 extends []
    ? []
    : 输入表达式们 extends [infer X, ...infer XS]
      ? [...计算表达式允许的变量们<X>, ...计算表达式们允许的变量们<XS>]
      : never
>
