$(function() {
    //调用 getUserInfo 获取用户基本信息
    getUserInfo()

    var layer = layui.layer

    $('#btnLogout').on('click', function() {
        //提示用户是否确认退出
        layer.confirm('确认是否退出?', { icon: 3, title: '提示' }, function(index) {
            //1.清空本地存储的token
            localStorage.removeItem('token')
                //2.强制跳转到登录页面
            location.href = '/login.html'
                //关闭 confirm 询问框
            layer.close(index);
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //已封装 至 baseAPI.js中
        // headers 就是请求头部配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！', { icon: 2 })
            }
            //调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        //已封装 至 baseAPI.js中
        // complete: function(res) {
        //     //在 complete 回调函数中，可以通过 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1.强制清空 token
        //         localStorage.removeItem('token')
        //             //2.强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    //1.获取用户的名称
    var name = user.nickname || user.useranme
        //2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        //3.按需渲染用户头像
    if (user.user_pic !== null) {
        //3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2 渲染文本头像
        $('.layui-nav-img').hide()
            //toUpperCase()  获取到的首字或字母 转为大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}