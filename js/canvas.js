function shape(canvas,copy,cobj){
    //给shape添加属性；此处this指的是shape
    this.canvas=canvas;//将传过来canvas添加到shape的canvas上
    this.copy=copy;
    this.cobj=cobj;//将传过来的二级对象cobj添加到shape的canvas上
    this.width=this.canvas.width;//将画布的宽保存到shape的cobj身上
    this.height=this.canvas.height;//将画布的高保存到shape的cobj身上
    this.type="line";//设置默认属性为划线；
    this.style="stroke";//设置，默认为划线
    this.borders="#000";//设置默认边的背景色为黑色。
    this.fill="#000";//设置默认填充的背景色为黑色
    this.linew=1;//设置默认线的宽度为1像素
    this.historys=[];//为了保存已画完的图形而建立的数组，数组的名字可以随意的进行设定
    this.bianNum=5;//设置默认的多边形的边数为五边形
    this.jiaoNum=5;
    this.isback=true;
    this.xpsize=10;
    this.isxp=true;
}
shape.prototype={//给shape添加原型函数
    init:function(){//init初始化函数给它一个默认值方便在外面调用
        this.cobj.lineWidth=this.linew;
        this.cobj.strokeStyle=this.borders;
        this.cobj.fillStyle=this.fill;
    },
    draw:function(){//画的函数，在画图的时候直接调用就好
        var that=this;//将this这个对象用that保存，this指的是外面的实例化对象
        this.copy.onmousedown=function(e){
            //开始画的位置
            e.preventDefault();
            var startx= e.offsetX;
            var starty= e.offsetY;

            that.copy.onmousemove=function(e){
                e.preventDefault();
                that.isback=true;
                that.init();//开始画图调用初始化函数
                //结束画的位置
                var endx= e.offsetX;
                var endy= e.offsetY;
                //清空画布
                that.cobj.clearRect(0,0,that.width,that.height);
                //如果history数组里有画的线条和图案则被保存下来
                if(that.historys.length>0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);//将画布区域的数据全部放在新的位置
                }
                that.cobj.beginPath();//确定是一个独立的图形，就要重新开始一个路径
                that[that.type](startx,starty,endx,endy);//线条的位置
            }
            that.copy.onmouseup=function(){
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height))//获取画布区域所有的数据
                that.copy.onmouseup=null;//把自己也要清空，不进行相关的操作
                that.copy.onmousemove=null;//鼠标抬起后停止作画
            }

        }
    },
    line:function(x,y,x1,y1){//划线
        var that=this;
        that.cobj.beginPath();
        that.cobj.moveTo(x,y);
        that.cobj.lineTo(x1,y1);
        that.cobj.stroke();
    },
    rect:function(x,y,x1,y1){//画矩形
        var that=this;
        that.cobj.beginPath();
        that.cobj.rect(x,y,x1-x,y1-y);
        that.cobj[that.style]();
    },
    arc:function(x,y,x1,y1){
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.arc(x,y,r,0,2*Math.PI);
        this.cobj[this.style]();
    },
    bian:function(x,y,x1,y1){
        this.cobj.beginPath();
        var angle=360/this.bianNum*Math.PI/180;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        for(var i=0;i<this.bianNum;i++){
            this.cobj.lineTo((x+r*Math.cos(angle*i)),(y+r*Math.sin(angle*i)));
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    jiao:function(x,y,x1,y1){
        this.cobj.beginPath();
        var angle=360/(this.jiaoNum*2)*Math.PI/180;
        var r1=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r2=r1/3;
        for(var i=0;i<this.jiaoNum*2;i++){
            if(i%2==0){
                this.cobj.lineTo((x+r1*Math.cos(angle*i)),(y+r1*Math.sin(angle*i)));
            }else{
                this.cobj.lineTo((x+r2*Math.cos(angle*i)),(y+r2*Math.sin(angle*i)));
            }

        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    pen:function(){
        var that=this;
        this.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function(e){
                that.init();
                var endx= e.offsetX;
                var endy= e.offsetY;
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.historys.length>0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);
                }
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();

            }

            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
            }
        }
    },
    eraser:function(xcObj){
        var that=this;
        that.copy.onmousemove=function(e){
            if(that.isxp){
                return false;
            }
            var ox= e.offsetX;
            var oy= e.offsetY;
            var lefts=ox-that.xpsize/2
            var heights=oy-that.xpsize/2
            if(lefts<0){
                lefts=0;
            }
            if(lefts>that.width-that.xpsize){
                lefts=that.width-that.xpsize;
            }


            if(heights<0){
                heights=0;
            }
            if(heights>that.height-that.xpsize){
                heights=that.height-that.xpsize;
            }
            xcObj.css({
                display:"block",
                left:lefts+"px",
                top:heights+"px",
            });
        }
        that.copy.onmousedown=function(e){
            var dx= e.clientX;
            var dy= e.clientY;
            that.copy.onmousemove=function(e){
                that.isback=true;
                var ox= e.offsetX;
                var oy= e.offsetY;
                var lefts=ox-that.xpsize/2
                var heights=oy-that.xpsize/2
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.width-that.xpsize){
                    lefts=that.width-that.xpsize;
                }


                if(heights<0){
                    heights=0;
                }
                if(heights>that.height-that.xpsize){
                    heights=that.height-that.xpsize;
                }
                xcObj.css({
                    display:"block",
                    left:lefts+"px",
                    top:heights+"px",
                });
                that.cobj.clearRect(ox,oy,that.xpsize,that.xpsize);
            }
            that.copy.onmouseup=function(){
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.eraser(xcObj);
            }
        }
        that.copy.onmouseout=function(){
            xcObj.css("display","none");
        }
    },
    fanxiang:function(data,x,y){
        for(var i=0;i<data.width*data.height;i++){
            data.data[i*4+0]=255-data.data[i*4+0];
            data.data[i*4+1]=255-data.data[i*4+1];
            data.data[i*4+2]=255-data.data[i*4+2];
            data.data[i*4+3]=255;
        }
        this.cobj.putImageData(data,x,y);
    },
    masaike:function(dataobj,num,x,y){
        var widths=dataobj.width;
        var heights=dataobj.height;
        var w=widths/num;
        var h=heights/num;
        for(var i=0;i<num;i++){
            for(var j=0;j<num;j++){
                var r=0;
                var g=0;
                var b=0;
                var data=this.cobj.getImageData(j*w,i*h,w,h);
                for(var k=0;k<data.width*data.height;k++){
                    r+=data.data[k*4+0];
                    g+=data.data[k*4+1];
                    b+=data.data[k*4+2];
                }
                var r1=parseInt(r/(data.width*data.height));
                var g1=parseInt(g/(data.width*data.height));
                var b1=parseInt(b/(data.width*data.height));
                for(var m=0;m<data.width*data.height;m++){
                    data.data[m*4+0]=r1;
                    data.data[m*4+1]=g1;
                    data.data[m*4+2]=b1;
                }
                this.cobj.putImageData(data,x+j*w,y+i*h)
            }
        }
    },
    gaosimoh:function(dataobj,num,x,y){
        var arr=[];
        var widths=dataobj.width;
        var heights=dataobj.height;
        var num = num;
        for(var i=0;i< widths;i++){
            for(var j=0;j<heights;j++){

                var x1=j+num>widths?j-num:j;
                var y1=i+num>heights?i-num:i;
                var dataObj=this.cobj.getImageData(x1,y1,num,num);
                var r=0;var g=0;var b=0;
                for(var k=0;k<dataObj.width*dataObj.height;k++){
                    r+=dataObj.data[k*4+0];
                    g+=dataObj.data[k*4+1];
                    b+=dataObj.data[k*4+2];
                }
                r=parseInt(r/(dataObj.width*dataObj.height));
                g=parseInt(g/(dataObj.width*dataObj.height));
                b=parseInt(b/(dataObj.width*dataObj.height));
                arr.push(r,g,b,255);
            }
        }
        for(var i=0;i<dataobj.data.length;i++){
            dataobj.data[i]=arr[i];
        }
        this.cobj.putImageData(dataobj,x,y);

    }

}