import { Injectable, EventEmitter } from "@angular/core";
import { Subscription } from "rxjs/internal/Subscription";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpRequest,
  HttpEvent
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { encryptLocalStorage } from "./storage";

//region OperatingApplication
interface OperatingApplication {
  OLID: any;
  Registration_No: string;
  Product_Category: string;
  Product_Name: string;
  Registered_On: string;
  Valid_Till: string;
  Applicable_Products: string;
  Status: string;
  License_Doc: File | null;
  CreatedBy: string;
  PlantId: string;
  MfgName: string;
}
interface DynamicApplication {
  Prm_ID: any;
  FK_IDD: any;
  Picture_Namee: File | null;
  Picture_Positionn: string;
  IsActivee: string;
  Str: string;
}
//endregion
//region POApplication
interface POApplication {
  POID: any;
  Category: string;
  Product: string;
  PO_Type: any;
  Model_for_BIS: string;
  Supplier_Name: string;
  Quotation_Reference_No: string;
  Quotation_Date: string;
  PO_Reference_No: string;
  PO_Value_in_INR: any;
  PO_Date: string;
  Invoice_No: string;
  Invoice_date: string;
  Payment_Release_Date: string;
  Payment_Value_in_INR: any;
  Balance_Amount: any;
  CreatedBy: string;
  PlantId: string;
  Payment_Term_In_Days: any;
  PO_Remarks: any;
  Invoice_Remarks: any;
  Upload_Quotation: File | null;
  Upload_PO_Reference: File | null;
  Upload_Invoice: File | null;
  MfgPlantID: any;
}

interface InwardApplication {
  WIDD:any;
    FYY: string;
    Date_of_receiptt: any;
    Productt: string;
    categoryy: string;
    Samplee: string;
    MTMM: string;
    Serial_noo: string;
    Engg_Lab_Serial_noo: string;
    Waybill_noo: string;
    Incotermss: string;
    Asset_Typee: string;
    GAMS_Asset_Ownerr: string;
    Challan_numberr: string;
    GAMS_Asset_IDD: string;
    Accessoriess: string;
    Modell: string;
    Part_numberr: string;
    Qtyy: string;
    Working_Conditionn: string;
    Storage_Locationn: string;
    Remarkss: string;
    Received_Byy: string;
    statuss: string;
    Lab_Detailss: string;
    Technical_leadd: string;
    Date_of_returnn:any;
    Product_Statuss: string;
    History_Logss: string;
    Inwards_Docss: File | null;
    incoterms_Docss: File | null;
    Str:any;
}
//endregion
interface RMMaterial {
  RIDD: any;
  FYY: string;
  Date_of_Inventoryy: any;
  Productt: string;
  Categoryy: string;
  Engg_Lab_Serial_numberr: string;
  Reasonn: string;
  RORQQ: string;
  Accessoriess: string;
  Modell:any;
  Part_numberr:any;
  Qtyy:any;
  Unit_pricee: string;
  Tax_Statuss: string;
  Finnace_remarkss:any;
  Statuss: string;
  Tax_paid_datee:any;
  Inventory_approvall: File | null;
  Duty_Uploadd: File  | null;
  Str: string;
}
//region QueryApplication
interface QueryApplication {
  QryID: any;
  MfgPlantID: any;
  QryDate: any;
  QueryBy: string;
  Query_Related_To: string;
  QueryTo: string;
  QuerySubject: string;
  Product: string;
  Model_For_BIS: string;
  Inclusion_RequestID: string;
  Query_One: string;
  Query_One_Date: any;
  Query1_Reply_From_Lnv: string;
  Query1_Reply_Date: any;
  Query_Two: string;
  Query_Two_Date: any;
  Query2_Reply_From_Lnv: string;
  Query2_Reply_Date: any;
  Query_Three: string;
  Query_Three_Date: any;
  Query3_Reply_From_Lnv: string;
  Query3_Reply_Date: any;
  CreatedBy: string;
  PlantId: any;
  Query_Status: any;

}
//endregion
//region BISApplication
interface BISApplication {
  BISProgramID: any;
  Category: string;
  R_Number: string;
  Product: string;
  Model_For_BIS: string;
  Details: string;
  Test_Request: string;
  India_SS_Date: string;
  Lead_Model: string;
  Series_Model: string;
  FInalize_BIS_Model_Plan: string;
  FInalize_BIS_Model_Plan_Revised: string;
  Finalize_BIS_Model_Actual: string;
  Biz_Approval_PO_Plan: string;
  Biz_Approval_PO_Plan_Revised: string;
  Biz_Approval_PO_Actual: string;
  Sample_Receipt_Plan: string;
  Sample_Receipt_Plan_Revised: string;
  Sample_Receipt_Actual: string;
  Sample_Submission_Lab_Plan: string;
  Sample_Submission_Lab_Plan_Revised: string;
  Sample_Submission_Lab_Actual: string;
  BIS_Lab_Test_Report_Plan: string;
  BIS_Lab_Test_Report_Plan_Revised: string;
  BIS_Lab_Test_Report_Actual: string;
  Letter_Submit_Govt_Plan: string;
  Letter_Submit_Govt_Plan_Revised: string;
  Letter_Submit_Govt_Actual: string;
  BIS_Approved_Plan: string;
  BIS_Approved_Plan_Revised: string;
  BIS_Approved_Actual: string;
  CreatedBy: string;
  PlantId: string;
  MfgPlantID: any;
  Test_Report: string;
  Inclusion_Request_ID: string;
  RGP_Reference: string;
  Adapter: string;
  UMA_DIS: string;
  Battery: string;
  Others: string;
  Upld_Test_Report: File | null;
  Upld_Certificate: File | null;
  Upld_TestRequest: File | null;
  CCLUpload: File | null;
  Upld_RGPReference: File | null;
  Upld_BISProgramOthers: File | null;

}

