/**
 * Created by zhangjiasheng on 16/9/7.
 */
import React from 'react'
import { Grid, Row, Col, Thumbnail, Panel, Image, FormControl, FormGroup, Form, ControlLabel, HelpBlock, Button} from 'react-bootstrap'
import {BootstrapTable,TableHeaderColumn} from 'react-bootstrap-table'
import actions from '../actions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Alert from 'react-s-alert'
import _ from 'lodash'
import FileUpload from 'react-fileupload'
import config from '../config'

class ProductDetail extends React.Component {


	loadProductByNetwork(id) {
		this.props.actions.getSingleProduct(id).then((data) => {
			this.setState({
				...data.value
			})
		}).catch((err) => {
			console.log(err)
			Alert.error("网络加载单个产品信息失败")
		})
	}

	state = {
		_id: '',
		data: [],
		filter: null,
		images: {},
		effect: null,
	}


	componentWillMount() {
		this.loadProductByNetwork(this.props.params.id)
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

	_renderTableColumn = () => {
		let renderArr = []
		if (this.state.filter && this.state.filter.length > 0) {
			_.map(this.state.filter, (item) => {
				renderArr.push(<TableHeaderColumn dataAlign='center' dataField={item} key={item}>{item}</TableHeaderColumn>)
			})
			_.map(this.state.effect, (item) => {
				//
			})
		}
		return renderArr
	}

	render() {
		return (
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
											}}></Image>
											<h4 style={{
											display: 'block',
											width:200,
											overflow: 'hidden',
											whiteSpace: 'nowrap',
											textOverflow: 'ellipsis'
										}}>{key}</h4>
											<p>
												<Button bsStyle="danger" onClick={this._handleProductImageDelete.bind(this, this.state._id, key)}>删除</Button>&nbsp;
											</p>
										</div>
									</Col>
								)
							})}
						</Row>
					</Panel>
				</Row>
				<Row>
					<Panel header="参数管理" bsStyle="success">
						{
							<BootstrapTable
								data={this.state.data}
								selectRow={{
									mode: 'radio',
									clickToSelect: true
								}}
								cellEdit={{
						  	mode: 'dbclick',
						  	blurToSave: true,
						  	beforeSaveCell: (row, cellName, cellValue) => {
						  		console.log(row, cellName, cellValue)
						  	}
						  }}
							>
								<TableHeaderColumn dataField="id" isKey={true} dataAlign="center">编号</TableHeaderColumn>

								{this._renderTableColumn()}
							</BootstrapTable>

						}
					</Panel>
				</Row>

			</Grid>
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