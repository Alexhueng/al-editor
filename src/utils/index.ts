/**
 * @returns a random color
 */
const randomColor = () => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b})`
}

export const base64Image2Clipboard = async (base64: string) => {
  const base64Data = base64.split(',')[1]

  const imageBlob = await fetch(`data:image/png;base64,${base64Data}`).then((res) => res.blob())

  // 创建 ClipboardItem 对象，指定类型为 'image/png'
  const clipboardItem = new ClipboardItem({
    'image/png': imageBlob,
  })

  return clipboardItem
}

export const getType = (value: any) => Object.prototype.toString.call(value).slice(8, -1)
export const isString = (value: unknown) => getType(value) === 'String'
export const isNumber = (value: unknown) => getType(value) === 'Number'
export const isObject = (value: unknown) => getType(value) === 'Object'
export const isBoolean = (value: unknown) => getType(value) === 'Boolean'
export const isArray = (value: unknown) => getType(value) === 'Array'
export const isNull = (value: unknown) => getType(value) === 'Null'
export const isUndefined = (value: unknown) => getType(value) === 'Undefined'
