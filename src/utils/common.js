import { Message } from 'element-ui'

function uploadImgIsCorrect (imgFile, sizeLimit) {
  let isCorrect = true
  if (!/.(gif|jpg|jpeg|png|GIF|JPG|JPEG|PNG)$/.test(imgFile.name)) {
    Message.warning('图片格式必须是.gif,jpeg,jpg,png中的一种')
    isCorrect = false
  } else if ((imgFile.size).toFixed(2) >= sizeLimit) {
    Message.warning(`图片不能超过${sizeLimit / 1024}KB`)
    isCorrect = false
  }
  return isCorrect
}

function downloadStream (stream, streamType, downloadName) {
  // 创建一个新的 Blob 对象，包含下载的文件数据
  const blob = new Blob([stream], { type: streamType })
  // 创建一个 URL 对象，指向 Blob 数据
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  // 设置下载的文件名
  link.download = downloadName
  // 模拟点击下载链接
  // link.click()
  // 模拟点击(兼容火狐)
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  )
  // 释放 URL 对象
  window.URL.revokeObjectURL(blob)
}

export { uploadImgIsCorrect, downloadStream }