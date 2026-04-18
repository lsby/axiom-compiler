import { 表达式, 运算 } from './math.js'

export class 加法运算<参数们泛型 extends 表达式<string[]>[]> extends 运算<参数们泛型> {
  public 生成文本表示(子项文本们: string[]): string {
    return 子项文本们.join(' + ')
  }

  public 生成Latex表示(子项Latex们: string[]): string {
    return 子项Latex们.join(' + ')
  }

  public 计算(运算分量: number[]): number {
    return 运算分量.reduce((累积, 当前) => 累积 + 当前, 0)
  }
}

export class 减法运算<参数们泛型 extends 表达式<string[]>[]> extends 运算<参数们泛型> {
  public 生成文本表示(子项文本们: string[]): string {
    return 子项文本们.join(' - ')
  }

  public 生成Latex表示(子项Latex们: string[]): string {
    return 子项Latex们.join(' - ')
  }

  public 计算(运算分量: number[]): number {
    let [第一项, ...其余项] = 运算分量
    if (第一项 === undefined) throw new Error('减法运算至少需要一个操作数')
    return 其余项.length === 0 ? -第一项 : 第一项 - 其余项.reduce((累积, 当前) => 累积 + 当前, 0)
  }
}

export class 乘法运算<参数们泛型 extends 表达式<string[]>[]> extends 运算<参数们泛型> {
  public 生成文本表示(子项文本们: string[]): string {
    return 子项文本们.join(' * ')
  }

  public 生成Latex表示(子项Latex们: string[]): string {
    return 子项Latex们.join(' \\cdot ')
  }

  public 计算(运算分量: number[]): number {
    return 运算分量.reduce((累积, 当前) => 累积 * 当前, 1)
  }
}

export class 除法运算<参数们泛型 extends 表达式<string[]>[]> extends 运算<参数们泛型> {
  // 除法在latex里写成分数 不需要加括号
  public override 应该为子项加括号Latex(_子项: 表达式<string[]>): boolean {
    return false
  }

  public 生成文本表示(子项文本们: string[]): string {
    return 子项文本们.join(' / ')
  }

  public 生成Latex表示(子项Latex们: string[]): string {
    return `\\frac{${子项Latex们[0]}}{${子项Latex们[1]}}`
  }

  public 计算(运算分量: number[]): number {
    let [第一项, ...其余项] = 运算分量
    if (第一项 === undefined || 其余项.length === 0) {
      throw new Error('除法运算至少需要两个操作数')
    }
    return 其余项.reduce((累积, 当前) => 累积 / 当前, 第一项)
  }
}
