


//temp
function compareTime(a,b) {
  if (a.getTime() < b.getTime()){
     return -1;
  }
  if (a.getTime() > b.getTime()){ 
     return 1;
  }
  return 0;
}




function Scene(id_p) {
    
    //scene atributes
    var id = id_p;
    
    //
    var totalTime;

   //scenesync timer
    var clock = new Clock();
    
    //lista de syncs
    var syncList = new Array();
    //lista de selects
    var selectList = new Array(); 
    //lista de midias
    var mediaList = new Array();
    //lista de cenas

    
    
    //gets
    this.GetID = function () {
        return id;
    };
    this.Start = function(){
        clock.Start();
    };
    this.Stop = function(){
        clock.Stop();
    };
    this.AddMedia = function (media_p){
        mediaList.push(media_p);
    };
    this.GetCounterMedia = function(){
        return mediaList.length;
    };
    this.GetCurrentTime = function(){
        return clock.GetCurrentTime();
    };
    this.Click = function (posX, posY){

        for(slIndex=0;slIndex<selectList.length;slIndex++){
              selectList[slIndex].Execute( clock.GetCurrentTime() );  
        }

        for(mlc=0; mlc < mediaList.length; mlc++){
            mediaList[mlc].Click( posX, posY, clock.GetCurrentTime() );
        }

    };
    this.Load = function (){
        for(i=0; i < mediaList.length; i++){
            mediaList[i].Load();
        } 
        
    };
    this.Unload = function (){
        for(i=0; i < mediaList.length; i++){
            mediaList[i].Unload();
        } 
        
    };
    this.ExecuteAction = function(action_p, target_p, param_p,time_p){
              
       for(ea=0; ea < mediaList.length; ea++){
          if(mediaList[ea].GetID()==target_p){
             
              if(action_p == 'start')mediaList[ea].Start(time_p);
              else if(action_p == 'stop') mediaList[ea].Stop();
              else if(action_p == 'set') mediaList[ea].ApplyProperty(param_p);
              break; 
          }
       } 
       
       
    };
    this.SetTime = function(time_p){

        //reset all medias
        for(l=0; l < mediaList.length; l++){
            mediaList[l].Reset();
        }   
        
         

            for(l=syncList.length-1;l>=0;l--){ 
               if(syncList[l].IsDynamic() ){
                   syncList.splice(l, 1);
               }
            }
            
            for(l=syncList.length-1;l>=0;l--){  //O(N)

                 if(syncList[l].getTime()>=time_p){
                     syncList[l].Reset(); 
                 }
                 else break;
            }

            for(l=0;l<syncList.length;l++){  //O(N)
                 if(syncList[l].getTime()<=time_p){
                    syncList[l].ExecuteWithSeek(); 
                 }
                 else break;
            }
       
      

       clock.SetCurrentTime(time_p);   
       
       for(l=0; l < mediaList.length; l++){
            mediaList[l].SetCurrentTime(time_p); 
       } 

       for(l=0;l<syncList.length;l++){  //O(N)
             if(syncList[l].IsDynamic() ){     
                if(syncList[l].getTime()<=time_p){
                    syncList[l].ExecuteWithSeek(); 
                 }
                 else break;
             }
      }
      

    };
    this.AddSyncList = function(syncList_p){
        for(l=0;l<syncList_p.length;l++){
           syncList.push(syncList_p[l]);
        }
        syncList.sort(compareTime);
    };
    this.AddSelectList = function(selectList_p){
        selectList = selectList_p;
    };
    this.AddSync = function(sync_p){
        syncList.push(sync_p);
        syncList.sort(compareTime);
    };
    this.Update = function () {
        
        clock.Update();
        var curTime = clock.GetCurrentTime();

        GUISetTimeText(curTime, totalTime);

      //  console.log(curTime);
        for(sl=0;sl<syncList.length;sl++){
            if(syncList[sl].getTime()>curTime)break;
         //  console.log(syncList[sl].getTime()+'  '+sl);  
           if( curTime == syncList[sl].getTime() ){
              syncList[sl].Execute();  
           }
           
        }
        
        
        for(ml=0; ml < mediaList.length; ml++){
            mediaList[ml].Update();
        }

        
    };
    
    this.Draw = function (canvas) {
        for(i=0; i < mediaList.length; i++){
            mediaList[i].Draw(canvas);
        }

    };
    
}
