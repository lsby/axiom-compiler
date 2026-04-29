import { 任意的表达式, 值, 操作, 符号, 表达式 } from '../base/base.js'

// 算子, 是计算的基本模块
// 需要提供 名称, 实际逻辑, 纯文本和latex 的渲染结果
export class 算子<操作名称 extends string, const 参数类型 extends any[], 返回值类型> extends 操作<
  操作名称,
  参数类型,
  返回值类型
> {
  public static 从表达式创建<N extends string, M extends Record<string, any>, R>(
    名称: N,
    参数符号: 符号<any, any>[],
    体: 表达式<M, R>,
  ): 算子<N, any[], R> {
    return new 算子(
      名称,
      (...args) => {
        let e: 任意的表达式 = 体
        for (let i = 0; i < 参数符号.length; i++) {
          let 符号 = 参数符号[i]
          if (符号 === undefined) throw new Error('意外的空值')

          e = e.代换(符号.获得名称(), new 值(args[i]))
        }
        return e.求值() as R
      },
      (参数) => `${名称}(${参数.map((p) => p.输出文本(true)).join(', ')})`,
      (参数) => `\\mathrm{${名称}}(${参数.map((p) => p.输出Latex(true)).join(', ')})`,
      { 体, 参数符号 },
    )
  }
  public constructor(
    操作名称: 操作名称,
    实现: (...参数: [...参数类型]) => 返回值类型,
    private 纯文本格式化: (参数: 任意的表达式[]) => string,
    private Latex格式化: (参数: 任意的表达式[]) => string,
    选项?: { 体?: 表达式<any, any>; 参数符号?: 符号<any, any>[] },
  ) {
    super(操作名称, 实现, 选项)
  }

  public override 格式化纯文本(参数: 任意的表达式[]): string {
    return this.纯文本格式化(参数)
  }
  public override 格式化Latex(参数: 任意的表达式[]): string {
    return this.Latex格式化(参数)
  }
}
export type 计算算子参数类型<A> = A extends 算子<any, infer Arr, any> ? Arr : never

export let 加法算子 = new 算子(
  '加',
  (a: number, b: number): number => a + b,
  (参数): string => `(${参数[0]?.输出文本(true) ?? ''} + ${参数[1]?.输出文本(true) ?? ''})`,
  (参数): string => `(${参数[0]?.输出Latex(true) ?? ''} + ${参数[1]?.输出Latex(true) ?? ''})`,
)
export let 减法算子 = new 算子(
  '减',
  (a: number, b: number): number => a - b,
  (参数): string => `(${参数[0]?.输出文本(true) ?? ''} - ${参数[1]?.输出文本(true) ?? ''})`,
  (参数): string => `(${参数[0]?.输出Latex(true) ?? ''} - ${参数[1]?.输出Latex(true) ?? ''})`,
)
export let 乘法算子 = new 算子(
  '乘',
  (a: number, b: number): number => a * b,
  (参数): string => `(${参数[0]?.输出文本(true) ?? ''} × ${参数[1]?.输出文本(true) ?? ''})`,
  (参数): string => `(${参数[0]?.输出Latex(true) ?? ''} \\times ${参数[1]?.输出Latex(true) ?? ''})`,
)
export let 除法算子 = new 算子(
  '除',
  (a: number, b: number): number => a / b,
  (参数): string => `(${参数[0]?.输出文本(true) ?? ''} / ${参数[1]?.输出文本(true) ?? ''})`,
  (参数): string => `\\frac{${参数[0]?.输出Latex(true) ?? ''}}{${参数[1]?.输出Latex(true) ?? ''}}`,
)

// 数组原子算子
export let 判空 = new 算子(
  'isEmpty',
  (arr: number[]): boolean => arr.length === 0,
  (参数): string => `isEmpty(${参数[0]?.输出文本(true) ?? ''})`,
  (参数): string => String.raw`\mathrm{isEmpty}(${参数[0]?.输出Latex(true) ?? ''})`,
)
export let 头 = new 算子(
  'head',
  (arr: number[]): number => {
    let 首项 = arr[0]
    if (首项 === undefined) throw new Error('空数组无法取头')
    return 首项
  },
  (参数): string => `head(${参数[0]?.输出文本(true) ?? ''})`,
  (参数): string => String.raw`\mathrm{head}(${参数[0]?.输出Latex(true) ?? ''})`,
)
export let 尾 = new 算子(
  'tail',
  (arr: number[]): number[] => arr.slice(1),
  (参数): string => `tail(${参数[0]?.输出文本(true) ?? ''})`,
  (参数): string => String.raw`\mathrm{tail}(${参数[0]?.输出Latex(true) ?? ''})`,
)
export let 前置 = new 算子(
  'cons',
  (x: number, arr: number[]): number[] => [x, ...arr],
  (参数): string => `cons(${参数[0]?.输出文本(true) ?? ''}, ${参数[1]?.输出文本(true) ?? ''})`,
  (参数): string => String.raw`\mathrm{cons}(${参数[0]?.输出Latex(true) ?? ''}, ${参数[1]?.输出Latex(true) ?? ''})`,
)
export let 小于等于 = new 算子(
  'leq',
  (a: number, b: number): boolean => a <= b,
  (参数): string => `(${参数[0]?.输出文本(true) ?? ''} <= ${参数[1]?.输出文本(true) ?? ''})`,
  (参数): string => `(${参数[0]?.输出Latex(true) ?? ''} \\le ${参数[1]?.输出Latex(true) ?? ''})`,
)
