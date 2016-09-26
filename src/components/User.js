/**
 * Created by zhangjiasheng on 16/9/8.
 */
import React from 'react'
import { Grid, Row, Col, Panel, FormControl, FormGroup, Form, ControlLabel, HelpBlock, Button} from 'react-bootstrap'
import {BootstrapTable,TableHeaderColumn} from 'react-bootstrap-table'
import actions from '../actions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Alert from 'react-s-alert'
import {browserHistory} from 'react-router'

class User extends React.Component {

	state = {
		registerEntity: {},
		users: [],
		sizePerPage: 10,
		currentPage: 1,
		totalDataSize: 0,

	}

	inputField = [
	{
		id: 'username',
		label: '用户名',
		type: 'text'
	}, {
		id: 'password',
		label: '密码',
		type: 'text'
	}, {
		id: 'name',
		label: '姓名',
		type: 'text'
	}, {
		id: 'email',
		label: '邮箱',
		type: 'email'
	}, {
		id: 'company',
		label: '公司',
		type: 'text'
	}, {
		id: 'job',
		label: '职务',
		type: 'text'
	}, {
		id: 'city',
		label: '城市',
		type: 'text'
	}, {
		id: 'phone',
		label: '手机号',
		type: 'number'
	}
]

	_handleRegisterInputChange(key, e) {
		this.setState({
			registerEntity: {
				...this.state.registerEntity,
				[key]: e.target.value
			}
		})
	}

	_handleRegisterSubmit(e) {
		// this.props.actions.register({})
		console.log(this.state)
		e.preventDefault()
		let entity = this.state.registerEntity
		let username = entity.username
		let password = entity.password
		let name = entity.name
		let email = entity.email
		let company = entity.company
		let job = entity.job
		let city = entity.city
		let phone = entity.phone
		if(!!username && !!password && !!name && !!email && !!company && !!job && !!city && !!phone) {
			this.props.actions.register({username, password, name, email, company, job, city, phone}).then((data) => {
				Alert.success("注册成功")
				this._loadUsersList(this.state.currentPage, this.state.sizePerPage)
			}).catch((err) => {
				Alert.error('注册失败,请检查')
			})
		}else {
			Alert.error('请填写完整的注册信息')
		}
	}

	_handlePageAndSizeChange(page,size) {
		this._loadUsersList(page,size)
	}

	_handleUserDelete(id) {
		this.props.actions.deleteUserById(id).then((data) => {
			Alert.success("删除成功")
			this._loadUsersList(this.state.currentPage, this.state.sizePerPage)
		}).catch((err) => {
			Alert.error('删除失败')
		})
	}


	componentWillMount() {
		this._loadUsersList(this.state.currentPage, this.state.sizePerPage)
	}
	_loadUsersList(page,size) {
		this.props.actions.getUserList({page,size}).then((data) => {
			let list = data.value.data
			list = _.map(list, (item) => {
				return {
					...item,
					operation: <Button bsStyle="danger" bsSize="xsmall" onClick={this._handleUserDelete.bind(this, item._id)}>删除</Button>
				}
			})
			this.setState({
				users: list,
				sizePerPage: data.value.sizePerPage,
				currentPage: data.value.currentPage,
				totalDataSize: data.value.totalDataSize
			})
			Alert.success('获取用户列表成功')
		})
	}


	render() {


		return (
			<div>
				<Col xs={12} sm={10} md={10} smOffset={1} mdOffset={1}>
					<Panel header="用户注册" bsStyle="primary">
						<Form horizontal>

							{
								_.map(this.inputField, (item) => {
									return (
										<FormGroup controlId={item.id} key={item.id}>
											<Col componentClass={ControlLabel} sm={2}>
												{item.label}
											</Col>
											<Col sm={10}>
												<FormControl type={item.type} placeholder={item.label} onChange={this._handleRegisterInputChange.bind(this, item.id)}/>
											</Col>
										</FormGroup>
									)
								})
							}

							<FormGroup>
								<Col smOffset={2} sm={10}>
									<Button type="submit" onClick={this._handleRegisterSubmit.bind(this)}>
										注册
									</Button>
								</Col>
							</FormGroup>
						</Form>
					</Panel>
				</Col>
				<Col xs={12} sm={10} md={10} smOffset={1} mdOffset={1}>
					<Panel header="用户管理(双击编辑,退出保存)" bsStyle="info">
						<BootstrapTable
							data={this.state.users}
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
								onPageChange: this._handlePageAndSizeChange.bind(this),
								sizePerPageList: [10,20,30,50],
								pageStartIndex: 1,
								page: this.state.currentPage,
						  }}
							cellEdit={{
						    mode: 'dbclick',
						    blurToSave: true,
						    beforeSaveCell: (row, cellName, cellValue) => {
						      let preparedData = row
						      preparedData[cellName] = cellValue
				          this.props.actions.updateUserById({id: row._id, body: preparedData}).then((data) => {
				            Alert.success('更新成功')
				            this._loadUsersList(this.state.currentPage, this.state.sizePerPage)
				          }).catch((err) => {
				            Alert.error('更新失败')
				          })
						    }
						  }}
						>
							<TableHeaderColumn dataAlign="center" dataField="_id" isKey={true}>编号</TableHeaderColumn>
							<TableHeaderColumn dataAlign="center" dataField="password">密码</TableHeaderColumn>
							<TableHeaderColumn dataAlign="center" dataField="name">昵称</TableHeaderColumn>
							<TableHeaderColumn dataAlign="center" dataField="phone">手机号</TableHeaderColumn>
							<TableHeaderColumn dataAlign="center" dataField="email">邮箱</TableHeaderColumn>
							<TableHeaderColumn dataAlign="center" dataField="city">城市</TableHeaderColumn>
							<TableHeaderColumn dataAlign="center" dataField="company">公司</TableHeaderColumn>
							<TableHeaderColumn dataAlign="center" dataField="job">职务</TableHeaderColumn>
							<TableHeaderColumn dataAlign="center" dataField="operation">操作</TableHeaderColumn>
						</BootstrapTable>
					</Panel>
				</Col>
			</div>
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
export default connect(mapStateToProps, mapDispatchToProps)(User)