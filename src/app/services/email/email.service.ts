import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) {}

  sendEmail(url:string, data:any) {
    console.log(url);

    console.log("emailservice");
    return this.http.post(url, data);
  }
}
