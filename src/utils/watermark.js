'use strict'

const watermark = {}
let watermarkStr = '测试环境'
let watermarkEnv = '测试环境'
const watermarkId = '1.23452384164.123412415'

const setWatermark = (str, elementId, parentElement, top, left) => {
  let id = watermarkId
  if (elementId !== undefined) {
    id = elementId
  }
  if (parentElement !== undefined && document.getElementById(id) !== null) {
    parentElement.removeChild(document.getElementById(id))
  } else if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }

  const can = document.createElement('canvas')
  can.width = 350
  can.height = 250

  const cans = can.getContext('2d')
  cans.rotate(-10 * Math.PI / 180)
  cans.font = '35px Vedana'
  cans.fillStyle = 'rgba(129,145,143,0.16)'
  if (watermarkEnv == '正式环境') {
    cans.font = '35px Vedana'
    cans.fillStyle = 'rgba(252,78,78,0.09)'
  }
  cans.textAlign = 'left'
  cans.textBaseline = 'Middle'
  cans.fillText(str, can.width / 8, can.height / 2)

  const div = document.createElement('div')
  div.id = id
  div.style.pointerEvents = 'none'
  div.style.top = top ? top + 'px' : '30px'
  div.style.left = left ? left + 'px' : '0px'
  div.style.position = 'fixed'
  div.style.zIndex = '100000'
  div.style.width = document.documentElement.clientWidth + 'px'
  div.style.height = document.documentElement.clientHeight + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  div.style.display = 'block'
  if (parentElement !== undefined) {
    parentElement.appendChild(div)
  } else {
    document.body.appendChild(div)
  }
  return id
}

// 该方法只允许调用一次
watermark.set = () => {
  let id = setWatermark(watermarkStr)
  let styleLength = document.getElementById(id).style.length
  let styleBg = document.getElementById(id).style.background
  // console.log('id>>>>>', id)
  // console.log('id.style>>>', styleLength)
  setInterval(() => {
    if (document.getElementById(id) === null || document.getElementById(id).style === undefined ||
      document.getElementById(id).style.length < 10 || document.getElementById(id).style.length !== styleLength ||
      styleBg !== document.getElementById(id).style.background) {
      id = setWatermark(watermarkStr)
      // console.log('id.style>>>>>', document.getElementById(id).style)
      // console.log('in style>>>', styleLength)
      styleLength = document.getElementById(id).style.length
      styleBg = document.getElementById(id).style.background
    }
  }, 500)
  window.onresize = () => {
    setWatermark(watermarkStr)
  }
}

const outWatermark = (id) => {
  if (document.getElementById(id) !== null) {
    const div = document.getElementById(id)
    div.style.display = 'none'
  }
}
watermark.out = () => {
  const str = '1.23452384164.123412415'
  outWatermark(str)
}

watermark.setStr = (str) => {
  watermarkStr = str
}

watermark.setEnv = (str) => {
  watermarkEnv = str
}

watermark.setWatermark = setWatermark

export default watermark
