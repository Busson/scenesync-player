
SS_DOC = document.createElement('script');
SS_DOC.src = 'js/scenesync_synchronism.js';
document.head.appendChild(SS_DOC);

SS_DOC = document.createElement('script');
SS_DOC.src = 'js/content/scene.js';
document.head.appendChild(SS_DOC);



var textX = 50;
var textY = 50;

function Core(){
    var canvas = null;
    var FPS = 30;
    
    var sceneList = new Array();
    var currentScene = 0;
    var playerStatus = "Parsing file";
    
    var canvasWidth;
    var canvasHeight;
    var aspectRatio;

    //transition
    var transition = new SceneTransition();

    // cont medias to load in scene
    var loadMediasConter = 0;
    
    this.Load = function(){
        loadMediasConter = 0;
        if(sceneList[currentScene].GetCounterMedia()==0){
            SS_CORE.Start();
            transition.Finish();
        }  
        sceneList[currentScene].Load();
        
        //prov
        transition.Load();
    };
    this.SignalLoad = function(){
        loadMediasConter++;
     //   console.log(loadMediasConter+' '+sceneList[currentScene].GetCounterMedia());
        if(loadMediasConter >= sceneList[currentScene].GetCounterMedia()){
           //prov
           transition.Finish();
           SS_CORE.Start();
           //console.log('LOAD ALL');
        }
        
    };
    this.FinishLoadDocument = function(){
        //temp
        playerStatus = "Loading";
        SS_CORE.Load();
    };
    this.SetScreenSize = function(cWidth_p,cHeight_p){
        canvasWidth = cWidth_p;
        canvasHeight = cHeight_p;
    };
    this.GetCanvasWidth = function(){
        return canvasWidth;
    };
    this.ChangeScene = function(target_p){
       for(sl=0; sl < sceneList.length; sl++){
           if(sceneList[sl].GetID()==target_p){
               currentScene = sl;
               break;
           }
       }  
    };
    this.GetCanvasHeight = function(){
        return canvasHeight;
    };
    this.Update = function () {

        if(playerStatus=='Playing') sceneList[currentScene].Update();
        transition.Update();
    };
    this.GetCurrentTime = function(){
        return sceneList[currentScene].GetCurrentTime();
    };
    this.Draw = function () { 
        canvas.clearRect(0,0,720,480); //clear screen
        if(playerStatus=='Playing') sceneList[currentScene].Draw(canvas);
        transition.Draw(canvas);
    };
    this.GetFPS = function(){
        return FPS;
    };
    this.ExecuteAction = function(action_p, target_p, param_p, time_p){
       if(action_p!='goto') sceneList[currentScene].ExecuteAction(action_p, target_p, param_p, time_p);
       else SS_CORE.ChangeSceneAndTime(target_p, param_p);
    };
    this.ChangeSceneAndTime = function(target_p,time_p){
        if(sceneList[currentScene].GetID()== target_p){
            // console.log(" mudando cena::: "+target_p);
             sceneList[currentScene].SetTime(time_p);
        }
        else{
            for(scl=0;scl < sceneList.length; scl++){
                 if(sceneList[scl].GetID()== target_p){
                     sceneList[currentScene].Unload();
                     currentScene=scl;
                     playerStatus = "Loading";
                 //    transition.Start();
                     SS_CORE.Load();
                 }
            }
        }
    };
    this.AddActionInCurrentContext = function(action_p){
        sceneList[currentScene].AddSync(action_p);     
    };
    this.Start = function(){
         sceneList[currentScene].Start();
         playerStatus = "Playing";
    };
    this.Pause = function(){
        // sceneList[currentScene]
         playerStatus = "Paused";
    }; 
    this.AddScene = function(scene_p){
        sceneList.push(scene_p); 
    };
    this.SetCanvas = function(canvas_p){
        canvas = canvas_p;
    };
    this.Click = function(posX,posY){
        sceneList[currentScene].Click(posX,posY);
    };
}


function SceneTransition(){
   
   var hVertice=0;
   var vVertice=0;
   var effect="default";
   var state="NONE";
   var finishTransition=false;

   var loadingIcon = null;   

   //scenesync timer
   var clock;   
   
   this.Start = function(){
       state="START";
       clock = new Clock(); 
       clock.Start();
   };

   this.Finish = function(){
   //    state="FINISH";
       finishTransition=true;
   };

   this.Load = function(){
    //   loadingIcon = new MImage(2,'assets/logo.png',30,30,30,30,1);
    //   loadingIcon.Load();
   };

   this.Update = function () {
       
       if(clock==null)return;

       clock.Update();
    
       if(state=="START" && clock.GetCurrentTime()<=1000){ 
           if(hVertice<SS_CORE.GetCanvasWidth())hVertice+=150;
           else if(vVertice < SS_CORE.GetCanvasHeight()) vVertice+=150;
           else state="LOADING";
       }
       else if(finishTransition==true && clock.GetCurrentTime()>=1500){
           if(vVertice > 0) vVertice-=150;
           else if(hVertice>0)hVertice-=150;
       }
   };

   this.Draw = function (canvas){
     
       canvas.globalAlpha = 1;   
      
       if(effect=="default"){
          canvas.beginPath();canvas.moveTo(0,0);canvas.lineTo(0,480);
          if(hVertice>=SS_CORE.GetCanvasWidth())canvas.lineTo(hVertice,vVertice);
          canvas.lineTo(hVertice,0);canvas.closePath(); canvas.fill();
           
        } 
        
     //   loadingIcon.Draw(canvas);
   };

}


var SS_CORE = new Core();



