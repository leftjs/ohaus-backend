/**
 * Created by zhangjiasheng on 7/23/16.
 */
var OSS = require('ali-oss').Wrapper
var fs = require('fs')
import config from '../config'
const ossConfig = config.oss
import _ from 'lodash'
import uuid from 'node-uuid'
var multer = require('multer')
var storage = multer.memoryStorage()

var client = new OSS({
	region: ossConfig.region,
	accessKeyId: ossConfig.accessKeyId,
	accessKeySecret: ossConfig.accessKeySecret
})

export const uploadSingleWithFile = (file) => {
	client.useBucket(ossConfig.bucketName)
	return client.put(`${uuid.v4()}.${file.mimetype.split('\/')[1]}`, !!file.buffer ? file.buffer : file.path).then((res) => {
		return Promise.resolve(res.url)
	}).catch((err) => {
		console.log(err)
		return Promise.reject(err)
	})
}

export const uploadSingleWithBuffer = (buffer, suffix) => {
	client.useBucket(ossConfig.bucketName)
	return client.put(`${uuid.v4()}.${suffix}`, buffer).then((res) => {
		return Promise.resolve(res.url)
	}).catch((err) => {
		console.log(err)
		return Promise.reject(err)
	})
}



export const uploadMultiple = (files) => {
	return Promise.all(_.map(files, (file) => {
		return uploadSingle(file)
	})).then((res) => {
		return Promise.resolve(res)
	}).catch((err) => {
		return Promise.reject(err)
	})
}


export const uploadMiddleware = multer({ storage: storage })
