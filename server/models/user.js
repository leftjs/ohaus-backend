/**
 * Created by zhangjiasheng on 16/8/26.
 */
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = Schema({
	avatar: {
		type:String
	},
	password: {
		type: String,
	}, // 密码
	name: {
		type: String,
		required: true
	},  // 姓名
	email: {
		type: String,
		required: true,
	},
	company: {
		type: String,
		required: true
	},
	job: {
		type: String,
		required: true
	},
	province: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true,
		index:{
			unique: true
		}
	},
	isValidated: {
		type: Boolean,
		default: false
	},
	helpBy: {
		type: String,
	}

})

export default mongoose.model('User', userSchema)