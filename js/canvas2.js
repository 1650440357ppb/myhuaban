function shape(canvas,copy,cobj,xp){
    this.canvas=canvas;
    this.copy=copy;
    this.cobj=cobj;
    // this.selectarea=selectarea;
    this.xp=xp;
    this.width=canvas.offsetWidth;
    this.height=canvas.offsetHeight;
    this.type="line";
    this.style="stroke";
    // this.strokeStyle="#000";
    // this.fillStyle="#000";
    this.border="#000";
    this.fill="#000";
    this.lineW=1;
    this.historys=[];
    this.bianNum=5;
    this.jiaoNum=5;
    this.isback=true;
    this.eraserSize=16;
    this.isshow=true;



}
shape.prototype={
    init:function(){
        this.cobj.strokeStyle=this.border;
        this.cobj.fillStyle=this.fill;
        this.cobj.lineWidth=this.lineW;
        // this.cobj.strokeStyle=this.strokeStyle;
        // this.cobj.fillStyle=this.fillStyle;
        // this.cobj.lineWidth=this.lineWidth;
    },
    draw:function(){
        var that=this;
        this.copy.onmousedown=function(e){
            var startx=e.offsetX;
            var starty=e.offsetY;
            that.copy.onmousemove=function(e){
                that.init();
                var movex=e.offsetX;
                var movey=e.offsetY;
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.historys.length>0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);
                }

                that[that.type](startx,starty,movex,movey);

            }
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));


            }

        }
    },
    line:function(x,y,x1,y1){
        this.cobj.beginPath();
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();
    },
    rect:function(x,y,x1,y1){
        this.cobj.beginPath();
        this.cobj.rect(x,y,x1-x,y1-y);
        this.cobj[this.style]();

    },
    arc:function(x,y,x1,y1){
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.arc(x,y,r,0,2*Math.PI);
        this.cobj[this.style]();
    },
    bian:function(x,y,x1,y1){
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var angle=360/this.bianNum*Math.PI/180;
        for(var i=0;i<this.bianNum;i++){
            this.cobj.lineTo(Math.cos(angle*i)*r+x,Math.sin(angle*i)*r+y);
        }
        this.cobj.closePath();
        this.cobj[this.style]();
    },
    jiao:function(x,y,x1,y1){
        angle=360/(this.jiaoNum*2)*Math.PI/180;
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1=r/3;
        for(var i=0;i<this.jiaoNum*2;i++){
            if(i%2==0){
                this.cobj.lineTo(Math.cos(angle*i)*r+x,Math.sin(angle*i)*r+y);
            }else{
                this.cobj.lineTo(Math.cos(angle*i)*r1+x,Math.sin(angle*i)*r1+y);
            }
        }
        this.cobj.closePath();
        this.cobj[this.style]();

    },
    pen:function(){
        var  that=this;
        this.copy.onmousedown=function(e){
            var startx=e.offsetX;
            var starty=e.offfsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function(e){
                that.init();
                var endx=e.offsetX;
                var endy=e.offsetY;
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.historys.length>0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);
                }
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();

            };
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
            }
        }
    },
    eraser:function(){
        var that=this;
        that.copy.onmousemove=function(e){
            if(!that.isshow){
                return;
            }
            var movex= e.offsetX;
            var movey= e.offsetY;
            var left=movex-that.eraserSize/2;
            var top=movey-that.eraserSize/2;
            if(left<0){
                left=0;
            }
            if(left>that.width-that.eraserSize){
                left=that.width-that.eraserSize;
            }
            if(top<0){
                top=0;
            }
            if(top>that.height-that.eraserSize){
                top=that.height-that.eraserSize;
            }
            that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.eraserSize+"px;height:"+that.eraserSize+"px";
        }

        that.copy.onmousedown=function(){

            that.copy.onmousemove=function(e){
                // that.isback=true;
                var movex= e.offsetX;
                var movey= e.offsetY;
                var left=movex-that.eraserSize/2;
                var top=movey-that.eraserSize/2;
                if(left<0){
                    left=0;
                }
                if(left>that.width-that.eraserSize){
                    left=that.width-that.eraserSize;
                }
                if(top<0){
                    top=0;
                }
                if(top>that.height-that.eraserSize){
                    top=that.height-that.eraserSize;
                }
                that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.eraserSize+"px;height:"+that.eraserSize+"px";
                that.cobj.clearRect(left,top,that.eraserSize,that.eraserSize);
            }

            that.copy.onmouseup=function(){
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                // that.clear();
            }
        }
    },
    // clear:function(){
    //     var that=this;
    //
    //     that.copy.onmousemove=function(e){
    //         // if(!that.isshowxp){
    //         //     return false;
    //         // }
    //         var movex=e.offsetX;
    //         var movey=e.offsetY;
    //         var lefts=movex-that.xpsize/2;
    //         var tops=movey-that.xpsize/2;
    //         if(lefts<0){
    //             lefts=0;
    //         }
    //         if(lefts>that.width-that.xpsize){
    //             lefts=that.width-that.xpsize;
    //         }
    //         if(tops<0){
    //             tops=0;
    //         }
    //         if(tops>that.height-that.xpsize){
    //             tops=that.height-that.xpsize;
    //         }
    //
    //         that.xp.style.cssText="display:block;left:"+lefts+"px;top:"+tops+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px";
    //
    //
    //     };
    //     that.copy.onmousedown=function(){
    //         that.copy.onmousemove=function(){
    //             var movex=e.offsetX;
    //             var movey=e.offsetY;
    //             var left=movex-that.xpsize/2;
    //             var top=movey-that.xpsize/2;
    //             if(left<0){
    //                 left=0;
    //             }
    //             if(left>that.width-that.xpsize){
    //                 left=that.width-that.xpsize;
    //             }
    //             if(top<0){
    //                 top=0;
    //             }
    //             if(top>that.height-that.xpsize){
    //                 top=that.height-that.xpsize;
    //             }
    //
    //             that.xp.style.cssText="display:block;left:"+left+"px;top:"+top+"px;width:"+that.xpsize+"px;height:"+that.xpsize+"px";
    //             that.cobj.clearRect(left,top,that.xpsize,that.xpsize);
    //
    //         }
    //         that.copy.onmouseup=function(){
    //             that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
    //             that.copy.onmousemove=null;
    //             that.copy.onmouseup=null;
    //             that.clear();
    //             // xpObj[0].onmouseup=null;
    //             // xpObj.onmousemove=null;
    //         }
    //     }
    //
    //
    // },
    //剪切
    select:function(selectareaobj){
        var that=this;
        that.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            var minx,miny,w,h;
            that.init();
            that.copy.onmousemove=function(e){
                var endx= e.offsetX;
                var endy= e.offsetY;
                minx=startx>endx?endx:startx;
                miny=starty>endy?endy:starty;
                w=Math.abs(startx-endx);
                h=Math.abs(starty-endy);
                selectareaobj.css({
                    left:minx,
                    top:miny,
                    width:w,
                    height:h,
                    display:"block"
                })
            }
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.temp=that.cobj.getImageData(minx,miny,w,h);
                that.cobj.clearRect(minx,miny,w,h);
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.cobj.putImageData(that.temp,minx,miny);
                that.drag(minx,miny,w,h,selectareaobj);
            }
        }
    },
    //拖拽
    drag:function(x,y,w,h,selectareaobj){
        var that=this;
        that.copy.onmousemove=function(e){
            selectareaobj.css("cursor","move");
        }
        that.copy.onmousedown=function(e){
            var ax= selectareaobj.position().left;
            var ay= selectareaobj.position().top;
            var ox= e.clientX;
            var oy= e.clientY;
            that.copy.onmousemove=function(e){
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.historys.length!=0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);
                }
                var mx= e.clientX;
                var my= e.clientY;
                var lefts=(mx-ox)+ax;
                var tops=(my-oy)+ay;
                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.width-w){
                    lefts=that.height-w;
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.height-h){
                    tops=that.height-h;
                }
                selectareaobj.css({
                    left:lefts,
                    top:tops
                })
                x=lefts;
                y=tops;
                that.cobj.putImageData(that.temp,lefts,tops);
                that.selectarea.style.border="1px dotted #000";
            }
            that.copy.onmouseup=function(){
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;
                that.drag(x,y,w,h,selectareaobj);
                that.selectarea.style.border="none";
            }
        }
    }

}