import { 调用函数 } from './model/math/interpreter.js'
import { 函数, 参数, 参数引用, 数 } from './model/math/math.js'
import { 乘法运算, 减法运算, 加法运算, 除法运算 } from './model/math/operations.js'
import { Latex渲染器 } from './model/renderer/latex-renderer.js'
import { 数学渲染器 } from './model/renderer/math-renderer.js'

// 定义函数 f(x) = x + 1
let f = new 函数('f', [new 参数('x')], new 加法运算([new 参数引用('x'), new 数(1)]))

// 调用 f(5)
let 结果 = 调用函数(f, [5])

console.log(`函数 f(x) = x + 1 在 x=5 时的计算结果是: ${结果}`)

// 定义更复杂的函数 g(a, b) = a * b + 10
let 表达式G = new 加法运算([new 乘法运算([new 参数引用('a'), new 参数引用('b')]), new 数(10)])
let g = new 函数('g', [new 参数('a'), new 参数('b')], 表达式G)

let 结果G = 调用函数(g, [3, 4])
console.log(`函数 g(a, b) = a * b + 10 在 a=3, b=4 时的计算结果是: ${结果G}`)

console.log('\n--- 渲染演示 ---')
let latex代码 = 数学渲染器.渲染为Latex(表达式G)
console.log('函数 g 的表达式纯文本:', 数学渲染器.渲染为文本(表达式G))
console.log('函数 g 的表达式 LaTeX:', latex代码)

// 演示图片生成
console.log('\n正在生成图片...')
await Latex渲染器.渲染并保存(latex代码, { 保存路径: './data/formula_g.svg', 格式: 'svg' })
await Latex渲染器.渲染并保存(latex代码, { 保存路径: './data/formula_g.png', 格式: 'png' })
console.log('图片已保存为: formula_g.svg 和 formula_g.png')

// 演示带括号和除法的渲染
let 复杂表达式 = new 除法运算([
  new 加法运算([new 数(1), new 参数引用('x')]),
  new 减法运算([new 数(10), new 参数引用('y')]),
])
let 复杂Latex = 数学渲染器.渲染为Latex(复杂表达式)
console.log('\n复杂表达式纯文本:', 数学渲染器.渲染为文本(复杂表达式))
console.log('复杂表达式 LaTeX:', 复杂Latex)

await Latex渲染器.渲染并保存(复杂Latex, { 保存路径: './data/formula_complex.png', 格式: 'png', 背景颜色: '#ffffff' })
console.log('复杂表达式图片已保存为: formula_complex.png (白色背景)')
