/**
 * Created by zhangjiasheng on 16/8/26.
 */
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = Schema({
	username: {
		type: String,
		required: true,
		index:{
			unique: true
		}
	}, // 用户名
	password: {
		type: String,
		required: true
	}, // 密码
	nickname: {
		type: String,
		required: true
	},  // 昵称

})

export default mongoose.model('User', userSchema)