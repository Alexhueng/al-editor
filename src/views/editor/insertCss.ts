import { insertCss } from 'insert-css'

export function preWork() {
  const container = document.getElementById('graph-container')!
  const stencilContainer = document.createElement('div')
  stencilContainer.id = 'stencil'
  const graphContainer = document.createElement('div')
  graphContainer.id = 'graph-container'
  container?.appendChild(stencilContainer)
  container?.appendChild(graphContainer)

  insertCss(`
  #container {
    display: flex;
    // border: 1px solid #dfe3e8;
  }
  #stencil {
    // width: 300px;
    // height: 100%;
    // position: relative;
    // border-right: 1px solid #dfe3e8;
  }
  .x6-graph {
    // height: fit-content !important;
  }

  // #graph-container {
  //   width: calc(100% - 300px);
  //   height: 100%;
  // }
  .x6-widget-stencil  {
    background-color: #fff;
    width: inherit;
  }
  .x6-widget-stencil-content {
    padding: 10px;
    padding-top: 42px;
    width: inherit;
  }
  .x6-widget-stencil-title {
    background-color: #fff;
    width: inherit;
  }
  .x6-widget-stencil-group-title {
    background-color: #fff !important;
  }
  .x6-widget-transform {
    margin: -1px 0 0 -1px;
    padding: 0px;
    // transform: translate(-10px, -10px);
    border: 1px solid #239edd;
    border-style: dashed;
  }
  .x6-widget-transform > div {
    border: 1px solid #239edd;
    // border-radius: 50%;
    // background: #239edd;
  }
  .x6-widget-transform > div:hover {
    background-color: #ffeb3b;
  }
  .x6-widget-transform-active-handle {
    background-color: #ffeb3b !important;
  }
  .x6-widget-transform-resize {
    border-radius: 0;
  }
  .x6-widget-transform-rotate {
    
  }

  .x6-widget-selection-inner {
    border: 1px solid #239edd;
  }
  .x6-widget-selection-box {
    // padding: 10px;
    // transform: translate(-10px, -10px);
    opacity: 1;
    // border-width: 2px;
    // border-color: #ff9800;
  }

  @keyframes running-line {
    to {
      stroke-dashoffset: -1000;
    }
  }
`)
}
