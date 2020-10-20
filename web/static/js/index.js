;
(function($) {
    var $input = $('.todo-input')
    var $wrap = $('.todo-wrap')
    $input.on('keydown', function(ev) {
            if (ev.keyCode == 13) {
                //1发送ajax
                $.ajax({
                    url: "/add",
                    type: 'post',
                    dataType: 'json',
                    data: {
                        task: $input.val()
                    },
                    //2根据后台返回结果处理dom节点
                    success: function(result) {
                        if (result.code == 0) {
                            var data = result.data
                            var $dom = $(`<li class="todo-item" data-id=${ data.id }>${ data.task }</li>`)
                            $wrap.append($dom)
                            $input.val('')
                        }
                    }
                })
            }
        })
        //删除
        //由于动态添加任务,所以需要用事件代理
    $wrap.on('click', 'li', function() {
            var $this = $(this)
                //1发送ajax请求
            $.ajax({
                url: '/del',
                type: 'get',
                dataType: 'json',
                data: {
                    id: $this.data('id')
                },
                success: function(result) {
                    //2根据后台返回结果
                    //2.1成功处理dom节点
                    if (result.code == 0) {
                        $this.remove()
                    }
                    //失败,弹出失败消息
                    else {
                        alert(result.msg)
                    }
                }
            })
        })
        //上传文件
    $('.avatar-input').on('change', function() {
        var formData = new FormData($('#avatar-form')[0])
        $.ajax({
            url: '/upload',
            type: 'POST',
            dataType: 'json',
            data: formData,
            contentType: false, //必须设置
            processData: false, //必须设置
            success: function(result) {
                //根据后台返回结果,处理
                console.log(result.data)
            }
        })
    })
})(jQuery)