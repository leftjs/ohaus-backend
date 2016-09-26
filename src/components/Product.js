/**
 * Created by zhangjiasheng on 16/8/25.
 */
import React from 'react'
import { Grid, Row, Col, Panel, FormControl, FormGroup, Form, ControlLabel, HelpBlock, Button, ButtonToolbar, DropdownButton, MenuItem} from 'react-bootstrap'
import {BootstrapTable,TableHeaderColumn} from 'react-bootstrap-table'
import actions from '../actions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Alert from 'react-s-alert'
import {browserHistory} from 'react-router'
require('../styles/App.css')


const FieldGroup = ({ id, label, help, ...props }) => {
	return (
		<FormGroup controlId={id}>
			<ControlLabel>{label}</ControlLabel>
			<FormControl {...props} />
			{help && <HelpBlock>{help}</HelpBlock>}
		</FormGroup>
	);
}
class Product extends React.Component {
	state = {
		zip: null,
		products: [],
		sizePerPage: 10,
		currentPage: 1,
		totalDataSize: 0,
		categories: []
	}

	_getAllCategories = () => {
		this.props.actions.getAllCategories().then((res) => {
			this.setState({
				categories: res.value
			})
		}).catch((err) =>{
			console.log(err)
			err.res.then((msg) => {
				Alert.err(msg)
			})
		})
	}


	componentWillMount() {
		this._getAllCategories()
		this._fetchProductListByPageAndSize({page: this.state.currentPage, size: this.state.sizePerPage})
	}

	_handleItemDeleteClick = (id) => {
		this.props.actions.deleteProductById(id).then((res) => {
			this._fetchProductListByPageAndSize({page: this.state.currentPage, size: this.state.sizePerPage})
			Alert.success(res.value.msg)
		})
	}

	_handleItemDetailClick = (id) => {
		browserHistory.push(`/product/${id}`)
	}

	_handleCategorySelect = (productId, categoryId, subCategoryId) => {
		// TODO 分类选择
		this.props.actions.updateProductCategoryById({id: productId , category: {id: categoryId, subId: subCategoryId}}).then((res) => {
			this._fetchProductListByPageAndSize({page: this.state.currentPage, size: this.state.sizePerPage})

		}).catch((err) => {
			err.res.then((value) => {
				Alert.error(value.message)
			})
		})
	}

	_getCategoryFromId = (category = {}, categories) => {
		if (category == null) {
			category = {}
		}

		console.log(categories, category)
		let {id, subId} = category
		if (!id && !subId) {
			return '请选择'
		} else {
			let firstCategory = null
			let subCategory = null
			_.forEach(categories, (item) => {
				if (item._id == id) {
					firstCategory = item
				}
			})
			if (!!firstCategory) {
				_.forEach(firstCategory.subs, (item) => {
					if (item._id == subId) {
						subCategory = item
					}
				})
			}
			if (!!firstCategory && !!subCategory) {
				return `${firstCategory.name} - ${subCategory.name}`
			}else {
				return '请选择'
			}
		}
	}

	_renderCategoryDropDown = (productId, categories) => {
		let renderArr = []
		_.forEach(categories, (item) => {
			renderArr.push(<MenuItem header key={item._id}>{item.name}</MenuItem>)
			_.forEach(item.subs, (inlineItem) => {
				renderArr.push(<MenuItem key={inlineItem._id} onSelect={this._handleCategorySelect.bind(this, productId, item._id, inlineItem._id)}>{inlineItem.name}</MenuItem>)
			})
			renderArr.push(<MenuItem divider key={item._id + 'divider'}/>)
		})
		return renderArr
	}

