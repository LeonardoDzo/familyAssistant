import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class FilesService {
  extensiones: string[];

  constructor(
    public app: FirebaseApp,
    public http: Http,
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase
  ) { 
    this.http.get('assets/extensiones-imagenes.json').subscribe( res => {
      this.extensiones = res.json();
    });
  }

  private getExt(name: string): string {
    return name.split('.').pop();
  }

  getFiles() {
    var uid = this.afa.auth.currentUser.uid;
    return this.afd.list('safebox/' + uid).valueChanges();
  }

  upload(files: FileList, upload, toast: ToastsManager) {
    var uid = this.afa.auth.currentUser.uid;
    var ref = this.app.storage().ref();

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var ext = this.getExt(file.name);
      var imgRef = ref.child('safebox/' + uid + '/' + file.name);
      var type = this.extensiones.indexOf(ext) == -1 ? 'file' : 'image';
      var uploadTask = imgRef.put(file);
      upload.isUploading = true
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        upload.progress = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes) * 100)
      },
      error => {
        toast.error("Ocurrió un error subiendo el archivo...",null);
        upload.isUploading = false
      },
      () => {
        this.afd.database.ref('safebox/' + uid).push({
          downloadUrl: uploadTask.snapshot.downloadURL,
          filename: file.name,
          type: type
        })
        toast.success("El archivo se subió correctamente.",null)
        upload.isUploading = false
      }
    )
    }
  }
}
