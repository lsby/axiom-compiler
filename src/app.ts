import z from 'zod/v3'
import { 值, 数据, 符号 } from './model/base/base.js'
import { 排序 } from './model/math/algorithm.js'
import { 加法算子, 除法算子 } from './model/math/constructor.js'
import { 函数 } from './model/math/function.js'
import { Latex渲染器 } from './model/renderer/latex-renderer.js'

// 加法
let 加法函数 = new 函数(加法算子, new 数据([new 符号('a', z.number()), new 符号('b', z.number())]))
console.log('加法 纯文本:', 加法函数.输出文本())
console.log('加法 Latex:', 加法函数.输出Latex())
console.log('加法 求值:', 加法函数.代换('a', new 值(1)).代换('b', new 值(2)).求值())

// 除法
let 除法函数 = new 函数(除法算子, new 数据([new 符号('a', z.number()), new 符号('b', z.number())]))
console.log('除法 纯文本:', 除法函数.输出文本())
console.log('除法 Latex:', 除法函数.输出Latex())
console.log('除法 求值:', 除法函数.代换('a', new 值(10)).代换('b', new 值(2)).求值())

// 我的函数1
let 我的函数1 = 除法函数.代换('b', new 符号('c', z.number())).代换('a', 加法函数)
console.log('我的函数1 纯文本:', 我的函数1.输出文本())
console.log('我的函数1 Latex:', 我的函数1.输出Latex())
await Latex渲染器.渲染并保存(我的函数1.输出Latex(), { 保存路径: './data/img01.png', 格式: 'png', 背景颜色: 'white' })
console.log('我的函数1 求值:', 我的函数1.代换('a', new 值(10)).代换('b', new 值(20)).代换('c', new 值(3)).求值())

// 排序
console.log('排序函数 文本:', 排序.输出文本())
console.log('排序函数 latex:', 排序.输出Latex())
await Latex渲染器.渲染并保存(排序.输出Latex(), { 保存路径: './data/img02.png', 格式: 'png', 背景颜色: 'white' })
let 代换后 = 排序.代换('arr', new 值([1, 3, 6, 2, 5, 9]))
await Latex渲染器.渲染并保存(代换后.输出Latex(), { 保存路径: './data/img03.png', 格式: 'png', 背景颜色: 'white' })
console.log('排序函数 求值:', 代换后.求值())
