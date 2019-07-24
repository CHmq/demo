# README

# May 16th [merge]

## 1. service层

- APPKEY 接口配置已经重构 请看 `config.json` 使用
  - 直接调用 `apiService` 即可 不需要再 实例化 `APPKEY`
- API 接口已经重构 请看 `config.json`
  - 具体请参考 `authService` `userService` 的封装

## 2. Routes层

- 路由现在已经可以传递 区域的url `/cn/en?` 和 当前语言 `zh-CN` 
  - 通过 `locationUrl` 和 `lang` 获取
- 新增了 `ProtectedRoute` 针对未登录的保护 
  - 以后所有新的路由 如果用户要登录才能查看 请使用这个路由调用
  - 使用方式 已经注释

## 3. Other

- API 接口请 对象析构 
  - API 接口不要这样写 `data.data.data.xxx` **没人看得懂**
- 不要使用 `state` 拿数据
  - 去看 `redux` 通过 `props` 获得数据
- **目前 可能有部分页面无法显示 是API接口导致 请重构**
  - 重构有问题的 请找 `Illya`

# May 20th [merge]

## explain

1. 设置了 cookies 过期时间 目前为48h
2. 封装了 API接口 `依照链接` 来封装文件
3. 将未登录时的页面设置为 logout 页面

## 1. redux

- 请看 `redux` `react-redux` 等库
  - 后续马上要用
- 目前的 `redux` 全局值 我来处理 