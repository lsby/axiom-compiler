import z from 'zod/v3'
import { 值, 操作, 数据, 符号, 调用 } from './model/base/base.js'
import { Latex渲染器 } from './model/renderer/latex-renderer.js'

let 插入: 操作<'insert', [number, number[]], number[]> = new 操作(
  'insert',
  (x: number, arr: number[]): number[] => {
    if (arr.length === 0) return [x]
    let [y, ...ys] = arr
    if (y === undefined) throw new Error('意外的空值')
    return x <= y ? [x, ...arr] : [y, ...插入.调用(x, ys)]
  },
  (p) => `insert(${p[0]}, ${p[1]})`,
  (p) => String.raw`
    \mathrm{insert}(${p[0]}, ${p[1]}) =
    \begin{cases}
      ${p[0]} & \text{if } ${p[1]} = [] \\
      [${p[0]}, \ldots ${p[1]}] & \text{if } ${p[0]} \le y \\
      [头(${p[1]}), \ldots insert(${p[0]}, 尾(${p[1]})] & \text{否则}
    \end{cases}
  `,
)

let 排序: 操作<'sort', [number[]], number[]> = new 操作(
  'sort',
  (arr: number[]): number[] => {
    if (arr.length === 0) return []
    let [x, ...xs] = arr
    if (x === undefined) throw new Error('意外的空值')
    return 插入.调用(x, 排序.调用(xs))
  },
  (p) => `sort(${p[0]})`,
  (p) => String.raw`
  \begin{aligned}
    & ${插入.格式化Latex(['x', 'arr'])} \\
    & \mathrm{sort}(${p[0]}) =
      \begin{cases}
        [] & \text{if } ${p[0]} = [] \\
        \mathrm{insert}\bigl(头(${p[0]}), \mathrm{sort}(尾(${p[0]}))\bigr) & \text{否则}
      \end{cases}
    \end{aligned}
  `,
)

let 排序函数 = new 调用(排序, new 数据([new 符号('arr', z.number().array())]))
await Latex渲染器.渲染并保存(排序函数.转Latex(), { 保存路径: './data/img.png', 格式: 'png', 背景颜色: 'white' })

console.log('表达式 纯文本:', 排序函数.转纯文本())
console.log('表达式 求值:', 排序函数.代换('arr', new 值([3, 1, 5, 6, 9, 3])).求值())
