/**
 * Created by zhangjiasheng on 16/9/9.
 */
import * as types from './const'
import * as req from '../services/request'

/**
 * 登录
 * @param username
 * @param password
 * @returns {function(*): *}
 */
export const login = ({username, password}) => {
	return dispatch => dispatch({
		type: types.LOGIN,
		payload: new Promise((resolve, reject) => {
			req.post('/api/users/login', {username, password}).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 注册
 * @param username
 * @param password
 * @param nickname
 * @returns {function(*): *}
 */
export const register = ({username, password, name, phone, email, company, job,city}) => {
	return dispatch => dispatch({
		type: types.REGISTER,
		payload: new Promise((resolve, reject) => {
			req.post('/api/users/register', {username, password, name, phone, email, company, job, city}).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 删除指定用户
 * @param id
 * @returns {function(*): *}
 */
export const deleteUserById = (id) => {
	return dispatch => dispatch({
		type: types.DELETE_USER_BY_ID,
		payload: new Promise((resolve, reject) => {
			req.remove(`/api/users/${id}`).then((data) => {
				resolve(data)
			}).catch((err) => {
				resjec(err)
			})
		})
	})
}

/**
 * 更新指定用户
 * @param id
 * @param body
 * @returns {function(*): *}
 */
export const updateUserById = ({id, body}) => {
	return dispatch => dispatch({
		type: types.UPDATE_USER_BY_ID,
		payload: new Promise((resolve, reject) => {
			req.put(`/api/users/${id}`, {...body}).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}

/**
 * 分页获取用户列表
 * @param page
 * @param size
 * @returns {function(*): *}
 */
export const getUserList = ({page, size}) => {
	return dispatch => dispatch({
		type: types.GET_USER_LIST,
		payload: new Promise((resolve, reject) => {
			req.get('/api/users/list', {
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
 * 获取指定用户
 * @param id
 * @returns {function(*): *}
 */
export const getUserById = (id) => {
	return dispatch => dispatch({
		type: types.GET_USER_BY_ID,
		payload: new Promise((resolve, reject) => {
			req.get(`/api/users/${id}`).then((data) => {
				resolve(data)
			}).catch((err) => {
				reject(err)
			})
		})
	})
}


















