import { Component, HostListener, Inject, OnInit, ViewChild } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationService } from "src/app/notification.service";
import { AuthService } from "src/app/_services/auth.service";
import { SharedService } from "src/app/shared.service";
import { Subscription } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { DatePipe } from "@angular/common";
import { Output, EventEmitter, Input, ElementRef } from "@angular/core";
import { HttpEventType } from "@angular/common/http";
import * as _ from "lodash";
import Swal from "sweetalert2";
import { AgGridAngular } from "ag-grid-angular";

import { CellClassParams } from "ag-grid-community";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import {
  ColDef,
  GridApi,
  ColumnApi,
  CsvExportParams,
  ProcessHeaderForExportParams,
  ICellRendererParams,
  ModuleRegistry,
  RowGroupingDisplayType,
} from "ag-grid-community";

import {
  ProgressStatus,
  ProgressStatusEnum,
} from "src/app/model/progress-status.model";
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { saveAs } from "file-saver-es";
import * as _moment from "moment";
import { MatAccordion } from "@angular/material/expansion";
import { DOCUMENT } from "@angular/common";
import { MatPaginator } from '@angular/material/paginator';
const moment = _moment;


@Component({
  selector: 'app-bis-inward',
  templateUrl: './bis-inward.component.html',
  styleUrls: ['./bis-inward.component.css'],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ]
})
export class BisInwardComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatAccordion) accordion1: MatAccordion;
  @ViewChild("agGrid", { static: false }) agGrid: AgGridAngular;
  @Input() public disabled: boolean;
  @HostListener('window:scroll')
  @ViewChild("Upld_TestRequestRef") inputvar1: ElementRef;
  @ViewChild("Upld_Test_ReportRef") inputvar2: ElementRef;
  @ViewChild("incoterms_DocssRef") inputvar3: ElementRef;
  @ViewChild("Inwards_DocssRef") inputvar7: ElementRef;
  @ViewChild("CCLInclusion_2Ref") inputvar8: ElementRef;
  @ViewChild("Upld_CertificateRef") inputvar4: ElementRef;
  @ViewChild("Upld_RGPReferenceRef") inputvar5: ElementRef;
  @ViewChild("Upld_BISProgramOthersRef") inputvar6: ElementRef;
  @Output() public uploadStatus: EventEmitter<ProgressStatus>;
  @ViewChild("inputFile") inputFile: ElementRef;
  @ViewChild("tabset") tabset: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  public groupDisplayType: RowGroupingDisplayType = "groupRows";
  public rowSelection: "single" | "multiple" = "multiple";
  gridApibu: any;
  gridColumnApibu: any;
  allRowsSelected: boolean = false;
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
  columnDefs: ColDef[] = [];
  columnDefR: ColDef[] = []; // Define an empty array for column definitions
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
    WIDD: any;
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
    Date_of_returnn: any;
    Product_Statuss: string;
    History_Logss: string;
    Inwards_Docss: FileList | null;
    incoterms_Docss: FileList | null;
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
  BISInwarddetails: any;
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
  formfi: { WIDD: number; FYY: string; Date_of_receiptt: Date ; Productt: string; categoryy: string; Samplee: string; MTMM: string; Serial_noo: string; Engg_Lab_Serial_noo: string; Waybill_noo: string; Incotermss: string; Asset_Typee: string; GAMS_Asset_Ownerr: string; Challan_numberr: string; GAMS_Asset_IDD: string; Accessoriess: string; Modell: string; Part_numberr: string; Qtyy: string; Working_Conditionn: string; Storage_Locationn: string; Remarkss: string; Received_Byy: string; statuss: string; Lab_Detailss: string; Technical_leadd: string; Date_of_returnn: Date; Product_Statuss: string; History_Logss: string; Inwards_Docss: any; incoterms_Docss: any; };
  formfid: { WIDD: any; FYY: string; Date_of_receiptt: Date; Productt: string; categoryy: string; Samplee: string; MTMM: string; Serial_noo: string; Engg_Lab_Serial_noo: string; Waybill_noo: string; Incotermss: string; Asset_Typee: string; GAMS_Asset_Ownerr: string; Challan_numberr: string; GAMS_Asset_IDD: string; Accessoriess: string; Modell: string; Part_numberr: string; Qtyy: string; Working_Conditionn: string; Storage_Locationn: string; Remarkss: string; Received_Byy: string; statuss: string; Lab_Detailss: string; Technical_leadd: string; Date_of_returnn: Date; Product_Statuss: string; History_Logss: string; Inwards_Docss: any; incoterms_Docss: any;Str:any };
  gridrow: any;
  Assemblys: any;
  selectShift: any;
  sshift: any;

  buttondis: string;
  buttondiss: string;
  checkboxss: boolean;
  initialSelectedRows = [];
  Get_InwardCategorys: any;
  Get_Inwardsamples: any;
  Get_InwardAccessoriess: any;
  public rform: {
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
    Finnace_remarkss:any
    Statuss: string;
    Tax_paid_datee:any;
    Inventory_approvall: FileList | null;
    Duty_Uploadd: FileList | null;
    Str:any;
};


  getRMMaterial: any;
  gridApiR: any;
  gridColumnApiR: any;
  formRRm: {
    RIDD: any; FYY: string; Date_of_Inventoryy: any; Productt: string; Categoryy: string; Engg_Lab_Serial_numberr: string; Reasonn: string; RORQQ: string; Accessoriess: string;Modell:any;Part_numberr:any;Qtyy:any, Unit_pricee: string; Tax_Statuss: string; Finnace_remarkss: any; Statuss: string; Tax_paid_datee: any; Inventory_approvall: any; Duty_Uploadd: any;
    // Conditional property
    Str: string;
  };
  statussre: any;


  constructor(
    private authService: AuthService,
    private service: SharedService,
    private notifyService: NotificationService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private _document: Document,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.typeSelected = "ball-fussion";
    this.send_date.setMonth(this.send_date.getMonth());
    (this.formattedDate = this.send_date.toISOString().slice(0, 10)),
      "dd-MM-yyyy";
    console.log(this.formattedDate);
    this.uploadStatus = new EventEmitter<ProgressStatus>();

    this.form = {
      WIDD: 0,
      FYY: "",
      Date_of_receiptt:'',
      Productt: "",
      categoryy: "",
      Samplee: "",
      MTMM: "",
      Serial_noo: "",
      Engg_Lab_Serial_noo: "",
      Waybill_noo: "",
      Incotermss: "",
      Asset_Typee: "",
      GAMS_Asset_Ownerr: "",
      Challan_numberr: "",
      GAMS_Asset_IDD: "",
      Accessoriess: "",
      Modell: "",
      Part_numberr: "",
      Qtyy: "",
      Working_Conditionn: "",
      Storage_Locationn: "",
      Remarkss: "",
      Received_Byy: "",
      statuss: "",
      Lab_Detailss: "",
      Technical_leadd: "",
      Date_of_returnn: '',
      Product_Statuss: "",
      History_Logss: "",
      Inwards_Docss: null,
      incoterms_Docss: null
  };
  this.rform = {
    RIDD:0,
  FYY: '',
  Date_of_Inventoryy: '',
  Productt:'',
  Categoryy: '',
  Engg_Lab_Serial_numberr: '',
  Reasonn: '',
  RORQQ: '',
  Accessoriess: '',
  Modell:'',
  Part_numberr:'',
  Qtyy:'',
  Unit_pricee: '',
  Tax_Statuss: '',
  Finnace_remarkss:'',
  Statuss: '',
  Tax_paid_datee:'',
  Inventory_approvall: null,
  Duty_Uploadd:null,
  Str:'',
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
    rowSelection: 'multiple',
  };

  onSelectionChanged(event: any) {
    const selectedRows = event.api.getSelectedRows();
    this.gridrow = selectedRows;
    this.buttondis = selectedRows.length === 0 ? 'disabled' : '';
    this.buttondiss = selectedRows.length >= 1 ? 'disabled' : '';

    // Update checkbox state based on the selection
    if (selectedRows.length === 1) {
        this.checkboxss = selectedRows[0].dS_Flagg === 1;
    } else {
        this.checkboxss = false; // or true, depending on your default behavior for multiple selections
    }

    // Iterate through all rows to update dS_Flagg values for unselected rows
    event.api.forEachNode((node: any) => {
        const isSelected = selectedRows.includes(node.data);
        if (!isSelected) {
            node.setDataValue('dS_Flagg', 0);
        }
    });


    // Refresh the grid to reflect the changes
    this.gridApibu.refreshCells({ force: true });

    console.log(selectedRows);
}


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
  INWARD = new MatTableDataSource();
  //region BISProgramColumnList
  BISProgramColumnList: string[] = [
    "Action",
    "SNo",
    "fy",
    "date_of_receipt",
    "product",
    "category",
    "sample",
    "mtm",
    "serial_no",
    "engg_Lab_Serial_no",
    "waybill_no",
    "incoterms",
    "asset_Type",
    "gamS_Asset_Owner",
    "challan_number",
    "gamS_Asset_ID",
    "accessories",
    "model",
    "part_number",
    "qty",
    "working_Condition",
    "storage_Location",
    "remarks",
    "received_By",
    "status",
    "lab_Details",
    "technical_lead",
    "date_of_return",
    "product_Status",
    "history_Logs",
    "incoterms_Doc",
    "inwards_Docs",
  ];
  //end region
  ngOnInit(): void {

    // this.GetMfgPlantList();
    this.Get_InwardCategory();
    this.Get_Inwardsample();
    this.Get_InwardAccessories();
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
    this.GetBISInwarddetails();
    this.GetRMdetails();
    this.form.WIDD = 0;
    this.gridApibu.forEachNode((node) => {
      if (node.isSelected()) {
        this.initialSelectedRows.push(node.data.wid); // Store the initially selected row IDs
      }
    });
  }

  MapR_Number(param: any) {

    // console.log(param.category);

    this.BISCategoryR_Num = this.BISCategoryR_Num_Temp;
    // this.BISCategoryR_Num = this.BISCategoryR_Num.filter(x => x.category === param.category);
    this.BISCategoryR_Num = this.BISCategoryR_Num.filter(
      (x) => x.category === param
    );
  }
  //Auto Enable date

  //region Search & Filter

  applyFilter(event: Event, columnName: string): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filters[columnName] = filterValue;

    this.INWARD.filterPredicate = (data: any, filter: string): boolean => {
      return Object.keys(this.filters).every(column => {
        const columnFilterValue = this.filters[column];
        return !columnFilterValue || (data[column]?.toString().toLowerCase().includes(columnFilterValue));
      });
    };

    // Trigger the filter
    this.INWARD.filter = JSON.stringify(this.filters);
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

  // Get Category and Product
  CategoryProductFilter() {

    this.jsonParam = {
      PlantId: localStorage.getItem("PlantId"),
    };

    this.service.TradeProductFilters(this.jsonParam).subscribe((response) => {

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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Prepare data for deletion
        const formfid = {
          WIDD: param.wid,
          FYY: '',
          Date_of_receiptt: '',
          Productt: '',
          categoryy: '',
          Samplee: '',
          MTMM: '',
          Serial_noo: '',
          Engg_Lab_Serial_noo: '',
          Waybill_noo: '',
          Incotermss: '',
          Asset_Typee: '',
          GAMS_Asset_Ownerr: '',
          Challan_numberr: this.form.Challan_numberr,
          GAMS_Asset_IDD: '',
          Accessoriess: '',
          Modell: '',
          Part_numberr: '',
          Qtyy: '',
          Working_Conditionn: '',
          Storage_Locationn: '',
          Remarkss: '',
          Received_Byy: '',
          statuss: '',
          Lab_Detailss: '',
          Technical_leadd: '',
          Date_of_returnn: '',
          Product_Statuss: '',
          History_Logss: '',
          Inwards_Docss: null,
          incoterms_Docss: null,
          Str: 'DEL'
        };

        this.service.InwardApplication(formfid).subscribe({
          next: (response) => {
            this.DelDataByTables = response;
            console.log(this.DelDataByTables);
            if (response) {
              Swal.fire("Great!", "Deleted Successfully!", "success");
              this.GetBISInwarddetails();
              setTimeout(() => (this.isVisible = false), 500);
            } else {
              Swal.fire("Oops!", "Something went wrong!", "error");
            }
          },
          error: (error) => {
            console.error("Error occurred while deleting data:", error);
            Swal.fire("Error!", "There was an issue with the request.", "error");
          }
        });
      }
    });
  }



  //end region
  //Edit
  EditBISMaster(element: any) {
    debugger
    this.form.WIDD=element.wid;
    this.form.FYY=element.fy
    this.form.Date_of_receiptt=element.date_of_receipt
    this.form.Productt=element.product
    this.form.categoryy=element.category
    this.form.Samplee=element.sample
    this.form.MTMM=element.mtm
    this.form.Serial_noo=element.serial_no
    this.form.Engg_Lab_Serial_noo=element.engg_Lab_Serial_no
    this.form.Waybill_noo=element.waybill_no
    this.form.Incotermss=element.incoterms
    this.form.Asset_Typee=element.asset_Type
    this.form.GAMS_Asset_Ownerr=element.gamS_Asset_Owner
    this.form.Challan_numberr=element.challan_number
    this.form.GAMS_Asset_IDD=element.gamS_Asset_ID
    this.form.Accessoriess=element.accessories
    this.form.Modell=element.model
    this.form.Part_numberr=element.part_number
    this.form.Qtyy=element.qty
    this.form.Working_Conditionn=element.working_Condition;
    this.form.Storage_Locationn=element.storage_Location;
    this.form.Remarkss=element.remarks;
    this.form.Received_Byy=element.received_By
    this.form.statuss=element.status
    this.form.Lab_Detailss=element.lab_Details
    this.form.Technical_leadd=element.technical_lead
    this.form.Date_of_returnn=element.date_of_return
    this.form.Product_Statuss=element.product_Status
    this.form.History_Logss=element.history_Logs
  }
  combinedRenderer(params: any) {
    const container = document.createElement('div');
    const value = params.value;
    const field = params.colDef.field;

    // Create span for the value and tooltip
    const span = document.createElement('span');
    span.innerText = value;
    span.title = value; // Tooltip text

    // Add special styling for text overflow
    span.classList.add('cell-text-ellipsis');

    // Add button actions if needed
    if (field === 'action') {
      const editButton = document.createElement('button');
      editButton.className = 'modalbutton1';
      editButton.innerHTML = `<i class="fa fa-edit" style="color:green;"></i>`;
      editButton.addEventListener('click', () => {
        this.EditBISMaster(params.data);
        this.accordion.openAll();
      });
      const deleteButton = document.createElement('button');
      deleteButton.className = 'modalbutton';
      deleteButton.innerHTML = `<i class="fa fa-trash" style="color:red;"></i>`;
      deleteButton.style.display = this.Roleid <= '2' ? 'inline' : 'none';
      deleteButton.addEventListener('click', () => {
        this.PostDelDataByTables(params.data);
      });

      container.appendChild(editButton);
      container.appendChild(deleteButton);
    } else {
      container.appendChild(span);
    }

    return container;
  }
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
  sendmail(){
    this.service.PostInward_Receipt_Acknowledge_Mail().subscribe(
      (response) => {
        this.statussre = response;
      },
      (error) => {
        this.authService.logout();
      }
    );
  }
  //end region
  sendSelectedRows() {
    if (this.gridApibu) {
      // Collect all the rows in the grid
      const allNodes = [];
      this.gridApibu.forEachNode((node) => allNodes.push(node));

      // Prepare the object to store the selection changes
      const changedRows = {};

      allNodes.forEach(node => {
        const wasInitiallySelected = this.initialSelectedRows.includes(node.data.wid);
        const isSelectedNow = node.isSelected();

        if (wasInitiallySelected && !isSelectedNow) {
          // Row was initially selected but now unselected - flag it as 0
          changedRows[node.data.wid] = { widd: node.data.wid, isflagg: 0 };
        } else if (!wasInitiallySelected && isSelectedNow) {
          // Row was initially unselected but now selected - flag it as 1
          changedRows[node.data.wid] = { widd: node.data.wid, isflagg: 1 };
        }
      });

      if (Object.keys(changedRows).length > 0) {
        // Send the changed rows (selected/unselected) as a JSON object
        this.service.PostUpdateFlagBIS_Inward(changedRows).subscribe(
          (response) => {
            //alert('Selection updates sent successfully!');
          },
          (error) => {
            console.error('Error while sending updates', error);
          }
        );

        // Update initialSelectedRows with the current selection state
        this.initialSelectedRows = allNodes
          .filter(node => node.isSelected())
          .map(node => node.data.wid);
      } else {
        alert('No selection changes to update!');
      }
    } else {
      console.error('Grid API not initialized');
    }
}
onGridReadybu(params: any) {
  this.gridApibu = params.api;
  this.gridColumnApibu = params.columnApi;
  this.BISInwarddetails = this.BISInwarddetails;
}
onGridReadyR(params: any) {
  this.gridApiR = params.api;
  this.gridColumnApiR = params.columnApi;
  this.getRMMaterial = this.getRMMaterial;
}
onchangestatus() {
  debugger
  const status = this.form.statuss;
  const filteredData = this.BISInwarddetails.filter(item => item.status === status);

  // Assuming you have a reference to the AG Grid API
  const gridApi = this.gridApibu; // Get this reference from the gridReady event

  if (gridApi) {
    gridApi.setRowData(filteredData);
  }
}
  selectAllRows() {
    this.gridApibu.selectAll(); // Select all rows
    this.allRowsSelected = true; // Toggle button state
  }

  deselectAllRows() {
    this.gridApibu.deselectAll(); // Deselect all rows
    this.allRowsSelected = false; // Toggle button state
  }
  // Get BIS Lists
  GetBISInwarddetails()
   {
    debugger
    this.service.GetBISInwarddetails().subscribe(
      (response) => {
        this.BISInwarddetails = response.table;
        //this.INWARD.data = this.BISInwarddetails;
        this.columnDefs = [
          {
            headerCheckboxSelection: false, // "Select All" checkbox in the header
            checkboxSelection: true, // Checkbox for row selection
            minWidth: 30,
            maxWidth: 30,
          },
          {
            headerName: 'Action',
            field: 'action',
            cellRenderer: this.combinedRenderer.bind(this),
            minWidth: 70,
            maxWidth: 70,
            width: 70
          },
          {
            headerName: 'WID',
            field: 'wid',
            minWidth: 70,
            maxWidth: 70,
            width: 70
          },
          {
            headerName: 'FY',
            field: 'fy',
            minWidth: 70,
            maxWidth: 70,
            width: 70
          },
          {
            headerName: 'Date of Receipt',
            field: 'date_of_receipt',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Product',
            field: 'product',  minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Category',
            field: 'category',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Sample',
            field: 'sample',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'MTM',
            field: 'mtm',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Serial No',
            field: 'serial_no',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Engg Lab Serial No',
            field: 'engg_Lab_Serial_no',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Waybill No',
            field: 'waybill_no',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Incoterms',
            field: 'incoterms',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Asset Type',
            field: 'asset_Type',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'GAMS Asset Owner',
            field: 'gamS_Asset_Owner',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Challan Number',
            field: 'challan_number',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'GAMS Asset ID',
            field: 'gamS_Asset_ID',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Accessories',
            field: 'accessories',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Model',
            field: 'model',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Part Number',
            field: 'part_number',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Qty',
            field: 'qty',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Working Condition',
            field: 'working_Condition',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Storage Location',
            field: 'storage_Location',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Remarks',
            field: 'remarks',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Received By',
            field: 'received_By',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Incoterms Doc',
            field: 'incoterms_Doc',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Inwards Docs',
            field: 'inwards_Docs',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Status',
            field: 'status',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Lab Details',
            field: 'lab_Details',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Technical Lead',
            field: 'technical_lead',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Date of Return',
            field: 'date_of_return',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Product Status',
            field: 'product_Status',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'History Logs',
            field: 'history_Logs',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          }
        ];
      },
      (error) => {
        this.authService.logout();
      }
    );

    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }
 Get_InwardCategory()
  {
   debugger
   this.service.Get_InwardCategory().subscribe(
     (response) => {
       this.Get_InwardCategorys = response.table;
       //this.INWARD.data = this.BISInwarddetails;

     },
     (error) => {
       this.authService.logout();
     }
   );

 }
