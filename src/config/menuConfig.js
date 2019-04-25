const menuList = [{
		title: '首页',
		key: '/admin/home'
	}, {
		title: '用户',
		key: '/admin/useList',
		children: [{
			title: '新增用户',
			key: '/admin/useList/addUser'
		}, {
			title: '用户更改',
			key: '/admin/useList/resUser'
		}, {
			title: '删除用户',
			key: '/admin/useList/delUser'
		}]
	}, {
		title: '管理员设置',
		key: '/admin/adminList'
	}, {
		title: '订单管理',
		key: '/admin/order'
	},

]

export default menuList;