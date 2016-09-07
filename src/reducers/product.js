/**
 * Created by zhangjiasheng on 16/8/25.
 */

import * as types from '../actions/const'

export const product = (state={}, action) => {
	console.log(action)
	switch (action.type) {
		case `${types.SAY_HELLO}_FULFILLED`:
			return {
				...state,
			}
		case `${types.GET_PRODUCT_LIST}_FULFILLED`:
			return {
				...state,
				...action.payload
			}
		default:
			return {
				...state
			}
	}
}