//region BISApplication
interface CCLApplication {
  BISProgramID: any;
  Category: string;
  R_Number: string;
  Product: string;
  Model_For_BIS: string;
  Details: string;
  Test_Request: string;
  India_SS_Date: string;
  Lead_Model: string;
  Series_Model: string;
  FInalize_BIS_Model_Plan: string;
  FInalize_BIS_Model_Plan_Revised: string;
  Finalize_BIS_Model_Actual: string;
  Biz_Approval_PO_Plan: string;
  Biz_Approval_PO_Plan_Revised: string;
  Biz_Approval_PO_Actual: string;
  Sample_Receipt_Plan: string;
  Sample_Receipt_Plan_Revised: string;
  Sample_Receipt_Actual: string;
  Sample_Submission_Lab_Plan: string;
  Sample_Submission_Lab_Plan_Revised: string;
  Sample_Submission_Lab_Actual: string;
  BIS_Lab_Test_Report_Plan: string;
  BIS_Lab_Test_Report_Plan_Revised: string;
  BIS_Lab_Test_Report_Actual: string;
  Letter_Submit_Govt_Plan: string;
  Letter_Submit_Govt_Plan_Revised: string;
  Letter_Submit_Govt_Actual: string;
  BIS_Approved_Plan: string;
  BIS_Approved_Plan_Revised: string;
  BIS_Approved_Actual: string;
  CreatedBy: string;
  PlantId: string;
  MfgPlantID: any;
  Test_Report: string;
  Inclusion_Request_ID: string;
  RGP_Reference: string;
  Adapter: string;
  UMA_DIS: string;
  Battery: string;
  Others: string;
  Upld_Test_Report: File | null;
  Upld_Certificate: File | null;
  Upld_TestRequest: File | null;
  CCLUpload: File | null;
  Upld_RGPReference: File | null;
  Upld_BISProgramOthers: File | null;
  CCLInclusion_1:File | null;
  CCLInclusion_2:File | null;
}
//endregion
@Injectable({
  providedIn: "root"
})
export class SharedService {
  invokeAppComponentFunction = new EventEmitter();
  invokeProductCategoryFunction = new EventEmitter();
  public subsVar = Subscription;
  todayNumber: number = Date.now();
  url: string;
  header: any;
  output: any;
  exportDataAsExcel: any;
  constructor(private router: Router, private http: HttpClient) {
    this.url = environment.baseurl;
  }

  UrlhttpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
    })
  };

  handleError(error: HttpErrorResponse) {
    let errorMessage = "Unknown error!";
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  EnableHeaderMenuList() {
    //
    this.invokeAppComponentFunction.emit();
  }

  ProductByCategory(param: string) {
    this.invokeProductCategoryFunction.emit(param);
  }

  //region getDashboardData//
  getDashboardData(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostDashboard_Data", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion

  //region DynamicTitle//
  Dynamictitle(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostManage_Banner_Title", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion
  //region GetMfgPlant
  GetMfgPlant(): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .get<any>(this.url + "/BIS/GetMFgList", HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
  //endregion

    //region Get_RMMaterial
    Get_RMMaterial(): Observable<any> {
      const HttpToken = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
        })
      };

      return this.http
        .get<any>(this.url + "/BIS/Get_RMMaterial", HttpToken)
        .pipe(retry(0), catchError(this.handleError));
    }
    //endregion

    //region Get_CCL_Inclusion_View_Data
    Get_CCL_Inclusion_View_Data(): Observable<any> {
      const HttpToken = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
        })
      };

      return this.http
        .get<any>(this.url + "/BIS/Get_CCL_Inclusion_View_Data", HttpToken)
        .pipe(retry(0), catchError(this.handleError));
    }
    //endregion
    //region Get_CCL_Component_List
    Get_CCL_Component_List(): Observable<any> {
      const HttpToken = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
        })
      };

      return this.http
        .get<any>(this.url + "/BIS/Get_CCL_Component_List", HttpToken)
        .pipe(retry(0), catchError(this.handleError));
    }
    //endregion


   //region GetMfgPlant
   Getimgandtitle(): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .get<any>(this.url + "/BIS/Get_Banner_Data", HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
  //endregion

  //region DownloadFile
  DownloadFile(param: any): Observable<Blob> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    const _headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${encryptLocalStorage.getItem("access_token")}`
    );
    return this.http.post(this.url + "/BISProgram/DownloadFile", param, {
      reportProgress: true,
      responseType: "blob",
      headers: _headers
    });
  }
 //endregion

  //region GetBISProdListByFY
  GetBISProdListByFY(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostFilterBy_Fy", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion

 //region GetBISKeyFiltersBy_Param
  GetBISKeyFiltersBy_Param(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostKeyFiltersBy_Param", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
  //endregion

  //region GetBISKeyFiltersBy_ParamPO
  GetBISKeyFiltersBy_ParamPO(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    return this.http
      .post<any>(this.url + "/BISProgram/PostFilter_For_BISPOReference", param, HttpToken)
      //
      .pipe(retry(0), catchError(this.handleError));
  }
 //endregion
 //region GetBISKeyFiltersBy_ModelforbisPO
  GetBISKeyFiltersBy_ModelforbisPO(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BISProgram/PostModelForBIS_Filter_ByProduct", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion
  //region Product Filter(Product,Search By Product,Guest,BIS Report,)
  ProductByFilters(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(
        this.url + "/BISProgram/PostProductAdvanceFilter",
        param,
        HttpToken
      )
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion
  //region Common Product Filter (Product,BIS Report,BIS Program)
  ProductFilters(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostProductFilters", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
  //endregion
  //region Product Filter Key list (PO Reference)
  ProductPOFilters(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostBISFilter_KeyList", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion
  //region Product Filter Key list(BISProgram,Guest)
  TradeProductFilters(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostFilter_For_BISProgram", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
 //endregion
  //region Product Filter Key list(Search By product,BIS Report)

  ProductCommonFilters(param: any): Observable<any> {

    const HttpToken = {

      headers: new HttpHeaders({

        "Content-Type": "application/json",

        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`

      })

    };

    return this.http

      .post<any>(this.url + "/BIS/PostBISFilter_KeyList", param, HttpToken)

      .pipe(retry(0), catchError(this.handleError));

  }
  //endregion
  //region product Filter By dynamic query(Guest)//
  TradingByFilters(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(
        this.url + "/BISProgram/PostProductAdvanceFilter",
        param,
        HttpToken
      )
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion
  //region File upload
  async submitFileUpload(fd: FormData): Promise<Observable<any>> {
    let returnValue: any;
    const _headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${sessionStorage.getItem("access_token")}`
    );
    await this.http
      .post<any>(this.url + "/DocumentUpload", fd, { headers: _headers })
      .toPromise()
      .then(data => {
        returnValue = of(data);
      })
      .catch(error => {
        console.error(error);
        returnValue = throwError(new Error(error.message));
      });
    return returnValue;
  }
  //endregion
  //region Upload file
  public uploadFile(file: Blob): Observable<HttpEvent<void>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.http.request(
      new HttpRequest("POST", this.url + "/BISProgram/Upload", formData, {
        reportProgress: true
      })
    );
  }
 //endregion

  //region Create BIS Program //
  public BISApplication(
    application: BISApplication
  ): Observable<HttpEvent<any>> {
    debugger
    var formData = new FormData();
    formData.append("BISProgramID", application.BISProgramID);
    formData.append("Category", application.Category);
    formData.append("R_Number", application.R_Number);
    formData.append("Product", application.Product);
    formData.append("Model_For_BIS", application.Model_For_BIS);
    formData.append("Details", application.Details);
    formData.append("Test_Request", application.Test_Request);
    formData.append("India_SS_Date", application.India_SS_Date);
    formData.append("Lead_Model", application.Lead_Model);
    formData.append("Series_Model", application.Series_Model);
    formData.append(
      "FInalize_BIS_Model_Plan",
      application.FInalize_BIS_Model_Plan
    );
    formData.append(
      "FInalize_BIS_Model_Plan_Revised",
      application.FInalize_BIS_Model_Plan_Revised
    );
    formData.append(
      "Finalize_BIS_Model_Actual",
      application.Finalize_BIS_Model_Actual
    );
    formData.append("Biz_Approval_PO_Plan", application.Biz_Approval_PO_Plan);
    formData.append(
      "Biz_Approval_PO_Plan_Revised",
      application.Biz_Approval_PO_Plan_Revised
    );
    formData.append(
      "Biz_Approval_PO_Actual",
      application.Biz_Approval_PO_Actual
    );
    formData.append("Sample_Receipt_Plan", application.Sample_Receipt_Plan);
    formData.append(
      "Sample_Receipt_Plan_Revised",
      application.Sample_Receipt_Plan_Revised
    );
    formData.append("Sample_Receipt_Actual", application.Sample_Receipt_Actual);
    formData.append(
      "Sample_Submission_Lab_Plan",
      application.Sample_Submission_Lab_Plan
    );
    formData.append(
      "Sample_Submission_Lab_Plan_Revised",
      application.Sample_Submission_Lab_Plan_Revised
    );
    formData.append(
      "Sample_Submission_Lab_Actual",
      application.Sample_Submission_Lab_Actual
    );
    formData.append(
      "BIS_Lab_Test_Report_Plan",
      application.BIS_Lab_Test_Report_Plan
    );
    formData.append(
      "BIS_Lab_Test_Report_Plan_Revised",
      application.BIS_Lab_Test_Report_Plan_Revised
    );
    formData.append(
      "BIS_Lab_Test_Report_Actual",
      application.BIS_Lab_Test_Report_Actual
    );
    formData.append(
      "Letter_Submit_Govt_Plan",
      application.Letter_Submit_Govt_Plan
    );
    formData.append(
      "Letter_Submit_Govt_Plan_Revised",
      application.Letter_Submit_Govt_Plan_Revised
    );
    formData.append(
      "Letter_Submit_Govt_Actual",
      application.Letter_Submit_Govt_Actual
    );
    formData.append("BIS_Approved_Plan", application.BIS_Approved_Plan);
    formData.append(
      "BIS_Approved_Plan_Revised",
      application.BIS_Approved_Plan_Revised
    );
    formData.append("BIS_Approved_Actual", application.BIS_Approved_Actual);

    if (application.Upld_Test_Report == null) {
      application.Upld_Test_Report &&
        formData.append("Upld_Test_Report", application.Upld_Test_Report);
    } else {
      var Upld_Test_Report =
        this.todayNumber + "_" + application.Upld_Test_Report.name;
      application.Upld_Test_Report &&
        formData.append(
          "Upld_Test_Report",
          application.Upld_Test_Report,
          Upld_Test_Report
        );
    }

    if (application.Upld_Certificate == null) {
      application.Upld_Certificate &&
        formData.append("Upld_Certificate", application.Upld_Certificate);
    } else {
      var Upld_Certificate =
        this.todayNumber + "_" + application.Upld_Certificate.name;
      application.Upld_Certificate &&
        formData.append(
          "Upld_Certificate",
          application.Upld_Certificate,
          Upld_Certificate
        );
    }

    if (application.Upld_TestRequest == null) {
      application.Upld_TestRequest && formData.append("Upld_TestRequest", application.Upld_TestRequest);
    } else {
      var Upld_TestRequest = this.todayNumber + "_" + application.Upld_TestRequest.name;
      application.Upld_TestRequest &&
        formData.append("Upld_TestRequest", application.Upld_TestRequest, Upld_TestRequest);
    }

    if (application.Upld_RGPReference == null) {
      application.Upld_RGPReference && formData.append("Upld_RGPReference", application.Upld_RGPReference);
    } else {
      var Upld_RGPReference = this.todayNumber + "_" + application.Upld_RGPReference.name;
      application.Upld_RGPReference &&
        formData.append("Upld_RGPReference", application.Upld_RGPReference, Upld_RGPReference);
    }

    if (application.CCLUpload == null) {
      application.CCLUpload && formData.append("CCLUpload", application.CCLUpload);
    } else {
      var CCLUpload = this.todayNumber + "_" + application.CCLUpload.name;
      application.CCLUpload &&
        formData.append("CCLUpload", application.CCLUpload, CCLUpload);
    }


    if (application.Upld_BISProgramOthers == null) {
      application.Upld_BISProgramOthers && formData.append("Upld_BISProgramOthers", application.Upld_BISProgramOthers);
    } else {
      var Upld_BISProgramOthers = this.todayNumber + "_" + application.Upld_BISProgramOthers.name;
      application.Upld_BISProgramOthers &&
        formData.append("Upld_BISProgramOthers", application.Upld_BISProgramOthers, Upld_BISProgramOthers);
    }

    formData.append("Test_Report", application.Test_Report);
    formData.append("Inclusion_Request_ID", application.Inclusion_Request_ID);
    formData.append("RGP_Reference", application.RGP_Reference);
    formData.append("Adapter", application.Adapter);
    formData.append("UMA_DIS", application.UMA_DIS);
    formData.append("Battery", application.Battery);
    formData.append("Others", application.Others);
    formData.append("PlantId", application.PlantId);
    formData.append("CreatedBy", application.CreatedBy);
    formData.append("MfgPlantID", application.MfgPlantID);

    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    const _headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${encryptLocalStorage.getItem("access_token")}`
    );

    return this.http.request(
      new HttpRequest(
        "POST",
        this.url + "/BISProgram/PostManageBISProgram",
        formData,
        { headers: _headers }
      )
    );
  }
