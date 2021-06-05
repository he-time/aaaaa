$(function() {
    var form = layui.form

    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        Pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        newPwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=oldPwd]').val()
            if (pwd == value) {
                return '新旧密码不能相同！'
            }
        },
        // 校验两次密码是否一致的规则
        rePwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=newPwd]').val()
            if (pwd !== value) {
                return '与新密码输入不一致！'
            }
        }
    })

    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！', { icon: 2 })
                }
                layui.layer.msg('更新密码成功!', { icon: 1 })

                //重置表单$('')[0].reset()
                $('.layui-form')[0].reset()
                    //重置成功之后 删除原来的 token   
                window.parent.localStorage.removeItem('token')
                    //删除原来的token之后 退出返回到login 页面
                window.parent.location.href = '/login.html'
            }
        })
    })
})