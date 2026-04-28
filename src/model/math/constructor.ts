import { 任意的表达式, 值, 操作, 符号 } from '../base/base.js'
import { 函数 } from './function.js'

export function 渲染为文本(项: 任意的表达式 | undefined): string {
  if (项 === undefined) throw new Error('渲染目标不存在')
  if (项 instanceof 函数) return 项.输出文本()
  if (项 instanceof 值) return String(项.求值())
  if (项 instanceof 符号) return 项.获得名称()
  throw new Error('无法渲染的表达式类型')
}

export function 渲染为Latex(项: 任意的表达式 | undefined): string {
  if (项 === undefined) throw new Error('渲染目标不存在')
  if (项 instanceof 函数) return 项.输出Latex()
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
