import { StorageService } from '@/utils/storage'
import type { useGraph } from '../useGraph'
import type { Cell } from '@antv/x6'

const storage = new StorageService()

type Options = {
  events?: string[]
}

const DEFAULT_EVENTS = ['cell:added', 'cell:removed', 'cell:changed']
const PERSISTENCE_KEY = 'persistence'

export class Persistence {
  graph: useGraph
  options: Options
  constructor(graph: useGraph, options: Options = {}) {
    this.graph = graph
    this.options = options
    this.autoSave()
  }

  autoSave() {
    const events = this.options.events || DEFAULT_EVENTS

    events.forEach((event) => {
      this.graph.on(event, () => {
        this.save()
      })
    })
  }
  save(data?: { cells: Cell.Properties[] }) {
    storage.set(PERSISTENCE_KEY, data || this.graph.toJSON())
  }
  remove() {
    storage.remove(PERSISTENCE_KEY)
  }
  restore() {
    this.graph.fromJSON(storage.get(PERSISTENCE_KEY)!).centerContent()
  }
  hasUnsaved() {
    return !!storage.get(PERSISTENCE_KEY)
  }
}
