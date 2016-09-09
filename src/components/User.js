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
		e.preventDefault()
		let entity = this.state.registerEntity
		let username = entity.username
		let password = entity.password
		let nickname = entity.nickname
		if(!!username && !!password && !!nickname) {
			this.props.actions.register({username, password, nickname}).then((data) => {
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
							<FormGroup controlId="username">
								<Col componentClass={ControlLabel} sm={2}>
									用户名
								</Col>
								<Col sm={10}>
									<FormControl type="text" placeholder="用户名" onChange={this._handleRegisterInputChange.bind(this, 'username')}/>
								</Col>
							</FormGroup>
							<FormGroup controlId="password">
								<Col componentClass={ControlLabel} sm={2}>
									密码
								</Col>
								<Col sm={10}>
									<FormControl type="password" placeholder="密码" onChange={this._handleRegisterInputChange.bind(this, 'password')}/>
								</Col>
							</FormGroup>
							<FormGroup controlId="nickname">
								<Col componentClass={ControlLabel} sm={2}>
									昵称
								</Col>
								<Col sm={10}>
									<FormControl type="text" placeholder="昵称" onChange={this._handleRegisterInputChange.bind(this, 'nickname')}/>
								</Col>
							</FormGroup>
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
							<TableHeaderColumn dataAlign="center" dataField="username">用户名</TableHeaderColumn>
							<TableHeaderColumn dataAlign="center" dataField="password">密码</TableHeaderColumn>
							<TableHeaderColumn dataAlign="center" dataField="nickname">昵称</TableHeaderColumn>
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