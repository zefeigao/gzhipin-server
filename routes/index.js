var express = require('express');
var router = express.Router();

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

router.post('/register', function(req, res) {
  // 1. 获取请求参数
  const {username, password} = req.body
  // 2. 处理
  if (username === 'admin'){ // 注册会失败
    // 3. 返回相应数据
    res.send({code: 1, msg: '用户已存在'})
  } else { // 注册会成功
    // 3. 返回相应数据
    res.send({code:0, data: {_id: 0, username, password}})
  }
  
})



module.exports = router;
