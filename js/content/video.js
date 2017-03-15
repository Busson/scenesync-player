


function MVideo(id_p,src_p,left_p,top_p,width_p,height_p,opacity_p){
    
    //media image atributes
    var id = id_p;
    var src = src_p;
    var left = left_p;
    var top = top_p;
    var width = width_p;
    var height = height_p;
    var opacity = opacity_p;
    
    //media image atributes
    var id_o = id_p;
    var src_o = src_p;
    var left_o = left_p;
    var top_o = top_p;
    var width_o = width_p;
    var height_o = height_p;
    var opacity_o = opacity_p;


    //control
    var relativeTime = null;

    //defaults
    if(opacity==null)opacity=1;
   
    //content
    var content = null;
    
    //scenesync timer
    var clock = new Clock();
    
    //lista de syncs
    var syncList = new Array();
    
    //lista de selects
    var selectList = new Array();

    //lista de cenas
    
    //gets
    this.GetID = function () {
        return id;
    };
    this.Reset = function (){

        id = id_o;
        src = src_o;
        left = left_o;
        top = top_o;
        width = width_o;
        height = height_o;
        opacity = opacity_o;

        relativeTime = null;
        //defaults
        if(opacity==null)opacity=1;
        
        clock.Reset();
    };

    this.ApplyProperty = function(property_p){
        for(prl=0; prl < property_p.length; prl++){
            if(property_p[prl].GetName()=="id")id=property_p[prl].GetValue();
            else if(property_p[prl].GetName()=="src")src=property_p[prl].GetValue(); //fazer reload
            else if(property_p[prl].GetName()=="left")left=property_p[prl].GetValue();
            else if(property_p[prl].GetName()=="top")top=property_p[prl].GetValue();
            else if(property_p[prl].GetName()=="width")width=property_p[prl].GetValue();
            else if(property_p[prl].GetName()=="height")height=property_p[prl].GetValue();
            else if(property_p[prl].GetName()=="opacity")opacity=property_p[prl].GetValue();
        }
    }; 
    
    this.Start = function(time_p){
      //  if(clock.GetState()!=0)return null;
        relativeTime = time_p;
        clock.Start();

        content.play();
       
      //  console.log('iniciei a midia: '+id+' no tempo: '+relativeTime);
      //  console.log('iniciei a midia: '+id);
 
    };
    this.Stop = function(){
    //    if(clock.GetState()==0)return null;
        clock.Stop();

        content.stop();
    };
    this.Click = function (posX, posY, scene_time_p){
       
      if(clock.GetState()==0)return null;
            
        if(posX >= (SS_CORE.GetCanvasWidth()*left) && posX <= ((SS_CORE.GetCanvasWidth()*width) + (SS_CORE.GetCanvasWidth()*left) ) ){
           if(posY >= (SS_CORE.GetCanvasHeight()*top) && posY <= ((SS_CORE.GetCanvasHeight()*height) + (SS_CORE.GetCanvasHeight()*top) ) ){
                for(slIndex=0;slIndex<selectList.length;slIndex++){
                   
                  selectList[slIndex].Execute(scene_time_p);  
                }
           
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
    this.SetCurrentTime = function(relativeTime_p){
         
        if(relativeTime == null){
             
             for(msl=0;msl<syncList.length;msl++){  //O(N)
                     syncList[msl].Reset(); 
             }
             return;   
        }

        var currentTime_aux = (relativeTime_p-relativeTime);
        
        for(msl=syncList.length-1;msl>=0;msl--){  //O(N)

                 if(syncList[msl].getTime()>=currentTime_aux){ 
                     syncList[msl].Reset(); 
                 }
                 else break;
        }

        for(msl=0;msl<syncList.length;msl++){  //O(N)
                 if(syncList[msl].getTime()<=currentTime_aux){
                    syncList[msl].ExecuteWithSeek(relativeTime); 
                 }
                 else break;
        }

        clock.SetCurrentTime(currentTime_aux);
    };
    this.Load = function (){

             content = document.createElement("video");
             
             content.onloadeddata = function() {
                 SS_CORE.SignalLoad();
             };
             content.onpause = function() {
        
             };
             content.oncanplay = function() {
    
             };
             content.onstalled = function() {
            
             };
             content.onplaying = function() {
                  
             };
             content.onsuspend = function() {
            
             };
             content.onseeked = function() {
           
             };
             content.onseeking = function() {
            
             };
             content.ontimeupdate = function(){
            
             };
             content.onabort = function() {
             
             };
             content.onwaiting = function() {
                 
             };
             content.onended=function(){
                
             };
             content.addEventListener('progress', function() {
                
             });
             
             var sourceVideo = document.createElement("source"); 
             sourceVideo.type = "video/mp4";
             sourceVideo.src = src;
             content.appendChild(sourceVideo);


    };
    this.Unload = function (){
        content = null;
        delete content;
    }
    
    this.Update = function () {
        if(clock.GetState()==0)return null;
        
        clock.Update();
        var curTime = clock.GetCurrentTime();
      //  console.log(curTime);
        for(i=0;i<syncList.length;i++){
         //  console.log(syncList[i].getTime()+'  '+i); 
           if(syncList[i].getTime()>curTime)break; 
            
           if( curTime == syncList[i].getTime() ){
              syncList[i].Execute(relativeTime);  
           }
           
        }
        
    };
    
    this.Draw = function (canvas) {
        
        if(clock.GetState()==0)return null; 
     //   console.log('media '+id+' '+clock.GetCurrentTime());
     //   console.log('Draw media '+id+' '+left+' '+top+' '+width+' '+height+' '+opacity);
     //   console.log("media: "+id+" Começou em: "+relativeTime);
        canvas.globalAlpha = opacity;       
        canvas.drawImage(content,SS_CORE.GetCanvasWidth()*left,SS_CORE.GetCanvasHeight()*top,SS_CORE.GetCanvasWidth()*width,SS_CORE.GetCanvasHeight()*height);
    };
    
}