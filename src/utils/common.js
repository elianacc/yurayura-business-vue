import { Message } from 'element-ui'
import mqtt from 'mqtt'
import crypto from 'crypto-js'

var mqttServerIp = '127.0.0.1'
var mqttSubClient = mqtt.connect(`ws://${mqttServerIp}:8083/mqtt`, getMqttProp('consumers'))
var mqttPubClient = mqtt.connect(`ws://${mqttServerIp}:8083/mqtt`, getMqttProp('producers'))

// 上传图片格式和大小校验
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

// 下载文件流
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

// 获取mqtt连接属性
function getMqttProp (clientSuffix) {
  let options = {
    username: 'yura',
    password: '123456',
    clientId: `mqtt-yura-business-vue-${clientSuffix}-${Math.random().toString(16)}`,
    clean: true,
    keepalive: 100,
    connectTimeout: 100
  }
  return options
}

// 发送mqtt消息
function sendMqttMsg (topic, message, success) {
  if (!message) {
    message = 'default'
  }
  mqttPubClient.publish(topic, message, { qos: 0 }, err => {
    if (!err) {
      success()
    }
  })

}

// 生成16位UUID
function generate16UUID () {
  return 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    return (Math.random() * 16 | 0).toString(16);
  });
}

// AES加密
function encryptAes (content, key, salt) {

  let keyUtf8 = crypto.enc.Utf8.parse(key)
  let saltUtf8 = crypto.enc.Utf8.parse(salt)

  let contentUtf8 = crypto.enc.Utf8.parse(content)
  var encrypted = crypto.AES.encrypt(contentUtf8, keyUtf8, {
    iv: saltUtf8,
    mode: crypto.mode.CBC,
    padding: crypto.pad.ZeroPadding
  })

  return crypto.enc.Base64.stringify(encrypted.ciphertext)

}

export { mqttSubClient, mqttPubClient, uploadImgIsCorrect, downloadStream, sendMqttMsg, generate16UUID, encryptAes }