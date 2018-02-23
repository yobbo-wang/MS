;
(function ($) {
    window.appEngine = {
        dataType: [
            {"type":"short","text":"short"},
            {"type":"int","text":"int"},
            {"type":"long","text":"long"},
            {"type":"float","text":"float"},
            {"type":"double","text":"double"},
            {"type":"boolean","text":"boolean"},
            {"type":"char","text":"char"},
            {"type":"long","text":"long"},
            {"type":"byte","text":"byte"},
            {"type":"java.lang.Integer","text": "Integer"},
            {"type":"java.lang.String","text":"String"},
            {"type":"java.lang.Boolean","text":"Boolean"},
            {"type":"java.lang.Float","text":"Float"},
            {"type":"java.lang.Double","text":"Double"},
            {"type":"java.util.Date","text":"java.util.Date"},
            {"type":"java.sql.Timestamp","text":"Timestamp"},
            {"type":"java.sql.Time","text":"Time"},
            {"type":"byte[]","text":"byte[]"},
            {"type":"java.sql.Date","text":"java.sql.Date"},
            {"type":"java.sql.Blob","text":"Blob"},
            {"type":"java.sql.Clob","text":"Clob"}
        ],
        dialogId: new Array(),
        editMenu : function (menu) {
            switch(menu){
                case 'add': editMenu(menu); break;
                case 'del': delMenu(); break;
                case 'mod': editMenu(menu);break;
                default: true
            }
        },openDialog:function(options){
            var dialogId = appEngine.dialogId, _b = false;
            if(dialogId.length != 0)
            {
                for ( var _id in dialogId) {
                    $("#"+dialogId[_id]).remove();
                }
                _b = true;
            }
            $(document.body).append("<div id="+options.id+" class='easyui-dialog'></div>");
            $("#"+options.id).dialog({
                width : options.width,
                height : options.height,
                modal : options.modal==null?false:options.modal,
                maximizable : options.maximizable==null?false:options.maximizable,
                title : options.title,
                closed : options.closed==null ? false : options.closed,
                href : options.url,
                buttons : [ {text : "确定",iconCls : "icon-save",handler : function() {
                        options.save();
                    }
                }, {text : "返回",iconCls : "icon-undo",handler : function() {
                        $("#"+options.id).dialog("close");
                    }
                } ]
            });
            if(!_b)
            {
                appEngine.dialogId.push(options.id);
            }else{
                if($.inArray(options.id,dialogId)==-1)
                {
                    appEngine.dialogId.push(options.id);
                }
            }
            $("#"+options.id).dialog("open");
        },
        displayTable: function (clazz) {
            var data = $(clazz).data('detail'), data = data.replace(new RegExp("'","gm"),'"'), data = JSON.parse(data);
            var state = $.data($('#menu-list')[0], 'datagrid');
            var tables = data.row.tables, id = data.row.id, length = tables.length;
            var status = $(clazz).attr('status');
            if(status == 'opened'){
                $('#tr-h1-'+id).remove();
                $('#tr-h2-'+id).remove();
                $(clazz).attr('status', 'close');
                return;
            }
            var h1 = '<tr class="treegrid-tr-tree" id="tr-h1-'+id+'" style="height:'+ (length+1)*28 +'px">';
                h1 += '<td colspan="1" style="border-right:0">';
                h1 += '<div class="datagrid-row-detail">&nbsp;</div>';
                h1 += '</td></tr>';
            var h2 = '<tr class="treegrid-tr-tree" id="tr-h2-'+id+'" style="height:'+ (length+1)*28 +'px">';
                h2 += '<td colspan="6"><table id="entity-'+id+'"></table></td>';
            $('#' + state.rowIdPrefix + '-1-' + id).after(h1);
            $('#' + state.rowIdPrefix + '-2-' + id).after(h2);
            $('#entity-'+id).datagrid({
                singleSelect: true,
                rownumbers: true,
                checkbox: true,
                columns:[[
                    {field:'table_name',title:'实体名',width:'20%'},
                    {field:'remark',title:'备注',width:'30%'},
                    {field:'createDateStr',title:'创建时间',width:'30%'},
                    {field:'id',align:'center',title:'操作',width:'20%',formatter:function(value,row,index){
                        var h = "<a href='javascript:;' style='text-decoration: none;color:red;' data-id='"+value+"' onclick='appEngine.deleteEntity(this)'>删除</a>";
                        h += "<a href='javascript:;' style='text-decoration: none;margin-left: 5px;' onclick='appEngine.addEntity(\""+value+"\")'>修改</a>";
                        return h;
                    }},
                ]],
                data: tables,
                onSelect: function (index, row) {
                    $('#entityInfo').form('load', row);
                }
            });
            $(clazz).attr('status', 'opened');
        },
        deleteEntity: function (clazz) {
            var id= $(clazz).data('id');
            if(id == null || id == undefined) return;
            $.post(path + '/menu/deleteEntity', {id: id}, function (result) {
                if (result.success) {
                    $.messager.show({title:'温馨提示',msg:result.data,timeout:3000,showType:'show'});
                    $('#menu-list').treegrid("reload");
                } else {
                    alert(result.data);
                }
            });
        },
        addEntity: function (id) {
            var menu_id = '';
            if(id != undefined){
                var rows = $("#menu-list").datagrid("getSelected");
                if(rows == null)return;
                menu_id = rows.id;
            }
            appEngine.openDialog({
                width: 420,
                height: 300,
                modal: true,
                maximizable: false,
                title: (id != undefined) ? '新增实体' : '修改实体',
                closed: true,
                id: "addEntity",
                url: path + '/engine/menu/entity.html?menu_id=' + menu_id + '&id='+id,
                save:function(){
                    $('#add-entity').form('submit', {
                        url : path + "/menu/addEntity",
                        method : 'post',
                        onSubmit : function() {
                            var result = $(this).form('validate');
                            return result;
                        },
                        success : function(data) {
                            var result = eval('(' + data + ')');
                            if (result.success) {
                                $.messager.show({title:'温馨提示',msg:result.data,timeout:3000,showType:'show'});
                                $('#addEntity').dialog("close");
                                $('#menu-list').treegrid("reload");
                            } else {
                                $('#errorMsg').html("<span style='color:Red'>错误提示:" + result.data + "</span>");
                            }
                        }
                    });
                }
            });
        },
        createEntityCode: function () {  //生成实体代码

        },
        endEditing:function(index, field){
            if (appEngine.endIndex == undefined){return true}
            if ($('#datagrid-entity').datagrid('validateRow', appEngine.endIndex)){
                //验证数据
                $('#datagrid-entity').datagrid('endEdit', appEngine.endIndex);
                appEngine.endIndex = undefined;
                return true;
            } else {
                return false;
            }
        },
        editEntity: function (type) {
            if(type == 'add'){
                var counts = $('#datagrid-entity').datagrid('getRows').length;
                $('#datagrid-entity').datagrid('appendRow',{ORDINAL_POSITION: counts + 1});
            }else if(type == "del"){
                var row = $('#datagrid-entity').datagrid('getSelected');
                var index = $('#datagrid-entity').datagrid('getRowIndex',row);
                $('#datagrid-entity').datagrid('deleteRow',index); //动态删除
            }else if(type == 'maintain'){

            }
        },
        onClickCell : function(index, field){
            if (appEngine.endEditing(index, field)){
                $('#datagrid-entity').datagrid('selectRow', index)
                    .datagrid('editCell', {index:index,field:field});
                appEngine.endIndex = index;
            }
        }
    };
    
    function delMenu() {
        var rows = $("#menu-list").datagrid("getSelected");
        if(rows==null)
            return;
        var id= rows.id;
        $.post(path + '/menu/delete', {id: id}, function (result) {
            if (result.success) {
                $.messager.show({title:'温馨提示',msg:result.data,timeout:3000,showType:'show'});
                $('#menu-list').treegrid("reload");
            } else {
                alert(result.data);
            }
        });
    }
    
    //新增菜单
    function editMenu(type) {
        var id = "";
        if(type == 'mod'){
            var rows = $("#menu-list").datagrid("getSelected");if(rows==null)return; id= rows.id;
        };
        appEngine.openDialog({
            width: 550,
            height: 500,
            modal: true,
            maximizable: false,
            title: type == 'add' ? "新增菜单" : "修改菜单",
            closed: true,
            id: "editMenu",
            url: path + '/engine/menu/index.html?id=' + id,
            save:function(){
                $('#menu-edit').form('submit', {
                    url : path + "/menu/save",
                    method : 'post',
                    onSubmit : function() {
                        var result = $(this).form('validate');
                        return result;
                    },
                    success : function(data) {
                        var result = eval('(' + data + ')');
                        if (result.success) {
                            $.messager.show({title:'温馨提示',msg:result.data,timeout:3000,showType:'show'});
                            $('#editMenu').dialog("close");
                            $('#menu-list').treegrid("reload");
                        } else {
                            $('#errorMsg').html("<span style='color:Red'>错误提示:" + result.data + "</span>");
                        }
                    }
                });
            }
        });
    }
}
)(jQuery);