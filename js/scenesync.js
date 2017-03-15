
var SS_DOC = document.createElement('script');
SS_DOC.src = 'js/scenesync_interface.js';
document.head.appendChild(SS_DOC);

SS_DOC = document.createElement('script');
SS_DOC.src = 'js/scenesync_core.js';
document.head.appendChild(SS_DOC);

SS_DOC = document.createElement('script');
SS_DOC.src = 'js/content/image.js';
document.head.appendChild(SS_DOC);

SS_DOC = document.createElement('script');
SS_DOC.src = 'js/content/text.js';
document.head.appendChild(SS_DOC);

SS_DOC = document.createElement('script');
SS_DOC.src = 'js/content/video.js';
document.head.appendChild(SS_DOC);

function InitializeSceneSync(file_p){
   
    LoadInterfaceElements();
    var canvas = document.getElementById('myCanvas');
    canvas.addEventListener("click", SS_CORE.Click, false);

    canvas.addEventListener('mousedown', function(evt) {   
       var rect = document.getElementById('myCanvas').getBoundingClientRect();
       SS_CORE.Click( (evt.clientX - rect.left), (evt.clientY - rect.top) );
    }, false);


    SS_CORE.SetCanvas(canvas.getContext("2d"));
    SS_CORE.SetScreenSize(canvas.offsetWidth,canvas.offsetHeight);
    
    setInterval(function() {
       SS_CORE.Update();
       SS_CORE.Draw();
     }, 1000/SS_CORE.GetFPS());
    
    ReadSceneSyncDocument(file_p);
       
  //  SS_CORE.Load();
  //  SS_CORE.Start();
}

function ReadSceneSyncDocument(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                LoadSceneSync(rawFile.responseText); 
            }
        }
    }
    rawFile.send(null);
}

function LoadSceneSync(documentContent_p){

//    console.log('INIT LOAD FILE');

    var parser = new DOMParser();
    var SSContent = parser.parseFromString(documentContent_p,"text/xml");
   
    var sceneNode = SSContent.getElementsByTagName("scene");
    for(sceneIndex=0; sceneIndex <sceneNode.length; sceneIndex++){
         //attr
         var sceneID = sceneNode[sceneIndex].getAttribute('id')
         // alloc
         var SCENE = new Scene(sceneID);
         //child nodes
         //image
         var imageNode = sceneNode[sceneIndex].getElementsByTagName("image");
         for(imageIndex=0; imageIndex < imageNode.length ; ){
             //attr
             var imageID = imageNode[imageIndex].getAttribute('id');
             var imageSrc = imageNode[imageIndex].getAttribute('src');
             var imageLeft = imageNode[imageIndex].getAttribute('left');
             var imageTop = imageNode[imageIndex].getAttribute('top');
             var imageWidth = imageNode[imageIndex].getAttribute('width');
             var imageHeight = imageNode[imageIndex].getAttribute('height');
             var imageOpacity = imageNode[imageIndex].getAttribute('opacity');
             //alloc 
             var IMAGE = new MImage(imageID,imageSrc,imageLeft,imageTop,imageWidth,imageHeight,imageOpacity);
             //child nodes
             IMAGE.AddSelectList(ReadSceneSyncNode_Select(imageNode[imageIndex]));
             IMAGE.AddSyncList(ReadSceneSyncNode_Sync(imageNode[imageIndex]));
             SCENE.AddMedia(IMAGE);
             sceneNode[sceneIndex].removeChild(imageNode[imageIndex]); 
         }
        //video
        var videoNode = sceneNode[sceneIndex].getElementsByTagName("video");
        for(videoIndex=0; videoIndex < videoNode.length ; ){
           //attr
             var videoID = videoNode[videoIndex].getAttribute('id');
             var videoSrc = videoNode[videoIndex].getAttribute('src');
             var videoLeft = videoNode[videoIndex].getAttribute('left');
             var videoTop = videoNode[videoIndex].getAttribute('top');
             var videoWidth = videoNode[videoIndex].getAttribute('width');
             var videoHeight = videoNode[videoIndex].getAttribute('height');
             var videoOpacity = videoNode[videoIndex].getAttribute('opacity');
             //alloc 
               var VIDEO = new MVideo(videoID,videoSrc,videoLeft,videoTop,videoWidth,videoHeight,videoOpacity);
             //child nodes
             VIDEO.AddSelectList(ReadSceneSyncNode_Select(videoNode[videoIndex]));
             VIDEO.AddSyncList(ReadSceneSyncNode_Sync(videoNode[videoIndex]));
             SCENE.AddMedia(VIDEO);  
             sceneNode[sceneIndex].removeChild(videoNode[videoIndex]); 
         } 
         //text 
         var textNode = sceneNode[sceneIndex].getElementsByTagName("text");
         for(textIndex=0; textIndex < textNode.length ; ){
             //attr
             var textID = textNode[textIndex].getAttribute('id');
             var textSrc = textNode[textIndex].getAttribute('src');
             var textLeft = textNode[textIndex].getAttribute('left');
             var textTop = textNode[textIndex].getAttribute('top');
             var textFontSize = textNode[textIndex].getAttribute('font-size');
             var textFontFamily = textNode[textIndex].getAttribute('font-family');
             var textFontWeight = textNode[textIndex].getAttribute('font-weight');
             var textFontStyle = textNode[textIndex].getAttribute('font-style');
             var textColor = textNode[textIndex].getAttribute('color');
             var textOpacity = textNode[textIndex].getAttribute('opacity');
             //alloc 
             var TEXT = new MText(textID,textSrc,textLeft,textTop,textFontSize,textFontFamily,textColor,textFontWeight,textFontStyle,textOpacity);
             //child nodes
             TEXT.AddSelectList(ReadSceneSyncNode_Select(textNode[textIndex]));
             TEXT.AddSyncList(ReadSceneSyncNode_Sync(textNode[textIndex]));
             SCENE.AddMedia(TEXT);
             sceneNode[sceneIndex].removeChild(textNode[textIndex]); 
         } 
 
         
         SCENE.AddSelectList(ReadSceneSyncNode_Select(sceneNode[sceneIndex]));
         SCENE.AddSyncList(ReadSceneSyncNode_Sync(sceneNode[sceneIndex])); 
         SS_CORE.AddScene(SCENE);
    }
    
    SS_CORE.FinishLoadDocument();
  //  console.log('FINISH LOAD FILE');
}

