import { usePanelStore } from '@/stores/panel'
import { useGraph } from '../useGraph'

const panelStore = usePanelStore()

export const useKeyboard = (graph: useGraph) => {
  graph.bindKey(['meta+c', 'ctrl+c'], () => {
    graph._copy()
    return false
  })
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    graph._cut()
    return false
  })
  graph.bindKey(['meta+v', 'ctrl+v'], () => {
    graph._paste()
    return false
  })

  // undo redo
  graph.bindKey(['meta+z', 'ctrl+z'], (...args) => {
    graph._undo()
    return false
  })
  graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
    graph._redo()
    return false
  })

  // select all
  graph.bindKey(['meta+a', 'ctrl+a'], () => {
    graph._selectAll()
    return false
  })

  // delete
  graph.bindKey(['delete'], () => {
    graph._deleteCells()
  })
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Delete') {
      graph._deleteCells()
    }
  })

  // zoom
  // ctrl + 数字会冲突到chrome浏览器的切换标签快捷键.
  // graph.bindKey(['ctrl+1', 'meta+1'], () => {
  //   const zoom = graph.zoom()
  //   if (zoom < 1.5) {
  //     graph.zoom(0.1)
  //   }
  // })
  // graph.bindKey(['ctrl+2', 'meta+2'], () => {
  //   const zoom = graph.zoom()
  //   if (zoom > 0.5) {
  //     graph.zoom(-0.1)
  //   }
  // })
}
