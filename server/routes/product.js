/**
 * Created by zhangjiasheng on 16/8/26.
 */
import express from 'express'
const router = express.Router()
import multer from 'multer'
const upload = multer({dest: 'upload/'})
import AdmZip from 'adm-zip'
import * as ossUtils from '../utils/ossUtils'
import _ from 'lodash'
import xlsx from 'xlsx'
import product from '../models/product'
import mammoth from 'mammoth'

require('shelljs/global')


/**
 * 压缩包上传
 */
router.put('/zip', upload.single('file'), (req,res,next) => {

	let zip = new AdmZip(`./${req.file.path}`)
	let zipEntries = zip.getEntries()
	let productData = {
		name: '',
		images: {},
		data: [],
		filter: [], // 筛选项
		effect: [] // 变化项
	}
	// 待上传的数组,额外提出来为了准确捕获上传状态
	let prepareToUpload = []
	let prepareDescInfo = {
		data: '',
		options: ''
	}
	zipEntries.forEach((zipEntry, index) => {
		// console.log(zipEntry.toString())
		// 去除无效文件和目录文件
		if (!/^\./.test(zipEntry.name) && zipEntry.isDirectory == false) {
			if (/\.(png|jpg|gif|bmp)$/.test(zipEntry.name.toLowerCase())) {
				// console.log(zipEntry.toString())
				prepareToUpload.push({
					data: zipEntry.getData(),
					suffix:  _.last(zipEntry.name.split('.')),
					name: zipEntry.name.replace(/(\.|-)/g, '_')
				})
			} else if (/\.xlsx$/.test(zipEntry.name.toLowerCase())) {
				productData.name = zipEntry.name.split('.xlsx')[0]
				try{
					let workbook = xlsx.read(zipEntry.getData())
					productData.data = _.map(xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]), (item) => {
						return _.transform(item, (result, value, key) => {
							// 去除键值的首尾空格
							result[key.trim()] = value.trim()
						}, {})
					})
					productData.data = _.map(productData.data, (item,index) => {
						return {
							...item,
							id: index
						}
					})
					let json2 = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]])
					let jsonResult = _.reduce(json2, (result,item) => {
						return _.mergeWith(result, item, (objValue, srcValue) => {
							let array = []
							return _.compact(array.concat(objValue, srcValue.trim()))
						})
					},{})
					productData.filter = jsonResult['筛选项']
					productData.effect = jsonResult['变化项']
				}catch (err) {
					console.log(err)
				}
			} else if (/\.(docx|doc)/.test(zipEntry.name.toLowerCase())) {
				// console.log('.........', zipEntry.toString())
				const options = {
					convertImage: mammoth.images.imgElement(function(image) {
						image.altText = ''
						return image.read().then((imageBuffer) => {
							return ossUtils.uploadSingleWithBuffer(imageBuffer, image.contentType.split('/')[1]).then((url) => {
								return {
									src: url
								}
							})
						})
					})
				}

				prepareDescInfo.data = zipEntry.getData()
				prepareDescInfo.options = options

				try {
					mammoth.convertToHtml(zipEntry.getData(), options).then((result) => {
						let html = result.value
						let messages = result.messages
						productData.desc = html
					}).done()
				} catch (err) {
					console.log(err)
				}




			}
		}
		if(zipEntries.length - 1 == index) {
			// 最后一个遍历完成
			Promise.all((_.map(prepareToUpload, (item) => {
				// console.log(item.data)
				return ossUtils.uploadSingleWithBuffer(item.data, item.suffix).then((url) => {
					productData.images[item.name] = url
				})
			})).concat([new Promise((resolve, reject) => {
				mammoth.convertToHtml(prepareDescInfo.data, prepareDescInfo.options).then((res) => {
					productData.desc = res.value
					resolve(res.value)
				})
			})])).then((result) => {
				// console.log(productData)
				product.create(productData, (err,doc) => {
					if(err) {
						console.log(err)
						return next(customError(400, err.message))
					}
					if(!doc) return next(customError(400, '录入失败'))
					return res.json(doc)
				})
			})
		}
	})
	// 用后即焚
	rm('-rf', `./${req.file.path}`)
})

/**
 * 获取所有的产品列表
 */
router.get('/list/all',(req, res, next) => {
	product.find({},(err, list) => {
		if(err) return next(err)
		res.json(list)
	})
})

/**
 * 分页获取产品列表
 */
router.get('/list', (req,res,next) => {
	let page = !!parseInt(req.query['page']) ? parseInt(req.query['page']) : 1
	let size = !!parseInt(req.query['size']) ? parseInt(req.query['size']) : 10
	if (page < 1) page = 1
	console.log(page, size)
	product.count({}, (err, count) => {
		if(err) return next(customError(400, err.message))
		product.find({}).skip(parseInt((page - 1 ) * size)).limit(parseInt(size)).exec((err, list) => {
			if(err) return next(customError(400, err.message))
			res.json({
				data: list,
				totalDataSize: count,
				sizePerPage: parseInt(size),
				currentPage: parseInt(page)
			})
		})
	})
})

/**
 * 删除某个产品
 */
router.delete('/single/:id', (req,res,next) => {
	let id = req.params['id']
	product.remove({_id: id}, (err, count) => {
		if(err) return next(customError(400, err.message))
		res.json({msg:`id为[${id}]的产品删除成功`})
	})
})

