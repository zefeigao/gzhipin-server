/*
测试使用mongoose使用数据库
1. 连接数据库
    1.1. 引入mongoose
    1.2. 连接指定数据库(URL 只有数据库是变化的)
    1.3. 获取连接对象
    1.4. 绑定连接完成的监听(用来提示连接成功)
2. 得到对应特定集合的Model
    2.1. 字义Schema(描述文档结构)
    2.2. 定义Model(与集合对应, 可以操作集合)
3. 通过Model 或其实例对集合数据进行CRUD 操作
    3.1. 通过Model 实例的save()添加数据
    3.2. 通过Model 的find()/findOne()查询多个或一个数据
    3.3. 通过Model 的findByIdAndUpdate()更新某个数据
    3.4. 通过Model 的remove()删除匹配的数据
*/

const md5 = require('blueimp-md5')

// 1. 连接数据库
// 1.1. 引入mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected', function () { // 连接成功回调
    console.log('数据库连接成功！')
})

// 2. 得到对应特定集合的Model
// 2.1. 字义Schema(描述文档结构)
const userSchema = mongoose.Schema({ // 置顶文档的结构，属性名/属性值的类型，是否是必须的，默认值等
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required:true}, // 用户类型： dashen/laoban
    header: {type: String},
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
// 这是定义了个函数
const UserModel = mongoose.model('users', userSchema) // 集合名：users

// 3. 通过Model 或其实例对集合数据进行CRUD 操作
// 3.1. 通过Model 实例的save()添加数据
function testSave() {
    // 创建UserModel实例,将user数据保存进去Í
    const userModel = new UserModel({username: 'Tom', password: md5('123'), type: 'dashen'})
    // 调用save()保存
    userModel.save(function(error, user){ // 返回一个包含user信息的文档对象
        console.log('save()', error, user._doc);

    })
}
// testSave()

// 3.2. 通过Model 的find()/findOne()查询多个或一个数据
function testFind(){
    // 查询多个，返回数组
    UserModel.find(function (error, users){
        console.log('find()', error, users.map((user)=>(user._doc)));
    })
    // 查询一个
    UserModel.findOne({_id:'5fc243efd2422f446ae74528'}, function(error, user){
        console.log('findOne()', error, user._doc);
    })
}
testFind()

// 3.3. 通过Model 的findByIdAndUpdate()更新某个数据
function testUpdate() {
    UserModel.findByIdAndUpdate(
        {_id: '5fc243ba5e561a4451854353'}, 
        {username: 'Bob'}, 
        function(error, oldUser){ // 返回旧的User信息
            console.log('findByIdAndUpdate()', error, oldUser._doc);
        }
    )
}
// testUpdate()

// 3.4. 通过Model 的remove()删除匹配的数据
function testDelete(){
    UserModel.remove({_id:'5fc243ba5e561a4451854353'}, function(error, doc){ // doc: 成功返回：{ n: 1, ok: 1 } 再次运行已经删除的id返回：{ n: 0, ok: 1 }
        console.log('remove()', error, doc); // {n: 1/0, ok:1}
    })
}
// testDelete()
