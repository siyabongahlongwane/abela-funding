import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Storage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  backendUrl: string = environment.backendUrl;
  constructor(private http: HttpClient, public router: Router, private storage: Storage) { }

  apply(endpoint: string, body: any): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.post(url, body);
  }

  login(endpoint: string): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.get(url);
  }

  genericFetchApplications(endpoint: string): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.get(url);
  }

  fetchMarks(endpoint: string): Observable<any> {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.get(url);
  }

  deleteApplication(endpoint: string) {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.delete(url);
  }

  updateApplication(endpoint: string, body: any) {
    const url = `${this.backendUrl}/${endpoint}`;
    return this.http.put(url, body);
  }

  uploadFiles(files: any[], directory: string = 'abela'): Promise<any> {
    let downloadURLs: string[] = [];
    return new Promise((resolve, reject) => {
      const allPercentage: Observable<any>[] = [];
      for (const file of files) {
        const filePath = `${directory}/${Date.now()}_${file.name}`;
        const fileRef = ref(this.storage, filePath);
        const task: any = uploadBytesResumable(fileRef, file);

        // observe percentage changes
        const uploadPercent = from(task).pipe(
          finalize(() => {
            getDownloadURL(task.snapshot.ref).then((url) => {
              downloadURLs.push(url);
              if (downloadURLs.length === files.length) {
                resolve(downloadURLs);
              }
            }).catch((error) => {
              reject(error);
            });
          })
        );

        allPercentage.push(uploadPercent);
        uploadPercent.subscribe();
      }
    });
  }

  addReferrer(body: any): Observable<any> {
    const url = `${this.backendUrl}/referrer/addReferrer`;
    return this.http.post(url, body);
  }  
}
