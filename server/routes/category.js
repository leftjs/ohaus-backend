var express = require('express');
var router = express.Router();
import Category from '../models/category'
import _ from 'lodash'

/**
 * 添加一级分类
 */
router.post('/add', (req,res,next) => {
	let name = req.body.name
	console.log(name)
	Category.create({name}, (err, doc) => {
		if (err) return next(customError(400, err.message))
		if (!doc) return next(customError(400, '添加一级分类失败'))
		res.json(doc)
	})
})

/**
 * 添加二级分类
 */
router.post('/add/:id/sub', (req,res,next) => {
	let id = req.params['id']
	let name = req.body.name
	Category.findOne({_id: id}, (err, doc) => {
		if (err) return next(customError(400, err.message))
		if (!doc) return next(customError(400, '该分类不存在'))
		let errs = _.compact(_.map(doc.subs, (sub) => {
			console.log(name, sub.name)
			if (name == sub.name) {
				return customError(400, '该子分类已经存在')
			}
		}))
		if (errs.length > 0 ) {
			return next(errs[0])
		}
		doc.subs.push({name})
		doc.save((err, result) => {
			if(err) return next(customError(400, err.message))
			console.log(result)
			res.json(result)
		})
	})
})

/**
 * 删除指定一级分类
 */
router.delete('/:id', (req,res,next) => {
	let id = req.params['id']
	Category.remove({_id: id}, (err,result) => {
		if (err) return next(customError(400, err.message))
		res.json(result)
	})
})

/**
 * 删除指定二级分类
 */
router.delete('/:id/sub/:sub', (req,res,next) => {
	let id = req.params['id']
	let subId = req.params['sub']
	Category.findOne({_id: id}, (err, doc) => {
		if (err) return next(customError(400, err.message))
		if (!doc) return next(customError(400, '该一级分类不存在'))
		let newSubs = _.compact(_.map(doc.subs, (item) => {
			if (item._id != subId) {
				return item
			}
		}))
		doc.subs = newSubs
		doc.save((err, result) => {
			if (err) return next(customError(400, err.message))
			console.log(result)
			res.json(result)
		})
	})
})

/**
 * 更新指定分类的二级分类
 */
router.put('/:id/sub', (req, res, next) => {
	let id = req.params['id']
	let row = req.body.row
	Category.findOne({_id: id}, (err, doc) => {
		let newSubs = _.map(doc.subs, (item) => {
			if (item._id == row._id) {
				return row
			}else {
				return item
			}
		})
		doc.subs = newSubs
		doc.save((err, result) => {
			if (err) return next(customError(400, err.message))
			console.log(result)
			res.json(result)
		})
	})
})

/**
 * 更新指定分类名称
 */
router.put('/:id', (req,res,next) => {
	let id = req.params['id']
	let name = req.body.name
	Category.update({_id: id}, {$set: {
		name
	}}, (err,result) => {
		if (err) return next(customError(400, err.message))
		console.log(result)
		res.json(result)
	})
})

/**
 * 获取所有分类
 */
router.get('/all', (req,res,next) => {
	Category.find({}, (err, list) => {
		if(err) return next(customError(400, err.message))
		res.json(list)
	})
})


module.exports = router;