	_fetchProductListByPageAndSize = ({page, size}) => {
		this.props.actions.getProductListByPageAndSize({page, size}).then((res) => {
			let data = res.value
			let list = data.data
			list = _.map(list, (item) => {
				return {
					_id: item._id,
					name: item.name,
					imageCount: `${item.images.length}张`,
					dataCount: `${item.data.length}个`,
					filterCount: `${item.filter.length}个`,
					effectCount: `${item.effect.length}个`,
					category:
							<DropdownButton bsSize="xsmall" bsStyle="default" title={!!this.state.categories ? this._getCategoryFromId({id: item.categoryId, subId: item.subCategoryId}, this.state.categories) : '未知'} noCaret>
								{ !!this.state.categories ? this._renderCategoryDropDown(item._id, this.state.categories) : null}
							</DropdownButton>,
					operation: <div>
						<Button bsStyle="danger" bsSize="xsmall" onClick={this._handleItemDeleteClick.bind(this, item._id)}>删除</Button>
						<Button bsStyle="info" bsSize="xsmall" style={{marginLeft: 10}} onClick={this._handleItemDetailClick.bind(this, item._id)}>详情</Button>
					</div>

				}
			})
			this.setState({
				products: list,
				totalDataSize: data.totalDataSize,
				sizePerPage: data.sizePerPage,
				currentPage: data.currentPage
			})
		})
	}
	_handleUploadChange = (e) => {
		this.setState({
			zip: e.target.files[0]
		})
	}

	_handleUploadSubmit = (e) => {
		if (this.state.zip == null) {
			Alert.error('您没有选择任何文件')
			return
		}
		let data = new FormData()
		data.append('file', this.state.zip)
		this.props.actions.uploadProductZip(data).then((result) => {
			Alert.success("录入成功")
			this._fetchProductListByPageAndSize({page: this.state.currentPage, size: this.state.sizePerPage})
		}).catch((err) => {
			Alert.error("录入失败")
		})
	}

	_handlePageAndSizeChange = (page, size) => {
		this._fetchProductListByPageAndSize({page, size})
	}
	render() {
		return (

			<Grid>
				<Row>
					<Col xs={12} sm={10} md={10} smOffset={1} mdOffset={1}>
						<Panel header="产品信息录入" bsStyle="primary">
							<form>
								<FieldGroup
									id="formControlsFile"
									type="file"
									label="信息上传"
									help="请选择您需要上传的产品信息的压缩包"
								  onChange={this._handleUploadChange}
								/>
								<Button bsStyle="info" onClick={this._handleUploadSubmit}>提交</Button>
							</form>
						</Panel>
					</Col>
				</Row>
				<Row>
					<Col xs={12} sm={10} md={10} smOffset={1} mdOffset={1}>
						<Panel header="产品信息管理" bsStyle="success">
							<BootstrapTable
								bodyStyle={{
									overflow: 'visible'
								}}
								data={this.state.products}
							  striped={true}
							  hover={true}
							  remote={true}
							  condensed={true}
							  pagination={true}
							  fetchInfo={{
							  	dataTotalSize: this.state.totalDataSize
							  }}
							  options={{
							  	sizePerPage: this.state.sizePerPage,
									onPageChange: this._handlePageAndSizeChange,
									sizePerPageList: [10,20,30,50],
									pageStartIndex: 1,
									page: this.state.currentPage,
							  }}
							>
								<TableHeaderColumn isKey={true} dataField="_id" dataAlign="center">产品编号</TableHeaderColumn>
								<TableHeaderColumn dataField="name" dataAlign="center" >产品名称</TableHeaderColumn>
								<TableHeaderColumn width={200} dataField="category" dataAlign="center" columnClassName="td-overflow-visible" >分类</TableHeaderColumn>
								<TableHeaderColumn dataField="imageCount" dataAlign="center" >配图数量</TableHeaderColumn>
								<TableHeaderColumn dataField="dataCount" dataAlign="center">筛选项数量</TableHeaderColumn>
								<TableHeaderColumn dataField="filterCount" dataAlign="center">过滤项数量</TableHeaderColumn>
								<TableHeaderColumn dataField="effectCount" dataAlign="center">变化项数量</TableHeaderColumn>
								<TableHeaderColumn dataField="operation" dataAlign="center">操作</TableHeaderColumn>
							</BootstrapTable>
						</Panel>
					</Col>
				</Row>

			</Grid>
		)
	}
}


function mapStateToProps(state) {
	/* Populated by react-webpack-redux:reducer */
	return {}
}

function mapDispatchToProps(dispatch) {
	/* Populated by react-webpack-redux:action */
	return {
		actions: {
			...bindActionCreators(actions, dispatch)
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Product)