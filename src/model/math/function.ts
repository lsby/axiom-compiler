import {
  不动点,
  任意的数据,
  任意的表达式,
  操作,
  数据,
  替换数据符号,
  符号,
  表达式,
  计算数据包含符号,
  计算数据返回值类型,
  计算表达式包含符号,
  调用,
} from '../base/base.js'
import { 类型限制, 继承 } from '../base/types.js'
import { 算子, 计算算子参数类型 } from './constructor.js'

// 函数, 是算子和符号组成的调用, 可以通过代换将其内部符号替换为其他的表达式
// 函数不包含逻辑, 其逻辑是通过算子组合形成的
export class 函数<
  算子类型 extends 类型限制<
    继承<计算数据返回值类型<参数类型>, 计算算子参数类型<算子类型>>,
    any,
    {
      错误: '函数参数类型不匹配'
      算子名称: 算子类型 extends 算子<infer N, any, any> ? N : '未知算子'
      期待的参数类型: 计算算子参数类型<算子类型>
      实际传入的参数类型: 计算数据返回值类型<参数类型>
    }
  >,
  const 参数类型 extends 任意的数据,
> extends 调用<算子类型, 参数类型> {
  private 我的算子: 算子类型
  private 我的参数: 参数类型

  public constructor(算子: 算子类型, 参数: 参数类型) {
    super(算子, 参数)
    this.我的算子 = 算子
    this.我的参数 = 参数
  }

  public override 代换<S extends 计算数据包含符号<参数类型> | (string & {}), R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 函数<算子类型, 替换数据符号<参数类型, S, 计算表达式包含符号<R>>> {
    return new 函数(this.我的算子, this.我的参数.代换(符号名, 替换物) as any) as any
  }

  public override 输出文本(嵌套?: boolean): string {
    return this.获得完整输出组(嵌套, false)
  }
  public override 输出Latex(嵌套?: boolean): string {
    return this.获得完整输出组(嵌套, true)
  }

  protected override 输出主体文本(): string {
    return this.我的算子.格式化纯文本(this.我的参数.获得各项())
  }
  protected override 输出主体Latex(): string {
    return this.我的算子.格式化Latex(this.我的参数.获得各项())
  }

  protected override 是否应在组中隐藏主体(): boolean {
    return true
  }

  /**
   * 语法糖: 通过当前函数派生出一个新函数
   * @param 名称 新函数的名称
   * @param 参数符号 新函数的参数列表
   * @param 变换逻辑 如何通过当前函数构造出新函数的体
   */
  public 派生<const N extends string, const S extends string>(
    名称: N,
    参数符号: 符号<S, any>[],
    变换逻辑: (自身: this) => 任意的表达式,
  ): 函数<算子<N, any[], any>, 数据<符号<S, any>[]>> {
    let 体 = 变换逻辑(this)
    let 新算子 = 算子.从表达式创建(名称, 参数符号, 体 as any)
    return new 函数(新算子, new 数据(参数符号)) as any
  }
}

// 不动点函数, 函数的特殊情况, 用来处理需要递归的情况
export class 不动点函数<const 参数类型 extends 任意的数据, 返回值> extends 表达式<计算数据包含符号<参数类型>, 返回值> {
  public constructor(
    private 我的不动点: 不动点<any, any, 返回值>,
    private 我的参数: 参数类型,
    private 纯文本格式化?: (参数: 任意的表达式[]) => string,
    private Latex格式化?: (参数: 任意的表达式[]) => string,
  ) {
    super()
  }

  public override 代换<S extends 计算数据包含符号<参数类型> | (string & {}), R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 不动点函数<替换数据符号<参数类型, S, 计算表达式包含符号<R>>, 返回值> {
    return new 不动点函数(
      this.我的不动点,
      this.我的参数.代换(符号名, 替换物) as any,
      this.纯文本格式化,
      this.Latex格式化,
    ) as any
  }

  public 获得不动点(): 不动点<any, any, 返回值> {
    return this.我的不动点
  }

  public override 求值(): 返回值 {
    let 参数值 = this.我的参数.获得各项().map((项: any) => 项.求值())
    return this.我的不动点.应用(参数值)
  }

  public override 输出文本(嵌套?: boolean): string {
    return this.获得完整输出组(嵌套, false)
  }
  public override 输出Latex(嵌套?: boolean): string {
    return this.获得完整输出组(嵌套, true)
  }

  protected override 输出主体文本(): string {
    let 参数列表 = this.我的参数.获得各项()
    if (this.我的不动点.比较参数(参数列表)) {
      return this.我的不动点.格式化纯文本(参数列表)
    } else {
      let 传入参数文本 = 参数列表.map((p) => p.输出文本(true)).join(', ')
      return `(${this.我的不动点.输出Lambda文本()})(${传入参数文本})`
    }
  }

  protected override 输出主体Latex(): string {
    let 参数列表 = this.我的参数.获得各项()
    if (this.我的不动点.比较参数(参数列表)) {
      return this.我的不动点.格式化Latex(参数列表)
    } else {
      let 传入参数文本 = 参数列表.map((p) => p.输出Latex(true)).join(', ')
      return `(${this.我的不动点.输出LambdaLatex()})(${传入参数文本})`
    }
  }

  protected override 是否应在组中隐藏主体(): boolean {
    return this.我的不动点.比较参数(this.我的参数.获得各项())
  }

  public override 收集依赖(池: Set<不动点<any, any, any> | 操作<any, any, any>>): void {
    this.我的不动点.收集依赖(池)
    this.我的参数.收集依赖(池)
  }

  /**
   * 语法糖: 通过当前函数派生出一个新函数
   * @param 名称 新函数的名称
   * @param 参数符号 新函数的参数列表
   * @param 变换逻辑 如何通过当前函数构造出新函数的体
   */
  public 派生<const N extends string, const S extends string>(
    名称: N,
    参数符号: 符号<S, any>[],
    变换逻辑: (自身: this) => 任意的表达式,
  ): 函数<算子<N, any[], any>, 数据<符号<S, any>[]>> {
    let 体 = 变换逻辑(this)
    let 新算子 = 算子.从表达式创建(名称, 参数符号, 体 as any)
    return new 函数(新算子, new 数据(参数符号)) as any
  }
}