//endregion

  //region Create BIS Program //
  public CCLApplication(
    application: CCLApplication
  ): Observable<HttpEvent<any>> {
    debugger
    var formData = new FormData();
    formData.append("BISProgramID", application.BISProgramID);
    formData.append("Category", application.Category);
    formData.append("R_Number", application.R_Number);
    formData.append("Product", application.Product);
    formData.append("Model_For_BIS", application.Model_For_BIS);
    formData.append("Details", application.Details);
    formData.append("Test_Request", application.Test_Request);
    formData.append("India_SS_Date", application.India_SS_Date);
    formData.append("Lead_Model", application.Lead_Model);
    formData.append("Series_Model", application.Series_Model);
    formData.append(
      "FInalize_BIS_Model_Plan",
      application.FInalize_BIS_Model_Plan
    );
    formData.append(
      "FInalize_BIS_Model_Plan_Revised",
      application.FInalize_BIS_Model_Plan_Revised
    );
    formData.append(
      "Finalize_BIS_Model_Actual",
      application.Finalize_BIS_Model_Actual
    );
    formData.append("Biz_Approval_PO_Plan", application.Biz_Approval_PO_Plan);
    formData.append(
      "Biz_Approval_PO_Plan_Revised",
      application.Biz_Approval_PO_Plan_Revised
    );
    formData.append(
      "Biz_Approval_PO_Actual",
      application.Biz_Approval_PO_Actual
    );
    formData.append("Sample_Receipt_Plan", application.Sample_Receipt_Plan);
    formData.append(
      "Sample_Receipt_Plan_Revised",
      application.Sample_Receipt_Plan_Revised
    );
    formData.append("Sample_Receipt_Actual", application.Sample_Receipt_Actual);
    formData.append(
      "Sample_Submission_Lab_Plan",
      application.Sample_Submission_Lab_Plan
    );
    formData.append(
      "Sample_Submission_Lab_Plan_Revised",
      application.Sample_Submission_Lab_Plan_Revised
    );
    formData.append(
      "Sample_Submission_Lab_Actual",
      application.Sample_Submission_Lab_Actual
    );
    formData.append(
      "BIS_Lab_Test_Report_Plan",
      application.BIS_Lab_Test_Report_Plan
    );
    formData.append(
      "BIS_Lab_Test_Report_Plan_Revised",
      application.BIS_Lab_Test_Report_Plan_Revised
    );
    formData.append(
      "BIS_Lab_Test_Report_Actual",
      application.BIS_Lab_Test_Report_Actual
    );
    formData.append(
      "Letter_Submit_Govt_Plan",
      application.Letter_Submit_Govt_Plan
    );
    formData.append(
      "Letter_Submit_Govt_Plan_Revised",
      application.Letter_Submit_Govt_Plan_Revised
    );
    formData.append(
      "Letter_Submit_Govt_Actual",
      application.Letter_Submit_Govt_Actual
    );
    formData.append("BIS_Approved_Plan", application.BIS_Approved_Plan);
    formData.append(
      "BIS_Approved_Plan_Revised",
      application.BIS_Approved_Plan_Revised
    );
    formData.append("BIS_Approved_Actual", application.BIS_Approved_Actual);

    if (application.Upld_Test_Report == null) {
      application.Upld_Test_Report &&
        formData.append("Upld_Test_Report", application.Upld_Test_Report);
    } else {
      var Upld_Test_Report =
        this.todayNumber + "_" + application.Upld_Test_Report.name;
      application.Upld_Test_Report &&
        formData.append(
          "Upld_Test_Report",
          application.Upld_Test_Report,
          Upld_Test_Report
        );
    }

    if (application.Upld_Certificate == null) {
      application.Upld_Certificate &&
        formData.append("Upld_Certificate", application.Upld_Certificate);
    } else {
      var Upld_Certificate =
        this.todayNumber + "_" + application.Upld_Certificate.name;
      application.Upld_Certificate &&
        formData.append(
          "Upld_Certificate",
          application.Upld_Certificate,
          Upld_Certificate
        );
    }

    if (application.Upld_TestRequest == null) {
      application.Upld_TestRequest && formData.append("Upld_TestRequest", application.Upld_TestRequest);
    } else {
      var Upld_TestRequest = this.todayNumber + "_" + application.Upld_TestRequest.name;
      application.Upld_TestRequest &&
        formData.append("Upld_TestRequest", application.Upld_TestRequest, Upld_TestRequest);
    }

    if (application.Upld_RGPReference == null) {
      application.Upld_RGPReference && formData.append("Upld_RGPReference", application.Upld_RGPReference);
    } else {
      var Upld_RGPReference = this.todayNumber + "_" + application.Upld_RGPReference.name;
      application.Upld_RGPReference &&
        formData.append("Upld_RGPReference", application.Upld_RGPReference, Upld_RGPReference);
    }

    if (application.CCLUpload == null) {
      application.CCLUpload && formData.append("CCLUpload", application.CCLUpload);
    } else {
      var CCLUpload = this.todayNumber + "_" + application.CCLUpload.name;
      application.CCLUpload &&
        formData.append("CCLUpload", application.CCLUpload, CCLUpload);
    }
    if (application.CCLInclusion_1 == null) {
      application.CCLInclusion_1 && formData.append("CCLInclusion_1", application.CCLInclusion_1);
    } else {
      var CCLInclusion_1 = this.todayNumber + "_" + application.CCLInclusion_1.name;
      application.CCLInclusion_1 &&
        formData.append("CCLInclusion_1", application.CCLInclusion_1, CCLInclusion_1);
    }

    if (application.CCLInclusion_2 == null) {
      application.CCLInclusion_2 && formData.append("CCLInclusion_2", application.CCLInclusion_2);
    } else {
      var CCLInclusion_2 = this.todayNumber + "_" + application.CCLInclusion_2.name;
      application.CCLInclusion_2 &&
        formData.append("CCLInclusion_2", application.CCLInclusion_2, CCLInclusion_2);
    }

    if (application.Upld_BISProgramOthers == null) {
      application.Upld_BISProgramOthers && formData.append("Upld_BISProgramOthers", application.Upld_BISProgramOthers);
    } else {
      var Upld_BISProgramOthers = this.todayNumber + "_" + application.Upld_BISProgramOthers.name;
      application.Upld_BISProgramOthers &&
        formData.append("Upld_BISProgramOthers", application.Upld_BISProgramOthers, Upld_BISProgramOthers);
    }

    formData.append("Test_Report", application.Test_Report);
    formData.append("Inclusion_Request_ID", application.Inclusion_Request_ID);
    formData.append("RGP_Reference", application.RGP_Reference);
    formData.append("Adapter", application.Adapter);
    formData.append("UMA_DIS", application.UMA_DIS);
    formData.append("Battery", application.Battery);
    formData.append("Others", application.Others);
    formData.append("PlantId", application.PlantId);
    formData.append("CreatedBy", application.CreatedBy);
    formData.append("MfgPlantID", application.MfgPlantID);

    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    const _headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${encryptLocalStorage.getItem("access_token")}`
    );

    return this.http.request(
      new HttpRequest(
        "POST",
        this.url + "/BISProgram/PostManageBISProgram",
        formData,
        { headers: _headers }
      )
    );
  }
//endregion

  //region Create Operating license
  public OperatingApplication(
    application: OperatingApplication
  ): Observable<HttpEvent<void>> {
    var formData = new FormData();
    formData.append("OLID", application.OLID);
    formData.append("Registration_No", application.Registration_No);
    formData.append("Product_Category", application.Product_Category);
    formData.append("Product_Name", application.Product_Name);
    formData.append("Registered_On", application.Registered_On);
    formData.append("Valid_Till", application.Valid_Till);
    formData.append("Applicable_Products", application.Applicable_Products);
    formData.append("Status", application.Status);
    formData.append("MfgName", application.MfgName);
    if (application.License_Doc == null) {
      application.License_Doc &&
        formData.append("License_Doc", application.License_Doc);
    } else {
      var License = this.todayNumber + "_" + application.License_Doc.name;
      application.License_Doc &&
        formData.append("License_Doc", application.License_Doc, License);
    }
    formData.append("CreatedBy", application.CreatedBy);
    formData.append("PlantId", application.PlantId);

    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "multipart/form-data",

        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    const _headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${encryptLocalStorage.getItem("access_token")}`
    );

    return this.http.request(
      new HttpRequest(
        "POST",
        this.url + "/BISProgram/PostManageOperativeLicense",
        formData,
        { headers: _headers }
      )
    );
  }
