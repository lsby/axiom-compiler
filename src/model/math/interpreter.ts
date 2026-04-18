import { 函数, 参数, 参数引用, 数, 等价, 类型限制, 表达式, 运算 } from './math.js'

type 环境 = Record<string, number>

function 解释表达式(节点: 表达式<string[]>, 上下文: 环境): number {
  if (节点 instanceof 数) {
    return 节点.值
  }

  if (节点 instanceof 参数引用) {
    let 结果 = 上下文[节点.值]
    if (结果 === undefined) {
      throw new Error(`未定义的变量: ${节点.值}`)
    }
    return 结果
  }

  if (节点 instanceof 运算) {
    let 运算分量 = 节点.参数们.map((项) => 解释表达式(项, 上下文))
    return 节点.计算(运算分量)
  }

  throw new Error('未知的表达式类型')
}

export function 调用函数<
  参数们类型 extends 参数<string>[],
  表达式类型 extends 表达式<string[]>,
  const 实参列表类型 extends number[],
>(
  目标函数: 函数<参数们类型, 表达式类型>,
  实参列表: 类型限制<
    等价<参数们类型['length'], 实参列表类型['length']>,
    [...实参列表类型],
    { _错误: '参数数量不匹配'; _预期数量: 参数们类型['length']; _实际数量: 实参列表类型['length'] }
  >,
): number {
  let 实际参数们 = 实参列表 as unknown as number[]
  if (目标函数.参数们.length !== 实际参数们.length) {
    throw new Error(`函数参数不匹配：预期 ${目标函数.参数们.length} 个，实际得到 ${实际参数们.length} 个`)
  }

  let 局部环境: 环境 = {}
  for (let 索引 = 0; 索引 < 目标函数.参数们.length; 索引++) {
    let 形参 = 目标函数.参数们[索引] as unknown as 参数<string> | undefined
    let 实参 = 实际参数们[索引]
    if (形参 === undefined || 实参 === undefined) {
      throw new Error('意外的空值')
    }
    局部环境[形参.值] = 实参
  }

  return 解释表达式(目标函数.表达式, 局部环境)
}
