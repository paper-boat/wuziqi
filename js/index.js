$(function(){
  var canvasS = 600;
  var row = 15;
  var blockS = canvasS/row;
  var ctx = $('#canvas').get(0).getContext('2d');
  var starRadius = 3;
  $('#canvas').get(0).width = canvasS;
  $('#canvas').get(0).height = canvasS;

  var draw =function(){
    var jiange = blockS/2+0.5;
    var lineWidth = canvasS-blockS;

    // 画列
    ctx.save();
    ctx.beginPath();
    ctx.translate(jiange,jiange);
    ctx.strokeStyle = "#734202";
    for(var i = 0; i<row;i++ ){
      ctx.moveTo(0,0);
      ctx.lineTo(lineWidth,0)
      ctx.translate(0,blockS);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    // 画行
    ctx.save();
    ctx.beginPath();
    ctx.translate(jiange,jiange);
    ctx.strokeStyle = "#754301";
    for(var i = 0; i<row;i++ ){
      ctx.moveTo(0,0);
      ctx.lineTo(0,lineWidth);
      ctx.translate(blockS,0);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    // 画四个点
    var points = [3.5*blockS+0.5,11.5*blockS+0.5];
    for (var i = 0; i <2; i++) {
      for (var j = 0; j < 2; j++) {
        var x = points[i];
        var y = points[j]
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = '#3E0202';
        ctx.translate(x,y);
        ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
        ctx.fill();
        // ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
    }
    // 画中心点
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = '#4E0202';
    ctx.translate(7.5*blockS+0.5,7.5*blockS+0.5 );
    ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
    ctx.fill();
    // ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
  draw();

  var qiziRadius = blockS/2*0.8;

  // {x:1,y:1,color:1}
  var drop = function(qizi){
    // qizi.x
    // qizi.y
    // qizi.color

    // 旗子的样式及落棋的音乐
    ctx.save();
    ctx.beginPath();
    ctx.translate((qizi.x+0.5)*blockS+0.5,(qizi.y+0.5)*blockS+0.5);
    ctx.arc(0,0,qiziRadius,0,(Math.PI/180)*360);
    if ( qizi.color === 1 ) {    //黑棋
      var rd = ctx.createRadialGradient(-2,-6,2,0,0,15);
      rd.addColorStop(0.1,'#6c6c6c');
      rd.addColorStop(1,'#010101');
      ctx.fillStyle = rd;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 3;
      ctx.shadowColor = 'rgba(47,47,47,.85)';
      $('#black_play').get(0).play();
    } else {                    //白棋
      var rd = ctx.createRadialGradient(0,-5,2,0,0,15);
      rd.addColorStop(0.1,'#FFF');
      rd.addColorStop(0.35,'#F1F1F1');
      rd.addColorStop(0.5,'#E9E5E5');
      rd.addColorStop(0.7,'#E0DBE0');
      rd.addColorStop(1,'#C6C3C3');
      ctx.fillStyle = rd;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 3;
      ctx.shadowColor = 'rgba(47,47,47,0.74)';
      $('#white_play').get(0).play();
    }
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  var flag = true;
  var step = 1;
  var qiziAll = {};

  var panduan = function(qizi){
    var shuju = {};
    $.each(qiziAll,function(k,v){
      if( v.color === qizi.color ){
        shuju[k] = v;
      }
    })
    var lie = 1,hang = 1,zuoxie = 1,youxie = 1;
    var  tx,ty;   //游标

    //列
    tx = qizi.x;ty = qizi.y;
    while(shuju[ tx+ '-' +(ty+1) ]){
      lie ++;ty++;
    }
    tx = qizi.x;ty = qizi.y;
    while(shuju[ tx+ '-' +(ty-1) ]){
      lie ++;ty--;
    }

    // 水平
    tx = qizi.x;ty = qizi.y;
    while( shuju[(tx+1)+'-'+ty]){
      hang++;tx++;
    }
    tx = qizi.x;ty = qizi.y;
    while( shuju[(tx-1)+'-'+ty]){
      hang++;tx--;
    }

    // 左斜
    tx = qizi.x;ty = qizi.y;
    while( shuju[(tx-1)+'-'+(ty-1)]){
      zuoxie++;tx--;ty--;
    }
    tx = qizi.x;ty = qizi.y;
    while( shuju[(tx+1)+'-'+(ty+1)]){
      zuoxie++;tx++;ty++;
    }

    //右斜
    tx = qizi.x;ty = qizi.y;
    while( shuju[(tx+1)+'-'+(ty-1)]){
      youxie++;tx++;ty--;
    }
    tx = qizi.x;ty = qizi.y;
    while( shuju[(tx-1)+'-'+(ty+1)]){
      youxie++;tx--;ty++;
    }

    if( lie>=5 || hang>=5 || zuoxie>=5 || youxie>=5 ){
      return true;
    }
  }

  $('#canvas').on('click',function(e){
    var x = Math.floor(e.offsetX/blockS);
    var y = Math.floor(e.offsetY/blockS);
    // 处理落棋重复
    if(qiziAll[x+'-'+y]){
      return;
    }
    // 落棋
    var qizi;
    if( flag ){
      qizi = {x:x,y:y,color:1,step:step};
      drop(qizi);
      if( panduan(qizi) ){
        $('.cartel').show().find('#tishi').text('黑棋赢');
      }
      // flag = false;
    }else{
      qizi = {x:x,y:y,color:0,step:step};
      drop(qizi);
      if ( panduan(qizi) ){
        $('.cartel').show().find('#tishi').text('白棋赢');
      }
      // flag = true;
    }
    step += 1;
    flag = !flag;
    qiziAll[x+ '-' +y] = qizi;
  })

  $("#restart").on('click',function(){
    $('.cartel').hide();
    ctx.clearRect(0,0,600,600);
    draw();
    kaiguan = true;
    qiziAll = {};
    step = 1;
  })

  $('#qipu').on('click',function(){
    $('.cartel').hide();
    $('#save').show();
    ctx.save();
    ctx.font = "20px consolas";
    for( var i in qiziAll){
      if( qiziAll[i].color === 1){
          ctx.fillStyle = '#fff';
      }else{
        ctx.fillStyle = 'black';
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillText(qiziAll[i].step,
        (qiziAll[i].x+0.5)*blockS,
        (qiziAll[i].y+0.5)*blockS);
    }
    ctx.restore();
    var image = $('#canvas').get(0).toDataURL('image/jpg',1);
    $('#save').attr('href',image);
    $('#save').attr('download','qipu.png');
  })

  $('.tips').on('click',false);
  $('#close').on('click',function(){
    $('.cartel').hide();
  })
  $('.cartel').on('click',function(){
    $(this).hide();
  })



})
