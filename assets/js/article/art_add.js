$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()

    //初始化富文本编辑器
    initEditor()

    //定义加载 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化分类数据失败！', { icon: 2 })
                }

                //调用模板引擎 渲染文章类别的下拉菜单可选项
                var htmlStr = template('tpl-cate', res.data)
                $('[name=cate_id').html(htmlStr)

                // 、、、、、重点、、、、、
                //通知 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 400 / 280,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为上传按钮，绑定点击事件
    $('#btnChooseImage').on('click', function() {
        $('#file').click()
    })

    //为上传表单，绑定选中事件
    $('#file').on('change', function(e) {
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layui.layer.msg('请选择照片!', { icon: 2 })
        }
        //1.拿到用户选择的文件
        var file = e.target.files[0]

        //2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)

        //3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //定义文章的发布状态
    var art_state = '已发布'

    //为存为草稿按钮，绑定点击事件函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    //为表单绑定 submit 提交 事件
    $('form-add').on('submit', function(e) {
        //1.阻止表单的默认提交事件
        e.preventDefault()

        //2.基于form 表单，快速创建一个FormData 对象
        var fd = new FormData($(this)[0])

        //3.将文章的状态，存入 fd 中
        fd.append('state', art_state)

        //将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                //创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                //将 Canvas 画布上的内容，转化为文件对象
                //得到文件对象后，进行后续的操作
                //5.将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                //6.发起ajax 数据请求
                publishArticle(fd)
            })
    })


    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：如果向服务器提交的是 FormData 格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！', { icon: 2 })
                }
                layer.msg('发布文章成功！', { icon: 1 })

                //发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})