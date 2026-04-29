import { 不动点, 任意的数据, 任意的表达式, 表达式, 计算数据符号映射, 计算数据返回值类型, 调用 } from '../base/base.js'
import { 类型限制, 继承 } from '../base/types.js'
import { 算子, 计算算子参数类型 } from './constructor.js'

// 函数, 是算子 and 符号组成的调用, 可以通过代换将其内部符号替换为其他的表达式
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
  private 我的名称: string
  private 定义时的参数: 任意的表达式[]
  private 定义时的实现文本: string
  private 定义时的实现Latex: string
  private 我的算子: 算子类型
  private 我的参数: 参数类型

  public constructor(名称: string, 算子: 算子类型, 参数: 参数类型) {
    super(算子, 参数)
    this.我的算子 = 算子
    this.我的参数 = 参数
    this.我的名称 = 名称
    this.定义时的参数 = 参数.获得各项() as 任意的表达式[]
    this.定义时的实现文本 = (this.我的算子 as 算子<any, any, any>).格式化纯文本(this.定义时的参数)
    this.定义时的实现Latex = (this.我的算子 as 算子<any, any, any>).格式化Latex(this.定义时的参数)
  }

  public 设置名称(名称: string): this {
    // 在改名前，捕获当前的表现形式作为实现
    this.定义时的实现文本 = this.输出主体文本()
    this.定义时的实现Latex = this.输出主体Latex()
    this.我的名称 = 名称
    // 自动提取所有自由符号作为参数
    let 符号池 = new Set<任意的表达式>()
    this.收集符号(符号池)
    this.定义时的参数 = Array.from(符号池)
    return this
  }

  public override 获得依赖名称(): string {
    return this.我的名称
  }

  public override 获得依赖定义文本(): string {
    let 参数文本 = this.定义时的参数.map((p: 任意的表达式) => p.输出文本(true)).join(', ')
    return `${this.我的名称}(${参数文本}) = ${this.定义时的实现文本}`
  }

  public override 获得依赖定义Latex(): string {
    let 参数文本 = this.定义时的参数.map((p: 任意的表达式) => p.输出Latex(true)).join(', ')
    return `\\mathrm{${this.我的名称}}(${参数文本}) &= ${this.定义时的实现Latex}`
  }

  public override 代换<
    S extends Extract<keyof 计算数据符号映射<参数类型>, string> | (string & {}),
    R extends 表达式<any, S extends keyof 计算数据符号映射<参数类型> ? 计算数据符号映射<参数类型>[S] : any>,
  >(符号名: S, 替换物: R): 函数<算子类型, any> {
    let 结果 = new 函数(this.我的名称, this.我的算子, this.我的参数.代换(符号名 as any, 替换物) as any)
    结果.定义时的参数 = this.定义时的参数
    结果.定义时的实现文本 = this.定义时的实现文本
    结果.定义时的实现Latex = this.定义时的实现Latex
    return 结果
  }

  public override 输出文本(嵌套?: boolean): string {
    return this.获得完整输出组(嵌套, false)
  }
  public override 输出Latex(嵌套?: boolean): string {
    return this.获得完整输出组(嵌套, true)
  }

  protected override 输出主体文本(): string {
    let 参数文本 = this.我的参数
      .获得各项()
      .map((p: 任意的表达式) => p.输出文本(true))
      .join(', ')
    return `${this.我的名称}(${参数文本})`
  }
  protected override 输出主体Latex(): string {
    let 参数文本 = this.我的参数
      .获得各项()
      .map((p: 任意的表达式) => p.输出Latex(true))
      .join(', ')
    return `\\mathrm{${this.我的名称}}(${参数文本})`
  }

  protected override 是否应在组中隐藏主体(): boolean {
    return true
  }

  public override 收集依赖(池: Set<任意的表达式>): void {
    // 先收集依赖，保证顺序
    this.我的算子.收集依赖(池)
    this.我的参数.收集依赖(池)
    池.add(this)
  }

  public override 收集符号(池: Set<任意的表达式>): void {
    this.我的参数.收集符号(池)
  }
}

