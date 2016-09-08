var express = require('express');
var router = express.Router();
import User from '../models/user'

/**
 * 注册
 */
router.post('/register', (req,res,next) => {
	let username = req.body.username
	let password = req.body.password
	let nickname = req.body.nickname
	User.create({username, password, nickname}, (err,user) => {
		if(err) return next(customError(400, err.message))
		if(!user) return next(customError(400, '用户创建出错'))
		res.json(user)
	})
})

/**
 * 登陆
 */
router.post('/login', (req,res, next) => {
	let username = req.body.username
	let password = req.body.password
	User.findOne({username, password}, (err, user) => {
		if(err) return next(customError(400, err.message))
		if(!user) return next(customError(400, '用户登陆失败'))
		res.json('用户登陆成功')
	})
})

/**
 * 删除指定用户
 */
router.delete('/:id', (req,res,next) => {
	let id = req.params['id']
	User.remove({_id: id}, (err,count) => {
		if(err) return next(customError(400, err.message))
		if(count < 1) return next(customError(400, '删除失败,不存在该用户'))
		res.json('删除成功')
	})
})

/**
 * 更新指定用户信息
 */
router.put('/:id', (req,res,next) => {
	let id = req.params['id']
	let body = req.body
	User.update({_id: id}, {$set: {
		...body
	}}, (err,result) => {
		if (err) return next(customError(400, err.message))
		if(result.ok < 1) return next(customError(400, '更新失败'))
		res.json('更新成功')
	})
})

/**
 * 分页获取用户列表
 */
router.get('/list', (req,res,next) => {
	let page = !!parseInt(req.query['page']) ? parseInt(req.query['page']) : 1
	let size = !!parseInt(req.query['size']) ? parseInt(req.query['size']) : 10
	if (page < 1) page = 1
	User.count({}, (err, count) => {
		if(err) return next(customError(400, err.message))
		User.find({}).skip(parseInt((page - 1 ) * size)).limit(parseInt(size)).exec((err, list) => {
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
 * 获取指定用户信息
 */
router.get('/:id', (req,res,next) => {
	let id = req.params['id']
	User.findOne({_id: id}, (err, user) => {
		if (err) return next(customError(400, err.message))
		if(!user) return next(customError(400, '该用户不存在'))
		res.json(user)
	})
})
module.exports = router;
