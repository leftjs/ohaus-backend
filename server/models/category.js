/**
 * Created by zhangjiasheng on 16/8/26.
 */
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const subCategorySchema = Schema({
	name: {
		type: String,
	},
	image: String
})

const categorySchema = Schema({
	name: {
		type: String,
		index: true,
		unique: true
	}, // 名称
	subs: [subCategorySchema]
})

export default mongoose.model('Category', categorySchema)