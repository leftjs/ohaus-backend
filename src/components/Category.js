/**
 * Created by zhangjiasheng on 16/9/14.
 */
import React from 'react'
import actions from '../actions'
import { Grid, Row, Col, Panel, FormControl, FormGroup, Form, ControlLabel, HelpBlock, Button} from 'react-bootstrap'
import {BootstrapTable,TableHeaderColumn} from 'react-bootstrap-table'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Alert from 'react-s-alert'
import _ from 'lodash'


class Category extends React.Component {


	state = {
		data: [], // 所有数据
		input: "", // 一级分类输入框的值
		inputSub: "", // 二级分类输入框的值
	}


	componentWillMount() {
		this._getAllCategories()
	}


	_getAllCategories = () => {
		this.props.actions.getAllCategories().then((res) => {
			let data = _.map(res.value, (item) => {
				let mySubs = _.map(item.subs, (inlineItem) => {
					return {
						...inlineItem,
						operation:
							<div>
								<Button bsStyle="danger" bsSize="xsmall" onClick={this._handleSubCategoryDelete.bind(this, item._id, inlineItem._id)}>删除</Button>
								{/* <Button bsStyle="danger" bsSize="xsmall" onClick={!!inlineItem.image ? this._handleViewImage(inlineItem.image) : this._handleUploadImage()}>{!!inlineItem.image ? "查看图片" : "上传图片"}</Button>*/}
							</div>
					}
				})
				item.subs = mySubs
				return item
			})

			this.setState({
				data
			})
		}).catch((err) =>{
			console.log(err)
			err.res.then((msg) => {
				Alert.err(msg)
			})
		})
	}




	_renderCategoriesList = () => {
		return _.map(this.state.data, (item) => {
			return (
				<Panel header={
					<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
						<span >{item.name}</span>
						<Button bsStyle="danger" onClick={this._handleCategoryDelete.bind(this, item._id)}>删除</Button>
					</div>
					}
				       bsStyle="primary" key={item._id}>
					<Row>
						<Col xs={12} sm={10} md={10} smOffset={1} mdOffset={1}>
							<Col xs={6} sm={6} md={6} lg={6}>
								<FormControl
									type="text"
									value={this.state.inputSub[item._id]}
									placeholder="添加二级分类"
									onChange={this._handleInputSubChange.bind(this, item._id)}
								/>

							</Col>
							<Col xs={6} md={6} sm={6} lg={6}>
								<Button block bsStyle="success" onClick={this._handleInputAddSubClick.bind(this, item._id)}>添加二级分类</Button>
							</Col>
						</Col>
					</Row>
					<Row style={{marginTop: 20}}>
						<BootstrapTable
							data={item.subs}
						  cellEdit={{
						  	mode: 'dbclick',
						  	blurToSave: true,
						  	beforeSaveCell: (row,cellName, cellValue) => {
						  		let rowData = {
						  			...row,
						  			[cellName]: cellValue
						  		}
						  		this._handleSubCategoryUpdate.call(this, item._id, rowData)
						  	}
						  }}
						>
							<TableHeaderColumn dataField="_id" isKey={true} dataAlign="center">编号</TableHeaderColumn>
							<TableHeaderColumn dataField="name" dataAlign="center">子分类</TableHeaderColumn>
							<TableHeaderColumn dataField="operation" dataAlign="center">操作</TableHeaderColumn>
						</BootstrapTable>
					</Row>
				</Panel>
			)
		})
	}


	_handleSubCategoryUpdate = (id, row) => {
		this.props.actions.updateSubCategory({id, row}).then((res) => {
			this._getAllCategories()
		}).catch((err) => {
			err.res.then((value) => {
				Alert.error(value.message)
			})
		})
	}

	_handleSubCategoryDelete = (id, subId) => {
		this.props.actions.deleteSubCategory({id, subId}).then((res) => {
				this._getAllCategories()
			}).catch((err) => {
				err.res.then((value) => {
					Alert.error(value.message)
				})
		})
	}

	_handleCategoryDelete = (key) => {
		this.props.actions.deleteCategory(key).then((res) => {
			console.log(res.value)
			this._getAllCategories()
		}).catch((err) => {
			err.res.then((value) => {
				Alert.error(value.message)
			})
		})
	}
	_handleInputChange = (e) => {
		this.setState({
			input: e.target.value
		})
	}

	_handleInputAddClick = (e) => {
		this.props.actions.addCategory(this.state.input).then((res) => {
			this._getAllCategories()
		}).catch((err) => {
			err.res.then((value) => {
				Alert.error(value.message)
			})
		})
	}

	_handleInputSubChange = (key, e) => {
		this.setState({
			inputSub: {
				...this.state.inputSub,
				[key]: e.target.value
			}
		})
	}

	_handleInputAddSubClick = (key) => {
		console.log(this.state.inputSub[key])
		this.props.actions.addSubCategory({id: key, name: this.state.inputSub[key]}).then((res) => {
			this._getAllCategories()
		}).catch((err) => {
			err.res.then((value) => {
				Alert.error(value.message)
			})
		})
	}

	render(){
		return(

			<Grid>
				<Row>
					<Col xs={12} sm={10} md={10} smOffset={1} mdOffset={1}>
						<Col xs={6} sm={6} md={6} lg={6}>
							<FormControl
								type="text"
								value={this.state.input}
								placeholder="添加一级分类"
								onChange={this._handleInputChange}
							/>
						</Col>
						<Col xs={6} md={6} sm={6} lg={6}>
							<Button block bsStyle="primary" onClick={this._handleInputAddClick}>添加一级分类</Button>
						</Col>
					</Col>
				</Row>
				<Row style={{marginTop: 10}}>
					<Col xs={12} sm={10} md={10} smOffset={1} mdOffset={1}>
						{this._renderCategoriesList()}
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
export default connect(mapStateToProps, mapDispatchToProps)(Category)