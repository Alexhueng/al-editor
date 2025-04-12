export class StorageService {
  private storage: Storage

  constructor(type: 'local' | 'session' = 'local') {
    this.storage = type === 'local' ? localStorage : sessionStorage
  }

  set<T = any>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value)
      this.storage.setItem(key, serialized)
    } catch (error) {
      // console.error(`Storage set error: ${key}`, error)
    }
  }

  get<T = any>(key: string): T | null {
    const item = this.storage.getItem(key)
    if (!item) return null
    try {
      return JSON.parse(item) as T
    } catch (error) {
      // console.warn(`Storage get (parse) fallback: ${key}`, error)
      return item as unknown as T
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key)
  }

  clear(): void {
    this.storage.clear()
  }

  has(key: string): boolean {
    return this.storage.getItem(key) !== null
  }
}
