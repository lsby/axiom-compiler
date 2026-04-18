import { Resvg } from '@resvg/resvg-js'
import * as 文件库 from 'fs/promises'
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js'
import { TeX } from 'mathjax-full/js/input/tex.js'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js'
import { mathjax } from 'mathjax-full/js/mathjax.js'
import { SVG } from 'mathjax-full/js/output/svg.js'
import * as 路径库 from 'path'

// 初始化 MathJax 环境 (Lite 模式，无需浏览器)
let 适配器 = liteAdaptor()
RegisterHTMLHandler(适配器)

export class Latex渲染器 {
  private static readonly 数学引擎 = mathjax.document('', {
    InputJax: new TeX({ packages: AllPackages }),
    OutputJax: new SVG({ fontCache: 'local' }),
  })

  /**
   * 将 LaTeX 转换为 SVG 字符串
   */
  public static 转换为Svg(公式: string): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let 结果 = Latex渲染器.数学引擎.convert(公式, { display: true })
    return 适配器.innerHTML(结果)
  }

  /**
   * 将 LaTeX 转换为 PNG 二进制数据
   */
  public static 转换为Png(公式: string, 缩放系数: number = 2, 背景颜色?: string): Buffer {
    let svg字符串 = Latex渲染器.转换为Svg(公式)
    let 转换器 = new Resvg(svg字符串, {
      fitTo: { mode: 'zoom', value: 缩放系数 },
      ...(背景颜色 !== undefined ? { background: 背景颜色 } : {}),
    })
    return 转换器.render().asPng()
  }

  /**
   * 将 LaTeX 渲染并保存为文件
   */
  public static async 渲染并保存(
    公式: string,
    参数: { 保存路径: string; 格式: 'svg' | 'png'; 缩放系数?: number; 背景颜色?: string },
  ): Promise<void> {
    let { 保存路径, 格式, 缩放系数 = 2, 背景颜色 } = 参数
    let 目标目录 = 路径库.dirname(保存路径)

    // 确保目标文件夹存在
    await 文件库.mkdir(目标目录, { recursive: true })

    switch (格式) {
      case 'svg':
        await 文件库.writeFile(保存路径, Latex渲染器.转换为Svg(公式))
        break
      case 'png':
        await 文件库.writeFile(保存路径, Latex渲染器.转换为Png(公式, 缩放系数, 背景颜色))
        break
    }
  }
}
