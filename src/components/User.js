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
	render() {
		return (
			<div>
				user
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