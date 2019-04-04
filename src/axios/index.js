import Jsonp from 'jsonp'

import axios from 'axios';
import {
	Modal
} from 'antd';

export default class Axios {
	static jsonp(options) {
		//控制开关，拦截状态码以及发送错误信息
		return new Promise((resolve, reject) => {
			Jsonp(options.url, {
				param: 'callback'
			}, function(err, response) {
				if (response.status == '1') {
					resolve(response)
				} else {
					reject("err.message")
				}

			})
		})
	}


	static ajax(options) {
		//声明变量url
		let babelApi = 'https://www.easy-mock.com/mock/5ca47bf2ac5abe5a8d89b967/exampledemo'
		//控制开关，拦截状态码以及发送错误信息
		return new Promise((resolve, reject) => {
			axios({
				//api传递过来的url
				url: babelApi + options.url,
				//请求的方式 
				method: 'get',
				setTimeout: 5000,
				//页码参数
				params: (options.data && options.data.params) || ''
				//通过then将返回的参数抛回
			}).then((response) => {
				if (response.status == 200) {
					const res = response.data
					if (res.code == 0) {
						resolve(res)
					} else {
						//错误弹出提示信息
						Modal.info({
							title: "警告",
							content: res.msg
						})
						resolve(res)
					}
				} else {
					reject(response.data)
				}

			})

		})
	}
}