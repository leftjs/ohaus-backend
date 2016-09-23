/**
 * Created by zhangjiasheng on 16/9/22.
 */

import config from '../config'
import * as request from './request'
const {apikey, passTpl, smsUrl} = config.yunpian

/**
 * 向指定电话号码发送短信
 * @param text
 * @param mobile
 */
export const sendSmsToMobile = (text, mobile) => {
	return request.form(smsUrl, `apikey=${apikey}&mobile=${mobile}&text=${text}`)
}

/**
 * 发送密码到指定号码
 * @param pass
 * @param mobile
 */
export const sendPassToMobile = (pass, mobile) => {
	return sendSmsToMobile(`${passTpl}${pass}`, mobile)
}