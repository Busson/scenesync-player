<scenesync> 
   <head>
   </head> 
   <body> 
       

       <scene id="asasas"> 
          
          <image id="img2" src="assets/simply.jpg" opacity="1" left="0.5" top="0.4" width="0.4" height="0.5"> 
               <sync id="sync3" time="1000">  //ver com delay
                     <start id="start5" target="img3" delay="1000" />
               </sync> 
          </image> 

          <text id="texto1" left="0.5" top="0.6" font-size="40px" font-family="sans-serif" color="blue" font-weight="bold" font-style="italic" > Alguma coisa hahahaha </text>
          
          <video id="img3" src="assets/video.mp4" left="0.5" top="0" width="0.5" height="0.4" >
              <sync id="sync4" time="1000" >
                  <stop id="stop1" target="img2" />
                  <set target="img3">
                     <property name="left" value="0" />
                     <property name="width" value="1" />
                  </set>
              </sync> 
          </video>
         
          <sync time="0" id="sync1" motion="">
             <start id="start1" target="img2" delay="1000" /> 
             <start id="start4" target="texto1" /> 
          </select>
        

       </scene>  

       <scene id="scene2">
        <image id="img3" src="assets/logo.png" left="0" top="0" width="1" height="1" /> 
       </scene> 
       
        <scene id="scene3">
       </scene>
      

   </body> 
</scenesync>  
   
