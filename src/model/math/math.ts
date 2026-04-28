import { 操作 } from '../base/base.js'

export let 加法 = new 操作(
  '加',
  (a: number, b: number): number => a + b,
  (参数: string[]): string => `(${参数[0]} + ${参数[1]})`,
  (参数: string[]): string => `(${参数[0]} + ${参数[1]})`,
)
export let 减法 = new 操作(
  '减',
  (a: number, b: number): number => a - b,
  (参数: string[]): string => `(${参数[0]} - ${参数[1]})`,
  (参数: string[]): string => `(${参数[0]} - ${参数[1]})`,
)
export let 乘法 = new 操作(
  '乘',
  (a: number, b: number): number => a * b,
  (参数: string[]): string => `(${参数[0]} × ${参数[1]})`,
  (参数: string[]): string => `(${参数[0]} \\times ${参数[1]})`,
)
export let 除法 = new 操作(
  '除',
  (a: number, b: number): number => a / b,
  (参数: string[]): string => `(${参数[0]} / ${参数[1]})`,
  (参数: string[]): string => `\\frac{${参数[0]}}{${参数[1]}}`,
)
