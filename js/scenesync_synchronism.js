

function Clock(){
    //attr
    var lasTime=0;
    var accTime=0;
    
    var state=0;
    
    this.Start = function(){
        accTime=0;
        lasTime = Date.now(); 
        state=1;
    };
    this.GetState = function(){
        return state;
    };
    this.Reset = function(){
        accTime=0;
        lasTime=0;
        state=0;
    };
    this.Stop = function(){
        state=0;
    };
    this.SetCurrentTime = function(time_p){
        accTime = parseInt(time_p);
    };
    this.GetCurrentTime = function(){
        return parseInt(accTime/100)*100;
    };
    this.Update = function(){
        if(state!=0){
           var curTime = Date.now(); 
           accTime += (curTime - lasTime);  
           lasTime = curTime;
        }
    };
}

function Select(id_p, motion_p){
    
    //attr
    var id = id_p;
    var motion = motion_p;
    
    //action list
    var actionList = new Array();

    this.getID = function () {
        return id;  
    };
    this.getMotion = function () {
       return motion;
    };

    this.AddAction = function(action_p){
        actionList.push(action_p);
    };

    this.Execute = function (relativeTime_p){
        
        for(actionIndex=0;actionIndex < actionList.length; actionIndex++){
            var relTime=0;
            if(relativeTime_p!=null)relTime=parseInt(relativeTime_p);
               actionList[actionIndex].Execute(relTime);
        }
    };

}

function Sync(id_p,time_p,isDynamic_P){
    
    //attr
    var id = id_p;
    var time = parseInt(time_p);
    
    //control
    var isExe=false;
    
    //action list
    var actionList = new Array();

    //if is dinamic
    var isDynamic = isDynamic_P;

    this.getID = function () {
        return id;  
    };
    this.IsDynamic = function(){
        return isDynamic;
    };
    this.getTime = function (){
        return time;   
    };
    
    this.AddAction = function(action_p){
        actionList.push(action_p);
    };
    this.Reset = function(){
        isExe=false;
    };
    this.ExecuteWithSeek = function(relativeTime_p){
        
        var relTime=0;
        if(relativeTime_p!=null)relTime=parseInt(relativeTime_p);

        for(actionIndex=0;actionIndex < actionList.length; actionIndex++){
           //  console.log('vou executar a acao '+actionList[actionIndex].getID());
             if(actionList[actionIndex].getType()!="goto")actionList[actionIndex].Execute(relTime+time);
        }
    }; 
    this.Execute = function (relativeTime_p){
        
       // alert(relativeTime_p);

        if(isExe==false)isExe=true;
        else return null;
        
        for(actionIndex=0;actionIndex < actionList.length; actionIndex++){
            var relTime=0;
            if(relativeTime_p!=null)relTime=parseInt(relativeTime_p);
               actionList[actionIndex].Execute(relTime+time);
        }
    };
    
}

function Start(id_p, target_p, delay_p){
    //attr
    var id = id_p;
    var target = target_p;
    var delay = null;
    

    //values
    if(delay_p!=null)delay = parseInt(delay_p);
    
    this.getID = function () {
      return id;  
    };
    this.getType = function (){
     return "start";
    };
    this.Execute = function (time_p){
        if(delay==null || delay==0){
           SS_CORE.ExecuteAction('start',target, 'null', time_p); 
        } 
        else{  
           var sync = new Sync('sync_start_'+id,parseInt(time_p)+delay,true);
           sync.AddAction(new Start('act_start_'+id,target));
           SS_CORE.AddActionInCurrentContext(sync);
        }  
    };
    
    this.getTarget = function (){
      return target;   
    };
}

function Stop(id_p, target_p, delay_p){
    //attr
    var id = id_p;
    var target = target_p;
    var delay = null;
    
    //values
    if(delay_p!=null)delay = parseInt(delay_p);
    
    this.getID = function () {
      return id;  
    };
    this.getType = function (){
      return "stop";
    };  
    this.Execute = function (time_p){
        if(delay==null || delay==0){
          
           SS_CORE.ExecuteAction('stop',target, 'null', time_p);
        }
        else{
            
           var sync = new Sync('sync_stop_'+id, parseInt(time_p)+delay, true);
           sync.AddAction(new Stop('act_stop_'+id,target));
           SS_CORE.AddActionInCurrentContext(sync);
        } 
    };
    
    this.getTarget = function (){
      return target;   
    };
}

function Property(id_p, name_p, value_p){
    //attr
    var id = id_p;
    var name = name_p;
    var value = value_p;
    
    this.GetID = function () {
      return id;  
    };
    
    this.GetName = function () {
      return name;  
    };
    
    this.GetValue = function () {
      return value;  
    };
}


function Set(id_p, target_p, delay_p){
    //attr
    var id = id_p;
    var target = target_p;
    var delay = null;
    var property = new Array();
    
    //values
    if(delay_p!=null)delay = parseInt(delay_p);
    
    this.GetID = function () {
         return id;  
    };
    this.getType = function (){
      return "set";
    };  
    this.AddProperty = function (property_p){
        property.push(property_p);
    };
    this.AddPropertyList = function (property_p){
        property = property_p; 
    };
    this.GetProperties = function (){
        return property;
    };
    this.Execute = function (time_p){
        if(delay==null || delay==0){
          
           SS_CORE.ExecuteAction('set',target, property, time_p);
        }
        else{
            
           var sync = new Sync('sync_set_'+id, parseInt(time_p)+delay, true);
           var set = new Set('act_set_'+id,target);
           set.AddPropertyList(property);
           sync.AddAction(set);
           SS_CORE.AddActionInCurrentContext(sync); 
        } 
    };
    
    this.getTarget = function (){
      return target;   
    };
}

function Goto(id_p, target_p, timeevent_p , delay_p){
    //attr
    var id = id_p;
    var target = target_p;
    var timeevent = timeevent_p;
    var delay = null;
     
    // console.log(id+' '+target+' '+timeevent+' '+delay);

    //values
    if(delay_p!=null)delay = parseInt(delay_p);
    
    this.getID = function () {
      return id;  
    };
    this.getType = function (){
      return "goto";
    }; 
    this.Execute = function (time_p){
        if(delay==null || delay==0){
           SS_CORE.ExecuteAction('goto',target, timeevent);
        }
        else{
           var sync = new Sync('sync_goto_'+id, parseInt(time_p)+delay, true);
           sync.AddAction(new Goto('act_goto_'+id,target,timeevent));
           SS_CORE.AddActionInCurrentContext(sync); 
        } 
    };
    
    this.getTarget = function (){
      return target;   
    };
}