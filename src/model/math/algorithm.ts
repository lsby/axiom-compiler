import z from 'zod/v3'
import { 符号 } from '../base/base.js'
import { 构造子, 渲染为Latex, 渲染为文本 } from './constructor.js'

export let 插入: 构造子<'insert', [number, number[]], number[]> = new 构造子(
  'insert',
  (x: number, arr: number[]): number[] => {
    if (arr.length === 0) return [x]
    let [y, ...ys] = arr
    if (y === undefined) throw new Error('意外的空值')
    return x <= y ? [x, ...arr] : [y, ...插入.调用(x, ys)]
  },
  (参数): string => `insert(${渲染为文本(参数[0])}, ${渲染为文本(参数[1])})`,
  (参数): string => String.raw`
    \mathrm{insert}(${渲染为Latex(参数[0])}, ${渲染为Latex(参数[1])}) =
    \begin{cases}
      ${渲染为Latex(参数[0])} & \text{if } ${渲染为Latex(参数[1])} = [] \\
      [${渲染为Latex(参数[0])}, \ldots ${渲染为Latex(参数[1])}] & \text{if } ${渲染为Latex(参数[0])} \le y \\
      [头(${渲染为Latex(参数[1])}), \ldots insert(${渲染为Latex(参数[0])}, 尾(${渲染为Latex(参数[1])}))] & \text{否则}
    \end{cases}
  `,
)

export let 排序: 构造子<'sort', [number[]], number[]> = new 构造子(
  'sort',
  (arr: number[]): number[] => {
    if (arr.length === 0) return []
    let [x, ...xs] = arr
    if (x === undefined) throw new Error('意外的空值')
    return 插入.调用(x, 排序.调用(xs))
  },
  (参数): string => `sort(${渲染为文本(参数[0])})`,
  (参数): string => String.raw`
  \begin{aligned}
    & ${插入.格式化Latex([new 符号('x', z.number()), new 符号('arr', z.number().array())])} \\
    & \mathrm{sort}(${渲染为Latex(参数[0])}) =
      \begin{cases}
        [] & \text{if } ${渲染为Latex(参数[0])} = [] \\
        \mathrm{insert}\bigl(头(${渲染为Latex(参数[0])}), \mathrm{sort}(尾(${渲染为Latex(参数[0])}))\bigr) & \text{否则}
      \end{cases}
    \end{aligned}
  `,
)