//endregion
//Dynamic Img Apllication
public DynamicApplication(
  application: DynamicApplication
): Observable<HttpEvent<void>> {
  var formData = new FormData();
  formData.append("Prm_ID", application.Prm_ID);
  formData.append("FK_IDD", application.FK_IDD);
  formData.append("Picture_Positionn", application.Picture_Positionn);
  formData.append("IsActivee", application.IsActivee);
  formData.append("Str", application.Str);

  if (application.Picture_Namee) {
    formData.append("Picture_Namee", application.Picture_Namee);
  }


  const HttpToken = {
    headers: new HttpHeaders({
      "Content-Type": "multipart/form-data",

      Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
    })
  };

  const _headers = new HttpHeaders().set(
    "Authorization",
    `Bearer ${encryptLocalStorage.getItem("access_token")}`
  );

  return this.http.request(
    new HttpRequest(
      "POST",
      this.url + "/BIS/PostManage_Banner_Picture",
      formData,
      { headers: _headers }
    )
  );
}

//endregion
  //region Create PO Reference
  public POApplication(
    application: POApplication
  ): Observable<HttpEvent<void>> {
    debugger;
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "multipart/form-data",

        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    const _headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${encryptLocalStorage.getItem("access_token")}`
    );
    var formData = new FormData();
    formData.append("POID", application.POID);
    formData.append("Category", application.Category);
    formData.append("Product", application.Product);
    formData.append("PO_Type", application.PO_Type);
    formData.append("Model_for_BIS", application.Model_for_BIS);
    formData.append("Supplier_Name", application.Supplier_Name);
    formData.append(
      "Quotation_Reference_No",
      application.Quotation_Reference_No
    );
    formData.append("Quotation_Date", application.Quotation_Date);
    formData.append("PO_Reference_No", application.PO_Reference_No);
    formData.append("PO_Value_in_INR", application.PO_Value_in_INR);
    formData.append("PO_Date", application.PO_Date);
    debugger
    formData.append("Invoice_No", application.Invoice_No);
    formData.append("Invoice_date", application.Invoice_date);
    formData.append("Payment_Release_Date", application.Payment_Release_Date);
    formData.append("Payment_Value_in_INR", application.Payment_Value_in_INR);
    formData.append("Balance_Amount", application.Balance_Amount);
    formData.append("CreatedBy", application.CreatedBy);
    formData.append("Payment_Term_In_Days", application.Payment_Term_In_Days);
    formData.append("Invoice_Remarks", application.Invoice_Remarks);
    formData.append("PO_Remarks", application.PO_Remarks);
    //  formData.append("Invoice_No", application.Invoice_No);

    if (application.Upload_Quotation == null) {
      application.Upload_Quotation &&
        formData.append("Upload_Quotation", application.Upload_Quotation);
    } else {
      var Quotation =
        this.todayNumber + "_" + application.Upload_Quotation.name;
      application.Upload_Quotation &&
        formData.append(
          "Upload_Quotation",
          application.Upload_Quotation,
          Quotation
        );
    }

    if (application.Upload_PO_Reference == null) {
      application.Upload_PO_Reference &&
        formData.append("Upload_PO_Reference", application.Upload_PO_Reference);
    } else {
      var PO_Reference =
        this.todayNumber + "_" + application.Upload_PO_Reference.name;
      application.Upload_PO_Reference &&
        formData.append(
          "Upload_PO_Reference",
          application.Upload_PO_Reference,
          PO_Reference
        );
    }

    if (application.Upload_Invoice == null) {
      application.Upload_Invoice &&
        formData.append("Upload_Invoice", application.Upload_Invoice);
    } else {
      var Invoice = this.todayNumber + "_" + application.Upload_Invoice.name;
      application.Upload_Invoice &&
        formData.append("Upload_Invoice", application.Upload_Invoice, Invoice);
    }

    formData.append("PlantId", application.PlantId);
    formData.append("MfgPlantID", application.MfgPlantID);
    debugger;
    return this.http
      .post<any>(this.url + "/BISProgram/PostManagePORef", formData, {
        headers: _headers
      })
      .pipe(retry(0), catchError(this.handleError));
  }
  //endregion

  public PostRMMaterial(
    application: RMMaterial
  ): Observable<HttpEvent<void>> {
    debugger;
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "multipart/form-data",

        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    const _headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${encryptLocalStorage.getItem("access_token")}`
    );
    var formData = new FormData();
    formData.append("RIDD", application.RIDD);
    formData.append("FYY", application.FYY);
    formData.append("Date_of_Inventoryy", application.Date_of_Inventoryy);
    formData.append("Productt", application.Productt);
    formData.append("Categoryy", application.Categoryy);
    formData.append("Engg_Lab_Serial_numberr", application.Engg_Lab_Serial_numberr);
    formData.append("Reasonn", application.Reasonn);
    formData.append("RORQQ", application.RORQQ);
    formData.append("Accessoriess", application.Accessoriess);
    formData.append("Modell", application.Modell);
    formData.append("Part_numberr", application.Part_numberr);
    formData.append("Qtyy", application.Qtyy);
    formData.append("Unit_pricee", application.Unit_pricee);
    formData.append("Tax_Statuss", application.Tax_Statuss);
    formData.append("Finnace_remarkss", application.Finnace_remarkss);
    formData.append("Statuss", application.Statuss);
    formData.append("Tax_paid_datee", application.Tax_paid_datee);

    if (application.Inventory_approvall == null) {
      application.Inventory_approvall && formData.append("Inventory_approvall", application.Inventory_approvall);
    } else {
      var Inventory_approvall = this.todayNumber + "_" + application.Inventory_approvall.name;
      application.Inventory_approvall &&
        formData.append("Inventory_approvall", application.Inventory_approvall, Inventory_approvall);
    }
    if (application.Duty_Uploadd == null) {
      application.Duty_Uploadd && formData.append("Duty_Uploadd", application.Duty_Uploadd);
    } else {
      var Duty_Uploadd = this.todayNumber + "_" + application.Duty_Uploadd.name;
      application.Duty_Uploadd &&
        formData.append("Duty_Uploadd", application.Duty_Uploadd, Duty_Uploadd);
    }
    formData.append("Str", application.Str);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Adjust token retrieval if necessary
    });

    return this.http
    .post<any>(this.url + "/BIS/PostRMMaterial", formData, {
      headers: _headers
    })
    .pipe(retry(0), catchError(this.handleError));
    }

  //endregion
  public InwardApplication(
    application: InwardApplication
  ): Observable<HttpEvent<void>> {
    debugger;
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "multipart/form-data",

        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    const _headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${encryptLocalStorage.getItem("access_token")}`
    );
    var formData = new FormData();
    formData.append("WIDD", application.WIDD);
    formData.append("FYY", application.FYY);
    formData.append("Date_of_receiptt", application.Date_of_receiptt);
    formData.append("Productt", application.Productt);
    formData.append("categoryy", application.categoryy);
    formData.append("Samplee", application.Samplee);
    formData.append("MTMM", application.MTMM);
    formData.append("Serial_noo", application.Serial_noo);
    formData.append("Engg_Lab_Serial_noo", application.Engg_Lab_Serial_noo);
    formData.append("Waybill_noo", application.Waybill_noo);
    formData.append("Incotermss", application.Incotermss);
    formData.append("Asset_Typee", application.Asset_Typee);
    formData.append("GAMS_Asset_Ownerr", application.GAMS_Asset_Ownerr);
    formData.append("Challan_numberr", application.Challan_numberr);
    formData.append("GAMS_Asset_IDD", application.GAMS_Asset_IDD);
    formData.append("Accessoriess", application.Accessoriess);
    formData.append("Modell", application.Modell);
    formData.append("Part_numberr", application.Part_numberr);
    formData.append("Qtyy", application.Qtyy);
    formData.append("Working_Conditionn", application.Working_Conditionn);
    formData.append("Storage_Locationn", application.Storage_Locationn);
    formData.append("Remarkss", application.Remarkss);
    formData.append("Received_Byy", application.Received_Byy);
    formData.append("statuss", application.statuss);
    formData.append("Lab_Detailss", application.Lab_Detailss);
    formData.append("Technical_leadd", application.Technical_leadd);
    formData.append("Date_of_returnn", application.Date_of_returnn);
    formData.append("Product_Statuss", application.Product_Statuss);
    formData.append("History_Logss", application.History_Logss);
    if (application.Inwards_Docss == null) {
      application.Inwards_Docss && formData.append("Inwards_Docss", application.Inwards_Docss);
    } else {
      var Inwards_Docss = this.todayNumber + "_" + application.Inwards_Docss.name;
      application.Inwards_Docss &&
        formData.append("Inwards_Docss", application.Inwards_Docss, Inwards_Docss);
    }
    if (application.Inwards_Docss == null) {
      application.Inwards_Docss && formData.append("incoterms_Docss", application.Inwards_Docss);
    } else {
      var incoterms_Docss = this.todayNumber + "_" + application.incoterms_Docss.name;
      application.incoterms_Docss &&
        formData.append("incoterms_Docss", application.incoterms_Docss, incoterms_Docss);
    }
    formData.append("Str", application.Str);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}` // Adjust token retrieval if necessary
    });

    return this.http
    .post<any>(this.url + "/BIS/PostBIS_Inward", formData, {
      headers: _headers
    })
    .pipe(retry(0), catchError(this.handleError));
    }

  //endregion
  //region Create BIS Query
  QueryApplication(form: any): Observable<any> {
    debugger
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostManageBISQuery", form, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion
selectedrow(form: any): Observable<any> {
  debugger
  const HttpToken = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
    })
  };
  //
  return this.http
    .post<any>(this.url + "/BIS/PostManageBISQuerys", form, HttpToken)
    .pipe(retry(0), catchError(this.handleError));
}
//endregion

