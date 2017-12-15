import { User } from 'app/shared/models/user';
import { Observable } from 'rxjs/Observable';
import { FileDatabase } from '../models/file-database';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UUID } from 'angular2-uuid';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class FilesService {
  extensiones: string[];
  archivos: string[];
  assistant: User = new User();
  private subs: Subscription[] = [];
  constructor(
    public app: FirebaseApp,
    public http: Http,
    private afa: AngularFireAuth,
    private afd: AngularFireDatabase
  ) {
    this.subs.push(this.http.get('assets/extensiones-imagenes.json').subscribe(res => {
      this.extensiones = res.json();
    }));

    this.subs.push(this.http.get('assets/extensiones-archivos.json').subscribe(res => {
      this.archivos = res.json();
    }));

    let uid = this.afa.auth.currentUser.uid;
    this.subs.push(this.getUser().subscribe((user: User) => {
      this.assistant = user;
    }, error => {
      
    }));
  }

  destroy() {
    this.subs.forEach(sub => {
      sub.unsubscribe();
    })
  }

  getUser() {
    let uid = this.afa.auth.currentUser.uid;
    return this.afd.object(`assistants/${uid}`).valueChanges();
  }

  private getExt(name: string): string {
    return name.split('.').pop();
  }

  getImageLink(file: FileDatabase): string {
    let name = file.filename;
    let ext = this.getExt(name)
    if (this.extensiones.indexOf(ext) != -1) {
      if(file.thumbnail)
        return file.thumbnail
      return file.downloadUrl
    } else if (this.archivos.indexOf(ext) != -1) {
      return "assets/images/files/" + ext + ".png"
    }
    return "assets/images/files/_blank.png"
  }

  getFiles() {
    var uid = this.assistant.selectedBoss;
    return this.afd.list('safebox/' + uid).valueChanges();
  }

  isFolder(file: FileDatabase): boolean {
    return file.type == 'folder'
  }

  isImage(files: FileList): boolean {
    let ext = this.getExt(files[0].name);

    return this.extensiones.indexOf(ext) != -1;
  }

  private uploadThumbnail(thumbnail,ref) {
    var uid = this.assistant.selectedBoss;
    let uuid = UUID.UUID();
    let ext = this.getExt(thumbnail.name)
    let thumbRef = this.app.storage().ref().child('safebox/' + uid + '/' + uuid + "." + ext)
    thumbRef.put(thumbnail).then((obj) => {
      ref.update({
        thumbnail: obj.downloadURL
      })
    })
  }

  createFolder(name: string, parent: string) {
    var uid = this.assistant.selectedBoss;
    this.afd.database.ref('safebox/' + uid).push({
      filename: name,
      parent: parent,
      type: 'folder'
    }).then(ref => {
      ref.update({
        id: ref.key
      })
    })
  }

  upload(parent: string,file: File, upload, toast: ToastsManager,thumbnail?: File) {
    var uid = this.assistant.selectedBoss;
    var ref = this.app.storage().ref();
    let uuid = UUID.UUID();
    var ext = this.getExt(file.name);

    var imgRef = ref.child('safebox/' + uid + '/' + uuid + "." + ext);
    var uploadTask = imgRef.put(file);
    upload.isUploading = true
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        upload.progress = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      },
      error => {
        toast.error("Ocurrió un error subiendo el archivo...", null);
        upload.isUploading = false
      },
      () => {
        this.afd.database.ref('safebox/' + uid).push({
          downloadUrl: uploadTask.snapshot.downloadURL,
          filename: file.name,
          parent: parent,
          type: 'file'
        }).then((ref) => {
          ref.update({
            id: ref.key
          })
          if(thumbnail) {
            this.uploadThumbnail(thumbnail,ref);
          }
        })
        toast.success("El archivo se subió correctamente.", null)
        upload.isUploading = false
      }
    )
  }
}