function ReadSceneSyncNode_Select(contentNode_p){
    var selectList = new Array();
    var selectNode = contentNode_p.getElementsByTagName("select");
   
    for(selectIndex=0; selectIndex < selectNode.length; selectIndex++){
          //attr
          var selectID = selectNode[selectIndex].getAttribute('id');
          var selectMotion = selectNode[selectIndex].getAttribute('motion');
          //alloc
          var SELECT = new Select(selectID,selectMotion);
          //child nodes
          var startNode = selectNode[selectIndex].getElementsByTagName("start");
          for(startIndex=0;startIndex < startNode.length ;startIndex++){
              //attr 
              var startID = startNode[startIndex].getAttribute('id');
              var startTarget = startNode[startIndex].getAttribute('target');
              var startDelay = startNode[startIndex].getAttribute('delay');
              //alloc
              SELECT.AddAction(new Start(startID,startTarget,startDelay));
          }
          var stopNode = selectNode[selectIndex].getElementsByTagName("stop");
          for(stopIndex=0;stopIndex < stopNode.length ;stopIndex++){
              //attr 
              var stopID = stopNode[stopIndex].getAttribute('id');
              var stopTarget = stopNode[stopIndex].getAttribute('target');
              var stopDelay = stopNode[stopIndex].getAttribute('delay');
              //alloc
              SELECT.AddAction(new Stop(stopID,stopTarget,stopDelay));
          }
          var setNode = selectNode[selectIndex].getElementsByTagName("set");
          for(setIndex=0;setIndex < setNode.length ;setIndex++){
              //attr 
              var setID = setNode[setIndex].getAttribute('id');
              var setTarget = setNode[setIndex].getAttribute('target');
              var setDelay = setNode[setIndex].getAttribute('delay');
              //alloc
              var SET = new Set(setID,setTarget,setDelay);
              //childs
              var propertyNode = setNode[setIndex].getElementsByTagName("property");
              for(propertyIndex=0;propertyIndex < propertyNode.length ;propertyIndex++){
                  //attr
                  var propertyID = propertyNode[propertyIndex].getAttribute('id');
                  var propertyName = propertyNode[propertyIndex].getAttribute('name');
                  var propertyValue = propertyNode[propertyIndex].getAttribute('value');
                  //alloc
                  SET.AddProperty( new Property(propertyID,propertyName,propertyValue) );
              }
              
              SELECT.AddAction(SET);
           }
           var gotoNode = selectNode[selectIndex].getElementsByTagName("goto");
           for(gotoIndex=0;gotoIndex < gotoNode.length ;gotoIndex++){
              //attr 
              var gotoID = gotoNode[gotoIndex].getAttribute('id');
              var gotoTarget = gotoNode[gotoIndex].getAttribute('target');
              var gotoTimeEvent = gotoNode[gotoIndex].getAttribute('timeEvent');
              var gotoDelay = gotoNode[gotoIndex].getAttribute('delay');
              //alloc
              SELECT.AddAction(new Goto(gotoID,gotoTarget,gotoTimeEvent,gotoDelay));
           }
          selectList.push(SELECT);
    }

     return selectList;
}

