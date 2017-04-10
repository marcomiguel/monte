import React from 'react';

export const One = () => {

    let textInput = '';
    let fileChange = null;

    const focus = () =>{
        textInput.focus();
    }

    const handleClick = () =>{
        fileChange.click();
    }
    
    /* ---- */

    const Config = {
        "files": {
            "accepted" : "image/jpeg,image/png,image/gif,video/mp4,video/x-matroska,audio/mp3,application/pdf"
        }
     }

    function iterateFiles(files){
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function(theFile) {
                return function(e) {
                    // Render thumbnail
                    console.log(theFile.name);
                };
            })(f);
            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

     const handleEventsDropzone = (event) => {
         console.log('handleEventsDropzone', event.type);
         if (event.type === 'change') {
            iterateFiles(Array.from(event.target.files));
        }
     }

    return(
        <div>
            <input type='button' onClick={ handleClick } value='Change'/>   
            <hr/>
            <input type='text' ref={(input) => { textInput = input; }}/>
            <input type='button' value='Focus the text input' onClick={focus}/>
            <hr/>
            <input 
                type="file" 
                name="file" 
                id='dropzone-file' 
                multiple 
                onChange={handleEventsDropzone} 
                ref={(input) => { fileChange = input; }} 
                style={{display: 'none'}} 
                accept={Config.files.accepted} />
        </div>   
    )
}

// <input type='file' ref={(input) => { fileChange = input; }}/>