//region Create PostCCLInclusion
PostCCLInclusion(form: any): Observable<any> {
  debugger
  const HttpToken = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
    })
  };
  //
  return this.http
    .post<any>(this.url + "/BIS/PostCCLInclusion", form, HttpToken)
    .pipe(retry(0), catchError(this.handleError));
}
//endregion
//region Create PostCCLInclusion
Postcategory_Data_CCLInclusion(form: any): Observable<any> {
  debugger
  const HttpToken = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
    })
  };
  //
  return this.http
    .post<any>(this.url + "/BIS/Postcategory_Data_CCLInclusion", form, HttpToken)
    .pipe(retry(0), catchError(this.handleError));
}
//endregion

//region Create FilterByInclusionID
PostBISQueryFilterByInclusionID(form: any): Observable<any> {
  debugger
  const HttpToken = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
    })
  };
  //
  return this.http
    .post<any>(this.url + "/BIS/PostBISFilterByInclusionID", form, HttpToken)
    .pipe(retry(0), catchError(this.handleError));
}
//endregion
//region Create FilterByInclusionID
PostKeyFiltersBy_Param
 (form: any): Observable<any> {
  debugger
  const HttpToken = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
    })
  };
  //
  return this.http
    .post<any>(this.url + "/BIS/PostToGetLeadSeriesByModel", form, HttpToken)
    .pipe(retry(0), catchError(this.handleError));
}
//endregion
  //region Create MFG
  MfgApplication(form: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostManageMfgPlant", form, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion
  //region Create MFG
  GetBISInwarddetails(): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .get<any>(this.url + "/BIS/GetBISInwarddetails",HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }


  PostInward_Receipt_Acknowledge_Mail(): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .get<any>(this.url + "/Email/PostInward_Receipt_Acknowledge_Mail",HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion
Get_Inwardsample(): Observable<any> {
  const HttpToken = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
    })
  };
  //
  return this.http
    .get<any>(this.url + "/BIS/Get_Inwardsample",HttpToken)
    .pipe(retry(0), catchError(this.handleError));
}

