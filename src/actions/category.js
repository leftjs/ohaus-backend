/**
 * Created by zhangjiasheng on 16/8/25.
 */
import * as types from './const'
import * as req from '../services/request'

/**
 * 添加一级分类
 * @param name
 * @returns {function(*): *}
 */
export const addCategory = (name) => {
	return dispatch => dispatch({
		type: types.ADD_CATEGORY,
		payload: new Promise((resolve, reject) => {
			req.post('/api/category/add', {name}).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}
/**
 * 添加二级分类
 * @param id
 * @param name
 * @returns {function(*): *}
 */
export const addSubCategory = ({id, name}) => {
	return dispatch => dispatch({
		type: types.ADD_CATEGORY_SUB,
		payload: new Promise((resolve, reject) => {
			req.post(`/api/category/add/${id}/sub`, {name}).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 获取所有分类
 * @returns {function(*): *}
 */
export const getAllCategories = () => {
	return dispatch => dispatch({
		type: types.GET_ALL_CATEGORIES,
		payload: new Promise((resolve, reject) => {
			req.get('/api/category/all').then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}



/**
 * 删除指定分类
 * @param id
 * @returns {function(*): *}
 */
export const deleteCategory = (id) => {
	return dispatch => dispatch({
		type: types.DELETE_CATEGORY,
		payload: new Promise((resolve, reject) => {
			req.remove(`/api/category/${id}`).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 删除指定二级分类
 * @param id
 * @param subId
 * @returns {function(*): *}
 */
export const deleteSubCategory = ({id, subId}) => {
	return dispatch => dispatch({
		type: types.DELETE_CATEGORY,
		payload: new Promise((resolve, reject) => {
			req.remove(`/api/category/${id}/sub/${subId}`).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}


/**
 * 更新指定分类的二级分类
 * @param id
 * @param row
 * @returns {function(*): *}
 */
export const updateSubCategory = ({id, row}) => {
	return dispatch => dispatch({
		type: types.UPDATE_CATEGORY_SUB,
		payload: new Promise((resolve, reject) => {
			req.put(`/api/category/${id}/sub`, {row}).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 更新指定分类的名称
 * @param id
 * @param name
 * @returns {function(*): *}
 */
export const updateCategory = ({id, name}) => {
	return dispatch => dispatch({
		type: types.UPDATE_CATEGORY_SUB,
		payload: new Promise((resolve, reject) => {
			req.put(`/api/category/${id}`, {name}).then((res) => {
				resolve(res)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}