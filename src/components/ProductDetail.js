/**
 * Created by zhangjiasheng on 16/9/7.
 */
import React from 'react'
import { Grid, Row, Col, Thumbnail, Panel, Image, Modal, FormControl, FormGroup, Form, ControlLabel, HelpBlock, Button} from 'react-bootstrap'
import {BootstrapTable,TableHeaderColumn} from 'react-bootstrap-table'
import actions from '../actions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Alert from 'react-s-alert'
import _ from 'lodash'
import FileUpload from 'react-fileupload'
import config from '../config'
import ReactDOM from 'react-dom'

class ProductDetail extends React.Component {


	loadProductByNetwork(id) {
		this.props.actions.getSingleProduct(id).then((result) => {
			let data = _.map(result.value.data, (item) => {
				return {
					...item,
					operation: <Button bsStyle="danger" bsSize="xsmall" onClick={this._handleDeleteProductDataById.bind(this, id, item.id)}>删除</Button>
				}
			})

			this.setState({
				...result.value,
				data
			})
		}).catch((err) => {
			console.log(err)
			Alert.error("网络加载单个产品信息失败")
		})
	}

	_handleDeleteProductDataById = (id, no) => {
		this.props.actions.deleteProductDataById({id, no}).then((data) => {
			Alert.success("删除成功")
			this.loadProductByNetwork(this.props.params.id)
		}).catch((err) => {
			Alert.error("删除失败")
		})
	}

	state = {
		_id: '',
		data: [],
		filter: [],
		images: {},
		effect: [],
		showModal: false,
		item: {}, // 待提交的参数信息
		desc: ''
	}

	componentWillMount() {
		this.loadProductByNetwork(this.props.params.id)
	}

	_handleModalClose() {
		this.setState({ showModal: false });
	}

	_handleModalOpen() {
		this.setState({ showModal: true });
	}





  _handleProductImageDelete = (id, name) => {
  	this.props.actions.deleteProductImageByName({id, name}).then((data) => {
			this.loadProductByNetwork(this.props.params.id)
		  Alert.success('删除指定配图成功')
	  }).catch((err) => {
	  	console.log(err)
		  Alert.error("删除指定配图失败")
	  })
  }

  _handleProductDataAddClick = (id, item) => {
  	this.props.actions.addProductDataById({id, item}).then((data) => {
  		Alert.success("添加参数成功")
		  this.loadProductByNetwork(this.props.params.id)
		  this._handleModalClose()
	  }).catch((err) => {
	  	Alert.error('添加参数失败')
	  })
  }

	_handleDescChange = (e) => {
		this.setState({
			desc: e.target.value
		})
	}
	_handleDescSubmit = () => {
		this.props.actions.updateProductDescById({id: this.props.params.id, desc: ReactDOM.findDOMNode(this._descTextarea).value})
			.then((data) => {
				Alert.success("描述信息更新成功")
				this.loadProductByNetwork(this.props.params.id)

			}).catch((err) => {
				Alert.error("描述信息更新失败")
		})
	}

	_renderTableColumn = () => {
		let renderArr = []
		if (this.state.filter && this.state.filter.length > 0) {
			_.map(this.state.filter, (item) => {
				renderArr.push(<TableHeaderColumn dataAlign='center' dataField={item} key={item}>{item}</TableHeaderColumn>)
			})
			_.map(this.state.effect, (item) => {
				//
				renderArr.push(<TableHeaderColumn dataAlign='center' dataField={item} key={item}><span style={{
					color: 'red'
				}}>{item}</span></TableHeaderColumn>)
			})
		}
		return renderArr
	}

	_handleFormControlChange = (key, e) => {
		this.setState({
			item: {
				...this.state.item,
				[key]: e.target.value
			}
		})
	}
	_renderFormGroup = () => {
		let renderArr = []
		if(this.state.filter && this.state.effect && this.state.filter.length > 0 && this.state.effect.length > 0) {
			let labels = [...this.state.filter, ...this.state.effect]
			_.map(labels, (item) => {
				renderArr.push(
					<FormGroup controlId={item} key={item}>
						<Col componentClass={ControlLabel} sm={2}>
							{item}
						</Col>
						<Col sm={10}>
							<FormControl type="text" placeholder={item} onChange={this._handleFormControlChange.bind(this, item)}/>
						</Col>
					</FormGroup>
				)
			})
		}
		return renderArr
	}

