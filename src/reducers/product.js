/**
 * Created by zhangjiasheng on 16/8/25.
 */

import * as types from '../actions/const'

export const product = (state={}, action) => {
	switch (action.type) {
		case `${types.SAY_HELLO}_FULFILLED`:
			return {
				...state,
				word: action.payload
			}
		default:
			return {}
	}
}