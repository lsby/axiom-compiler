import z from 'zod/v3'
import { 值, 延迟调用, 数据, 条件表达式, 符号 } from '../base/base.js'
import { 判空, 前置, 头, 小于等于, 尾, 渲染为Latex, 渲染为文本, 递归构造子 } from './constructor.js'
import { 函数 } from './function.js'

// ---- 参数符号 ----
let 参数x = new 符号('x', z.number())
let 参数arr = new 符号('arr', z.number().array())

// ---- 原子函数 ----
let 判空函数 = new 函数(判空, new 数据([参数arr]))
let 头函数 = new 函数(头, new 数据([参数arr]))
let 尾函数 = new 函数(尾, new 数据([参数arr]))
let 前置函数 = new 函数(前置, new 数据([参数x, 参数arr]))
let 比较函数 = new 函数(小于等于, new 数据([参数x, 头函数]))

// ---- 插入 ----
// insert(x, arr) =
//   if isEmpty(arr) then cons(x, [])
//   else if leq(x, head(arr)) then cons(x, arr)
//   else cons(head(arr), insert(x, tail(arr)))
let 插入构造子 = new 递归构造子<'insert', [number, number[]], number[]>(
  'insert',
  [参数x, 参数arr],
  (自身) =>
    new 条件表达式(
      判空函数,
      前置函数.代换('arr', new 值<number[]>([])),
      new 条件表达式(比较函数, 前置函数, new 延迟调用(前置, [头函数, new 延迟调用(自身, [参数x, 尾函数])])),
    ),
  (参数): string => `insert(${渲染为文本(参数[0])}, ${渲染为文本(参数[1])})`,
  (参数): string => String.raw`
    \mathrm{insert}(${渲染为Latex(参数[0])}, ${渲染为Latex(参数[1])}) =
    \begin{cases}
      [${渲染为Latex(参数[0])}] & \text{if } ${渲染为Latex(参数[1])} = [] \\
      [${渲染为Latex(参数[0])}, \ldots ${渲染为Latex(参数[1])}] & \text{if } ${渲染为Latex(参数[0])} \le \mathrm{head}(${渲染为Latex(参数[1])}) \\
      [\mathrm{head}(${渲染为Latex(参数[1])}), \ldots \mathrm{insert}(${渲染为Latex(参数[0])}, \mathrm{tail}(${渲染为Latex(参数[1])}))] & \text{otherwise}
    \end{cases}
  `,
)
export let 插入 = new 函数(插入构造子, new 数据([参数x, 参数arr]))

// ---- 排序 ----
// sort(arr) = if isEmpty(arr) then [] else insert(head(arr), sort(tail(arr)))
let 参数arr2 = new 符号('arr', z.number().array())
let 排序构造子 = new 递归构造子<'sort', [number[]], number[]>(
  'sort',
  [参数arr2],
  (自身) =>
    new 条件表达式(
      new 函数(判空, new 数据([参数arr2])),
      new 值<number[]>([]),
      new 延迟调用(插入构造子, [
        new 函数(头, new 数据([参数arr2])),
        new 延迟调用(自身, [new 函数(尾, new 数据([参数arr2]))]),
      ]),
    ),
  (参数): string => `sort(${渲染为文本(参数[0])})`,
  (参数): string => String.raw`
  \begin{aligned}
    & ${插入.输出Latex()} \\
    & \mathrm{sort}(${渲染为Latex(参数[0])}) =
      \begin{cases}
        [] & \text{if } ${渲染为Latex(参数[0])} = [] \\
        \mathrm{insert}\bigl(\mathrm{head}(${渲染为Latex(参数[0])}), \mathrm{sort}(\mathrm{tail}(${渲染为Latex(参数[0])}))\bigr) & \text{otherwise}
      \end{cases}
    \end{aligned}
  `,
)
export let 排序 = new 函数(排序构造子, new 数据([参数arr2]))
