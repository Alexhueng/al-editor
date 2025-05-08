declare type RefType<T> = T | null

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare type Recordable<T = any> = Record<string, T>

declare type Nullable<T> = T | null
