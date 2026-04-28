import { describe, expect, it } from 'vitest'
import z from 'zod/v3'
import { 值, 操作, 数据, 符号, 调用 } from '../src/model/base/base.js'

let 测试加法 = new 操作('加', (a: number, b: number): number => a + b)
let 测试乘法 = new 操作('乘', (a: number, b: number): number => a * b)

describe('基础模型单元测试', () => {
  it('值单元测试', () => {
    let 数字 = new 值(100)
    expect(数字.求值()).toBe(100)
  })

  it('符号单元测试', () => {
    let x = new 符号('x', z.number())
    expect(x.获得名称()).toBe('x')

    let 替换物 = new 值(10)
    let 结果 = x.代换('x', 替换物)
    expect(结果.求值()).toBe(10)
  })

  it('数据单元测试', () => {
    let x = new 符号('x', z.number())
    let y = new 符号('y', z.number())
    let 数组 = new 数据([x, y])

    expect(数组.获得各项().length).toBe(2)

    let 替换后 = 数组.代换('x', new 值(1))
    expect(替换后.求值().length).toBe(2)
  })

  it('简单调用测试', () => {
    let 表达式 = new 调用(测试加法, new 数据([new 值(10), new 值(20)]))
    expect(表达式.求值()).toBe(30)
  })

  it('嵌套调用与代换测试', () => {
    let x = new 符号('x', z.number())
    let y = new 符号('y', z.number())

    // (x + 10) * y
    let 表达式 = new 调用(测试乘法, new 数据([new 调用(测试加法, new 数据([x, new 值(10)])), y]))

    let 代换后 = 表达式.代换('x', new 值(5)).代换('y', new 值(2))
    expect(代换后.求值()).toBe(30) // (5 + 10) * 2 = 30
  })
})
