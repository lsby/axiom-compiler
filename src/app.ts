import z from 'zod/v3'
import { 值, 数据, 符号, 调用 } from './model/base/base.js'
import { 乘法, 加法, 除法 } from './model/math/math.js'
import { Latex渲染器 } from './model/renderer/latex-renderer.js'

let x = new 符号('x', z.number())
let y = new 符号('y', z.number())

let 表达式1 = new 调用(
  除法,
  new 数据([new 调用(加法, new 数据([x, new 值(50)])), new 调用(乘法, new 数据([y, new 值(2)]))]),
)
console.log('表达式1 纯文本:', 表达式1.转纯文本())
console.log('表达式1 Latex:', 表达式1.转Latex())
await Latex渲染器.渲染并保存(表达式1.转Latex(), { 保存路径: './data/expression.png', 格式: 'png', 背景颜色: 'white' })
console.log('图片已保存到 ./data/expression.png')

let 表达式2 = 表达式1.代换('x', new 值(50))
console.log('表达式2 纯文本:', 表达式2.转纯文本())

let 表达式3 = 表达式2.代换('y', new 值(1))
console.log('表达式3 纯文本:', 表达式3.转纯文本())
console.log('表达式3 求值:', 表达式3.求值())
