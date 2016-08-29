/**
 * Created by zhangjiasheng on 16/8/25.
 */
import * as types from './const'
import * as req from '../services/request'
export const sayHello = (word) => {
	return dispatch => dispatch({
		type: types.SAY_HELLO,
		payload: new Promise((resolve, reject) => {
			setTimeout(()=> {
				resolve(`hello ${word}`)
			}, 2000)
		})
	})
}


export const uploadProductZip = (body) => {
	return dispatch => dispatch({
		type: types.UPLOAD_PRODUCT_ZIP,
		payload: new Promise((resolve, reject) => {
			req.upload('/product/zip', body).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

export const getProductListByPageAndSize = ({page, size}) => {
	return dispatch => dispatch({
		type: types.GET_PRODUCT_LIST,
		payload: new Promise((resolve, reject) => {
			req.get('/product/list', {
				page,
				size
			}).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}