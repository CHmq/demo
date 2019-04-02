const menuList = [{
		title: '首页',
		key: 'admin/home'
	}, {
		title: '用户',
		key: 'admin/useList',
		children: [{
			title: '新增用户',
			key: 'admin/addUser'
		}, {
			title: '用户更改',
			key: 'admin/resUser'
		}, {
			title: '删除用户',
			key: 'admin/delUser'
		}]
	}, {
		title: '权限',
		key: 'admin/admin'
	}

]

export default menuList;