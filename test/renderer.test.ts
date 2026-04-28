import { describe, expect, it } from 'vitest'
import { Latex渲染器 } from '../src/model/renderer/latex-renderer.js'

describe('Latex渲染器单元测试', () => {
  it('应该能将Latex转换为Svg字符串', () => {
    let 公式 = 'a^2 + b^2 = c^2'
    let svg = Latex渲染器.转换为Svg(公式)
    expect(svg).toContain('<svg')
    expect(svg).toContain('a')
    expect(svg).toContain('b')
    expect(svg).toContain('c')
  })

  it('应该能将Latex转换为Png数据', () => {
    let 公式 = 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}'
    let png = Latex渲染器.转换为Png(公式)
    expect(png).toBeInstanceOf(Buffer)
    expect(png.length).toBeGreaterThan(0)
  })
})
