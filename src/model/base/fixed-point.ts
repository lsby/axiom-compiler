import { 任意的表达式, 表达式, 计算表达式包含符号 } from './expression.js'
import { 符号 } from './symbol.js'
import { 值 } from './value.js'

// 不动点: fix(自引用符号, 参数符号列表, 体)
// 自引用在应用时局部代换为自身实例, 无需全局注册表
export class 不动点<自引用符号 extends string, 体符号 extends string, 返回值> extends 表达式<
  Exclude<体符号, 自引用符号>,
  返回值
> {
  private 绑定了自引用的体: 表达式<any, 返回值>

  public constructor(
    private 自引用符号名: 自引用符号,
    private 参数符号列表: 符号<any, any>[],
    private 体: 表达式<体符号, 返回值>,
    private 显示名称?: string,
    private 纯文本格式化?: (参数: 任意的表达式[]) => string,
    private Latex格式化?: (参数: 任意的表达式[]) => string,
  ) {
    super()
    // 预先将体内的自引用符号代换为自身, 避免每次应用时重复代换
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.绑定了自引用的体 = this.体.代换(this.自引用符号名, this as any)
  }

  public 获得显示名称(): string | undefined {
    return this.显示名称
  }

  public override 获得依赖名称(): string | undefined {
    return this.获得显示名称() ?? this.获得自引用符号名()
  }
  public override 获得依赖定义文本(): string | undefined {
    return this.输出定义文本()
  }
  public override 获得依赖定义Latex(): string | undefined {
    return this.输出定义Latex()
  }

  public override 代换<S extends Exclude<体符号, 自引用符号> | (string & {}), R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 不动点<自引用符号, Exclude<体符号, S> | 计算表达式包含符号<R>, 返回值> {
    // 保护自引用符号和参数符号
    if ((符号名 as string) === (this.自引用符号名 as string)) return this as any
    let 是参数符号 = this.参数符号列表.some((符号) => 符号.获得名称() === (符号名 as string))
    if (是参数符号) return this as any
    // 其他符号正常传播
    return new 不动点(
      this.自引用符号名,
      this.参数符号列表,
      this.体.代换(符号名, 替换物),
      this.显示名称,
      this.纯文本格式化,
      this.Latex格式化,
    ) as any
  }

  public override 求值(): 返回值 {
    throw new Error(`不动点 "${this.自引用符号名}" 需要通过 应用 方法传入参数来求值`)
  }

  // 带参数的应用: 只需代换参数符号 (自引用已在构造时绑定)
  public 应用(参数值: any[]): 返回值 {
    let 当前表达式: 任意的表达式 = this.绑定了自引用的体
    for (let i = 0; i < this.参数符号列表.length; i++) {
      let 当前符号 = this.参数符号列表[i]
      if (当前符号 === undefined) throw new Error('意外的空值')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      当前表达式 = 当前表达式.代换(当前符号.获得名称(), new 值(参数值[i]))
    }
    return 当前表达式.求值()
  }

  public 获得自引用符号名(): 自引用符号 {
    return this.自引用符号名
  }
  public 获得参数符号列表(): 符号<any, any>[] {
    return this.参数符号列表
  }
  public 获得体(): 表达式<体符号, 返回值> {
    return this.体
  }

  public override 输出文本(嵌套?: boolean): string {
    if (嵌套 === true) return this.显示名称 ?? this.自引用符号名
    return this.输出定义文本()
  }
  public override 输出Latex(嵌套?: boolean): string {
    return this.获得完整输出组(嵌套, true)
  }

  protected override 输出主体文本(): string {
    return this.输出定义文本()
  }
  protected override 输出主体Latex(): string {
    return this.输出定义Latex()
  }

  public 格式化纯文本(参数: 任意的表达式[]): string {
    if (this.纯文本格式化 !== undefined) return this.纯文本格式化(参数)
    return `${this.显示名称 ?? this.自引用符号名}(${参数.map((p) => p.输出文本(true)).join(', ')})`
  }
  public 格式化Latex(参数: 任意的表达式[]): string {
    if (this.Latex格式化 !== undefined) return this.Latex格式化(参数)
    return `\\mathrm{${this.显示名称 ?? this.自引用符号名}}(${参数.map((p) => p.输出Latex(true)).join(', ')})`
  }

  public 比较参数(传入参数: 表达式<any, any>[]): boolean {
    if (传入参数.length !== this.参数符号列表.length) return false
    for (let i = 0; i < 传入参数.length; i++) {
      let 传入 = 传入参数[i]
      let 预期 = this.参数符号列表[i]
      if (!(传入 instanceof 符号) || 传入.获得名称() !== 预期?.获得名称()) return false
    }
    return true
  }

  public 输出Lambda文本(): string {
    let 参数文本 = this.参数符号列表.map((s) => s.输出文本(true)).join(', ')
    return `(${参数文本}) => ${this.体.输出文本(true)}`
  }
  public 输出LambdaLatex(): string {
    let 参数文本 = this.参数符号列表.map((s) => s.输出Latex(true)).join(', ')
    return `(${参数文本}) \\Rightarrow ${this.体.输出Latex(true)}`
  }

  public 输出定义文本(): string {
    return `let ${this.显示名称 ?? this.自引用符号名} = ${this.输出Lambda文本()}`
  }
  public 输出定义Latex(): string {
    let 参数文本 = this.参数符号列表.map((s) => s.输出Latex(true)).join(', ')
    return `\\mathrm{${this.显示名称 ?? this.自引用符号名}}(${参数文本}) &= ${this.体.输出Latex(true)}`
  }

  public override 收集依赖(池: Set<任意的表达式>): void {
    if (池.has(this)) return
    池.add(this)
    this.体.收集依赖(池)
    // 移动到末尾, 保证依赖顺序
    池.delete(this)
    池.add(this)
  }
}