function ReadSceneSyncNode_Sync(contentNode_p){

     var syncList = new Array();
     var syncNode = contentNode_p.getElementsByTagName("sync");
     
     for(syncIndex=0; syncIndex < syncNode.length; syncIndex++){
          //attr
          var syncID = syncNode[syncIndex].getAttribute('id');
          var syncTime = syncNode[syncIndex].getAttribute('time');
          //alloc
          var SYNC = new Sync(syncID,syncTime);
          //child nodes
          var startNode = syncNode[syncIndex].getElementsByTagName("start");
          for(startIndex=0;startIndex < startNode.length ;startIndex++){
              //attr 
              var startID = startNode[startIndex].getAttribute('id');
              var startTarget = startNode[startIndex].getAttribute('target');
              var startDelay = startNode[startIndex].getAttribute('delay');
              //alloc
              SYNC.AddAction(new Start(startID,startTarget,startDelay));
          }
          var stopNode = syncNode[syncIndex].getElementsByTagName("stop");
          for(stopIndex=0;stopIndex < stopNode.length ;stopIndex++){
              //attr 
              var stopID = stopNode[stopIndex].getAttribute('id');
              var stopTarget = stopNode[stopIndex].getAttribute('target');
              var stopDelay = stopNode[stopIndex].getAttribute('delay');
              //alloc
              SYNC.AddAction(new Stop(stopID,stopTarget,stopDelay));
          }
          var setNode = syncNode[syncIndex].getElementsByTagName("set");
          for(setIndex=0;setIndex < setNode.length ;setIndex++){
              //attr 
              var setID = setNode[setIndex].getAttribute('id');
              var setTarget = setNode[setIndex].getAttribute('target');
              var setDelay = setNode[setIndex].getAttribute('delay');
              //alloc
              var SET = new Set(setID,setTarget,setDelay);
              //childs
              var propertyNode = setNode[setIndex].getElementsByTagName("property");
              for(propertyIndex=0;propertyIndex < propertyNode.length ;propertyIndex++){
                  //attr
                  var propertyID = propertyNode[propertyIndex].getAttribute('id');
                  var propertyName = propertyNode[propertyIndex].getAttribute('name');
                  var propertyValue = propertyNode[propertyIndex].getAttribute('value');
                  //alloc
                  SET.AddProperty( new Property(propertyID,propertyName,propertyValue) );
              }
              
              SYNC.AddAction(SET);
           }
           var gotoNode = syncNode[syncIndex].getElementsByTagName("goto");
           for(gotoIndex=0;gotoIndex < gotoNode.length ;gotoIndex++){
              //attr 
              var gotoID = gotoNode[gotoIndex].getAttribute('id');
              var gotoTarget = gotoNode[gotoIndex].getAttribute('target');
              var gotoTimeEvent = gotoNode[gotoIndex].getAttribute('timeEvent');
              var gotoDelay = gotoNode[gotoIndex].getAttribute('delay');
              //alloc
              SYNC.AddAction(new Goto(gotoID,gotoTarget,gotoTimeEvent,gotoDelay));
           }
          syncList.push(SYNC);
     }
     
     return syncList;
}
