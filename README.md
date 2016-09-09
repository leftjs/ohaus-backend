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
	
	* 产品信息管理功能介绍
	
		文档管理界面中，点击删除按钮直接删除该条产品信息，点击详情跳转到相应的产品的详情页面，该页面中可以对产品的详情信息进行管理，包括配图管理，参数管理，描述信息的图文编辑等等功能，其中配图管理界面可以新增和删除配图，注意上传时的原图片名称即为上传后的数据库中文件名；参数管理界面中，可以对该产品的参数进行增删改，修改的时候只需要在想要修改的属性上双击，退出则保存；描述信息的图文管理界面中，目前只支持纯文本编辑模式，如果想要实现doc的录入功能可以删除该产品然后通过上一条的zip重新导入，图文混排中的图片可以通过上传到某个图床的方式来实现。		
2. 用户管理

	* 用户注册功能介绍
	
		用户注册功能，所有的用户均必须由管理员注册，用户名，密码，昵称等等都不能为空；用户管理界面中，可以对用户信息进行删除和修改操作，双击需要编辑的字段，退出即保存。


## API DOC

1. 分页获取产品列表

	desc: 根据传入的页码和每页条数返回产品列表，默认从第1页开始，每页默认十条
	
	url: (baseUrl)/api/products/list[?page={number|1}&size={number|10}]
	
	method: GET
	
	params: 
	
	* page[query]: 页码
	* size[query]: 每页个数
	
	return:
	
	* 200: 
	
	```
	{
		data: [{
			_id: "57c434cf60dc28aa92be23bc", // 文档编号
			name: "EX系列天平", // 产品名称
			images: {
				"key(图片名称)" : "value(图片的url地址)",
				... // more				
			}, // 配图
			desc: String, // 详情的html片段
			data: [
				{	id : number,
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
	
2. 获取单个产品信息

	desc: 根据传入的产品的id，返回单个产品的信息
	
	url: (baseUrl)/api/products/:id
	
	method: GET
	
	params: 
	
	* id[path]: 指定产品的id
	
	return:
	
	* 200:
	
	```
	{
		_id: "57c434cf60dc28aa92be23bc", // 文档编号
		name: "EX系列天平", // 产品名称
		images: {
			"key(图片名称)" : "value(图片的url地址)",
			... // more				
		}, // 配图
		desc: String, // 详情的html片段
		data: [{	
			id : number,
			key(参数名) : value(参数值),
			... // more
			}
		], // 产品参数
		filter: [
			String, // 产品参数中可用户过滤的参数名
		], 
		effect: [
			String, // 产品参数中受影响的参数名
		]
	}
	```
	
3. 用户登陆

	desc: 判断传入的用户名和密码是否正确，验证结果通过返回信息来反馈
	
	url: (baseUrl)/api/users/login
	
	method: POST
	
	params: 
	
	* username(body): 用户名
	* password(body): 密码
	
	return:
	
	* 200: 用户名密码正确
	* 40X: 用户名或密码错误


	