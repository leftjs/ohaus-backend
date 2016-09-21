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
			req.upload('/api/products/zip', body).then((data) => {
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
			req.get('/api/products/list', {
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
			req.remove(`/api/products/single/${id}`).then((data) => {
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
			req.remove(`/api/products/${id}/image/${name}`).then((data) => {
				 resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 获取单个产品信息
 * @param id
 * @returns {function(*): *}
 */
export const getSingleProduct = (id) => {
	return dispatch => dispatch({
		type: types.GET_SINGLE_PRODUCT,
		payload: new Promise((resolve, reject) => {
			req.get(`/api/products/${id}`).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 删除指定产品的指定参数
 * @param id
 * @param no
 * @returns {function(*): *}
 */
export const deleteProductDataById = ({id, no}) => {
	return dispatch => dispatch({
		type: types.DELETE_PRODUCT_DATA_BY_ID,
		payload: new Promise((resolve, reject) => {
			req.remove(`/api/products/${id}/data/${no}`).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 更新指定产品的参数
 * @param id
 * @param item
 * @returns {function(*): *}
 */
export const updateProductDataById = ({id,item}) => {
	return dispatch => dispatch({
		type: types.UPDATE_PRODUCT_DATA_BY_ID,
		payload: new Promise((resolve, reject) => {
			req.put(`/api/products/${id}/data`, {item}).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 为指定产品添加参数
 * @param id
 * @param item
 * @returns {function(*): *}
 */
export const addProductDataById = ({id, item}) => {
	return dispatch => dispatch({
		type: types.ADD_PRODUCT_DATA_BY_ID,
		payload: new Promise((resolve, reject)=> {
			req.post(`/api/products/${id}/data`, {item}).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 更新指定产品的描述信息
 * @param id
 * @param desc
 * @returns {function(*): *}
 */
export const updateProductDescById = ({id, desc}) => {
	return dispatch => dispatch({
		type: types.UPDATE_PRODUCT_DESC_BY_ID,
		payload: new Promise((resolve, reject) => {
			req.put(`/api/products/${id}/desc`, {desc}).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 更新指定产品分类
 * @param id
 * @param category
 * @returns {function(*): *}
 */
export const updateProductCategoryById = ({id, category}) => {
	return dispatch => dispatch({
		type: types.UPDATE_PRODUCT_CATEGORY_BY_ID,
		payload: new Promise((resolve, reject) => {
			req.put(`/api/products/${id}/category`, {id: category.id, subId: category.subId}).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}