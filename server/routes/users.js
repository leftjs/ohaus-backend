var express = require('express');
var router = express.Router();
import User from '../models/user'
import { uploadMiddleware, uploadSingleWithFile } from '../utils/ossUtils'
import * as yunpianUtils from '../utils/yunpianUtils'
/**
 * 注册
 */
router.post('/register', (req,res,next) => {
	let avatar = req.body.avatar
	let name = req.body.name
	let email = req.body.email
	let company = req.body.company
	let job = req.body.job
	let city = req.body.city
	let phone = req.body.phone
	let province = req.body.province
	let password = Math.random().toString(36).slice(2).replace(/\d/g,'').slice(0,6)
	User.create({avatar, name, email, company, job, city, phone, province, password}, (err,user) => {
		if(err) {
			if (/phone(.*)dup/.test(err.message)) return next(customError(400, '该手机号码已经注册'))
			return next(customError(400, err.message))
		}

		yunpianUtils.sendPassToMobile(password, phone).then((result) => {
			return res.json(result)
		}).catch((err) => {
			// 短信下发失败时删除本用户
			User.remove({_id: user._id})
			err.res.then((value) => {
				return next(customError(400, JSON.stringify({msg: value.msg, detail: value.detail})))
			})
		})

	})
})


/**
 * 登陆
 */
router.post('/login', (req,res, next) => {
	let phone = req.body.phone
	let password = req.body.password
	User.findOne({phone, password}, (err, user) => {
		if(err) return next(customError(400, err.message))
		if(!user) return next(customError(400, '用户登陆失败'))
		if(!user.isValidated) return next(customError(401, '该用户尚未通过审核'))
		res.json('用户登陆成功')
	})
})

/**
 * 帮忙注册
 */
router.post('/:id/help/register', (req,res,next) => {
	let id = req.params['id']
	let name = req.body.name
	let email = req.body.email
	let company = req.body.company
	let job = req.body.job
	let city = req.body.city
	let phone = req.body.phone
	let province = req.body.province
	let password = Math.random().toString(36).slice(2).replace(/\d/g,'').slice(0,6)
	User.create({name, email, company, job, city, phone, province, password, helpBy:id}, (err,user) => {
		if(err) {
			if (/phone(.*)dup/.test(err.message)) return next(customError(400, '该手机号码已经注册'))
			return next(customError(400, err.message))
		}

		yunpianUtils.sendPassToMobile(password, phone).then((result) => {
			return res.json(result)
		}).catch((err) => {
			// 短信下发失败时删除本用户
			User.remove({_id: user._id})
			err.res.then((value) => {
				return next(customError(400, JSON.stringify({msg: value.msg, detail: value.detail})))
			})
		})

	})

})

/**
 * 为指定用户上传头像
 */
router.post("/:id/avatar/upload",uploadMiddleware.single('avatar') ,(req,res,next) => {
	let id = req.params['id']
	uploadSingleWithFile(req.file).then((result) => {
		User.update({_id: id}, {$set: {
			avatar: result
		}}, (err, changeCount) => {
			if(err) return next(customError(400, err.message))
			res.json('更新成功')
		})
	}).catch((err) => {
		return next(customError(400,err.message))
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
