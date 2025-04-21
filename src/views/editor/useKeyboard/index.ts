import { usePanelStore } from '@/stores/panel'
import { useGraph } from '../useGraph'
import * as SHORTCUT_KEYS from './shortcutKeys'

export const useKeyboard = (graph: useGraph) => {
  // copy
  graph.bindKey(SHORTCUT_KEYS.COPY, () => {
    graph._copy()
    return false
  })

  // cut
  graph.bindKey(SHORTCUT_KEYS.CUT, () => {
    graph._cut()
    return false
  })

  // paste
  graph.bindKey(SHORTCUT_KEYS.PASTE, () => {
    graph._paste()
    return false
  })

  // undo
  graph.bindKey(SHORTCUT_KEYS.UNDO, () => {
    graph._undo()
    return false
  })

  // redo
  graph.bindKey(SHORTCUT_KEYS.REDO, () => {
    graph._redo()
    return false
  })

  // select all
  graph.bindKey(SHORTCUT_KEYS.SELECT_ALL, () => {
    graph._selectAll()
    return false
  })

  // delete
  graph.bindKey(SHORTCUT_KEYS.DELETE, () => {
    graph._deleteCells()
  })
  window.addEventListener('keydown', (e) => {
    if (SHORTCUT_KEYS.DELETE.includes(e.key.toLowerCase())) {
      graph._deleteCells()
    }
  })

  // rotate
  graph.bindKey(SHORTCUT_KEYS.ROTATE_90, () => {
    graph._rotate(90, undefined, { absolute: false })
    return false
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
