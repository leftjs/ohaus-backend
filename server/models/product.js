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
	desc: String, // 描述
	categoryId: String, // 一级分类
	subCategoryId: String, // 二级分类
})

export default mongoose.model('Product', productSchema)