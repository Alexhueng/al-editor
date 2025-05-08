interface LayoutItem {
  x?: number
  y?: number
  row?: number
  col?: number
  index?: number
  [key: string]: any // 允许其他自定义属性
}

interface AutoWrapLayoutConfig {
  itemWidth?: number
  itemHeight?: number
  hGap?: number
  vGap?: number
  begin?: [number, number]
  containerWidth?: number
  maxRows?: number
}

export class AutoWrapLayout {
  private config: Required<AutoWrapLayoutConfig>

  constructor(config: AutoWrapLayoutConfig = {}) {
    // 初始化默认配置
    this.config = {
      itemWidth: 0,
      itemHeight: 0,
      hGap: 0,
      vGap: 0,
      begin: [0, 0],
      containerWidth: Infinity,
      maxRows: Infinity,
      ...config,
    }
  }

  /**
   * 执行布局计算
   * @param items 需要布局的对象数组
   * @param maxItems 最大布局数量限制(可选)
   * @returns 处理后的对象数组
   */
  execute(items: LayoutItem[] = [], maxItems: number = Infinity): LayoutItem[] {
    const { itemWidth, itemHeight, hGap, vGap, begin, containerWidth, maxRows } = this.config

    const [beginX, beginY] = begin
    let currentX = beginX
    let currentY = beginY
    let currentRow = 1
    let currentCol = 1
    let itemCount = 0

    return items.map((item, index) => {
      if (itemCount >= maxItems) return item

      // 检查是否需要换行
      if (currentX + itemWidth > beginX + containerWidth) {
        currentX = beginX
        currentY += itemHeight + vGap
        currentRow++
        currentCol = 1

        // 检查是否超出最大行数
        if (currentRow > maxRows) return item
      }

      // 写入布局信息
      const result = {
        ...item,
        x: currentX,
        y: currentY,
        row: currentRow,
        col: currentCol,
        index: itemCount,
      }

      // 更新位置
      currentX += itemWidth + hGap
      currentCol++
      itemCount++

      return result
    })
  }

  /**
   * 更新配置
   * @param newConfig 新的配置项
   */
  updateConfig(newConfig: AutoWrapLayoutConfig) {
    this.config = {
      ...this.config,
      ...newConfig,
    }
  }
}
