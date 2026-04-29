import { describe, expect, it } from 'vitest'
import { 值, 数据 } from '../src/model/base/base.js'
import { 乘法算子, 减法算子, 加法算子, 除法算子 } from '../src/model/math/constructor.js'
import { 函数 } from '../src/model/math/function.js'

describe('数学函数单元测试', () => {
  it('加法测试', () => {
    let 加法函数 = new 函数('add', 加法算子, new 数据([new 值(1), new 值(2)]))
    expect(加法函数.求值()).toBe(3)
    expect(加法函数.输出文本()).toBe('(1 + 2)')
  })

  it('减法测试', () => {
    let 减法函数 = new 函数('sub', 减法算子, new 数据([new 值(10), new 值(4)]))
    expect(减法函数.求值()).toBe(6)
    expect(减法函数.输出文本()).toBe('(10 - 4)')
  })

  it('乘法测试', () => {
    let 乘法函数 = new 函数('mul', 乘法算子, new 数据([new 值(3), new 值(4)]))
    expect(乘法函数.求值()).toBe(12)
    expect(乘法函数.输出文本()).toBe('(3 × 4)')
    expect(乘法函数.输出Latex()).toBe('(3 \\times 4)')
  })

  it('除法测试', () => {
    let 除法函数 = new 函数('div', 除法算子, new 数据([new 值(10), new 值(2)]))
    expect(除法函数.求值()).toBe(5)
    expect(除法函数.输出文本()).toBe('(10 / 2)')
    expect(除法函数.输出Latex()).toBe('\\frac{10}{2}')
  })

  it('嵌套函数测试', () => {
    // (1 + 2) * 3
    let 我的函数 = new 函数(
      'myFunc',
      乘法算子,
      new 数据([new 函数('add', 加法算子, new 数据([new 值(1), new 值(2)])), new 值(3)]),
    )
    expect(我的函数.求值()).toBe(9)
    expect(我的函数.输出文本()).toBe('((1 + 2) × 3)')
  })
})