Get_Inwardsample()
  {
   debugger
   this.service.Get_Inwardsample().subscribe(
     (response) => {
       this.Get_Inwardsamples = response.table;
       //this.INWARD.data = this.BISInwarddetails;

     },
     (error) => {
       this.authService.logout();
     }
   );

 }
Get_InwardAccessories()
  {
   debugger
   this.service.Get_InwardAccessories().subscribe(
     (response) => {
       this.Get_InwardAccessoriess = response.table;
       //this.INWARD.data = this.BISInwarddetails;

     },
     (error) => {
       this.authService.logout();
     }
   );

 }

  //Reset
  // resetForm() {

  //   this.form.BISProgramID = "";
  //   this.form.Category = "";
  //   this.form.R_Number = "";
  //   this.form.Product = "";
  //   this.form.Model_For_BIS = "";
  //   this.form.Test_Request = "";
  //   this.form.Lead_Model = "";
  //   this.form.India_SS_Date = "";
  //   this.form.Series_Model = "";
  //   this.form.Details = "";
  //   this.form.FInalize_BIS_Model_Plan = "";
  //   this.form.FInalize_BIS_Model_Plan_Revised = "";
  //   this.form.Finalize_BIS_Model_Actual = "";
  //   this.form.Biz_Approval_PO_Plan = "";
  //   this.form.Biz_Approval_PO_Plan_Revised = "";
  //   this.form.Biz_Approval_PO_Actual = "";
  //   this.form.Sample_Receipt_Plan = "";
  //   this.form.Sample_Receipt_Plan_Revised = "";
  //   this.form.Sample_Receipt_Actual = "";
  //   this.form.Sample_Submission_Lab_Plan = "";
  //   this.form.Sample_Submission_Lab_Plan_Revised = "";
  //   this.form.Sample_Submission_Lab_Actual = "";
  //   this.form.BIS_Lab_Test_Report_Plan = "";
  //   this.form.BIS_Lab_Test_Report_Plan_Revised = "";
  //   this.form.BIS_Lab_Test_Report_Actual = "";
  //   this.form.Letter_Submit_Govt_Plan = "";
  //   this.form.Letter_Submit_Govt_Plan_Revised = "";
  //   this.form.Letter_Submit_Govt_Actual = "";
  //   this.form.BIS_Approved_Plan = "";
  //   this.form.BIS_Approved_Plan_Revised = "";
  //   this.form.BIS_Approved_Actual = "";
  //   this.form.Test_Report = "";
  //   this.form.Inclusion_Request_ID = "";
  //   this.form.RGP_Reference = "";
  //   this.form.Adapter = "";
  //   this.form.UMA_DIS = "";
  //   this.form.Battery = "";
  //   this.form.Others = "";
  //   this.form.Upld_Test_Report = null;
  //   this.form.Upld_Certificate = null;
  //   this.form.Upld_TestRequest = null;
  //   this.form.CCLUpload = null;
  //   this.form.Upld_RGPReference = null;
  //   this.form.Upld_BISProgramOthers = null;
  //   this.inputvar1.nativeElement.value = "";
  //   this.inputvar2.nativeElement.value = "";
  //   this.inputvar3.nativeElement.value = "";
  //   this.inputvar4.nativeElement.value = "";
  //   this.inputvar5.nativeElement.value = "";
  //   this.inputvar6.nativeElement.value = "";
  //   this.form.CCLInclusion_1= null;
  //   this.form.CCLInclusion_2=null;

  // }
  //end region
  //Create BIS Program
  onSubmit() {
    debugger
    // Prepare form data
    this.formfid = {
        WIDD: this.form.WIDD,
        FYY: this.form.FYY,
        Date_of_receiptt: this.form.Date_of_receiptt,
        Productt: this.form.Productt,
        categoryy: this.form.categoryy,
        Samplee: this.form.Samplee,
        MTMM: this.form.MTMM,
        Serial_noo: this.form.Serial_noo,
        Engg_Lab_Serial_noo: this.form.Engg_Lab_Serial_noo,
        Waybill_noo: this.form.Waybill_noo,
        Incotermss: this.form.Incotermss,
        Asset_Typee: this.form.Asset_Typee,
        GAMS_Asset_Ownerr: this.form.GAMS_Asset_Ownerr,
        Challan_numberr: this.form.Challan_numberr,
        GAMS_Asset_IDD: this.form.GAMS_Asset_IDD,
        Accessoriess: this.form.Accessoriess,
        Modell: this.form.Modell,
        Part_numberr: this.form.Part_numberr,
        Qtyy: this.form.Qtyy,
        Working_Conditionn: this.form.Working_Conditionn,
        Storage_Locationn: this.form.Storage_Locationn,
        Remarkss: this.form.Remarkss,
        Received_Byy: this.form.Received_Byy,
        statuss: this.form.statuss,
        Lab_Detailss: this.form.Lab_Detailss,
        Technical_leadd: this.form.Technical_leadd,
      Date_of_returnn: this.form.Date_of_returnn ? this.form.Date_of_returnn : '',
        Product_Statuss: this.form.Product_Statuss,
        History_Logss: this.form.History_Logss,
        Inwards_Docss: this.form.Inwards_Docss && this.form.Inwards_Docss.length
            ? this.form.Inwards_Docss[0]
            : null,
        incoterms_Docss: this.form.incoterms_Docss && this.form.incoterms_Docss.length
            ? this.form.incoterms_Docss[0]
            : null,

        // Conditional property
        Str: this.form.WIDD === 0 ? 'ADD' : 'UPD'
    };

    // Call service method
    this.service.InwardApplication(this.formfid).subscribe(
        (data) => {
            if (data) {
              this.GetBISInwarddetails();
              Swal.fire("Great!", "Data Created Successfully!", "success");
                console.log(data);
                switch (data.type) {
                    case HttpEventType.UploadProgress:
                        this.uploadStatus.emit({
                            status: ProgressStatusEnum.IN_PROGRESS,
                            percentage: Math.round((data.loaded / data.total) * 100),
                        });
                        break;
                    case HttpEventType.Response:
                      this.BISInwarddetails = data;
                      this.INWARD.data = this.BISInwarddetails;
                        this.uploadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
                        this.spinner.hide();
                        Swal.fire("Great!", "Data Created Successfully!", "success");
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





formatDate(date: Date): string {
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

private resetForm() {
    this.form = {
        WIDD: null,
        FYY: "",
        Date_of_receiptt: null,
        Productt: "",
        categoryy: "",
        Samplee: "",
        MTMM: "",
        Serial_noo: "",
        Engg_Lab_Serial_noo: "",
        Waybill_noo: "",
        Incotermss: "",
        Asset_Typee: "",
        GAMS_Asset_Ownerr: "",
        Challan_numberr: "",
        GAMS_Asset_IDD: "",
        Accessoriess: "",
        Modell: "",
        Part_numberr: "",
        Qtyy: "",
        Working_Conditionn: "",
        Storage_Locationn: "",
        Remarkss: "",
        Received_Byy: "",
        statuss: "",
        Lab_Detailss: "",
        Technical_leadd: "",
        Date_of_returnn: "",
        Product_Statuss: "",
        History_Logss: "",
        Inwards_Docss: null,
        incoterms_Docss: null
    };

    // Reset file inputs
    this.inputvar1.nativeElement.value = "";
    this.inputvar2.nativeElement.value = "";
    this.inputvar3.nativeElement.value = "";
    this.inputvar4.nativeElement.value = "";
    this.inputvar5.nativeElement.value = "";
    this.inputvar6.nativeElement.value = "";
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


  // Toggle Datas
  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    this.INWARD.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    });
  }

  ngAfterViewInit() {
    console.log(this.tabset.tabs);
    this.INWARD.paginator = this.paginator;
  }

  goto(id) {
    this.tabset.tabs[id].active = true;
  }

  changeTab() {
    this.tabset.select(String(Number(this.tabset.activeId) + 1));
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
    this.INWARD.filter = filterValue.trim().toLowerCase();
  }
  onSubmitRRM() {
    debugger
    // Prepare form data
    this.formRRm= {
      RIDD: this.rform.RIDD,
        FYY: this.rform.FYY,
        Date_of_Inventoryy: this.rform.Date_of_Inventoryy ,
        Productt: this.rform.Productt,
        Categoryy: this.rform.Categoryy,
        Engg_Lab_Serial_numberr: this.rform.Engg_Lab_Serial_numberr,
        Reasonn: this.rform.Reasonn,
        RORQQ: this.rform.RORQQ,
        Accessoriess: this.rform.Accessoriess,
        Modell:this.rform.Modell,
        Part_numberr:this.rform.Part_numberr,
        Qtyy:this.rform.Qtyy,
        Unit_pricee: this.rform.Unit_pricee,
        Tax_Statuss: this.rform.Tax_Statuss,
        Finnace_remarkss: this.rform.Finnace_remarkss,
        Statuss: this.rform.Statuss,
        Tax_paid_datee: this.rform.Tax_paid_datee,

        Inventory_approvall: this.rform.Inventory_approvall && this.rform.Inventory_approvall.length
            ? this.rform.Inventory_approvall[0]
            : null,
            Duty_Uploadd: this.rform.Duty_Uploadd && this.rform.Duty_Uploadd.length
            ? this.rform.Duty_Uploadd[0]
            : null,

        // Conditional property
        Str: this.rform.RIDD === 0 ? 'ADD' : 'UPD'
    };

    // Call service method
    this.service.PostRMMaterial(this.formRRm).subscribe(
        (data) => {
            if (data) {
              this.GetRMdetails();
              Swal.fire("Great!", "Data Created Successfully!", "success");
                console.log(data);
                switch (data.type) {
                    case HttpEventType.UploadProgress:
                        this.uploadStatus.emit({
                            status: ProgressStatusEnum.IN_PROGRESS,
                            percentage: Math.round((data.loaded / data.total) * 100),
                        });
                        break;
                    case HttpEventType.Response:
                      // this.getRMMaterial = data;
                      this.GetRMdetails();
                      //this.INWARD.data = this.getRMMaterial;
                        this.uploadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
                        this.spinner.hide();
                        Swal.fire("Great!", "Data Created Successfully!", "success");
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
  GetRMdetails()
   {
    debugger

    // Call service method
    this.service.Get_RMMaterial().subscribe(
      (response) => {
        this.getRMMaterial = response.table;
        //this.INWARD.data = this.BISInwarddetails;
        this.columnDefR = [

          {
            headerName: 'Action',
            field: 'action',
            cellRenderer: this.combinedRendererRM.bind(this),
            minWidth: 70,
            maxWidth: 70,
            width: 70
          },
          {
            headerName: 'RID',
            field: 'rid',
            minWidth: 70,
            maxWidth: 70,
            width: 70
          },
          {
            headerName: 'FY',
            field: 'fy',
            minWidth: 70,
            maxWidth: 70,
            width: 70
          },
          {
            headerName: 'Date of Inventory',
            field: 'date_of_Inventory',
            minWidth: 100,
            maxWidth: 100,
            width: 100,
            valueFormatter: params => new Date(params.value).toLocaleDateString() // Format date as needed
          },
          {
            headerName: 'Product',
            field: 'product',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Category',
            field: 'category',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Reason',
            field: 'reason',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'RORQ',
            field: 'rorq',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Accessories',
            field: 'accessories',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Model',
            field: 'model',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Part Number',
            field: 'part_number',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Qty',
            field: 'qty',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Unit Price',
            field: 'unit_price',
            minWidth: 100,
            maxWidth: 100,
            width: 100,
          },
          {
            headerName: 'Tax Status',
            field: 'tax_Status',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Finance Remarks',
            field: 'finance_remarks',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Inventory Approval',
            field: 'inventory_approval',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Status',
            field: 'status',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          },
          {
            headerName: 'Tax Paid Date',
            field: 'tax_paid_date',
            minWidth: 100,
            maxWidth: 100,
            width: 100,
            valueFormatter: params => new Date(params.value).toLocaleDateString() // Format date as needed
          },
          {
            headerName: 'Duty Upload',
            field: 'duty_Upload',
            minWidth: 100,
            maxWidth: 100,
            width: 100
          }
        ];
      },
      (error) => {
        this.authService.logout();
      }
    );

    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }
EditRM(element: any) {
debugger;
    this.rform.RIDD=element.rid;
    this.rform.FYY=element.fy;
    if (element.date_of_Inventory) {
      const date = new Date(element.date_of_Inventory);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);  // Add 1 to month because getMonth() is zero-based
      const day = ('0' + date.getDate()).slice(-2);  // Ensure two digits
      this.rform.Date_of_Inventoryy = `${year}-${month}-${day}`;
    } else {
      this.rform.Date_of_Inventoryy = null;  // Handle the case where the date is null or undefined
    }
    this.rform.Productt=element.product
    this.rform.Categoryy=element.category
    this.rform.Engg_Lab_Serial_numberr=element.engg_Lab_Serial_number
    this.rform.Reasonn=element.reason
    this.rform.RORQQ=element.rorq
    this.rform.Accessoriess=element.accessories
    this.rform.Modell=element.model
    this.rform.Part_numberr=element.part_number
    this.rform.Qtyy=element.qty
    this.rform.Unit_pricee=element.unit_price
    this.rform.Tax_Statuss=element.tax_Status
    this.rform.Finnace_remarkss=element.finance_remarks
    this.rform.Statuss=element.status
    if (element.tax_paid_date) {
      const date = new Date(element.tax_paid_date);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);  // Add 1 to month because getMonth() is zero-based
      const day = ('0' + date.getDate()).slice(-2);  // Ensure two digits
      this.rform.Tax_paid_datee = `${year}-${month}-${day}`;
    } else {
      this.rform.Tax_paid_datee = null;  // Handle the case where the date is null or undefined
    }

  }
  combinedRendererRM(params: any) {
    const container = document.createElement('div');
    const value = params.value;
    const field = params.colDef.field;

    // Create span for the value and tooltip
    const span = document.createElement('span');
    span.innerText = value;
    span.title = value; // Tooltip text

    // Add special styling for text overflow
    span.classList.add('cell-text-ellipsis');

    // Add button actions if needed
    if (field === 'action') {
      const editButton = document.createElement('button');
      editButton.className = 'modalbutton';
      editButton.innerHTML = `<i class="fa fa-edit" style="color:green;"></i>`;
      editButton.addEventListener('click', () => {
        this.EditRM(params.data);
        this.accordion1.openAll();
      });
      const deleteButton = document.createElement('button');
      deleteButton.className = 'modalbutton';
      deleteButton.innerHTML = `<i class="fa fa-trash" style="color:red;"></i>`;
      deleteButton.style.display = this.Roleid <= '2' ? 'inline' : 'none';
      deleteButton.addEventListener('click', () => {
        this.PostDelRM(params.data);
      });

      container.appendChild(editButton);
      container.appendChild(deleteButton);
    } else {
      container.appendChild(span);
    }

    return container;
  }
  PostDelRM(param: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Prepare data for deletion
       this.formRRm = {
          RIDD: param.rid,
          FYY: '',
          Date_of_Inventoryy: '',
          Productt: '',
          Categoryy: '',
          Engg_Lab_Serial_numberr: '',
          Reasonn: '',
          RORQQ: '',
          Accessoriess: '',
          Modell:'',
          Part_numberr:'',
          Qtyy:'',
          Unit_pricee: '',
          Tax_Statuss: '',
          Finnace_remarkss:'',
          Statuss: '',
          Tax_paid_datee: '',
          Inventory_approvall: null,
          Duty_Uploadd: null,
          Str: 'DEL'
        };

        this.service.PostRMMaterial(this.formRRm).subscribe({
          next: (response) => {
            this.DelDataByTables = response;
            console.log(this.DelDataByTables);
            if (response) {
              Swal.fire("Great!", "Deleted Successfully!", "success");
              this.GetRMdetails();
              setTimeout(() => (this.isVisible = false), 500);
            } else {
              Swal.fire("Oops!", "Something went wrong!", "error");
            }
          },
          error: (error) => {
            console.error("Error occurred while deleting data:", error);
            Swal.fire("Error!", "There was an issue with the request.", "error");
          }
        });
      }
    });
  }
  formfids(formfids: any) {
    throw new Error("Method not implemented.");
  }
private rresetForm() {
    this.rform = {
      RIDD: null,
        FYY: "",
        Date_of_Inventoryy: null,
        Productt: "",
        Categoryy: "",
        Engg_Lab_Serial_numberr: "",
        Reasonn: "",
        RORQQ: "",
        Accessoriess: "",
        Modell:"",
        Part_numberr:"",
        Qtyy:"",
        Unit_pricee: "",
        Tax_Statuss: "",
        Finnace_remarkss:"",
        Statuss: "",
        Tax_paid_datee: "",
        Inventory_approvall: null,
        Duty_Uploadd: null,
        Str:''
    };

    // Reset file inputs
    this.inputvar1.nativeElement.value = "";
    this.inputvar2.nativeElement.value = "";
    this.inputvar3.nativeElement.value = "";
    this.inputvar4.nativeElement.value = "";
    this.inputvar5.nativeElement.value = "";
    this.inputvar6.nativeElement.value = "";
}
}