// 不动点函数, 函数的特殊情况, 用来处理需要递归的情况
export class 不动点函数<const 参数类型 extends 任意的数据, 返回值> extends 表达式<计算数据符号映射<参数类型>, 返回值> {
  private 我的名称: string | undefined
  private 定义时的参数: 任意的表达式[] | undefined
  private 定义时的实现文本: string | undefined
  private 定义时的实现Latex: string | undefined

  public constructor(
    private 我的不动点: 不动点<any, any, 返回值>,
    private 我的参数: 参数类型,
    private 纯文本格式化?: (参数: 任意的表达式[]) => string,
    private Latex格式化?: (参数: 任意的表达式[]) => string,
  ) {
    super()
  }

  public 设置名称(名称: string): this {
    this.定义时的实现文本 = this.输出主体文本()
    this.定义时的实现Latex = this.输出主体Latex()
    this.我的名称 = 名称
    let 符号池 = new Set<任意的表达式>()
    this.收集符号(符号池)
    this.定义时的参数 = Array.from(符号池)
    return this
  }

  public override 获得依赖名称(): string | undefined {
    return this.我的名称 ?? this.我的不动点.获得依赖名称()
  }

  public override 获得依赖定义文本(): string | undefined {
    if (this.我的名称 !== undefined && this.定义时的参数 !== undefined) {
      let 参数文本 = this.定义时的参数.map((p: 任意的表达式) => p.输出文本(true)).join(', ')
      return `${this.我的名称}(${参数文本}) = ${this.定义时的实现文本}`
    }
    return this.我的不动点.获得依赖定义文本()
  }

  public override 获得依赖定义Latex(): string | undefined {
    if (this.我的名称 !== undefined && this.定义时的参数 !== undefined) {
      let 参数文本 = this.定义时的参数.map((p: 任意的表达式) => p.输出Latex(true)).join(', ')
      return `\\mathrm{${this.我的名称}}(${参数文本}) &= ${this.定义时的实现Latex}`
    }
    return this.我的不动点.获得依赖定义Latex()
  }

  public override 代换<
    S extends Extract<keyof 计算数据符号映射<参数类型>, string> | (string & {}),
    R extends 表达式<any, S extends keyof 计算数据符号映射<参数类型> ? 计算数据符号映射<参数类型>[S] : any>,
  >(符号名: S, 替换物: R): 不动点函数<any, 返回值> {
    let 结果 = new 不动点函数(
      this.我的不动点,
      this.我的参数.代换(符号名 as any, 替换物) as any,
      this.纯文本格式化,
      this.Latex格式化,
    )
    结果.我的名称 = this.我的名称
    结果.定义时的参数 = this.定义时的参数
    结果.定义时的实现文本 = this.定义时的实现文本
    结果.定义时的实现Latex = this.定义时的实现Latex
    return 结果
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
    if (this.我的名称 !== undefined) {
      let 参数文本 = this.我的参数
        .获得各项()
        .map((p: 任意的表达式) => p.输出文本(true))
        .join(', ')
      return `${this.我的名称}(${参数文本})`
    }
    return this.我的不动点.格式化纯文本(this.我的参数.获得各项())
  }

  protected override 输出主体Latex(): string {
    if (this.我的名称 !== undefined) {
      let 参数文本 = this.我的参数
        .获得各项()
        .map((p: 任意的表达式) => p.输出Latex(true))
        .join(', ')
      return `\\mathrm{${this.我的名称}}(${参数文本})`
    }
    return this.我的不动点.格式化Latex(this.我的参数.获得各项())
  }

  protected override 是否应在组中隐藏主体(): boolean {
    if (this.我的名称 !== undefined) return true
    return this.我的不动点.比较参数(this.我的参数.获得各项())
  }

  public override 收集依赖(池: Set<任意的表达式>): void {
    this.我的不动点.收集依赖(池)
    this.我的参数.收集依赖(池)
    if (this.我的名称 !== undefined) {
      池.add(this)
    }
  }

  public override 收集符号(池: Set<任意的表达式>): void {
    this.我的参数.收集符号(池)
  }
}
