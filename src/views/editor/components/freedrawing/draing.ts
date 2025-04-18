import * as fabric from 'fabric'
import type { CanvasOptions } from 'fabric'

type FreeDrawingOptions = Partial<CanvasOptions> & {
  id: string | HTMLCanvasElement
  [key: string]: any
}

export class FreeDrawing {
  canvas: fabric.Canvas
  drawingBrush: fabric.PencilBrush
  constructor(options: FreeDrawingOptions) {
    this.canvas = new fabric.Canvas(options.id, {
      isDrawingMode: false,
      ...options,
      selection: false,
      width: options.width || window.innerWidth,
      height: options.height || window.innerHeight,
      enablePointerEvents: false,
    })
    this.drawingBrush = this.createPencilBrush()
    this.canvas.freeDrawingBrush = this.drawingBrush
    this.updateBrush()
  }
  getWrapperEl() {
    return this.canvas.wrapperEl
  }
  openDrawingMode() {
    this.canvas.isDrawingMode = true
  }
  closeDrawingMode() {
    this.canvas.isDrawingMode = false
  }
  toggleDrawingMode() {
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode
  }
  clear() {
    this.canvas.clear()
  }
  createPencilBrush() {
    const pencilBrush = new fabric.PencilBrush(this.canvas)
    return pencilBrush
  }
  updateBrush(options: any = {}) {
    const brush = this.drawingBrush
    brush.color = options.color || '#000'
    brush.width = options.width || 1
    // brush.strokeDashArray = [2]
    // if (brush.getPatternSrc) {
    //   brush.source = brush.getPatternSrc.call(brush)
    // }
    brush.shadow = new fabric.Shadow({
      blur: parseInt(options.shadowWidth, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: options.shadowColor,
    })
  }
  toSvg() {
    return this.canvas.toSVG()
  }
}
