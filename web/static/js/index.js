;
(function ($) {
    var $input = $('.todo-input')
    $input.on('keydown', function (ev) {
        if (ev.keyCode == 13) {
            //发送ajax
            $.ajax({
                url: "/add",
                type: 'post',
                dataType: 'json',
                data: {
                    task: $input.val()
                },
                success: function (result) {
                    console.log(result);
                }
            })
        }
    })
    //删除
    //由于动态添加任务,所以需要用事件代理
    var $wrap = $('.todo-wrap')
    $wrap.on('click', 'li', function () {
        var $this = $(this)
        $.ajax({
            url: '/del',
            type: 'get',
            dataType: 'json',
            data: {
                id: $this.data('id')
            },
            success: function (result) {
                //根据返回结果处理dom节点
                if (result.code == 0) {
                    $this.remove()
                }//处理失败,弹出失败消息
                else {
                    alert(result.msg)
                }
            }
        })
    })
})(jQuery)