/**
 * Created by zhangjiasheng on 16/8/25.
 */
import React from 'react'

class Home extends React.Component {
	render() {
		return (
			<div style={{
				marginTop: 100,
				display: 'flex',
				flexDirection: 'column',
				alignItem: 'center',
				justifyContent: 'center'
			}}>
				<h1 style={{
					textAlign: 'center'
				}}>欢迎登陆奥豪斯APP管理后台</h1>
				<p style={{
					textAlign: 'center',
					marginTop: 20,
					color: 'red'
				}}>请选择上方的菜单进行相应的管理</p>
			</div>
		)
	}
}

export default Home