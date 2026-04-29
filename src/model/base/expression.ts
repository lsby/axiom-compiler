// 所有一切都是表达式
export abstract class 表达式<符号映射 extends Record<string, any>, 返回值> {
  declare protected _类型保持: (输入: 符号映射) => 返回值

  public abstract 代换<
    S extends Extract<keyof 符号映射, string> | (string & {}),
    R extends 表达式<any, S extends keyof 符号映射 ? 符号映射[S] : any>,
  >(符号名: S, 替换物: R): 表达式<Omit<符号映射, S> & 计算表达式符号映射<R>, 返回值>

  public abstract 求值(): 返回值

  public abstract 输出文本(嵌套?: boolean): string
  public abstract 输出Latex(嵌套?: boolean): string

  public abstract 收集依赖(池: Set<任意的表达式>): void

  public abstract 收集符号(池: Set<任意的表达式>): void

  protected abstract 输出主体文本(): string
  protected abstract 输出主体Latex(): string

  protected 是否应在组中隐藏主体(): boolean {
    return false
  }

  public 获得依赖名称(): string | undefined {
    return undefined
  }
  public 获得依赖定义文本(): string | undefined {
    return undefined
  }
  public 获得依赖定义Latex(): string | undefined {
    return undefined
  }
  public 获得是否隐藏(): boolean {
    return false
  }

  protected 获得完整输出组(嵌套: boolean | undefined, 是Latex: boolean): string {
    let 主体 = 是Latex ? this.输出主体Latex() : this.输出主体文本()
    if (嵌套 === true) return 主体
    let 池 = new Set<任意的表达式>()
    this.收集依赖(池)

    let 结果 = []
    let 已处理名称 = new Set<string>()

    for (let 项 of 池) {
      if (项.获得是否隐藏()) continue
      let 名 = 项.获得依赖名称()
      if (名 === undefined || 已处理名称.has(名)) continue
      已处理名称.add(名)
      let 定义 = 是Latex ? 项.获得依赖定义Latex() : 项.获得依赖定义文本()
      if (定义 !== undefined) 结果.push(定义)
    }
    if (!this.是否应在组中隐藏主体()) {
      结果.push(主体)
    }

    if (结果.length === 0) return 主体

    if (是Latex) {
      return String.raw`\begin{aligned} ${结果.join(' \\\\ ')} \end{aligned}`
    } else {
      if (结果.length === 1 && 结果[0] !== undefined) return 结果[0]
      return 结果.join('\n')
    }
  }
}
export type 任意的表达式 = 表达式<any, any>
export type 计算符号类型<M, S> = S extends keyof M ? M[S] : any
export type 计算表达式符号映射<A> = A extends 表达式<infer X, any> ? X : never
export type 计算表达式返回值<A> = A extends 表达式<any, infer X> ? X : never
export type 移除表达式符号<A, S extends string> =
  A extends 表达式<infer 符号映射, infer 返回值> ? 表达式<Omit<符号映射, S>, 返回值> : never
export type 添加表达式符号<输入表达式, 符号 extends string, 类型> =
  输入表达式 extends 表达式<infer 符号映射, infer 返回值> ? 表达式<符号映射 & { [K in 符号]: 类型 }, 返回值> : never
export type 替换表达式符号<输入表达式, 旧符号 extends string, 新符号 extends string, 类型> = 添加表达式符号<
  移除表达式符号<输入表达式, 旧符号>,
  新符号,
  类型
>

export type 计算表达式们符号映射<表达式集> = 表达式集 extends []
  ? {}
  : 表达式集 extends [infer X, ...infer XS]
    ? 计算表达式符号映射<X> & 计算表达式们符号映射<XS>
    : 表达式集 extends (infer T)[]
      ? 计算表达式符号映射<T>
      : never
export type 替换表达式们符号<表达式们, 旧符号 extends string, 新符号 extends string, 类型> = 表达式们 extends []
  ? 表达式们
  : 表达式们 extends [infer X, ...infer XS]
    ? [替换表达式符号<X, 旧符号, 新符号, 类型>, ...替换表达式们符号<XS, 旧符号, 新符号, 类型>]
    : never
