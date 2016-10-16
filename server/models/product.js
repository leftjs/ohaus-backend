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
	images: Object, // 配图
	data: Array, // 全体数据
	filter: Array, // 筛选项
	effect: Array, // 变化项
	desc: String, // 描述
	categoryId: String, // 一级分类
	subCategoryId: String, // 二级分类

})
productSchema.set('toJSON', { getters: true, virtuals: true });
productSchema.virtual('minimumPrice').get(function() {
	let prices = _.map(this.data, (item) => {
		return item.price
	})
	return _.min(prices)

})

export default mongoose.model('Product', productSchema)