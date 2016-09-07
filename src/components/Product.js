/**
 * Created by zhangjiasheng on 16/8/25.
 */
import React from 'react'
import { Grid, Row, Col, Panel, FormControl, FormGroup, Form, ControlLabel, HelpBlock, Button} from 'react-bootstrap'
import {BootstrapTable,TableHeaderColumn} from 'react-bootstrap-table'
import actions from '../actions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Alert from 'react-s-alert'



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
	}


	// data: list,
	// totalDataSize: count,
	// sizePerPage: parseInt(size),
	// currentPage: parseInt(page)
	componentWillMount() {
		this._fetchProductListByPageAndSize({page: this.state.currentPage, size: this.state.sizePerPage})
	}

	_handleItemDeleteClick = (id) => {
		this.props.actions.deleteProductById(id).then((res) => {
			Alert.success(res.value.message)
		})
	}

	_fetchProductListByPageAndSize = ({page, size}) => {
		this.props.actions.getProductListByPageAndSize({page, size}).then((res) => {
			let data = res.value
			let list = data.data
			console.log(list)
			list = _.map(list, (item) => {
				return {
					_id: item._id,
					name: item.name,
					imageCount: `${_.keys(item.images).length}张`,
					dataCount: `${item.data.length}个`,
					filterCount: `${item.filter.length}个`,
					effectCount: `${item.effect.length}个`,
					operation: <div>
						<Button bsStyle="danger" bsSize="xsmall" onClick={this._handleItemDeleteClick.bind(this, item._id)}>删除</Button>
						<Button bsStyle="info" bsSize="xsmall" style={{marginLeft: 10}} onClick={this._handleUploadSubmit}>详情</Button>

					</div>

				}
			})
			console.log('list', list)
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
export default connect(mapStateToProps, mapDispatchToProps)(Product);