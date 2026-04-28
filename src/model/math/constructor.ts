import { 任意的表达式, 值, 延迟调用, 操作, 条件表达式, 符号 } from '../base/base.js'
import { 函数 } from './function.js'

export function 渲染为文本(项: 任意的表达式 | undefined): string {
  if (项 === undefined) throw new Error('渲染目标不存在')
  if (项 instanceof 条件表达式) {
    let 条件文本 = 渲染为文本(项.获得条件())
    let 真文本 = 渲染为文本(项.获得真分支())
    let 假文本 = 渲染为文本(项.获得假分支())
    return `if(${条件文本}, ${真文本}, ${假文本})`
  }
  if (项 instanceof 函数) return 项.输出文本()
  if (项 instanceof 延迟调用) {
    let 操作 = 项.获得操作()
    if (操作 instanceof 构造子) return 操作.格式化纯文本(项.获得参数列表())
    return `<延迟调用>`
  }
  if (项 instanceof 值) return String(项.求值())
  if (项 instanceof 符号) return 项.获得名称()
  throw new Error('无法渲染的表达式类型')
}

export function 渲染为Latex(项: 任意的表达式 | undefined): string {
  if (项 === undefined) throw new Error('渲染目标不存在')
  if (项 instanceof 条件表达式) {
    let 条件Latex = 渲染为Latex(项.获得条件())
    let 真Latex = 渲染为Latex(项.获得真分支())
    let 假Latex = 渲染为Latex(项.获得假分支())
    return String.raw`\begin{cases} ${真Latex} & \text{if } ${条件Latex} \\ ${假Latex} & \text{otherwise} \end{cases}`
  }
  if (项 instanceof 函数) return 项.输出Latex()
  if (项 instanceof 延迟调用) {
    let 操作 = 项.获得操作()
    if (操作 instanceof 构造子) return 操作.格式化Latex(项.获得参数列表())
    return `\\text{<延迟调用>}`
  }
  if (项 instanceof 值) return String(项.求值())
  if (项 instanceof 符号) return 项.获得名称()
  throw new Error('无法渲染的表达式类型')
}

export class 构造子<操作名称 extends string, const 参数类型 extends any[], 返回值类型> extends 操作<
  操作名称,
  参数类型,
  返回值类型
> {
  public constructor(
    操作名称: 操作名称,
    实现: (...参数: [...参数类型]) => 返回值类型,
    private 纯文本格式化: (参数: 任意的表达式[]) => string,
    private Latex格式化: (参数: 任意的表达式[]) => string,
  ) {
    super(操作名称, 实现)
  }

  public 格式化纯文本(参数: 任意的表达式[]): string {
    return this.纯文本格式化(参数)
  }
  public 格式化Latex(参数: 任意的表达式[]): string {
    return this.Latex格式化(参数)
  }
}
export type 计算构造子参数类型<A> = A extends 构造子<any, infer Arr, any> ? Arr : never

export let 加法 = new 构造子(
  '加',
  (a: number, b: number): number => a + b,
  (参数): string => `(${渲染为文本(参数[0])} + ${渲染为文本(参数[1])})`,
  (参数): string => `(${渲染为Latex(参数[0])} + ${渲染为Latex(参数[1])})`,
)
export let 减法 = new 构造子(
  '减',
  (a: number, b: number): number => a - b,
  (参数): string => `(${渲染为文本(参数[0])} - ${渲染为文本(参数[1])})`,
  (参数): string => `(${渲染为Latex(参数[0])} - ${渲染为Latex(参数[1])})`,
)
export let 乘法 = new 构造子(
  '乘',
  (a: number, b: number): number => a * b,
  (参数): string => `(${渲染为文本(参数[0])} × ${渲染为文本(参数[1])})`,
  (参数): string => `(${渲染为Latex(参数[0])} \\times ${渲染为Latex(参数[1])})`,
)
export let 除法 = new 构造子(
  '除',
  (a: number, b: number): number => a / b,
  (参数): string => `(${渲染为文本(参数[0])} / ${渲染为文本(参数[1])})`,
  (参数): string => `\\frac{${渲染为Latex(参数[0])}}{${渲染为Latex(参数[1])}}`,
)

// 数组原子构造子
export let 判空 = new 构造子(
  'isEmpty',
  (arr: number[]): boolean => arr.length === 0,
  (参数): string => `isEmpty(${渲染为文本(参数[0])})`,
  (参数): string => String.raw`\mathrm{isEmpty}(${渲染为Latex(参数[0])})`,
)
export let 头 = new 构造子(
  'head',
  (arr: number[]): number => {
    let 首项 = arr[0]
    if (首项 === undefined) throw new Error('空数组无法取头')
    return 首项
  },
  (参数): string => `head(${渲染为文本(参数[0])})`,
  (参数): string => String.raw`\mathrm{head}(${渲染为Latex(参数[0])})`,
)
export let 尾 = new 构造子(
  'tail',
  (arr: number[]): number[] => arr.slice(1),
  (参数): string => `tail(${渲染为文本(参数[0])})`,
  (参数): string => String.raw`\mathrm{tail}(${渲染为Latex(参数[0])})`,
)
export let 前置 = new 构造子(
  'cons',
  (x: number, arr: number[]): number[] => [x, ...arr],
  (参数): string => `cons(${渲染为文本(参数[0])}, ${渲染为文本(参数[1])})`,
  (参数): string => String.raw`\mathrm{cons}(${渲染为Latex(参数[0])}, ${渲染为Latex(参数[1])})`,
)
export let 小于等于 = new 构造子(
  'leq',
  (a: number, b: number): boolean => a <= b,
  (参数): string => `(${渲染为文本(参数[0])} <= ${渲染为文本(参数[1])})`,
  (参数): string => `(${渲染为Latex(参数[0])} \\le ${渲染为Latex(参数[1])})`,
)

// 递归构造子: 实现由表达式树定义, 支持自引用
export class 递归构造子<操作名称 extends string, const 参数类型 extends any[], 返回值类型> extends 构造子<
  操作名称,
  参数类型,
  返回值类型
> {
  private 表达式体: 任意的表达式
  private 我的参数符号列表: 符号<any, any>[]

  public constructor(
    操作名称: 操作名称,
    参数符号列表: 符号<any, any>[],
    构建体: (自身: 递归构造子<操作名称, 参数类型, 返回值类型>) => 任意的表达式,
    纯文本格式化: (参数: 任意的表达式[]) => string,
    Latex格式化: (参数: 任意的表达式[]) => string,
  ) {
    super(
      操作名称,
      ((): any => {
        throw new Error('递归构造子请通过 调用 方法执行')
      }) as any,
      纯文本格式化,
      Latex格式化,
    )
    this.我的参数符号列表 = 参数符号列表
    this.表达式体 = 构建体(this)
  }

  public override 调用(...参数: [...参数类型]): 返回值类型 {
    let 当前表达式: 任意的表达式 = this.表达式体
    for (let i = 0; i < this.我的参数符号列表.length; i++) {
      let 当前符号 = this.我的参数符号列表[i]
      if (当前符号 === undefined) throw new Error('意外的空值')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      当前表达式 = 当前表达式.代换(当前符号.获得名称(), new 值(参数[i]))
    }
    return 当前表达式.求值()
  }
}
