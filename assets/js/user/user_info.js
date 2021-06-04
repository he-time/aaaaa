$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: [/^[a-zA-Z0-9\u4e00-\u9fa5]{1,6}$/, '昵称只能填写1~ 6个字符之间']
    })

    //调用用户基本信息AJAX
    initUserInfo()

    //初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败', { icon: 2 })
                }
                //调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }

    //重置表单的数据  
    $('#benReset').on('click', function(e) {
        //阻止重置按钮的默认行为
        e.preventDefault()
        initUserInfo()
    })

    //监听表单的提交的事件
    $('.layui-form').on('submit', function(e) {
        //阻止提交按钮的默认行为
        e.preventDefault()

        //发起ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！', { icon: 2 })
                }
                layer.msg('更新用户信息成功', { icon: 1 })

                //调用父页面中的方法，重新渲染用户头像和基本信息
                //在子页面中调用父页面的函数
                window.parent.getUserInfo()
            }

        })
    })
})