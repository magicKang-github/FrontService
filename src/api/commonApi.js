// import axios from '../../libs/api.request'
import config from '../config/index'

const { hostName, deleteFile } = config

export const downloadFile = fileName => {
  window.location.href = hostName + '/api/common/download?fileName=' + encodeURI(fileName) + '&delete=' + deleteFile
}
