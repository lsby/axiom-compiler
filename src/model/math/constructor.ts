import { 不动点, 任意的表达式, 值, 延迟调用, 操作, 数据, 条件表达式, 符号 } from '../base/base.js'
import { 不动点函数, 函数 } from './function.js'

export function 渲染为文本(项: 任意的表达式 | undefined): string {
  if (项 === undefined) throw new Error('渲染目标不存在')
  if (项 instanceof 条件表达式) {
    let 条件文本 = 渲染为文本(项.获得条件())
    let 真文本 = 渲染为文本(项.获得真分支())
    let 假文本 = 渲染为文本(项.获得假分支())
    return `if(${条件文本}, ${真文本}, ${假文本})`
  }
  if (项 instanceof 函数) return 项.输出文本()
  if (项 instanceof 不动点函数) return 项.输出文本()
  if (项 instanceof 延迟调用) {
    let 操作 = 项.获得操作()
    if (操作 instanceof 构造子) return 操作.格式化纯文本(项.获得参数列表())
    if (操作 instanceof 不动点) return `${操作.获得自引用符号名()}(${项.获得参数列表().map(渲染为文本).join(', ')})`
    return `<延迟调用>`
  }
  if (项 instanceof 不动点) return `fix(${项.获得自引用符号名()})`
  if (项 instanceof 值) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let 原始值 = 项.求值()
    if (Array.isArray(原始值)) return `[${原始值.join(', ')}]`
    return String(原始值)
  }
  if (项 instanceof 数据) return `[${项.获得各项().map(渲染为文本).join(', ')}]`
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
  if (项 instanceof 不动点函数) return 项.输出Latex()
  if (项 instanceof 延迟调用) {
    let 操作 = 项.获得操作()
    if (操作 instanceof 构造子) return 操作.格式化Latex(项.获得参数列表())
    if (操作 instanceof 不动点)
      return `\\mathrm{${操作.获得自引用符号名()}}(${项.获得参数列表().map(渲染为Latex).join(', ')})`
    return `\\text{<延迟调用>}`
  }
  if (项 instanceof 不动点) return `\\mathrm{fix}(${项.获得自引用符号名()})`
  if (项 instanceof 值) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let 原始值 = 项.求值()
    if (Array.isArray(原始值)) return `[${原始值.join(', ')}]`
    return String(原始值)
  }
  if (项 instanceof 数据) return `[${项.获得各项().map(渲染为Latex).join(', ')}]`
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
