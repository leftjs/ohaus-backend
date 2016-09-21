/**
 * Created by zhangjiasheng on 16/8/25.
 */
import * as product from './product'
import * as user from './user'
import * as category from './category'

export default {
	...product,
	...user,
	...category
}