export type 类型限制<布尔, 预期类型, 错误提示> = 布尔 extends true ? 预期类型 : { _err: 错误提示 }
export type 等于<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false
export type 继承<A, B> = A extends B ? true : false
