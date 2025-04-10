import type { Graph } from '@antv/x6'
import useTransform from './transform'
import useSelection from './selection'
import useSnapline from './snapline'
import useKeyboard from './keyboard'
import useHistory from './history'
import useClipboard from './clipboard'
import useExport from './export'

export default function (graph: Graph) {
  useExport(graph)
  useTransform(graph)
  useSelection(graph)
  useSnapline(graph)
  useKeyboard(graph)
  useHistory(graph)
  useClipboard(graph)
}
