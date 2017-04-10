import { fileSize } from './helpers/Utils';

/*
item.status: 0:init, 1:cancel, 2:uploaded

*/

export default function (params) {

  let queue = [];
  let currentUpload = false;
  let config = {
    validFileType: 'none',
    path: '/',
    containerLoader: false,
    templateItemLoader: `
      <div class="dz-details">
        <div class="dz-filename">
          <i class="dz-wait-mark material-icons">sync</i>
          <i class="dz-success-mark material-icons">done</i>
          <i class="dz-error-mark material-icons">error_outline</i>
          <span class="one-line">[name]</span>
        </div>
        <div class="dz-size">
          <span>[size]</span>
          <a class="material-icons dz-remove">cancel</a>
        </div>
        <div class="dz-progress" id='progress[id]'></div>
        <div class="dz-error-message"><span>Error al procesar archivo, por favor intente de nuevo.</span></div>
      </div>
    `,
    ...params};
  let IsValidFileType = (type) => {
    if (type == "") return false;
    return config.validFileType.indexOf(type)>=0
  }

  let uploadInit = (item) => {
    let xhr = new XMLHttpRequest();
    currentUpload = item;
    xhr.open('POST', config.path, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.withCredentials = true;
    xhr.onload = function () {
      let ref;
      if (!((200 <= (ref = xhr.status) && ref < 300))) {
        uploadError(item, 'uploadInit: ' + item.name + ' - ' + xhr.status + ' ' + xhr.statusText + ' | ' + xhr.responseText);
      } else {
        item.response = JSON.parse(xhr.responseText);
        uploadChunks(item);
      }
    }
    xhr.onerror = function (event){
      uploadError(item, 'uploadInit: ' + item.name + ' - XMLHttpRequest cannot load');
    }
    xhr.send(JSON.stringify({
      command: "INIT",
      file_name: item.name,
      media_type: item.type
    }));

  }
  let uploadChunks = (item) => {
    let start = 0;
    let end = item.chunk_size;
    while (Math.round(start) < item.size) {
      uploadAppend(item, item.file.slice(start, end));
      start = end;
      end = start + item.chunk_size;
    }
  }

  let uploadAppend = (item, blob) => {
    let div = document.createElement("div");
    let divInner = document.createElement("div");
    let preview = document.getElementById('dz-preview' + item.id);
    let progressContent = document.getElementById('progress' + item.id);
    let xhr = new XMLHttpRequest();
    /*
    let processError = function(message){
      console.error(message);
      divInner.classList.add('error');
      cancelFile(item)
      preview.classList.add('dz-error');
      upload();
    }
    */

    div.className = 'dz-progress-item';
    div.style.width = (100 / item.chunks) + '%';
    div.appendChild(divInner);
    progressContent.appendChild(div);
    preview.classList.add('on');

    xhr.open('POST', config.path, true);
    //xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.withCredentials = true;
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        let loaded = Math.round((event.loaded / event.total) * 100);
        divInner.style.width = loaded + '%';
      }
    };

    xhr.onload = function () {
      let ref;
      currentUpload = false;
      if (!((200 <= (ref = xhr.status) && ref < 300))) {
        uploadError(item, 'uploadAppend: ' + item.file.name + ' - ' + xhr.status + ' ' + xhr.statusText + ' | ' + xhr.responseText);
      } else {
        item.uploaders.pop();
        if (!item.uploaders.length) {
          item.status = 2;
          uploadFinalize(item, preview);
        }
      }

    }
    xhr.onerror = function (event){
      uploadError(item, 'uploadAppend: ' + item.file.name + ' - XMLHttpRequest cannot load');
    }

    item.uploaders.push(xhr);

    let fd = new FormData();
    fd.append('command', 'APPEND');
    fd.append('file_name', item.name);
    fd.append('media_id', item.response.media_id);
    fd.append('segment_index', item.uploaders.length);
    fd.append('chunk', blob, item.name);
    xhr.send(fd);

    /*
    xhr.send(JSON.stringify({
      command: "APPEND",
      file_name: item.name,
      media_id: item.response.media_id,
      segment_index: item.uploaders.length,
      chunk: blob
    }));
    */
  }

  let uploadFinalize = (item, preview) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', config.path, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.withCredentials = true;
    xhr.onload = function () {
      let ref;
      if (!((200 <= (ref = xhr.status) && ref < 300))) {
        uploadError('uploadFinalize: ' + item.name + ' - ' + xhr.status + ' ' + xhr.statusText + ' | ' + xhr.responseText)
      } else {
        currentUpload = false;
        preview.classList.add('dz-complete');
        setTimeout(() => preview.remove(),1000);
        // console.log('itemmm', this.responseText);
      }
    }
    xhr.onerror = function (event){
      uploadError(item, 'uploadFinalize: ' + item.name + ' - XMLHttpRequest cannot load');
    }
    xhr.send(JSON.stringify({
      command: "FINALIZE",
      file_name: item.name,
      media_type: item.type,
      media_id: item.response.media_id
    }));

  }

  let determineChunkSize = (size) => {
    /*
    1mb:   1048576 byte
    6mb:   6291456 byte
    11mb: 11534336 byte
    60mb: 62914560 byte
    */
    // console.log('size', size);
    // if (size < 11534336){ //11mb
    //   return size;
    // }else if (size < 62914560) { //60mb
    //   let divide = size/6291456; // entre 6mb;
    //   console.log('divide', divide);
    //   console.log('size/divide', size / divide);
    //   return size / divide;
    // }
    // return size/10;

    var MAX_SIZE_CHUNK = 62914560; // 60mb
    var DIFF = 524288000; // 500mb

    if (size < MAX_SIZE_CHUNK ) {
      return {
        chunks: 1,
        size_chanks: size
      };
    } else {
      var i = 1;
      while(size  > DIFF * i){
        i++;
      }
      
      return {
        chunks: 10 * i,
        size_chanks: size / (10 * i)
      };
    }
    
  }

  let uploadError = (item, message, ) => {
    let preview = document.getElementById('dz-preview' + item.id);
    preview.classList.add('dz-error');
    console.error(message);
    cancelFile(item);
  }

  let cancelFile = (item, remove = false) => {

    if (item.uploaders && item.uploaders.length) {
      for (var i = 0; i < item.uploaders.length; i++) {
        item.uploaders[i].abort();
      }
    }
    item.status = 1;
    if (remove) {
      document.getElementById('dz-preview' + item.id).remove();
    }

    if (currentUpload.id == item.id){
      currentUpload = false;
      upload();
    }
  }

  let upload = () => {
    if (currentUpload) return;
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].status == 0){
        uploadInit(queue[i]);
        return;
      }
    }
  }

  let drawFileLoader = (index = 0) => {
    let item = queue[index];
    let div = document.createElement("div");
    let cancel;
    div.className  = 'dz-preview';
    div.id = 'dz-preview' + item.id;
    div.innerHTML = config.templateItemLoader
      .replace('[name]', item.name)
      .replace('[size]',fileSize(item.size))
      .replace('[id]', item.id);

    config.containerLoader.appendChild(div);

    cancel = div.getElementsByClassName('dz-remove')[0];
    cancel.onclick = cancelFile.bind(this, index, true);

    if (currentUpload == false) {
      upload();
    }
  }

  return {
    add : (file) => {
      if (IsValidFileType(file.type)) {
        // let chunk_size = determineChunkSize(file.size);
        let chunkData = determineChunkSize(file.size);
        queue.push({
          key: Math.random().toString().substring(2),
          name: file.name,
          file: file,
          type: file.type,
          // chunk_size: chunk_size,
          // chunks: Math.ceil(file.size / chunk_size),
          chunk_size: chunkData.size_chanks,
          chunks: Math.ceil(chunkData.chunks),
          size: file.size,
          status: 0,
          uploaders: []
        });
        drawFileLoader(queue.length - 1);
      }
    }
  }
}