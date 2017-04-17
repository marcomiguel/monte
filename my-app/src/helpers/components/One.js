import React from 'react';

export const One = () => {

    const Config = {
        "files": {
            "accepted" : "image/jpeg,image/png,image/gif,video/mp4,video/x-matroska,audio/mp3,application/pdf"
        }
     }

    let fileChange = null;

    const handleClick = () =>{
        fileChange.click();
    }

    function iterateFiles(files){
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            // console.log(files[i], 'iii')
            if(f.type.match('image')){
                console.log('se ha subido imagen');
                reader.onload = (function(theFile) {
                    return function(event) {
                        var pic = event.target;
                        /*  */
                        let img = document.createElement("img");
                        img.src = pic.result;
                        document.body.appendChild(img);
                        /* */
                        console.log(theFile.name);
                    };
                })(f);
                reader.readAsDataURL(f);
            }else{
                console.log('se ha subido otro');
                reader.onload = (function(theFile) {
                    return function(event) {
                        var pic = event.target;
                        /*  */
                        
                        var blob = new Blob([pic.result], {type: theFile.type});
                        var url = URL.createObjectURL(blob);
                        var video = document.createElement('video');

                        var timeupdate = function(){
                            if(snapImage()){
                                video.removeEventListener('timeupdate', timeupdate);
                                video.pause();
                            }
                        };

                        video.addEventListener('loadeddata', function(){
                            if(snapImage()){
                                video.removeEventListener('timeupdate', timeupdate);
                            }
                        });

                        var snapImage = function(){
                            var canvas = document.createElement('canvas');
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
                            var image = canvas.toDataURL();
                            var success = image.length > 100000;
                            if(success){
                                var img = document.createElement('img');
                                img.src = image;
                                document.body.appendChild(img);
                                URL.revokeObjectURL(url);
                            }
                            return success;
                        }

                        video.addEventListener('timeupdate', timeupdate);
                        video.preload = 'metadata';
                        video.src = url;
                        // Load video in Safari / IE11
                        video.muted = true;
                        video .playsInline = true;
                        video.play();

                        /* */
                        console.log(theFile.name);
                    };
                })(f);
                reader.readAsArrayBuffer(f);
            }

            
        }
    }

     const handleChangeFile = (event) => {
         // console.log('handleChangeFile', event.type);
         if (event.type === 'change') {
            iterateFiles(Array.from(event.target.files));
        }
     }

    return(
        <div>
            <input type='button' onClick={ handleClick } value='Change'/>
            <input 
                type="file" 
                name="file" 
                id='dropzone-file' 
                multiple 
                onChange={handleChangeFile} 
                ref={(input) => { fileChange = input; }} 
                style={{display: 'none'}} 
                accept={Config.files.accepted} />
        </div>   
    )
}