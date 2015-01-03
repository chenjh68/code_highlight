
//加载小头像
$(document).ready(function () {
    setInterval("highlight()",5000);

    $("#picpath").change(function(){
        $("#path").val(this.value);
        previewImage(this);
    });
    $("#insert_img").click(function(){
        $("#picpath").click();
    });


    //实现tab功能
    
    $('#editor').keydown(function(e){
        stopBubble(e);
        e = e || event;
        var keyCode = e.keyCode || e.which || 0;
        if (keyCode == '9'){
            var tabSpace = '    ';
            if (document.all){
                document.selection.createRange().pasteHTML(tabSpace);
            } else {
                document.execCommand('InsertHtml', null, tabSpace);
            }
            return false;
        }if (keyCode == '13'){
            var enter = '\n'+'';
            if (document.all){
                document.selection.createRange().pasteHTML(enter);
            } else {
                document.execCommand('InsertHtml', null, enter);
            }

            /*
            var $newCode = $("<code class ='python'></code>");
            $('#code_pre').append($newCode);
            
            var range = document.createRange();  
            var len = $('#code_pre').children.length;  
            range.setStart($('#code_pre'), len-1);  
            range.setEnd($('#code_pre'), len-1);  
            getSelection().addRange(range);  
            getSelection().removeAllRanges();
            getSelection().addRange(range);
            */
            return false;
        }
    })


});

//导出脚步
function downloadScript(){

    var lineArray = new Array();
    lineArray = $('#editor').html().toString().split("</code>");
    
    var codeStr = "";
    for (var i=0;i<lineArray.length; i++)    
    {    
        codeStr += lineArray[i].trim()+"\n";  //去除HTML tag
    }    
    codeStr = codeStr.replace(/<\/?[^>]*span>/g,'').replace(/<span\/?[^>]*>/g,'').replace(/<pre\/?[^>]*>/g,'').replace(/<code\/?[^>]*>/g,'').replace(/<\/?[^>]*pre>/g,'').trim();
    
    while(codeStr.indexOf("<img id=\"")!=-1){
        var imgId = "\""+codeStr.substring(codeStr.indexOf("<img id=\"")+9,codeStr.indexOf("\" src="))+".png\"";
        codeStr = codeStr.replace(/<img\/?[^>]*>/g,imgId)
    }
    codeStr = codeStr.replace(/<\/?[^>]*>/g,'');
    alert(codeStr);
    $('#opInfo').text(codeStr);
    
}
function highlight(){

    pasteHtmlAtCaret("<span id='index' style='display:none;'/>", false);
    $('#editor').find("code.hljs").removeClass("hljs");
    /*
    $('#editor').find("span.hljs-function").removeClass("hljs-function");
    $('#editor').find("span.hljs-keyword").removeClass("hljs-keyword");
    $('#editor').find("span.hljs-title").removeClass("hljs-title");
    */
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
   
    var div = document.getElementById("index");  
    //var len = div.children.length;
    var range = document.createRange();  
    range.setStart(div,0);  
    range.setEnd(div,0);  
    getSelection().addRange(range);  
    getSelection().removeAllRanges();
    getSelection().addRange(range);
    $('#index').remove();
    
    
/*
    range.setStart(startE,endOF);
    range.setEnd(endE,endOF);
    range.collapse(true);
    //sel.removeAllRanges();
    sel.addRange(range);
 */
    //range.setEnd(endE,endO);
    
/*
    var range = document.createRange();
    range.selectNodeContents(document.getElementById('editor'));
    range.setEnd(node, offset);
    sel.addRange(range);
    console.log(offset);
  */

    
    //pasteHtmlAtCaret($('#editor').html(), false);
                
       
    
}
function previewImage(file)
{
    var img_id = GenerateGuid();
    /*
    $ins_img =  $("<img id=" + img_id +" src='#' style='position: relative;'/>").css({
            float: 'auto',
            position: 'relative',
            overflow: 'hidden',
        });
    //alert($ins_img);
    
    $('#editor').append($ins_img);
    //把插入图片加入编辑框
    */
    document.getElementById('editor').focus();
    pasteHtmlAtCaret("<img id=" + img_id +" src='#' style='position: relative;float: 'auto';position: 'relative';overflow: 'hidden','/>", false);
    var $viewImg  = $('#'+img_id);
    if (file["files"] && file["files"][0])
    {
        var reader = new FileReader();
        reader.onload = function(evt){
            var MAX_HEIGHT = 50;
            var img=new Image();
            img.src=evt.target.result;
            if(img.height>MAX_HEIGHT){
                img.width *= MAX_HEIGHT / img.height; 
                img.height = MAX_HEIGHT; 
            }
            var width=img.width;
            var height=img.height;

            $viewImg.css({
                width:width,
                height:height
            });
            $viewImg.attr({src : evt.target.result});

        }
        reader.readAsDataURL(file.files[0]);
    }
    else
    {
  
        var ieImageDom = document.createElement("div");
        $(ieImageDom).css({
            float: 'left',
            position: 'relative',
            overflow: 'hidden',
            width: '100px',
            height: '100px'
        }).attr({"id":img_id});
       
        viewImg.parent().append(ieImageDom);
        viewImg.remove();
        file.select();
        path = document.selection.createRange().text;
        $(ieImageDom).css({"filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true',sizingMethod='scale',src=\"" + path + "\")"});
    }


}


//生成唯一id
function Guid()

{
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function GenerateGuid()

{
　　return Guid()+Guid()+Guid()+Guid()+Guid()+Guid()+Guid()+Guid();
}



//根据焦点插入html标签 selectPastedContent：true/false
function pasteHtmlAtCaret(html, selectPastedContent) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            //range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // only relatively recently standardized and is not supported in
            // some browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            var firstNode = frag.firstChild;
            range.insertNode(frag);
            
            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                if (selectPastedContent) {
                    range.setStartBefore(firstNode);
                } else {
                    range.collapse(true);
                }
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        // IE < 9
        var originalRange = sel.createRange();
        originalRange.collapse(true);
        sel.createRange().pasteHTML(html);
        if (selectPastedContent) {
            range = sel.createRange();
            range.setEndPoint("StartToStart", originalRange);
            range.select();
        }
    }
}

function getBodyTextOffset(node, offset) {
    var sel = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(document.getElementById('editor'));
    range.setEnd(node, offset);
    sel.removeAllRanges();
    sel.addRange(range);
    return sel.toString().length;
}

function getSelectionOffsets() {
    var sel, range;
    var start = 0, end = 0;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(sel.rangeCount - 1);
            start = getBodyTextOffset(range.startContainer, range.startOffset);
            end = getBodyTextOffset(range.endContainer, range.endOffset);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection) {
        // IE stuff here
    }
    return {
        start: start,
        end: end
    };
}

function stopBubble(e) { 
    //如果提供了事件对象，则这是一个非IE浏览器 
    if ( e && e.stopPropagation ) 
        //因此它支持W3C的stopPropagation()方法 
        e.stopPropagation(); 
    else
        //否则，我们需要使用IE的方式来取消事件冒泡 
        window.event.cancelBubble = true; 
}