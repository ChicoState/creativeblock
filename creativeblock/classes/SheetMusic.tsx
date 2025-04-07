 import React, { useEffect, useRef } from 'react';
 import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
 import { useRouter } from 'expo-router';

 function SheetMusicDisplay() {
   const osmdContainer = useRef(OpenSheetMusicDisplay);

   useEffect(() => {
     if (osmdContainer.current) {
       const osmd = new OpenSheetMusicDisplay(osmdContainer.current);
       osmd.load("@/assets/Music/MozartPianoSonata.xml")
         .then(() => {
           osmd.render();
         });
     }
   }, []);

   return (
     <div ref={osmdContainer} style={{ width: '100%', height: '500px' }} />
   );
 }

 export default SheetMusicDisplay;