Get_InwardAccessories(): Observable<any> {
  const HttpToken = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
    })
  };
  //
  return this.http
    .get<any>(this.url + "/BIS/Get_InwardAccessories",HttpToken)
    .pipe(retry(0), catchError(this.handleError));
}

Get_InwardCategory(): Observable<any> {
  const HttpToken = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
    })
  };
  //
  return this.http
    .get<any>(this.url + "/BIS/Get_InwardCategory",HttpToken)
    .pipe(retry(0), catchError(this.handleError));
}
  //region Create User Module//
  UserApplication(form: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostManageBISUser", form, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion
  //region Get and List User module//
  ManageUserModuleList(): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .get<any>(this.url + "/BIS/GetUserList", HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
  //endregion
  //region Create Notification //
  NotificationApplication(form: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostManageBISNotification", form, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion
  //region Get and List Mfg

  ManageMfgLists(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostMfgPlantList", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }

   //endregion
  //region Get and List notification//
  // ManageBISNotification(param: any): Observable<any> {
  //   const HttpToken = {
  //     headers: new HttpHeaders({
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
  //     })
  //   };

  //   return this.http
  //     .post<any>(this.url + "/BIS/PostBISNotification", param, HttpToken)
  //     .pipe(retry(0), catchError(this.handleError));
  // }
  // //endregion
  //region Get and List Notification Login//
  ManageLoginNotification(): Observable<any> {
    return this.http
      .get<any>(this.url + "/BIS/GetBISNotificationList")
      .pipe(retry(0), catchError(this.handleError));
  }
  //endregion
  //region Display Chart Count//
  ManageGetBISChart(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostBISChart", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
  //endregion
  //endchart//
  // region dashboard Status by Granted,WIP,Plan//

  DataByPlant(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostDashboard_DataByPlant", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
  //endregion
  // region Dashboard status data//
  ListStatusData(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(
        this.url + "/BISProgram/PostBISListBy_Status",
        param,
        HttpToken
      )
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion

  //region List BIS Program(Product,Search By Product,Guest,BIS Report,BIS Program)//
  BISProgramMasterList(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(
        this.url + "/BISProgram/PostBISProgramMasterList",
        param,
        HttpToken
      )
      .pipe(retry(0), catchError(this.handleError));
  }
 //endregion
  //region Get MFG Modal For BIS(Search By Product)//
  GetMfgModalForBis(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(
        this.url + "/BISProgram/PostBISModelForMFGSites",
        param,
        HttpToken
      )
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion
  //region Operating License fetch data//
  OperatingMasterList(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostOperativeLicense", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion
  //region List PO Reference//
  POMasterList(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostPOReference", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
//endregion
  //region List PO Reference//
  QueryMasterList(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostBISQueryList", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
  //endregion
  //List Inclusion Id for BIS Query//
  GetBISInclusionList(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostBISQueryFilter", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
 //endregion
  //BIS Query FIlter By Inclusion//
  GetBISQueryFilterByInclusionID(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostBISQueryFilterByInclusionID", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
 //endregion
  // BIS Query Filter By Product//
  GetBISPOModelList(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostBISQueryProductFilter", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
 //endregion
  // //List of BIS Notification
  // GetBISNotification(param: any): Observable<any> {
  //   const HttpToken = {
  //     headers: new HttpHeaders({
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
  //     })
  //   };

  //   return this.http
  //     .post<any>(this.url + "/BIS/PostBISNotification", param, HttpToken)
  //     .pipe(retry(0), catchError(this.handleError));
  // }
  //  //endregion
  //BIS Granted and Lap test report//
  GrantedandLabMasterList(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(
        this.url + "/BIS/PostBISGrantedAndLabTestReport",
        param,
        HttpToken
      )
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion

  //Get BIS Granted Report By Days//
  GetBISGrantedReportByDays(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    return this.http
      .post<any>(this.url + "/BIS/GetBISGrantedReportByDays", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
 //endregion
  //GET Pending Inclusion//
  GetBISPendingInclusion(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostBISPendingInclusion", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion

  //Get Pending Inclusion By Days//
  GetBISPendingInclusionByDays(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(
        this.url + "/BIS/GetBISPendingInclusionByDays",
        param,
        HttpToken
      )
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion
  //Get lab test Report By Day//
  GetLabTestReportByDays(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/GetLabTestReportByDays", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion

  //Get pending payment count(Dashboard)//
  GetPendingPaymentStatusCount(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostBISPendingPaymentStatusCount", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion
  //Get pending payment count(Dashboard)//
  GetPendingPaymentStatusByCount(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostBISPendingPaymentStatusWiseList", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion

  //Get List of count for BIS Query//
  GetBISQueryCount(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    //
    return this.http
      .post<any>(this.url + "/BIS/PostBISQueryStatusCount", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion

  //Get and List BIS query By Count//
  GetBISQueryByCount(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };
    return this.http
      .post<any>(this.url + "/BIS/PostBISQuery_StatusWiseListt", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion
  //Delete Table in every module//

  PostDelDataByTable(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostDelDataByTable", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }
   //endregion

   PostUpdateFlagBIS_Inward(param: any): Observable<any> {
    const HttpToken = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
      })
    };

    return this.http
      .post<any>(this.url + "/BIS/PostUpdateFlagBIS_Inward", param, HttpToken)
      .pipe(retry(0), catchError(this.handleError));
  }

    //region ManageCategory//
    PostManageCategory(param: any): Observable<any> {
      const HttpToken = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
        })
      };

      return this.http
        .post<any>(this.url + "/BIS/PostManageCategory", param, HttpToken)
        .pipe(retry(0), catchError(this.handleError));
    }
  //endregion
     //region ManageSample//
     PostManageSample(param: any): Observable<any> {
      const HttpToken = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
        })
      };

      return this.http
        .post<any>(this.url + "/BIS/PostManageSample", param, HttpToken)
        .pipe(retry(0), catchError(this.handleError));
    }
  //endregion
    //region ManageSample//
    PostManageAccessories(param: any): Observable<any> {
      const HttpToken = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `Bearer ${encryptLocalStorage.getItem("access_token")}`
        })
      };

      return this.http
        .post<any>(this.url + "/BIS/PostManageAccessories", param, HttpToken)
        .pipe(retry(0), catchError(this.handleError));
    }
  //endregion
}
