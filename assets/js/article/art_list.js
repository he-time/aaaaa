$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear() //获取 年
        var m = padZero(dt.getMonth() + 1) //获取 月
        var d = padZero(dt.getDate()) //获取 日
        var hh = padZero(dt.getHours()) //获取 时
        var mm = padZero(dt.getMinutes()) //获取 分
        var ss = padZero(dt.getSeconds()) //获取 秒

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    //定义时间 补零 的函数 ，美化时间的格式  00:00:00
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //定义 一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 10, //每页显示几条数据，默认每页显示10条
        cate_id: '', //文章分类的 ID
        state: '' //文章的发布状态
    }
    initTable()
    initCate()

    //获取文章列表 数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章失败!', { icon: 2 })
                }

                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res.data)
                $('tbody').html(htmlStr)

                //页面数据 渲染完成之后  再渲染分页
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！', { icon: 2 })
                }

                //调用模板引擎 渲染分类的可选项到页面中
                var htmlStr = template('tpl-cate', res.data)
                $('[name=cate_id').html(htmlStr)

                //通知 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    //为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        //获取表单中选中项的值
        var cate_id = $('[name=cate_id').val()
        var state = $('[name=state]').val()

        //为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        //根据最新的筛选条件，重新渲染表单数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法 来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的 ID
            count: total, //总数据的条数
            limt: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的页码数
            // 分页发生切换的时候，触发 jump 回调
            jump: function(obj) {
                //把最新的页面值，赋值到 q 这个查询参数中 
                q.pagenum = obj.curr

                //根据最新 的 q 获取对应的数据列表，并渲染表格
                initTable()
            }
        })
    }
})