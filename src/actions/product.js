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

/**
 * 上传产品压缩包
 * @param body
 * @returns {function(*): *}
 */
export const uploadProductZip = (body) => {
	return dispatch => dispatch({
		type: types.UPLOAD_PRODUCT_ZIP,
		payload: new Promise((resolve, reject) => {
			req.upload('/api/product/zip', body).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 分页获取产品列表
 * @param page
 * @param size
 * @returns {function(*): *}
 */
export const getProductListByPageAndSize = ({page, size}) => {
	return dispatch => dispatch({
		type: types.GET_PRODUCT_LIST,
		payload: new Promise((resolve, reject) => {
			req.get('/api/product/list', {
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

/**
 * 删除指定id的产品
 * @param id
 * @returns {function(*): *}
 */
export const deleteProductById = (id) => {
	return dispatch => dispatch({
		type: types.DELETE_PRODUCT_BY_ID,
		payload: new Promise((resolve, reject) => {
			req.remove(`/api/product/single/${id}`).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 删除指定id的产品的指定名称的配图
 * @param id
 * @param name
 * @returns {function(*): *}
 */
export const deleteProductImageByName = ({id,name}) => {
	return dispatch => dispatch({
		type: types.DELETE_PRODUCT_IMAGE_BY_NAME,
		payload: new Promise((resolve, reject) => {
			req.remove(`/api/product/${id}/image/${name}`).then((data) => {
				 resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

export const getSingleProduct = (id) => {
	return dispatch => dispatch({
		type: types.GET_SINGLE_PRODUCT,
		payload: new Promise((resolve, reject) => {
			req.get(`/api/product/${id}`).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}