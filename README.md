# 奥豪斯后台管理及API DOC
>
	后台管理系统地址: http://ohaus.greenicetech.cn
	api地址: http://ohaus.greenicetech.cn/api
	baseUrl: http://ohaus.greenicetech.cn
	
---
## 后台管理 DOC

1. 产品管理页面
	
	* 文档zip录入功能介绍
		
		zip包中需要包含本产品型号的所有资料，包括所有的产品配图，配图的名称标号已确定配图顺序;[产品名称].xlsx 为本产品用户可用于筛选的参数，数据库中保存的产品名称为xlsx的文件名;[产品名称].doc|docx 为本产品的描述部分，注意doc中的嵌套深度为一层。
2. 用户管理...

## API DOC

1. 分页获取产品列表

	desc: 根据传入的页码和每页条数返回产品列表，默认从第1页开始，每页默认十条
	
	url: (baseUrl)/api/product/list[?page={number|1}&size={number|10}]
	
	method: GET
	
	params: 
	
	* page: 页码
	* size: 每页个数
	
	return:
	
	* 200: 
	
	```
	{
		data: [{
			_id: "57c434cf60dc28aa92be23bc", // 文档编号
			name: "EX系列天平", // 产品名称
			images: {
				"key(图片名称)" : "value(图片的url地址)"
			}, // 配图
			desc: String, // 详情的html片段
			data: [
				{
					key(参数名) : value(参数值),
					... // more
				}
			], // 产品参数
			filter: [
				String, // 产品参数中可用户过滤的参数名
			], 
			effect: [
				String, // 产品参数中受影响的参数名
			]},
			... // more
		], // 数据
		totalDataSize: Number, // item总和
		sizePerPage: Number, // 每页个数
		currentPage: Number // 当前页数
	}
	```
	
	