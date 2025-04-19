/**
 * @returns a random color
 */
export const randomColor = () => {
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

/**
 *
 * @param arr
 * @param fieldName
 * @param ascending 升降序, 默认升序
 * @returns 排序后的数组
 */
export function sortByNumberField<T>(arr: T[], fieldName: keyof T, ascending = true): T[] {
  return arr.slice().sort((a, b) => {
    const valueA = a[fieldName] as number
    const valueB = b[fieldName] as number

    return ascending ? valueA - valueB : valueB - valueA
  })
}

export const IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'bmp', 'webp', 'svg', 'ico']

// 将数组转换为正则表达式需要的字符串格式
export const IMAGE_EXTENSIONS_STR = IMAGE_EXTENSIONS.join('|')

export function isImageFile(filename: string) {
  const imageRegex = new RegExp(`\\.(${IMAGE_EXTENSIONS_STR})$`, 'i')
  return imageRegex.test(filename)
}

export function isWebImageUrl(url: string) {
  const regex = new RegExp(`^https?://.+(\\.(${IMAGE_EXTENSIONS_STR}))(\\?[^#]*)?(#.*)?$`, 'i')
  return regex.test(url)
}

// 计算出一个八边形的refPoints
// const sideLength = Math.min(36, 36)
// // 缩进量，根据等边八角形的几何特性计算
// const indent = Math.round(sideLength / (2 + Math.sqrt(2)))
// const centerX = (36 - sideLength) / 2
// const centerY = (36 - sideLength) / 2

// const refPoints = [
//   `${centerX + indent},${centerY}`,
//   `${centerX + sideLength - indent},${centerY}`,
//   `${centerX + sideLength},${centerY + indent}`,
//   `${centerX + sideLength},${centerY + sideLength - indent}`,
//   `${centerX + sideLength - indent},${centerY + sideLength}`,
//   `${centerX + indent},${centerY + sideLength}`,
//   `${centerX},${centerY + sideLength - indent}`,
//   `${centerX},${centerY + indent}`,
// ].join(' ')
