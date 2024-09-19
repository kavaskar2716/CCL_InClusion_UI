import { Component, HostListener, Inject, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input,Pipe, PipeTransform  } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "src/app/notification.service";
import { AuthService } from "src/app/_services/auth.service";
import { SharedService } from "src/app/shared.service";
import { Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { DatePipe, DOCUMENT } from "@angular/common";
import { HttpEventType } from "@angular/common/http";
import Swal from "sweetalert2";
import { AgGridAngular } from "ag-grid-angular";
import { CellClassParams } from "ag-grid-community";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { ColDef, GridApi, ColumnApi, CsvExportParams, ProcessHeaderForExportParams, ICellRendererParams, ModuleRegistry, RowGroupingDisplayType } from "ag-grid-community";
import { ProgressStatus, ProgressStatusEnum } from "src/app/model/progress-status.model";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { saveAs } from "file-saver-es";
import * as _moment from "moment";
import { MatAccordion } from "@angular/material/expansion";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
const moment = _moment;
declare var bootstrap: any;

@Component({
  selector: 'app-ccl-program',
  templateUrl: './ccl-program.component.html',
  styleUrls: ['./ccl-program.component.css'],
  providers: [DatePipe],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})

export class CclProgramComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild("agGrid", { static: false }) agGrid: AgGridAngular;
  @Input() public disabled: boolean;
  @HostListener('window:scroll')
  @ViewChild("Upld_TestRequestRef") inputvar1: ElementRef;
  @ViewChild("Upld_Test_ReportRef") inputvar2: ElementRef;
  @ViewChild("CCLUploadRef") inputvar3: ElementRef;
  @ViewChild("CCLInclusion_1Ref") inputvar7: ElementRef;
  @ViewChild("CCLInclusion_2Ref") inputvar8: ElementRef;
  @ViewChild("Upld_CertificateRef") inputvar4: ElementRef;
  @ViewChild("Upld_RGPReferenceRef") inputvar5: ElementRef;
  @ViewChild("Upld_BISProgramOthersRef") inputvar6: ElementRef;
  @Output() public uploadStatus: EventEmitter<ProgressStatus>;
  @ViewChild("inputFile") inputFile: ElementRef;
  @ViewChild("tabset") tabset: any;
  componentTypes: string[] = ['Adapter', 'Connector'];
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  public groupDisplayType: RowGroupingDisplayType = "groupRows";
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 50,
    autoHeight: true,
    wrapText: true,
    resizable: true,
    filter: true,
    sortable: true,
    floatingFilter: true,
  };
  filteredComponentList: any[] = [];
  columnDefs: ColDef[] = []; // Define an empty array for column definitions
  columnDefstr: ColDef[] = []; // Define an empty array for column definitions
  rowData: any[] = []; // Define an empty array for row data
  filters: { [key: string]: string } = {};
  disableSwitching: boolean;
  isClicked: boolean = false;
  public isVisible: boolean = false;
  show = false;
  buttonName = "Show";
  hide: any;
  typeSelected: string;
  isDone = true;
  fileName = "";
  searchText;
  isShow: boolean;
  topPosToStartShowing = 10;
  myDate = new Date();
  send_date = new Date();
  formattedDate: any;
  today = Date.now();
  //Date Formatt to Display
  India_SS = new FormControl(new Date("yyyy-mm-dd"));
  startDate = new FormControl(new Date("yyyy-mm-dd"));
  endDate = new FormControl(new Date("yyyy-mm-dd"));
  startDaterevised = new FormControl(new Date("yyyy-mm-dd"));
  startDate1 = new FormControl(new Date("yyyy-mm-dd"));
  startDate1re = new FormControl(new Date("yyyy-mm-dd"));
  endDate1 = new FormControl(new Date("yyyy-mm-dd"));
  startDate2 = new FormControl(new Date("yyyy-mm-dd"));
  startDate2re = new FormControl(new Date("yyyy-mm-dd"));
  endDate2 = new FormControl(new Date("yyyy-mm-dd"));
  startDate3 = new FormControl(new Date("yyyy-mm-dd"));
  startDate3re = new FormControl(new Date("yyyy-mm-dd"));
  endDate3 = new FormControl(new Date("yyyy-mm-dd"));
  startDate4 = new FormControl(new Date("yyyy-mm-dd"));
  startDate4re = new FormControl(new Date("yyyy-mm-dd"));
  endDate4 = new FormControl(new Date("yyyy-mm-dd"));
  startDate5 = new FormControl(new Date("yyyy-mm-dd"));
  startDate5re = new FormControl(new Date("yyyy-mm-dd"));
  endDate5 = new FormControl(new Date("yyyy-mm-dd"));
  startDate6 = new FormControl(new Date("yyyy-mm-dd"), [
    Validators.min(1),
    Validators.max(1),
  ]);
  startDate6re = new FormControl(new Date("yyyy-mm-dd"));
  endDate6 = new FormControl(new Date("yyyy-mm-dd"));
  fixedTimezone = this.today;
  public form: {
    BISProgramID: any;
    Category: string;
    R_Number: string;
    Product: string;
    Model_For_BIS: string;
    Details: string;
    Test_Request: string;
    Test_Report: string;
    Inclusion_Request_ID: string;
    RGP_Reference: string;
    India_SS_Date: string;
    Lead_Model: string;
    Series_Model: string;
    Adapter: string;
    UMA_DIS: string;
    Battery: string;
    Others: string;
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
    MfgPlant1ID: any;
    Upld_Test_Report: FileList | null;
    Upld_Certificate: FileList | null;
    Upld_TestRequest: FileList | null;
    CCLUpload: FileList | null;
    CCLInclusion_1: FileList | null;
    CCLInclusion_2: FileList | null;
    Upld_RGPReference: FileList | null;
    Upld_BISProgramOthers: FileList | null;


  };
  toggleStyle: boolean = false;
  fileToUpload: any;
  BISProgramID = 0;
  isTableExpanded = false;
  searchTerm: any;
  public filterTerm!: any;
  ProductItemList: any = [];
  param: any;
  jsonParam: any = [];
  ProductType: string = "";
  ProductItemLists: any = [];
  ResProductFilterList: any = [];
  value1: any;
  target: HTMLButtonElement | undefined;
  ProdComplainenceLists: any = [];
  ProdMachineTypeLists: any = [];
  ProdMarketingSeriesLists: any = [];
  compid: any = "";
  machineid: any = "";
  marketingid: any = "";
  status: any = "";
  machineDisabled: boolean = false;
  msDisabled: boolean = false;
  compDisabled: boolean = false;
  stsDisabled: boolean = false;
  shared: any;
  formgroup: any;
  SharedService: any;
  message: string;
  BISMasterLists: any;
  Upld_Test_Report: any;
  isActiveDiv: boolean;
  DelDataByTables: any;
  latest_date: string;
  myPastDate: Date;
  myPastDates: string;
  fromDate1: any;
  fromDate;
  toDate;
  fromDates;
  toDates;
  PlantId: string;
  GetMfgList: any;
  MfgPlantID: number;
  MfgPlant1ID: number;
  mfgpondy: string;
  Roleid: string;
  GetBISProduct: any;
  BISCategory: any;
  BISCategoryR_Num: any;
  BISCategoryR_Num_Temp: any;
  autoenable: string;
  CCL_Component_List: any;
  listbis: any;
  filteredComponents: any;
  rejson: any;
  displayedComponents: any;
  componentsList: any;
  componentsListss: any;


  constructor(
    private authService: AuthService,
    private service: SharedService,
    private notifyService: NotificationService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: Document,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.typeSelected = "ball-fussion";
    this.send_date.setMonth(this.send_date.getMonth());
    (this.formattedDate = this.send_date.toISOString().slice(0, 10)),
      "dd-MM-yyyy";
    console.log(this.formattedDate);
    this.uploadStatus = new EventEmitter<ProgressStatus>();

    this.form = {
      BISProgramID: "",
      Category: "",
      R_Number: "",
      Product: "",
      Model_For_BIS: "",
      Details: "",
      Test_Request: "",
      India_SS_Date: "",
      Lead_Model: "",
      Series_Model: "",
      FInalize_BIS_Model_Plan: "",
      FInalize_BIS_Model_Plan_Revised: "",
      Finalize_BIS_Model_Actual: "",
      Biz_Approval_PO_Plan: "",
      Biz_Approval_PO_Plan_Revised: "",
      Biz_Approval_PO_Actual: "",
      Sample_Receipt_Plan: "",
      Sample_Receipt_Plan_Revised: "",
      Sample_Receipt_Actual: "",
      Sample_Submission_Lab_Plan: "",
      Sample_Submission_Lab_Plan_Revised: "",
      Sample_Submission_Lab_Actual: "",
      BIS_Lab_Test_Report_Plan: "",
      BIS_Lab_Test_Report_Plan_Revised: "",
      BIS_Lab_Test_Report_Actual: "",
      Letter_Submit_Govt_Plan: "",
      Letter_Submit_Govt_Plan_Revised: "",
      Letter_Submit_Govt_Actual: "",
      BIS_Approved_Plan: "",
      BIS_Approved_Plan_Revised: "",
      BIS_Approved_Actual: "",
      Test_Report: "",
      Inclusion_Request_ID: "",
      RGP_Reference: "",
      Adapter: "",
      UMA_DIS: "",
      Battery: "",
      Others: "",
      PlantId: "",
      MfgPlantID: 1,
      MfgPlant1ID: 2,
      CreatedBy: "",
      Upld_Test_Report: null,
      Upld_Certificate: null,
      Upld_TestRequest: null,
      CCLUpload: null,
      Upld_RGPReference: null,
      Upld_BISProgramOthers: null,
      CCLInclusion_1:null,
    CCLInclusion_2: null
    };
  }
  //region scroll height
  public lastScrolledHeight: number = 0;
  public showAddButton: boolean = true;

  @HostListener('window:scroll', ['$event']) onScroll(event) {
    const window = event.path[1];
    const currentScrollHeight = window.scrollY;
    console.log(currentScrollHeight);

    if (currentScrollHeight > this.lastScrolledHeight) {
      this.showAddButton = false;
      console.log('should NOT show button');
    } else {
      this.showAddButton = true;
      console.log('should show button');
    }
    this.lastScrolledHeight = currentScrollHeight;
  }
  //end region

  //Refresh
  refresh(): void {
    this._document.defaultView.location.reload();
  }
  //end region
  //regionScoll to top
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    console.log('[scroll]', scrollPosition);
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.rowData;
  }
  gridOptions = {
    sideBar: {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
        },
        // You can include other tool panels here if needed
      ],
      defaultToolPanel: "columns",
    },
  };
  // TODO: Cross browsing
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  //endregion
  //Scroll to Bottom
  goToBottom() {

    window.scrollTo(0, document.body.scrollHeight);

  }
  //endregion

  public subsVar: Subscription | undefined;
  //Fetch data for mat table
  BISList = new MatTableDataSource();
  //region BISProgramColumnList
  BISProgramColumnList: string[] = [
    "Action",
    "Category",
    "Inclusion_Request_Id",
    "Product",
    "Model_For_BIS",
    "India_SS_Date",
    "Lead_Model",
    "Series_Model",
    "CCL_Inclusion",
    "CCL_Inclusion_1",
    "CCL_Inclusion_2",

  ];
  //end region
  ngOnInit(): void {
    this.spinner.show();
    // this.GetMfgPlantList();
    this.PlantId = localStorage.getItem("PlantId");
    this.Roleid = localStorage.getItem("RoleID");
    this.EnableAppHeaderMenuList();
    // this.CategoryProductFilter();
    let type = this.activatedRoute.snapshot.params["type"];
    this.activatedRoute.paramMap.subscribe((params) => {
      type = params.get("type");
      console.log(type);
      this.ProductType = type;
      this.ProductItemList = null;

    });
    //Get BIS List Data
    this.BISProgramMasterLists();
    this.BISList.data = this.BISMasterLists;
    this.form.BISProgramID = 0;
    this.Get_CCL_Component_List();
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 3000);
  }
  hasBeenDisplayed(componentName: string, index: number): boolean {
    if (this.displayedComponents.has(componentName)) {
      return true;
    } else {
      this.displayedComponents.add(componentName);
      return false;
    }
  }
  MapR_Number(param: any) {
    debugger;
    // console.log(param.category);
    this.BISCategoryR_Num = this.BISCategoryR_Num_Temp;
    // this.BISCategoryR_Num = this.BISCategoryR_Num.filter(x => x.category === param.category);
    this.BISCategoryR_Num = this.BISCategoryR_Num.filter(
      (x) => x.category === param
    );
  }
  //Auto Enable date
  yesterdayDateFilter() {
    this.show = !this.show;

    if (this.show) {
      let FinalizeBis = new Date(this.form.India_SS_Date);
      let BizPoPlan = new Date(this.form.India_SS_Date);
      let Sample_Receipt = new Date(this.form.India_SS_Date);
      let Sample_Submission = new Date(this.form.India_SS_Date);
      let BIS_Lab_Test = new Date(this.form.India_SS_Date);
      let Letter_Submit = new Date(this.form.India_SS_Date);
      let BIS_Approved = new Date(this.form.India_SS_Date);
      FinalizeBis.setDate((FinalizeBis.getDate() / 7) * 5 - 178);
      BizPoPlan.setDate((BizPoPlan.getDate() / 7) * 5 - 164);
      Sample_Receipt.setDate((Sample_Receipt.getDate() / 7) * 5 - 108);
      Sample_Submission.setDate((Sample_Submission.getDate() / 7) * 5 - 94);
      BIS_Lab_Test.setDate((BIS_Lab_Test.getDate() / 7) * 5 - 66);
      Letter_Submit.setDate((Letter_Submit.getDate() / 7) * 5 - 63);
      BIS_Approved.setDate((BIS_Approved.getDate() / 7) * 5 - 35);

      this.form.FInalize_BIS_Model_Plan = this.datePipe.transform(
        FinalizeBis,
        "yyyy-MM-dd"
      );
      this.form.Biz_Approval_PO_Plan = this.datePipe.transform(
        BizPoPlan,
        "yyyy-MM-dd"
      );
      this.form.Sample_Receipt_Plan = this.datePipe.transform(
        Sample_Receipt,
        "yyyy-MM-dd"
      );
      this.form.Sample_Submission_Lab_Plan = this.datePipe.transform(
        Sample_Submission,
        "yyyy-MM-dd"
      );
      this.form.BIS_Lab_Test_Report_Plan = this.datePipe.transform(
        BIS_Lab_Test,
        "yyyy-MM-dd"
      );
      this.form.Letter_Submit_Govt_Plan = this.datePipe.transform(
        Letter_Submit,
        "yyyy-MM-dd"
      );
      this.form.BIS_Approved_Plan = this.datePipe.transform(
        BIS_Approved,
        "yyyy-MM-dd"
      );
    } else {
      this.form.FInalize_BIS_Model_Plan = "";
      this.form.Biz_Approval_PO_Plan = "";
      this.form.Sample_Receipt_Plan = "";
      this.form.Sample_Submission_Lab_Plan = "";
      this.form.BIS_Lab_Test_Report_Plan = "";
      this.form.Letter_Submit_Govt_Plan = "";
      this.form.BIS_Approved_Plan = "";
    }
  }
  //end region
  //region Search & Filter

  applyFilter(event: Event, columnName: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filters[columnName] = filterValue;

    this.BISList.filterPredicate = (data: any, filter: string): boolean => {
      return Object.keys(this.filters).every(column => {
        const columnFilterValue = this.filters[column];
        return !columnFilterValue || (data[column]?.toString().toLowerCase().includes(columnFilterValue));
      });
    };

    // Trigger the filter
    this.BISList.filter = JSON.stringify(this.filters);
  }

  //end region

  // Get MFG Plant
  GetMfgPlantList() {
    this.service.GetMfgPlant().subscribe(
      (response) => {
        this.GetMfgList = response.table;
      },
      (error) => {
        this.authService.logout();
      }
    );
  }
  //end region
  // Get_CCL_Component_List
  Get_CCL_Component_List() {
    debugger
    this.service.Get_CCL_Component_List().subscribe(
      (response) => {
        this.CCL_Component_List = response.table;

        this.filteredComponents = this.CCL_Component_List.filter(component =>
          this.listbis.InclusionDetails.some(detail => detail.Components === component.component)
        );
      },
      (error) => {
        this.authService.logout();
      }
    );
  }
  //end region

  // Get Category and Product
  CategoryProductFilter() {
    debugger;
    this.jsonParam = {
      PlantId: localStorage.getItem("PlantId"),
    };

    this.service.TradeProductFilters(this.jsonParam).subscribe((response) => {
      debugger;
      this.GetBISProduct = response;

      this.BISCategory = this.GetBISProduct.table;
      this.BISCategoryR_Num = this.GetBISProduct.table1;
      this.BISCategoryR_Num_Temp = this.GetBISProduct.table1;
      console.log(this.GetBISProduct);
    });
  }
  //end region
  // region showAlert
  showAlert(): void {
    if (this.isVisible) {
      return;
    }
    this.isVisible = true;

  }
  //end region
  // region noDelete
  noDelete() {

    setTimeout(() => this.isVisible = false, 500)
  }
  //end region
  //Delete
  PostDelDataByTables(param: any) {
    debugger;
    this.jsonParam = {
      delId: param,
      str: "BISMaster",
      PlantId: localStorage.getItem("PlantId"),
      DeleteBy: localStorage.getItem("name")

    };

    this.service.PostDelDataByTable(this.jsonParam).subscribe((response) => {
      this.DelDataByTables = response;
      console.log(this.DelDataByTables);
      if ((response.success = "DeleteSuccess")) {
        Swal.fire("Great!", "Delete Successfully!", "success");
        this.BISProgramMasterLists();
        setTimeout(() => this.isVisible = false, 500)
      }
    });
  }
  //end region
  //Edit
  EditBISMaster(element: any) {
    debugger;
    this.BISCategoryR_Num = this.BISCategoryR_Num_Temp;

    this.isActiveDiv = true;
    this.form.BISProgramID = element.bisProgramID;
    this.form.Category = element.category;
    this.form.R_Number = element.r_Number;
    this.form.Product = element.product;
    this.form.Model_For_BIS = element.model_For_BIS;
    this.form.Test_Request = element.test_Request;
    this.form.Lead_Model = element.lead_Model;
    this.form.India_SS_Date = element.india_SS_Date;
    this.form.Series_Model = element.series_Model;
    this.form.Details = element.details;
    this.form.FInalize_BIS_Model_Plan = element.fInalize_BIS_Model_Plan;
    // this.form.FInalize_BIS_Model_Plan_Revised =element.fInalize_BIS_Model_Plan_Revised;
    this.form.Finalize_BIS_Model_Actual = element.finalize_BIS_Model_Actual;
    this.form.Biz_Approval_PO_Plan = element.biz_Approval_PO_Plan;
    // this.form.Biz_Approval_PO_Plan_Revised =element.biz_Approval_PO_Plan_Revised;
    this.form.Biz_Approval_PO_Actual = element.biz_Approval_PO_Actual;
    this.form.Sample_Receipt_Plan = element.sample_Receipt_Plan;
    // this.form.Sample_Receipt_Plan_Revised = element.sample_Receipt_Plan_Revised;
    this.form.Sample_Receipt_Actual = element.sample_Receipt_Actual;
    this.form.Sample_Submission_Lab_Plan = element.sample_Submission_Lab_Plan;
    // this.form.Sample_Submission_Lab_Plan_Revised =element.sample_Submission_Lab_Plan_Revised;
    this.form.Sample_Submission_Lab_Actual = element.sample_Submission_Lab_Actual;
    this.form.BIS_Lab_Test_Report_Plan = element.biS_Lab_Test_Report_Plan;
    // this.form.BIS_Lab_Test_Report_Plan_Revised = element.biS_Lab_Test_Report_Plan_Revised;
    this.form.BIS_Lab_Test_Report_Actual = element.biS_Lab_Test_Report_Actual;
    this.form.Letter_Submit_Govt_Plan = element.letter_Submit_Govt_Plan;
    // this.form.Letter_Submit_Govt_Plan_Revised =element.letter_Submit_Govt_Plan_Revised;
    this.form.Letter_Submit_Govt_Actual = element.letter_Submit_Govt_Actual;
    this.form.BIS_Approved_Plan = element.biS_Approved_Plan;
    // this.form.BIS_Approved_Plan_Revised = element.biS_Approved_Plan_Revised;
    this.form.BIS_Approved_Actual = element.biS_Approved_Actual;
    this.form.Test_Report = element.test_Report;
    this.form.Inclusion_Request_ID = element.inclusion_Request_Id;
    this.form.RGP_Reference = element.rgP_Reference;
    this.form.Adapter = element.adapter;
    this.form.UMA_DIS = element.umA_DIS;
    this.form.Battery = element.battery;
    this.form.Others = element.others;
    this.form.PlantId = element.plantId;
    this.form.MfgPlantID = element.mfgPlant;
  }
  //end region
  // Product Name filter
  ProductFilters(param: string) {
    this.jsonParam = {
      ProductId: 0,
      ProductName: param,
      PlantId: localStorage.getItem("PlantId"),
    };

    this.service.ProductFilters(this.jsonParam).subscribe(
      (response) => {
        this.ResProductFilterList = response;
        this.ProdComplainenceLists =
          this.ResProductFilterList.resProdComplainenceLists;
        this.ProdMachineTypeLists =
          this.ResProductFilterList.resProdMachineTypeLists;
        this.ProdMarketingSeriesLists =
          this.ResProductFilterList.resProdMarketingSeriesLists;
        console.log(this.ResProductFilterList);
      },
      (error) => {
        this.authService.logout();
      }
    );
  }
  //end region

  // Get BIS Lists
  BISProgramMasterLists(): void {
    debugger

    this.spinner.show();

    this.service.Get_CCL_Inclusion_View_Data().subscribe(
      (response) => {
        // Check if response and BISProgramDetails are valid
        if (response && response.BISProgramDetails && Array.isArray(response.BISProgramDetails) && response.BISProgramDetails.length > 0) {
          const jsonResult = response.BISProgramDetails[0].JSONResult;

          // Validate JSONResult
          if (jsonResult && jsonResult.BISProgramDetails && Array.isArray(jsonResult.BISProgramDetails)) {
            // Set the data
            this.BISList.data = jsonResult.BISProgramDetails;

            // Extract InclusionDetails if it exists
            this.listbis = jsonResult.BISProgramDetails;

            // Filter components list from InclusionDetails
            this.componentsList = this.listbis.filter(detail => detail.InclusionDetails);
            this.componentsListss = this.componentsList.InclusionDetails.map(item => item.Components);

            console.log('BIS Program Details:', this.componentsList);
            console.log('Filtered Components List:', this.componentsListss);
          } else {
            console.error("JSONResult.BISProgramDetails is missing or not an array", jsonResult);
          }
        } else {
          console.error("Unexpected response structure", response);
        }
      },
      (error) => {
        console.error("Error fetching data", error);
        this.authService.logout(); // Handle authentication error
      },
      () => {
      this.spinner.hide();
      }
    );
  }

  openInNewTab(url: string) {
    if (!url) return;

    const encodedUrl = encodeURI(url);
    // window.open(encodedUrl + '#toolbar=0', '_blank');
    window.open(url + '#toolbar=0', '_blank');
  }
  hasDetailsOfType(element: any, componentType: string): boolean {
    return element.InclusionDetails.some(detail => detail.Components === componentType);
  }

  // Method to filter details by component type
  getDetailsByType(element: any, componentType: string): any[] {
    return element.InclusionDetails.filter(detail => detail.Components === componentType);
  }

  //end region

  //Reset
  resetForm() {

    this.form.BISProgramID = "";
    this.form.Category = "";
    this.form.R_Number = "";
    this.form.Product = "";
    this.form.Model_For_BIS = "";
    this.form.Test_Request = "";
    this.form.Lead_Model = "";
    this.form.India_SS_Date = "";
    this.form.Series_Model = "";
    this.form.Details = "";
    this.form.FInalize_BIS_Model_Plan = "";
    this.form.FInalize_BIS_Model_Plan_Revised = "";
    this.form.Finalize_BIS_Model_Actual = "";
    this.form.Biz_Approval_PO_Plan = "";
    this.form.Biz_Approval_PO_Plan_Revised = "";
    this.form.Biz_Approval_PO_Actual = "";
    this.form.Sample_Receipt_Plan = "";
    this.form.Sample_Receipt_Plan_Revised = "";
    this.form.Sample_Receipt_Actual = "";
    this.form.Sample_Submission_Lab_Plan = "";
    this.form.Sample_Submission_Lab_Plan_Revised = "";
    this.form.Sample_Submission_Lab_Actual = "";
    this.form.BIS_Lab_Test_Report_Plan = "";
    this.form.BIS_Lab_Test_Report_Plan_Revised = "";
    this.form.BIS_Lab_Test_Report_Actual = "";
    this.form.Letter_Submit_Govt_Plan = "";
    this.form.Letter_Submit_Govt_Plan_Revised = "";
    this.form.Letter_Submit_Govt_Actual = "";
    this.form.BIS_Approved_Plan = "";
    this.form.BIS_Approved_Plan_Revised = "";
    this.form.BIS_Approved_Actual = "";
    this.form.Test_Report = "";
    this.form.Inclusion_Request_ID = "";
    this.form.RGP_Reference = "";
    this.form.Adapter = "";
    this.form.UMA_DIS = "";
    this.form.Battery = "";
    this.form.Others = "";
    this.form.Upld_Test_Report = null;
    this.form.Upld_Certificate = null;
    this.form.Upld_TestRequest = null;
    this.form.CCLUpload = null;
    this.form.Upld_RGPReference = null;
    this.form.Upld_BISProgramOthers = null;
    this.inputvar1.nativeElement.value = "";
    this.inputvar2.nativeElement.value = "";
    this.inputvar3.nativeElement.value = "";
    this.inputvar4.nativeElement.value = "";
    this.inputvar5.nativeElement.value = "";
    this.inputvar6.nativeElement.value = "";
    this.form.CCLInclusion_1= null;
    this.form.CCLInclusion_2=null;

  }
  //end region
  //Create BIS Program
  public BISApplication() {
    var BISProgramID = this.form.BISProgramID;

    var Category = this.form.Category;
    var R_Number = this.form.R_Number;
    var Product = this.form.Product;
    var Model_For_BIS = this.form.Model_For_BIS;
    var Details = this.form.Details;
    var Test_Request = this.form.Test_Request;
    var India_SS_Date =
      this.form.India_SS_Date != ""
        ? moment(this.form.India_SS_Date).format("YYYY-MM-DD")
        : "";
    var Lead_Model = this.form.Lead_Model;
    var Series_Model = this.form.Series_Model;
    var FInalize_BIS_Model_Plan =
      this.form.FInalize_BIS_Model_Plan != ""
        ? moment(this.form.FInalize_BIS_Model_Plan).format("YYYY-MM-DD")
        : "";
    var FInalize_BIS_Model_Plan_Revised =
      this.form.FInalize_BIS_Model_Plan_Revised != ""
        ? moment(this.form.FInalize_BIS_Model_Plan_Revised).format("YYYY-MM-DD")
        : "";

    var Finalize_BIS_Model_Actual =
      this.form.Finalize_BIS_Model_Actual != ""
        ? moment(this.form.Finalize_BIS_Model_Actual).format("YYYY-MM-DD")
        : "";
    var Biz_Approval_PO_Plan =
      this.form.Biz_Approval_PO_Plan != ""
        ? moment(this.form.Biz_Approval_PO_Plan).format("YYYY-MM-DD")
        : "";
    var Biz_Approval_PO_Plan_Revised =
      this.form.Biz_Approval_PO_Plan_Revised != ""
        ? moment(this.form.Biz_Approval_PO_Plan_Revised).format("YYYY-MM-DD")
        : "";
    var Biz_Approval_PO_Actual =
      this.form.Biz_Approval_PO_Actual != ""
        ? moment(this.form.Biz_Approval_PO_Actual).format("YYYY-MM-DD")
        : "";
    var Sample_Receipt_Plan =
      this.form.Sample_Receipt_Plan != ""
        ? moment(this.form.Sample_Receipt_Plan).format("YYYY-MM-DD")
        : "";
    var Sample_Receipt_Plan_Revised =
      this.form.Sample_Receipt_Plan_Revised != ""
        ? moment(this.form.Sample_Receipt_Plan_Revised).format("YYYY-MM-DD")
        : "";
    var Sample_Receipt_Actual =
      this.form.Sample_Receipt_Actual != ""
        ? moment(this.form.Sample_Receipt_Actual).format("YYYY-MM-DD")
        : "";
    var Sample_Submission_Lab_Plan =
      this.form.Sample_Submission_Lab_Plan != ""
        ? moment(this.form.Sample_Submission_Lab_Plan).format("YYYY-MM-DD")
        : "";
    var Sample_Submission_Lab_Plan_Revised =
      this.form.Sample_Submission_Lab_Plan_Revised != ""
        ? moment(this.form.Sample_Submission_Lab_Plan_Revised).format(
          "YYYY-MM-DD"
        )
        : "";
    var Sample_Submission_Lab_Actual =
      this.form.Sample_Submission_Lab_Actual != ""
        ? moment(this.form.Sample_Submission_Lab_Actual).format("YYYY-MM-DD")
        : "";
    var BIS_Lab_Test_Report_Plan =
      this.form.BIS_Lab_Test_Report_Plan != ""
        ? moment(this.form.BIS_Lab_Test_Report_Plan).format("YYYY-MM-DD")
        : "";
    var BIS_Lab_Test_Report_Plan_Revised =
      this.form.BIS_Lab_Test_Report_Plan_Revised != ""
        ? moment(this.form.BIS_Lab_Test_Report_Plan_Revised).format(
          "YYYY-MM-DD"
        )
        : "";
    var BIS_Lab_Test_Report_Actual =
      this.form.BIS_Lab_Test_Report_Actual != ""
        ? moment(this.form.BIS_Lab_Test_Report_Actual).format("YYYY-MM-DD")
        : "";
    var Letter_Submit_Govt_Plan =
      this.form.Letter_Submit_Govt_Plan != ""
        ? moment(this.form.Letter_Submit_Govt_Plan).format("YYYY-MM-DD")
        : "";
    var Letter_Submit_Govt_Plan_Revised =
      this.form.Letter_Submit_Govt_Plan_Revised != ""
        ? moment(this.form.Letter_Submit_Govt_Plan_Revised).format("YYYY-MM-DD")
        : "";
    var Letter_Submit_Govt_Actual =
      this.form.Letter_Submit_Govt_Actual != ""
        ? moment(this.form.Letter_Submit_Govt_Actual).format("YYYY-MM-DD")
        : "";
    var BIS_Approved_Plan =
      this.form.BIS_Approved_Plan != ""
        ? moment(this.form.BIS_Approved_Plan).format("YYYY-MM-DD")
        : "";
    var BIS_Approved_Plan_Revised =
      this.form.BIS_Approved_Plan_Revised != ""
        ? moment(this.form.BIS_Approved_Plan_Revised).format("YYYY-MM-DD")
        : "";
    var BIS_Approved_Actual =
      this.form.BIS_Approved_Actual != ""
        ? moment(this.form.BIS_Approved_Actual).format("YYYY-MM-DD")
        : "";
    var CreatedBy = localStorage.getItem("name");
    var PlantId = localStorage.getItem("PlantId");
    var Upld_Test_Report =
      this.form.Upld_Test_Report && this.form.Upld_Test_Report.length
        ? this.form.Upld_Test_Report[0]
        : null;
    var Upld_Certificate =
      this.form.Upld_Certificate && this.form.Upld_Certificate.length
        ? this.form.Upld_Certificate[0]
        : null;
    var Upld_TestRequest =
      this.form.Upld_TestRequest && this.form.Upld_TestRequest.length
        ? this.form.Upld_TestRequest[0]
        : null;
    var CCLUpload =
      this.form.CCLUpload && this.form.CCLUpload.length
        ? this.form.CCLUpload[0]
        : null;
    var Upld_RGPReference =
      this.form.Upld_RGPReference && this.form.Upld_RGPReference.length
        ? this.form.Upld_RGPReference[0]
        : null;
        var CCLInclusion_1 =
        this.form.CCLInclusion_1 && this.form.CCLInclusion_1.length
          ? this.form.CCLInclusion_1[0]
          : null;
          var CCLInclusion_2 =
        this.form.CCLInclusion_2 && this.form.CCLInclusion_2.length
          ? this.form.CCLInclusion_2[0]
          : null;


    var Upld_BISProgramOthers =
      this.form.Upld_BISProgramOthers && this.form.Upld_BISProgramOthers.length
        ? this.form.Upld_BISProgramOthers[0]
        : null;
    var Test_Report = this.form.Test_Report;
    var Inclusion_Request_ID = this.form.Inclusion_Request_ID;
    var RGP_Reference = this.form.RGP_Reference;
    var Adapter = this.form.Adapter;
    var UMA_DIS = this.form.UMA_DIS;
    var Battery = this.form.Battery;
    var Others = this.form.Others;
    var MfgPlantID = this.form.MfgPlantID;


    this.service
      .CCLApplication({
        BISProgramID: BISProgramID,
        Category: Category,
        R_Number: R_Number,
        Product: Product,
        Model_For_BIS: Model_For_BIS,
        Details: Details,
        Test_Request: Test_Request,
        India_SS_Date: India_SS_Date,
        Lead_Model: Lead_Model,
        Series_Model: Series_Model,
        FInalize_BIS_Model_Plan: FInalize_BIS_Model_Plan,
        FInalize_BIS_Model_Plan_Revised: FInalize_BIS_Model_Plan_Revised,
        Finalize_BIS_Model_Actual: Finalize_BIS_Model_Actual,
        Biz_Approval_PO_Plan: Biz_Approval_PO_Plan,
        Biz_Approval_PO_Plan_Revised: Biz_Approval_PO_Plan_Revised,
        Biz_Approval_PO_Actual: Biz_Approval_PO_Actual,
        Sample_Receipt_Plan: Sample_Receipt_Plan,
        Sample_Receipt_Plan_Revised: Sample_Receipt_Plan_Revised,
        Sample_Receipt_Actual: Sample_Receipt_Actual,
        Sample_Submission_Lab_Plan: Sample_Submission_Lab_Plan,
        Sample_Submission_Lab_Plan_Revised: Sample_Submission_Lab_Plan_Revised,
        Sample_Submission_Lab_Actual: Sample_Submission_Lab_Actual,
        BIS_Lab_Test_Report_Plan: BIS_Lab_Test_Report_Plan,
        BIS_Lab_Test_Report_Plan_Revised: BIS_Lab_Test_Report_Plan_Revised,
        BIS_Lab_Test_Report_Actual: BIS_Lab_Test_Report_Actual,
        Letter_Submit_Govt_Plan: Letter_Submit_Govt_Plan,
        Letter_Submit_Govt_Plan_Revised: Letter_Submit_Govt_Plan_Revised,
        Letter_Submit_Govt_Actual: Letter_Submit_Govt_Actual,
        BIS_Approved_Plan: BIS_Approved_Plan,
        BIS_Approved_Plan_Revised: BIS_Approved_Plan_Revised,
        BIS_Approved_Actual: BIS_Approved_Actual,
        CreatedBy: CreatedBy,
        PlantId: PlantId,
        Upld_Test_Report: Upld_Test_Report,
        Upld_Certificate: Upld_Certificate,
        CCLInclusion_1:CCLInclusion_1,
        CCLInclusion_2:CCLInclusion_1,
        Test_Report: Test_Report,
        Inclusion_Request_ID: Inclusion_Request_ID,
        RGP_Reference: RGP_Reference,
        Adapter: Adapter,
        UMA_DIS: UMA_DIS,
        Battery: Battery,
        Others: Others,
        MfgPlantID: MfgPlantID,
        Upld_TestRequest: Upld_TestRequest,
        CCLUpload: CCLUpload,
        Upld_RGPReference: Upld_RGPReference,
        Upld_BISProgramOthers: Upld_BISProgramOthers,
      })
      .subscribe(
        (data) => {
          if (data) {
            console.log(data);
            switch (data.type) {
              case HttpEventType.UploadProgress:
                this.uploadStatus.emit({
                  status: ProgressStatusEnum.IN_PROGRESS,
                  percentage: Math.round((data.loaded / data.total) * 100),
                });
                break;
              case HttpEventType.Response:
                // this.inputFile.nativeElement.value = '';
                this.BISMasterLists = data.body;
                this.BISList.data = this.BISMasterLists;

                this.uploadStatus.emit({ status: ProgressStatusEnum.COMPLETE });

                Swal.fire("Great!", "Data Created Successfully!", "success");
                break;
            }

            this.form.Category = "";
            this.form.R_Number = "";
            this.form.Product = "";
            this.form.Model_For_BIS = "";
            this.form.Test_Request = "";
            this.form.Lead_Model = "";
            this.form.India_SS_Date = "";
            this.form.Series_Model = "";
            this.form.Details = "";
            this.form.FInalize_BIS_Model_Plan = "";
            this.form.FInalize_BIS_Model_Plan_Revised = "";
            this.form.Finalize_BIS_Model_Actual = "";
            this.form.Biz_Approval_PO_Plan = "";
            this.form.Biz_Approval_PO_Plan_Revised = "";
            this.form.Biz_Approval_PO_Actual = "";
            this.form.Sample_Receipt_Plan = "";
            this.form.Sample_Receipt_Plan_Revised = "";
            this.form.Sample_Receipt_Actual = "";
            this.form.Sample_Submission_Lab_Plan = "";
            this.form.Sample_Submission_Lab_Plan_Revised = "";
            this.form.Sample_Submission_Lab_Actual = "";
            this.form.BIS_Lab_Test_Report_Plan = "";
            this.form.BIS_Lab_Test_Report_Plan_Revised = "";
            this.form.BIS_Lab_Test_Report_Actual = "";
            this.form.Letter_Submit_Govt_Plan = "";
            this.form.Letter_Submit_Govt_Plan_Revised = "";
            this.form.Letter_Submit_Govt_Actual = "";
            this.form.BIS_Approved_Plan = "";
            this.form.BIS_Approved_Plan_Revised = "";
            this.form.BIS_Approved_Actual = "";
            this.form.Test_Report = "";
            this.form.Inclusion_Request_ID = "";
            this.form.RGP_Reference = "";
            this.form.Adapter = "";
            this.form.UMA_DIS = "";
            this.form.Battery = "";
            this.form.Others = "";
            this.form.Upld_Test_Report = null;
            this.form.Upld_Certificate = null;
            this.form.Upld_TestRequest = null;
            this.form.CCLUpload = null;
            this.form.Upld_RGPReference = null;
            this.form.Upld_BISProgramOthers = null;
            this.inputvar1.nativeElement.value = "";
            this.inputvar2.nativeElement.value = "";
            this.inputvar3.nativeElement.value = "";
            this.inputvar4.nativeElement.value = "";
            this.inputvar5.nativeElement.value = "";
            this.inputvar6.nativeElement.value = "";
          }
        },
        (error) => {
          this.inputFile.nativeElement.value = "";
          this.uploadStatus.emit({ status: ProgressStatusEnum.ERROR });
        }
      );
  }
  //end region
  //Upload files
  public upload(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
      this.uploadStatus.emit({ status: ProgressStatusEnum.START });
    }
  }
  //end region
  //Upload files
  uploadfile() {
    this.service.uploadFile(this.fileToUpload).subscribe(
      (data) => {
        if (data) {
          switch (data.type) {
            case HttpEventType.UploadProgress:
              this.uploadStatus.emit({
                status: ProgressStatusEnum.IN_PROGRESS,
                percentage: Math.round((data.loaded / data.total) * 100),
              });
              break;
            case HttpEventType.Response:
              this.inputFile.nativeElement.value = "";
              this.uploadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
              break;
          }
        }
      },
      (error) => {
        this.inputFile.nativeElement.value = "";
        this.uploadStatus.emit({ status: ProgressStatusEnum.ERROR });
      }
    );
  }
  //end region


  #regionDownload

  Download(fileName: any, Str: any): void {
    this.jsonParam = {
      fileName: fileName,
      Str: Str,
    };

    this.service
      .DownloadFile(this.jsonParam)
      .subscribe((blob) => saveAs(blob, fileName));
  }
  #endregion

  //Download Files
  EnableAppHeaderMenuList() {
    this.service.EnableHeaderMenuList();
  }
  //end region
  home() {
    this.router.navigate(["/dashboard"]);
  }

  setAvailableStatus(status: any): void {
    const data = {
      Series_Model: this.form.Series_Model,
    };
  }
  // Toggle Datas
  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    this.BISList.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    });
  }

  ngAfterViewInit() {
    console.log(this.tabset.tabs);
    const iframe = document.getElementById('pdfIframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.contentWindow?.addEventListener('contextmenu', (event) => {
        event.preventDefault(); // Disable right-click
      });
    }
  }

  goto(id) {
    this.tabset.tabs[id].active = true;
  }

  changeTab() {
    this.tabset.select(String(Number(this.tabset.activeId) + 1));
  }

  // Clear search
  clearSearch() {
    this.form.FInalize_BIS_Model_Plan = "";
  }
  //end
  // Clear Date
  clearDate(valueType: string) {
    switch (valueType) {
      case 'India_SS':
        this.form.India_SS_Date = "";
        break;
      case 'FInalize_BIS_Model_Plan':
        this.form.FInalize_BIS_Model_Plan = '';
        break;

      case 'FInalize_BIS_Model_Plan_Revised':
        this.form.FInalize_BIS_Model_Plan_Revised = '';
        break;

      case 'Finalize_BIS_Model_Actual':
        this.form.Finalize_BIS_Model_Actual = '';
        break;
      case 'Biz_Approval_PO_Plan':
        this.form.Biz_Approval_PO_Plan = "";
        break;
      case 'Biz_Approval_PO_Plan_Revised':
        this.form.Biz_Approval_PO_Plan_Revised = '';
        break;

      case 'Biz_Approval_PO_Actual':
        this.form.Biz_Approval_PO_Actual = '';
        break;

      case 'Sample_Receipt_Plan':
        this.form.Sample_Receipt_Plan = '';
        break;
      case 'Sample_Receipt_Plan_Revised':
        this.form.Sample_Receipt_Plan_Revised = "";
        break;
      case 'Sample_Receipt_Actual':
        this.form.Sample_Receipt_Actual = '';
        break;

      case 'Sample_Submission_Lab_Plan':
        this.form.Sample_Submission_Lab_Plan = '';
        break;

      case 'Sample_Submission_Lab_Plan_Revised':
        this.form.Sample_Submission_Lab_Plan_Revised = '';
        break;
      case 'Sample_Submission_Lab_Actual':
        this.form.Sample_Submission_Lab_Actual = "";
        break;
      case 'BIS_Lab_Test_Report_Plan':
        this.form.BIS_Lab_Test_Report_Plan = '';
        break;

      case 'BIS_Lab_Test_Report_Plan_Revised':
        this.form.BIS_Lab_Test_Report_Plan_Revised = '';
        break;

      case 'BIS_Lab_Test_Report_Actual':
        this.form.BIS_Lab_Test_Report_Actual = '';
        break;
      case 'Letter_Submit_Govt_Plan':
        this.form.Letter_Submit_Govt_Plan = "";
        break;
      case 'Letter_Submit_Govt_Plan_Revised':
        this.form.Letter_Submit_Govt_Plan_Revised = '';
        break;

      case 'Letter_Submit_Govt_Actual':
        this.form.Letter_Submit_Govt_Actual = '';
        break;

      case 'BIS_Approved_Plan':
        this.form.BIS_Approved_Plan = '';
        break;
      case 'BIS_Approved_Plan_Revised':
        this.form.BIS_Approved_Plan_Revised = "";
        break;
      case 'BIS_Approved_Actual':
        this.form.BIS_Approved_Actual = '';
        break;

    }
  }
  //end
  // downloadFile
  downloadFile() {
    this.Upld_Test_Report.download().subscribe(
      (res) => {
        const blob = new Blob([res.blob()], {
          type: "application/vnd.ms.excel",
        });
        const file = new File([blob], this.fileName + ".xlsx", {
          type: "application/vnd.ms.excel",
        });
      },
      (res) => { }
    );
  }
  //end
  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.BISList.filter = filterValue.trim().toLowerCase();
  }

  viewDocument(pdfUrl: string): void {
    // Optional: Append parameters to control PDF viewer behavior
    const sanitizedUrl = `${pdfUrl}#toolbar=0`; // Disables toolbar in some viewers

    // Open the PDF in a new tab
    window.open(sanitizedUrl, '_blank');
  }
  transform(value: string): string {
    return value.split('/').pop() || value;
  }
  extractAndTruncateFilename(url: string): string {
    if (!url) return ''; // Return an empty string if the URL is not provided

    // Extract filename from URL
    const filename = url.substring(url.lastIndexOf('/') + 1);

    // Find the last dot to separate the extension
    const dotIndex = filename.lastIndexOf('.');

    // If there's no dot, return the full filename
    if (dotIndex === -1) return filename;

    // Split filename and extension
    const namePart = filename.substring(0, dotIndex);
    const extensionPart = filename.substring(dotIndex);

    // Truncate the name part to 20 characters and add '...'
    const maxLength = 20;
    const truncatedName = namePart.length > maxLength
      ? namePart.substring(0, maxLength) + '...'
      : namePart;

    return truncatedName + extensionPart; // Combine and return
  }



}
