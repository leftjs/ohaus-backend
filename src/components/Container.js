/**
 * Created by zhangjiasheng on 16/8/25.
 */
import React from 'react'
import {Nav, Navbar, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import {browserHistory} from 'react-router'
import 'react-bootstrap-table/css/react-bootstrap-table-all.min.css'
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import Alert from 'react-s-alert'
class Container extends React.Component {
	render() {
		return (
			<div>
				<Alert stack={{limit: 3}} html={true} timeout={2000} offset={0} position='bottom-right' effect="slide"/>
				<Navbar>
					<Navbar.Header>
						<Navbar.Brand>
							<a>奥豪斯App后台管理系统</a>
						</Navbar.Brand>
					</Navbar.Header>
					<Nav>
						<NavItem eventKey={1} onClick={() => {
							browserHistory.push('/product')
						}}>产品管理</NavItem>
						<NavItem eventKey={2} href="#">Link</NavItem>
						<NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
							<MenuItem eventKey={3.1}>Action</MenuItem>
							<MenuItem eventKey={3.2}>Another action</MenuItem>
							<MenuItem eventKey={3.3}>Something else here</MenuItem>
							<MenuItem divider />
							<MenuItem eventKey={3.3}>Separated link</MenuItem>
						</NavDropdown>
					</Nav>
				</Navbar>
				{this.props.children}
			</div>
		)
	}
}

export default Container