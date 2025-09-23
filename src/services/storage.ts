export const storage = {
  getList<T = any>(key: string): T[] {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) as T[] : []
    } catch {
      return []
    }
  },
  setList<T = any>(key: string, list: T[]): void {
    localStorage.setItem(key, JSON.stringify(list))
  },
  addItem<T = any>(key: string, item: T): void {
    const list = this.getList<T>(key)
    list.push(item)
    this.setList<T>(key, list)
  },
}


