// auth.service.ts
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { encryptLocalStorage } from "../storage";

interface LoginResponse {
  length: number;
  token: string;
  data: any;
  userName: string;
  status: string;
  message: string;
  roleID: string;
  plantId: string;
  activeStatus: string;
  emailID: string;
}
@Injectable({
  providedIn: "root"
})
export class AuthService
{
  // API path
  // basePath = 'https://my-site.com/server/';
  url: string;
  header: any;
  constructor(private router: Router, private http: HttpClient) {
    this.url = environment.baseurl;
  }

  // localStorage.setItem('access_token', resp.token);
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  // Handle errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return throwError(
    //   'Something bad happened; please try again later.');
    return throwError("Unauthorized.");
  }

  // Verify user credentials on server to get token
  loginForm(data: any): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>("https://bis.indiamfg.lenovo.com/BIS_API/api/Auth", data, this.httpOptions)
      .pipe(retry(0), catchError(this.handleError));
  }

  // After login save token and other values(if any) in localStorage
  setUser(resp: LoginResponse) {
    localStorage.setItem("name", resp.userName);
   // localStorage.setItem("access_token", resp.token);
    encryptLocalStorage.setItem("access_token", resp.token);
    // localStorage.setItem("access_token1", resp.token);
    localStorage.setItem("Status", resp.status);
    localStorage.setItem("RoleID", resp.roleID);
    localStorage.setItem("PlantId", resp.plantId);
    localStorage.setItem("ActiveStatus", resp.activeStatus);
    localStorage.setItem("EmailID", resp.emailID);
    if (resp.plantId == "1") {
      this.router.navigate(["/ccl-program"]);
    } else if (resp.plantId == "2") {
      this.router.navigate(["/trading-dashboard"]);
    } else if (resp.plantId == "3") {
      this.router.navigate(["/guest"]);
    } else {
      this.router.navigate(["/auth/login"]);
    }
  }

  // Checking if token is set
  isLoggedIn() {
    return localStorage.getItem("access_token") != null;
  }

  // After clearing localStorage redirect to login screen
  logout() {
    localStorage.clear();
    this.router.navigate(["/auth/login"]);
  }

  //Get data from server for Dashboard
  getData(): Observable<LoginResponse> {
    const temphttpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
        //Authorization: `Bearer ${localStorage.getItem("access_token")}`
      })
    };
    return this.http

      .get<LoginResponse>(this.url + "/BIS/GetAllProduct", temphttpOptions)
      .pipe(retry(0), catchError(this.handleError));
  }
}
