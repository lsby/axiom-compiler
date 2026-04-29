import {
  任意的表达式,
  替换表达式们符号,
  表达式,
  计算表达式们符号映射,
  计算表达式符号映射,
  计算表达式返回值,
} from './expression.js'

// 数据是表达式的数组
export class 数据<const 值类型 extends 任意的表达式[]> extends 表达式<计算表达式们符号映射<值类型>, 值类型> {
  public constructor(private 值: [...值类型]) {
    super()
  }

  public override 代换<
    S extends Extract<keyof 计算表达式们符号映射<值类型>, string> | (string & {}),
    R extends 表达式<any, S extends keyof 计算表达式们符号映射<值类型> ? 计算表达式们符号映射<值类型>[S] : any>,
  >(符号名: S, 替换物: R): 表达式<Omit<计算表达式们符号映射<值类型>, S> & 计算表达式符号映射<R>, 值类型> {
    return new 数据(this.值.map((a) => a.代换(符号名 as any, 替换物))) as any
  }
  public override 求值(): 值类型 {
    return this.值
  }
  public 获得各项(): [...值类型] {
    return this.值
  }

  public override 输出文本(_嵌套?: boolean): string {
    return `[${this.值.map((v) => v.输出文本(true)).join(', ')}]`
  }
  public override 输出Latex(_嵌套?: boolean): string {
    return this.获得完整输出组(_嵌套, true)
  }

  protected override 输出主体文本(): string {
    return `[${this.值.map((v) => v.输出文本(true)).join(', ')}]`
  }
  protected override 输出主体Latex(): string {
    return `[${this.值.map((v) => v.输出Latex(true)).join(', ')}]`
  }

  public override 收集依赖(池: Set<任意的表达式>): void {
    this.值.forEach((v) => v.收集依赖(池))
  }

  public override 收集符号(池: Set<任意的表达式>): void {
    for (let 项 of this.值) {
      项.收集符号(池)
    }
  }
}
export type 任意的数据 = 数据<any>
export type 计算数据值类型<T> = T extends 数据<infer Arr> ? Arr : never
export type 计算数据返回值类型<T> = T extends 数据<infer Arr> ? { [K in keyof Arr]: 计算表达式返回值<Arr[K]> } : never
export type 计算数据符号映射<T> = T extends 数据<infer Arr> ? 计算表达式们符号映射<Arr> : never
export type 替换数据符号<输入数据, 旧符号 extends string, 新符号 extends string, 类型> = 数据<
  替换表达式们符号<计算数据值类型<输入数据>, 旧符号, 新符号, 类型>
>
