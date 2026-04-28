import {
  不动点,
  任意的数据,
  任意的表达式,
  替换数据符号,
  表达式,
  计算数据包含符号,
  计算数据返回值类型,
  计算表达式包含符号,
  调用,
} from '../base/base.js'
import { 类型限制, 继承 } from '../base/types.js'
import { 构造子, 计算构造子参数类型 } from './constructor.js'

export class 函数<
  构造子类型 extends 类型限制<
    继承<计算数据返回值类型<参数类型>, 计算构造子参数类型<构造子类型>>,
    any,
    {
      错误: '函数参数类型不匹配'
      构造子名称: 构造子类型 extends 构造子<infer N, any, any> ? N : '未知构造子'
      期待的参数类型: 计算构造子参数类型<构造子类型>
      实际传入的参数类型: 计算数据返回值类型<参数类型>
    }
  >,
  const 参数类型 extends 任意的数据,
> extends 调用<构造子类型, 参数类型> {
  private 我的构造子: 构造子类型
  private 我的参数: 参数类型

  public constructor(构造子: 构造子类型, 参数: 参数类型) {
    super(构造子, 参数)
    this.我的构造子 = 构造子
    this.我的参数 = 参数
  }

  public override 代换<S extends 计算数据包含符号<参数类型> | (string & {}), R extends 任意的表达式>(
    符号名: S,
    替换物: R,
  ): 函数<构造子类型, 替换数据符号<参数类型, S, 计算表达式包含符号<R>>> {
    return new 函数(this.我的构造子, this.我的参数.代换(符号名, 替换物) as any) as any
  }

  public 输出文本(): string {
    return this.我的构造子.格式化纯文本(this.我的参数.获得各项())
  }
  public 输出Latex(): string {
    return this.我的构造子.格式化Latex(this.我的参数.获得各项())
  }
}

export class 不动点函数<const 参数类型 extends 任意的数据, 返回值> extends 表达式<计算数据包含符号<参数类型>, 返回值> {
  public constructor(
    private 我的不动点: 不动点<any, any, 返回值>,
    private 我的参数: 参数类型,
    private 纯文本格式化: (参数: 任意的表达式[]) => string,
    private Latex格式化: (参数: 任意的表达式[]) => string,
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

  public override 求值(): 返回值 {
    let 参数值 = this.我的参数.获得各项().map((项: any) => 项.求值())
    return this.我的不动点.应用(参数值)
  }

  public 输出文本(): string {
    return this.纯文本格式化(this.我的参数.获得各项())
  }
  public 输出Latex(): string {
    return this.Latex格式化(this.我的参数.获得各项())
  }
}
