enchant();
enchant.ENV.USE_TOUCH_TO_START_SCENE=false;

console.clear();

//ランダムな数値生成
var randint=function(min,max){
    return window.Math.floor(Math.random()*(max-min+1))+min;
};

var KIDS="./images/kids_chuunibyou_boy.png";
var KOTO="./images/seiza_koto.png";
var WASHI="./images/seiza_washi.png";
var HAKUCHOU="./images/seiza_hakuchou.png";
var SEIZA1="./images/seiza01_ohitsuji.png";
var SEIZA2="./images/seiza02_oushi.png";
var SEIZA3="./images/seiza03_futago.png";
var SEIZA4="./images/seiza04_kani.png";
var SEIZA5="./images/seiza05_shishi.png";

var seizaImages=[KOTO,HAKUCHOU,WASHI,SEIZA1,SEIZA2,SEIZA3,SEIZA4,SEIZA5];

window.onload=function(){
    var game=new Core(320,320);
    game.fps=20;

    game.preload(KIDS);
    game.preload(KOTO);
    game.preload(WASHI);
    game.preload(HAKUCHOU);
    game.preload(SEIZA1);
    game.preload(SEIZA2);
    game.preload(SEIZA3);
    game.preload(SEIZA4);
    game.preload(SEIZA5);

    game.onload=function(){
        //ルートシーン
        var scene=game.rootScene;
        scene.backgroundColor="black";  //背景色

        //空のエンティティクラス
        var EmptyEntity=Class.create(Entity,{
            initialize:function(X,Y,width,height){
                Entity.call(this);
                this.moveTo(X,Y);
                this.width=width;
                this.height=height;
            },
            coloring:function(color,opacity){
                this.backgroundColor=color;
                this.opacity=opacity;
            }
        });

        //ウィンドウクラス
        var Window=Class.create(Group,{
            initialize:function(X,Y,width,height){
                Group.call(this);
                this.entity=new EmptyEntity(X,Y,width,height);
                this.entity.coloring("white",1);
                this.addChild(this.entity);
                this.entity2=new EmptyEntity(X+2,Y+2,width-4,height-4);
                this.entity2.coloring("black",1);
                this.addChild(this.entity2);
            },
            coloringFront:function(color,opacity){
                this.entity2.coloring(color,opacity);
            },
            coloringBack:function(color,opacity){
            	this.entity.coloring(color,opacity);
            }
        });

        //ゲームラベルクラス
        var GameLabel=Class.create(Label,{
            initialize:function(text,X,Y,px,color){
                Label.call(this,text);
                this.moveTo(X,Y);
                this.font=px+"px 'ＭＳ ゴシック','Consolas','Monaco'";
                this.color=color;
            }
        });

        //ゲームスプライトクラス
        var GameSprite=Class.create(Sprite,{
            initialize:function(X,Y,width,height,image){
                Sprite.call(this,width,height);
                this.image=game.assets[image];
                this.moveTo(X,Y);
            }
        });

        //点滅ラベルクラス
        var FlashingLabel=Class.create(GameLabel,{
          initialize:function(text,positionX,positionY,size,color){
            GameLabel.call(this,text,positionX,positionY,size,color);
            this.opacity=0.95;
            this.speed=-0.03;
          },
          onenterframe:function(){
            this.opacity+=this.speed;
            if(this.opacity<=0.25||this.opacity>=0.95){
              this.speed*=-1;
            }
          }
        });

        //星座
        var Seiza=Class.create(Group,{
          initialize:function(){
            Group.call(this);
            that=this;
            this.ids=[0,1,2];
            this.summonNum=0;

            this.sky=new EmptyEntity(0,0,320,220);
            this.sky.coloring("black",1);
            this.addChild(this.sky);

            this.image1=new GameSprite(160-32,10,64,64,seizaImages[0]);
            this.addChild(this.image1);
            this.image2=new GameSprite(160-32-80,120,64,64,seizaImages[1]);
            this.addChild(this.image2);
            this.image3=new GameSprite(160-32+80,120,64,64,seizaImages[2]);
            this.addChild(this.image3);

            this.resultLabel=new GameLabel("",110,95,24,"black");
            this.addChild(this.resultLabel);

            this.buttonWindow=new Window(230,240,80,50);
            this.addChild(this.buttonWindow);
            this.buttonLabel=new GameLabel("サモン！",239,256,16,"white");
            this.addChild(this.buttonLabel);
            this.buttonEntity=new EmptyEntity(230,240,80,50);
            this.addChild(this.buttonEntity);
            this.buttonEntity.ontouchstart=function(){
              if(that.waitTime<0){return;}
              that.checkImages();
            };

            this.changeImage();
          },
          setImage:function(){
            this.image1.image=game.assets[seizaImages[this.ids[0]]];
            this.image2.image=game.assets[seizaImages[this.ids[1]]];
            this.image3.image=game.assets[seizaImages[this.ids[2]]];
          },
          changeImage:function(){
            var r=randint(0,99);
            if(r<3){
              this.ids=[0,1,2];
            }
            else if(r<6){
              this.ids=[1,2,0];
            }
            else if(r<9){
              this.ids=[2,0,1];
            }
            else{
              var r2=randint(0,99);
              if(r2<30){
                this.ids[0]=randint(0,2);
              }
              else{
                this.ids[0]=randint(0,seizaImages.length-1);
              }

              var r3=randint(0,99);
              if(r3<30){
                this.ids[1]=randint(0,2);
              }
              else{
                this.ids[1]=randint(0,seizaImages.length-1);
              }

              var r4=randint(0,99);
              if(r4<30){
                this.ids[2]=randint(0,2);
              }
              else{
                this.ids[2]=randint(0,seizaImages.length-1);
              }
            }
            this.setImage();
            this.waitTime=1*game.fps-this.summonNum*0.05*game.fps;
          },
          checkImages:function(){
            var scoreValue=this.waitTime; //獲得スコア
            this.waitTime=-1;
            if(this.ids[0]==0&&this.ids[1]==1&&this.ids[2]==2||
              this.ids[0]==1&&this.ids[1]==2&&this.ids[2]==0||
              this.ids[0]==2&&this.ids[1]==0&&this.ids[2]==1
            ){
              //召喚成功
              this.sky.coloring("blue",1);
              this.resultLabel.text="召喚成功";
              this.summonNum++;
              this.tl.delay(0.7*game.fps).then(()=>{
                this.sky.coloring("black",1);
                this.resultLabel.text="";
                this.waitTime=1;

              });
              score.addValue(scoreValue);
            }
            else{
              //召喚失敗
              this.sky.coloring("red",1);
              this.resultLabel.text="召喚失敗";
              this.tl.delay(0.7*game.fps).then(()=>{
                this.sky.coloring("black",1);
                this.resultLabel.text="";
                this.waitTime=1;
              });
            }
          },
          endGame:function(){
            this.waitTime=-1;
            this.removeChild(this.image1);
            this.removeChild(this.image2);
            this.removeChild(this.image3);
            this.buttonLabel.text="終了！";
            this.removeChild(this.buttonEntity);
          },
          onenterframe:function(){
            if(this.waitTime<0){return;}
            this.waitTime--;
            if(this.waitTime===0){
              this.changeImage();
            }
          }
        });

        //スコア
        var Score=Class.create(Group,{
          initialize:function(){
            Group.call(this);
            this.value=0;
            this.label=new GameLabel("Score:0",5,250,16,"black");
            this.addChild(this.label);
          },
          addValue:function(value){
            this.value+=value;
            this.label.text="Score:"+this.value;
          }
        });

        //タイマー
        var Timer=Class.create(Group,{
          initialize:function(){
            Group.call(this);
            this.value=90*game.fps;
            this.label=new GameLabel("Time:"+Math.floor(this.value/game.fps),5,270,16,"black");
            this.addChild(this.label);
          },
          onenterframe:function(){
            if(this.value<=0){return;}
            this.value--;
            this.label.text="Time:"+Math.floor(this.value/game.fps);

            if(this.value<=0){
              seiza.endGame();
            }
          }
        });

        var ground=new EmptyEntity(0,220,320,100);
        ground.coloring("green",1);
        scene.addChild(ground);
        var seiza=new Seiza();
        scene.addChild(seiza);
        var kid=new GameSprite(160-64,320-128,128,128,KIDS);
        scene.addChild(kid);
        var score=new Score();
        scene.addChild(score);
        scene.addChild(new Timer());
        var serif1=new GameLabel("デネブ...",70,230,12,"black");
        scene.addChild(serif1);
        var serif1=new GameLabel("アルタイル...",200,295,12,"black");
        scene.addChild(serif1);
        var serif1=new GameLabel("ベガ...",80,305,12,"black");
        scene.addChild(serif1);
    };
    game.start();
};
