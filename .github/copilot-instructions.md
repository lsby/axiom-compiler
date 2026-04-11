# lsby-playground-ts-app AI 编码指南

## 代码风格

- 除非指定, 否则默认为ts代码
- 对于变量名, 函数名, 类名, 方法名等, 都尽可能使用中文(没错, 是中文)
- 禁止浮动的 Promise: no-floating-promises, 不要使用 void 忽略悬空的 promise
- 必须写函数返回类型: explicit-function-return-type
- 必须写类成员访问修饰符: explicit-member-accessibility
- 禁止非空断言: ! → no-non-null-assertion
- 永远使用 let, 拒绝 var 和 const
- 条件里必须显式布尔值: strict-boolean-expressions
- 禁止对非布尔值取反: no-negation
- 禁止使用 undefined: no-undefined (若必须使用 undefined, 则在值等级上用 void 0 替代)
- 总是考虑数组通过下标取项时可能出现的越界问题, 并做安全检查 (数组若越界, 则值为 void 0)
- 总是使用严格的条件判断, 不省略判断条件等于真, 空, null的情况
- 尽可能不要使用简写
- 尽可能使用style属性赋值, 而不是 cssText 文本或 textContent 文本
- 不要删除已有的空值断言, 注释等
- 如果中文变量名或函数名等能表达含义, 就不需要写同样含义的注释了
- 在不影响逻辑的情况下, 将代码写的尽可能短, 尽量减少不必要的换行
- 写出完整的类型, 尽可能不要使用 any
- 写类型时, 尽可能写 type 而不是 interface
- 尽可能不要用 addEventListener, 而是用 onxxx, 避免回调函数被一直持有造成内存泄漏
- 尽可能不要用 dom 查询, 例如 querySelector, 而是用对象引用, 避免 dom 结构变化导致代码失效
