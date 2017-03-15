var playElement;
var timeTextElement;
var timeBarElement;
var volumeElement;
var volumeBarElement;

var SS_GUI_CANVAS;
var SS_GUI_TIMETEXT;
var SS_GUI_PLAYBUTTON;

window.addEventListener('resize', function(event){
   LoadInterfaceElements();
});


function LoadInterfaceElements(){
   
     SS_GUI_CANVAS = document.getElementById('myCanvas');
     SS_GUI_CANVAS.height = (window.innerHeight-40);
     SS_GUI_CANVAS.width = (SS_GUI_CANVAS.height*1280)/720;
     
     if( (window.innerHeight / window.innerWidth < 0.6) ){
        SS_GUI_CANVAS.height = (window.innerHeight-40);
        SS_GUI_CANVAS.width = (SS_GUI_CANVAS.height*1280)/720;
     }
     else{
        SS_GUI_CANVAS.width = window.innerWidth;
        SS_GUI_CANVAS.height = (SS_GUI_CANVAS.width*720)/1280;

     }
     
     SS_GUI_TIMETEXT = document.getElementsByTagName('time')[0];
    
     console.log(  );
}

function PlayPause(){
     SS_CORE.Pause();
}

function GUISetTimeText(time, totalTime){
 
     var minutes = ((time/1000/60) << 0);
     var seconds = ((time/1000) % 60) << 0;

     if(minutes < 10) minutes = '0'+minutes;
     if(seconds < 10) seconds = '0'+seconds;
     
     var tTime; 

     if(totalTime=null || totalTime == undefined){
         tTime = '&infin;';
     }
     else{
         
         var totalMinutes = ((totalTime/1000/60) << 0);
         var totalSeconds = ((time/1000) % 60) << 0;
         
         if(totalMinutes < 10) totalMinutes = '0'+totalMinutes;
         if(totalSeconds < 10) totalSeconds = '0'+totalSeconds;

         tTime == totalMinutes+':'+totalSeconds;
     }
     
     

     SS_GUI_TIMETEXT.innerHTML =  minutes+':'+seconds+" / "+tTime;
}