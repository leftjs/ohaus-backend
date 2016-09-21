/**
 * Created by zhangjiasheng on 16/8/26.
 */
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const productSchema = Schema({
	name: {
		type: String,
		index:{
			unique: true
		}
	}, // 名称
	images: Object, // 配图
	data: Array, // 全体数据
	filter: Array, // 筛选项
	effect: Array, // 变化项
	desc: String,
	category: {
		id: String,
		subId: String
	}
})

export default mongoose.model('Product', productSchema)