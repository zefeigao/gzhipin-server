var express = require('express');
var router = express.Router();
var md5 = require('blueimp-md5')

const { UserModel } = require('../db/models');
const filter = {password: 0, __v: 0} // MongoDB查询，指定filter过滤的属性，即不返回该属性

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
b. 提供一个用户注册的接口
  a) path 为: /register
  b) 请求方式为: POST
  c) 接收username 和password 参数
  d) admin 是已注册用户
  e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
  f) 注册失败返回: {code: 1, msg: '此用户已存在'}
 */

// 测试：

// router.post('/register', function(req, res) {
//   // 1. 获取请求参数
//   const {username, password} = req.body
//   // 2. 处理
//   if (username === 'admin'){ // 注册会失败
//     // 3. 返回相应数据
//     res.send({code: 1, msg: '用户已存在'})
//   } else { // 注册会成功
//     // 3. 返回相应数据
//     res.send({code:0, data: {_id: '0', username, password}})
//   }
  
// })

router.post('/register', (req, res) => {
  // 1. 获取请求参数
  const {username, password, type} = req.body
  // 2. 处理:判断是否用户存在,如果存在返回错误信息，如果不存在就保存
  // 查询 根据username
  UserModel.findOne({username}, (err, user) => {
    //如果 user有值
    if (user){
      // 返回错误信息
      res.send({code: 1, msg: '此用户已存在'}) // code是一个数据是否正常的标识
    } else{ // 如果没有，将提交的user保存到数据库
      new UserModel({username, password: md5(password), type}).save((err, user) => {
        // 持久化cookie，浏览器会保存在本地文件
        res.cookie('userid', user._id, {maxAge: 1000*60*20}) // 单位毫秒，此处是20min
        const data = {username, type, _id: user._id} // 响应数据中不需要密码
        res.send({code: 0, data}) // 保存成功，返回成功的相应数据
      })
    }
  })
  
})

router.post('/login', (req, res) => {
  const {username, password} =req.body
  // 根据username和password查询数据库users，如果没有，提示错误信息，如果有，返回登录成功信息（包含user，）
  UserModel.findOne({username, password:md5(password)}, filter, (err, user) => { // 指定filter过滤的属性，即不返回该属性
    if (user) { // 登陆成功
      // 生成一个cookie(userid: user._id),并交给浏览器保存
      res.cookie('userid', user._id, {maxAge: 1000*60*20})
      // 返回登陆成功信息 包含user
      res.send({code: 0, data: user})
    } else {
      res.send({code: 1, msg: '用户名或密码不正确！'})
    }
  })
})


module.exports = router;
