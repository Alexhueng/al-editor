import { useGraph } from '../useGraph'
import useTransform from './transform'
import useSelection from './selection'
import useSnapline from './snapline'
import useKeyboard from './keyboard'
import useHistory from './history'
import useClipboard from './clipboard'
import useExport from './export'
// import useDnd from './dnd'

export const usePlugins = (graph: useGraph) => {
  useExport(graph)
  useTransform(graph)
  useSelection(graph)
  useSnapline(graph)
  useKeyboard(graph)
  useHistory(graph)
  useClipboard(graph)
  // useDnd(graph)
}
