// 基本
type 类型限制<布尔, 预期类型, 错误提示> = 布尔 extends true ? 预期类型 : { _err: 错误提示 }
type 等价<A, B> = A extends B ? (B extends A ? true : false) : false
type 包含<Arr, A> = Arr extends []
  ? false
  : Arr extends [infer X, ...infer XS]
    ? 等价<A, X> extends true
      ? true
      : 包含<XS, A>
    : never
type 子集<子, 父> = 子 extends []
  ? true
  : 子 extends [infer First, ...infer Rest]
    ? 包含<父, First> extends true
      ? 子集<Rest, 父>
      : false
    : never

// 函数
export class 函数<参数们类型 extends 参数<string>[], 表达式类型 extends 表达式<string[]>> {
  public constructor(
    private 符号: 类型限制<
      子集<计算表达式允许的变量们<表达式类型>, 计算参数们允许的名称们<参数们类型>>,
      string,
      '表达式使用了意外的参数'
    >,
    private 参数们: [...参数们类型],
    private 表达式: 表达式类型,
  ) {}
}
export class 参数<参数类型 extends string> {
  public constructor(private 值: 参数类型) {}
}
type 计算参数允许的名称们<输入参数> = 输入参数 extends 参数<infer X> ? X : never
type 计算参数们允许的名称们<输入参数们> = 输入参数们 extends []
  ? []
  : 输入参数们 extends [infer X, ...infer XS]
    ? [计算参数允许的名称们<X>, ...计算参数们允许的名称们<XS>]
    : never

// 表达式
const _类型保持符号: unique symbol = Symbol()
const _表达式烙印: unique symbol = Symbol()
export abstract class 表达式<变量们 extends string[]> {
  declare private [_类型保持符号]: 变量们
  private [_表达式烙印] = true
  public constructor() {}
}
export class 数 extends 表达式<[]> {
  public constructor(private 值: number) {
    super()
  }
}
export class 参数引用<值类型 extends string> extends 表达式<[值类型]> {
  public constructor(private 值: 值类型) {
    super()
  }
}
export class 运算<参数们 extends 表达式<string[]>[]> extends 表达式<计算表达式们允许的变量们<参数们>> {
  public constructor(
    private 值: '+' | '-' | '*' | '/',
    private 参数们: [...参数们],
  ) {
    super()
  }
}

type 计算表达式允许的变量们<输入表达式> = 输入表达式 extends 表达式<infer X> ? X : never
type 计算表达式们允许的变量们<输入表达式们> = 输入表达式们 extends []
  ? []
  : 输入表达式们 extends [infer X, ...infer XS]
    ? [...计算表达式允许的变量们<X>, ...计算表达式们允许的变量们<XS>]
    : never

// main
let _f = new 函数('f', [new 参数('x')], new 运算('+', [new 参数引用('x'), new 数(1)]))
