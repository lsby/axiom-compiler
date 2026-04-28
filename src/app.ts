import z from 'zod/v3'
import { 值, 数据, 符号, 调用 } from './model/base/base.js'
import { 乘法, 加法, 除法 } from './model/math/math.js'
import { Latex渲染器 } from './model/renderer/latex-renderer.js'

let x = new 符号('x', z.number())
let y = new 符号('y', z.number())

let 参数 = new 数据([x, y])

let 表达式1 = new 调用(加法, 参数)
let 表达式2 = 表达式1.代换('x', new 值(10))
let 最终表达式 = 表达式2.代换('y', new 值(20))

console.log(最终表达式.求值()) // 输出 30
console.log('最终表达式 纯文本:', 最终表达式.转纯文本())
console.log('最终表达式 Latex:', 最终表达式.转Latex())

// 测试复杂嵌套
let 复杂表达式 = new 调用(
  除法,
  new 数据([new 调用(加法, new 数据([x, new 值(100)])), new 调用(乘法, new 数据([y, new 值(2)]))]),
)

console.log('--- 复杂表达式 ---')
console.log('纯文本:', 复杂表达式.转纯文本())
console.log('Latex:', 复杂表达式.转Latex())

await Latex渲染器.渲染并保存(复杂表达式.转Latex(), {
  保存路径: './data/expression.png',
  格式: 'png',
  背景颜色: 'white',
})
console.log('图片已保存到 ./data/expression.png')
