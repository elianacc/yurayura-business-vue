import request from '@api/baseRequest'

function getSysNoticeRecentMonth (success) {
  request.get('/api/sys/notice/getRecentMonthList', null, success)
}

export { getSysNoticeRecentMonth }