/**
 * Created by zhangjiasheng on 16/8/26.
 */
import mongoose from 'mongoose'
import _ from 'lodash'
const Schema = mongoose.Schema

const productSchema = Schema({
	name: {
		type: String,
		index:{
			unique: true
		}
	}, // 名称
	images: [{
		name: String,
		url: String
	}], // 配图
	data: [
		{
			detail: [{
				name: String,
				value: String
			}]
		}
	], // 全体数据
	filter: Array, // 筛选项
	effect: Array, // 变化项
	desc: String, // 描述
	categoryId: String, // 一级分类
	subCategoryId: String, // 二级分类

})
productSchema.set('toJSON', { getters: true, virtuals: true });
productSchema.virtual('minimumPrice').get(function() {
	return _.minBy(_.compact(_.map(this.data, (item1) => {
		let detail = item1.detail
		if (!!detail) {
			return _.find(detail, (item2) => {
				return item2.name === '列表价RMB'
			})
		}else {
			return null
		}
	})), (item3) => {
		return _.toInteger(item3.value)
	}).value
})

export default mongoose.model('Product', productSchema)