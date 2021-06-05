$(function() {
    var layer = layui.layer
    var form = layui.form

    //调用获取文章分类的列表
    initArtCateList()

    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败!', { icon: 2 })
                }
                var htmlStr = template('tp1-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式，为form-add 表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！', { icon: 2 })
                }
                layer.msg('新增分类成功！', { icon: 1 })

                //通过索引 indexAdd 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    //通过代理的形式,为 btn-edit 绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        //弹出一个修改文章分类的信息层
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
            //发起获取数据的ajax 请求
        $.ajax({
            mothod: 'POST',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类信息失败！', { icon: 2 })
                }
                //快速给表单元素赋值
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式，为form-edit 表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败！', { icon: 2 })
                }
                layer.msg('更新分类成功！', { icon: 1 })

                //通过索引 indexAdd 关闭弹出层
                layer.close(indexEedit)
            }
        })
    })

    //通过代理的形式,为 btn-del 绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-del', function() {
        var id = $(this).attr('data-id')

        //提示用户是否要删除
        layer.confirm('您确认需要删除吗？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！', { icon: 2 })
                    }
                    layer.msg('删除分类成功！', { icon: 1 })
                    layer.close(index);
                    initArtCateList()
                }
            })
        })
    })
})