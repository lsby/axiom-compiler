import { describe, expect, it } from 'vitest'
import { 值, 操作, 数据, 符号, 调用 } from '../src/model/base/base.js'

let 测试加法 = new 操作(
  '加',
  (a: number, b: number): number => a + b,
  (参数: string[]): string => `(${参数[0]} + ${参数[1]})`,
  (参数: string[]): string => `(${参数[0]} + ${参数[1]})`,
)

let 测试乘法 = new 操作(
  '乘',
  (a: number, b: number): number => a * b,
  (参数: string[]): string => `(${参数[0]} × ${参数[1]})`,
  (参数: string[]): string => `(${参数[0]} \\times ${参数[1]})`,
)

let 测试除法 = new 操作(
  '除',
  (a: number, b: number): number => a / b,
  (参数: string[]): string => `(${参数[0]} / ${参数[1]})`,
  (参数: string[]): string => `\\frac{${参数[0]}}{${参数[1]}}`,
)

describe('基础模型单元测试', () => {
  it('值单元测试', () => {
    let 数字 = new 值(100)
    expect(数字.求值()).toBe(100)
    expect(数字.转纯文本()).toBe('100')
    expect(数字.转Latex()).toBe('100')
  })

  it('符号单元测试', () => {
    let x = new 符号<'x', number>('x')
    expect(x.转纯文本()).toBe('x')
    expect(x.转Latex()).toBe('x')

    let 替换物 = new 值(10)
    let 结果 = x.代换('x', 替换物)
    expect(结果.求值()).toBe(10)
  })

  it('数据单元测试', () => {
    let x = new 符号<'x', number>('x')
    let y = new 符号<'y', number>('y')
    let 数组 = new 数据([x, y])

    expect(数组.转纯文本()).toBe('x, y')

    let 替换后 = 数组.代换('x', new 值(1))
    expect(替换后.转纯文本()).toBe('1, y')
  })

  it('简单调用测试', () => {
    let 表达式 = new 调用(测试加法, new 数据([new 值(10), new 值(20)]))
    expect(表达式.求值()).toBe(30)
    expect(表达式.转纯文本()).toBe('(10 + 20)')
  })

  it('嵌套调用与代换测试', () => {
    let x = new 符号<'x', number>('x')
    let y = new 符号<'y', number>('y')

    // (x + 10) * y
    let 表达式 = new 调用(测试乘法, new 数据([new 调用(测试加法, new 数据([x, new 值(10)])), y]))

    expect(表达式.转纯文本()).toBe('((x + 10) × y)')

    let 代换后 = 表达式.代换('x', new 值(5)).代换('y', new 值(2))
    expect(代换后.求值()).toBe(30) // (5 + 10) * 2 = 30
    expect(代换后.转纯文本()).toBe('((5 + 10) × 2)')
    expect(代换后.转Latex()).toBe('((5 + 10) \\times 2)')
  })

  it('除法与Latex格式化测试', () => {
    let 表达式 = new 调用(测试除法, new 数据([new 值(1), new 值(2)]))
    expect(表达式.求值()).toBe(0.5)
    expect(表达式.转纯文本()).toBe('(1 / 2)')
    expect(表达式.转Latex()).toBe('\\frac{1}{2}')
  })
})