	render() {
		return (
			<div>
				<Modal show={this.state.showModal} bsSize="large" onHide={this._handleModalClose.bind(this)}>
					<Modal.Header closeButton>
						<Modal.Title>新增参数</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<h4>以下参数请完整填写</h4>

						<hr />

						<Form horizontal>
							{this._renderFormGroup()}
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button bsStyle="danger" onClick={this._handleModalClose.bind(this)}>关闭</Button>
						<Button bsStyle="success" onClick={this._handleProductDataAddClick.bind(this, this.props.params.id, this.state.item)}>提交</Button>
					</Modal.Footer>
				</Modal>
				<Grid>
					<Row>
						<Panel header="配图管理" bsStyle="danger">
							<Row style={{
							paddingLeft: 15
						}}>
								<FileUpload options={{
								baseUrl:`${config.domain}/api/product/${this.state._id}/image/upload`,
								chooseAndUpload: true,
								fileFieldName: 'file',
								uploadSuccess: () => {
									this.loadProductByNetwork(this.props.params.id)
								}
							}}>
									<Button bsStyle="success" ref="chooseAndUpload">上传新图片</Button>
								</FileUpload>
							</Row>
							<Row>
								{_.map(this.state.images,(value,key) => {
									return (
										<Col xs={12} sm={6} md={4} key={key}>
											<div style={{
											border: '1px solid grey',
											marginTop: 10,
											padding: 5
										}}>
												<Image src={value} responsive style={{
												height: 200
											}} />
												<h4 style={{
											display: 'block',
											width:200,
											overflow: 'hidden',
											whiteSpace: 'nowrap',
											textOverflow: 'ellipsis'
										}}>{key}</h4>
												<p>
													<Button bsStyle="danger" onClick={this._handleProductImageDelete.bind(this, this.state._id, key)} block>删除</Button>&nbsp;
												</p>
											</div>
										</Col>
									)
								})}
							</Row>
						</Panel>
					</Row>
					<Row>
						{
							!!this.state.data ? <Panel header="参数管理(双击编辑,退出编辑则保存,黑色为筛选项,红色为变化项)" bsStyle="success">
								<Button bsStyle="success" style={{marginLeft: 10}} onClick={this._handleModalOpen.bind(this)}>新增</Button>
								<BootstrapTable
									data={this.state.data}
									cellEdit={{
								    mode: 'dbclick',
								    blurToSave: true,
								    beforeSaveCell: (row, cellName, cellValue) => {
								    	let preparedData = row
								    	preparedData[cellName] = cellValue

						  		    this.props.actions.updateProductDataById({id: this.state._id, item: preparedData}).then((data) => {
						  		    	Alert.success('更新成功')
						  		    }).catch((err) => {
						  		    	Alert.error('更新失败')
						  		    })
								    }
								  }}
								>
									<TableHeaderColumn dataField="id" isKey={true} dataAlign="center">编号</TableHeaderColumn>

									{this._renderTableColumn()}

									<TableHeaderColumn dataField="operation" dataAlign="center">操作</TableHeaderColumn>
								</BootstrapTable>

							</Panel> : null
						}
					</Row>
					<Row>
						<Panel header="图文管理" bsStyle="info">
							<Form>
								<FormGroup controlId="formControlsTextarea">
									<ControlLabel>产品详情图文编辑区域(暂时不支持所见即所得,图片请使用图床上传)</ControlLabel>
									<textarea name="desc" rows="20" style={{
										width: '100%',
										border: '1px solid grey',
										borderRadius: 5
									}} value={this.state.desc} onChange={this._handleDescChange} ref={(view) => {this._descTextarea = view}}/>
								</FormGroup>
							</Form>
							<Button bsStyle="success" block onClick={this._handleDescSubmit}>提交</Button>
						</Panel>
					</Row>
				</Grid>

			</div>
		)
	}
}

function mapStateToProps(state) {
	/* Populated by react-webpack-redux:reducer */
	console.log(state)
	return {
		products: state.product.data
	}
}

function mapDispatchToProps(dispatch) {
	/* Populated by react-webpack-redux:action */
	return {
		actions: {
			...bindActionCreators(actions, dispatch)
		}
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);