Promise.prototype.finally = function (callback) {
	let p = this.constructor;
	// We don’t invoke the callback in here,
	// because we want then() to handle its exceptions
	return this.then(
		// Callback fulfills: pass on predecessor settlement
		// Callback rejects: pass on rejection (=omit 2nd arg.)
		value  => p.resolve(callback()).then(() => value),
		reason => p.resolve(callback()).then(() => { throw reason })
	);
};
/**
 * 为指定产品上传配图
 */
router.post('/:id/image/upload', upload.single('file'), (req,res,next) => {
	product.findOne({_id: req.params['id']}, (err,doc) => {
		if (err) return next(customError(400, err.message))
		if (!doc) return next(customError(400, "找不到该产品,请检查"))
		ossUtils.uploadSingleWithFile(req.file).then((url) => {
			doc.images[req.file.originalname.replace(/(\.|-)/g, '_')] = url
			product.update({_id: doc._id}, {$set: {
				images: doc.images
			}},(err, result) => {
				if (err) return next(customError(400, err.message))
				if (result.ok < 1) return next(customError(400, "更新失败,请检查"))
				res.json(result)
			})
		}).catch((err) => {
			console.log(err)
			return next(customError(400, err.message))
		}).finally(() => {
			// 用后即焚
			rm('-rf', `./${req.file.path}`)
		})
	})
})

/**
 * 为指定产品删除某个配图
 */
router.delete('/:id/image/:name', (req,res,next) => {
	let id = req.params['id']
	let name = req.params['name']
	product.findOne({_id: id}, (err, doc) => {
		if (err) return next(customError(400, err.message))
		if (!doc) return next(customError(400, "找不到该产品,请检查"))
		delete doc.images[name]
		product.update({_id: doc._id}, {$set: {
			images: doc.images
		}}, (err, result) => {
			if (err) return next(customError(400, err.message))
			if (result.ok < 1) return next(customError(400, "更新失败,请检查"))
			res.json(result)
		})
	})
})

/**
 * 获取指定产品
 */
router.get('/:id', (req,res,next) => {
	let id = req.params['id']
	product.findOne({_id: id}, (err, doc) => {
		if (err) return next(customError(400, err.message))
		if (!doc) return next(customError(400, "找不到该产品,请检查"))
		res.json(doc)
	})
})

/**
 * 更新指定产品分类
 */
router.put('/:id/category', (req,res,next) => {
	let id = req.params['id']
	let category = req.body.category
	console.log(category)
	product.update({_id: id}, {$set: {category}}, (err,result) => {
		if (err) return next(customError(400, err.message))
		res.json(result)
	})
})

/**
 * 删除指定产品的某个参数
 */
router.delete('/:id/data/:no', (req,res,next) => {
	let id = req.params['id']
	let no = req.params['no']

	product.findOne({_id: id}, (err, doc) => {
		if (err) return next(customError(400, err.message))
		if (!doc) return next(customError(400, "找不到该产品,请检查"))
		let data = doc.data
		data = _.reject(data, (item) => {
			return item.id == no
		})
		product.update({_id: id}, {$set: {
			data: data
		}}, (err, result) => {
			if (err) return next(customError(400, err.message))
			if (result.ok < 1) return next(customError(400, "更新失败,请检查"))
			res.json('更新成功')
		})
	})
})

/**
 * 更新指定产品的某个参数
 */
router.put('/:id/data', (req, res, next) => {

	let id = req.params['id']
	let body = req.body.item
	delete body.operation
	product.findOne({_id: id}, (err,doc) => {
		if (err) return next(customError(400, err.message))
		if (!doc) return next(customError(400, "找不到该产品,请检查"))
		let data = doc.data
		data = _.map(data, (item) => {
			if (item.id == body.id) {
				return body
			}else {
				return item
			}
		})
		product.update({_id: id}, {$set: {
			data: data
		}}, (err, result) => {
			if (err) return next(customError(400, err.message))
			if (result.ok < 1) return next(customError(400, "更新失败,请检查"))
			res.json('更新成功')
		})
	})
})

/**
 * 为指定产品添加参数
 */
router.post('/:id/data', (req,res,next) => {
	let id = req.params['id']
	let body = req.body.item
	product.findOne({_id: id}, (err, doc) => {
		if (err) return next(customError(400, err.message))
		if (!doc) return next(customError(400, "找不到该产品,请检查"))
		let data = doc.data
		let no = -1
		_.map(data, (item) => {
			if (item.id > no) {
				no = item.id
			}
		})
		no++ // 获取最后一个id号
		data.push({
			id: no,
			...body
		})
		product.update({_id: id}, {$set: {
			data
		}}, (err, result) => {
			if (err) return next(customError(400, err.message))
			if (result.ok < 1) return next(customError(400, "更新失败,请检查"))
			res.json('更新成功')
		})
	})
})

/**
 * 更新指定产品的描述
 */
router.put('/:id/desc', (req,res,next) => {
	let id = req.params['id']
	let desc = req.body.desc
	product.findOne({_id: id}, (err,doc) => {
		if (err) return next(customError(400, err.message))
		if (!doc) return next(customError(400, "找不到该产品,请检查"))
		product.update({_id: id}, {$set: {
			desc
		}},(err,result) => {
			if (err) return next(customError(400, err.message))
			if (result.ok < 1) return next(customError(400, "更新失败,请检查"))
			res.json('更新成功')
		})
	})
})


export default router