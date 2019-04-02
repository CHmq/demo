import Jsonp from 'jsonp'

export default class Axios {
	static jsonp(options) {
		//控制开关，拦截状态码以及错误信息
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
}