import { HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Subscription } from "rxjs";
import {
  ProgressStatus,
  ProgressStatusEnum
} from "src/app/model/progress-status.model";
import { NotificationService } from "src/app/notification.service";
import { SharedService } from "src/app/shared.service";
import { AuthService } from "src/app/_services/auth.service";
import { MatAccordion } from "@angular/material/expansion";
import Swal from "sweetalert2";
import { saveAs } from "file-saver-es";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { array, object } from "@amcharts/amcharts5";
import { values } from "lodash";
import * as XLSX from "xlsx";
import { AgGridAngular } from "ag-grid-angular";
import { CellClassParams } from "ag-grid-community";
import {
  ColDef,
  GridApi,
  ColumnApi,
  CsvExportParams,
  ProcessHeaderForExportParams,
} from "ag-grid-community";

@Component({
  selector: 'app-ccl-list-management',
  templateUrl: './ccl-list-management.component.html',
  styleUrls: ['./ccl-list-management.component.css']
})
export class CclListManagementComponent implements OnInit {
  @ViewChild("TABLE", { static: false }) TABLE: ElementRef;
  @Input() public disabled: boolean;
  @ViewChild("Upload_QuotationRef") inputvar1: ElementRef;
  @ViewChild("Upload_PO_ReferenceRef") inputvar2: ElementRef;
  @ViewChild("Upload_InvoiceRef") inputvar3: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Output() public uploadStatus: EventEmitter<ProgressStatus>;
  @ViewChild("inputFile") inputFile: ElementRef;
  @ViewChild("agGrid", { static: false }) agGrid: AgGridAngular;
  isTableExpanded = false;
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  /* Declare Multiselect Variable */
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
  columnDefs: ColDef[] = []; // Define an empty array for column definitions
  columnDefstr: ColDef[] = []; // Define an empty array for column definitions
  rowData: any[] = []; // Define an empty array for row data
  dropdownList = [];
  //selectedItems = [];
  //Model_for_BIS =[];
  dropdownSettings: IDropdownSettings = {};

  /* END */

  OperatingList: any;
  searchText;
  public form: {
    cid: any;
    category: any;
    str:any;

  };
  public form1: {
    sid: any;
    sample: any;
    str:any;

  };
  public form2: {
    aid: any;
    accessories: any;
    str:any;

  };
  rowDatas: any[];
  Get_InwardCategorys: any;
  Get_Inwardsamples: any;
  columnDefss: ({ headerName: string; field: string; cellRenderer: any; minWidth: number; maxWidth: number; width: number; filter?: undefined; } | { headerName: string; field: string; cellRenderer: any; minWidth: number; maxWidth: number; width: number; filter: boolean; })[];
  Get_InwardAccessoriess: any;
  columnDefsq: ({ headerName: string; field: string; cellRenderer: any; minWidth: number; maxWidth: number; width: number; filter?: undefined; } | { headerName: string; field: string; cellRenderer: any; minWidth: number; maxWidth: number; width: number; filter: boolean; })[];
  Roleid: number;
  jsonParam: { cidd: any; categoryy: any; str: string; };
  DelDataByTables: any;
  jsonParam1: { sidd: any; samplee: any; str: string; };
  jsonParam2: { aidd: any; accessoriess: any; str: string; };
  jsonParamx: { cid: any; category: any; str: string; };


  constructor(
    private authService: AuthService,
    private service: SharedService,
    private notifyService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {


    this.uploadStatus = new EventEmitter<ProgressStatus>();


    this.form = {
      cid: 0,
    category:'',

    str:'',
    };

    this.form1 = {
      sid: 0,
    sample:'',
    str:'',
    };

    this.form2 = {
      aid: 0,
    accessories:'',
    str:'',
    };
  }


  ngOnInit(): void {
    //this.GetKeyFiltersBy_Product();
    this.GetCategory();
    this.GetSample();
    this.GetAccessories();
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowDatas = this.rowData;
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
  //Clear date

  //Export Excel
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.TABLE.nativeElement,
      { raw: true }
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    ws["A1"].s = {
      fill: {
        patternType: "none", // none / solid
        fgColor: { rgb: "FF000000" },
        bgColor: { rgb: "FFFFFFFF" }
      },
      font: {
        name: "Times New Roman",
        sz: 16,
        color: { rgb: "#FF000000" },
        bold: true,
        italic: false,
        underline: false
      },
      border: {
        top: { style: "thin", color: { auto: 1 } },
        right: { style: "thin", color: { auto: 1 } },
        bottom: { style: "thin", color: { auto: 1 } },
        left: { style: "thin", color: { auto: 1 } }
      }
    };
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Excelreport.xlsx");
  }


  //Scroll to bottom
  goToBottom() {

    window.scrollTo(0, document.body.scrollHeight);

  }

  //Common Filter




  //Filter By Product for model for bis

  customTooltipRenderer(params: any) {
    const container = document.createElement('div');

    // Create the content element
    const content = document.createElement('span');
    content.innerText = params.value || '';

    // Set the tooltip (title attribute)
    content.title = `${params.value}`;

    // Add the content element to the container
    container.appendChild(content);

    // Return the container
    return container;
  }

  //List of PO
  GetCategory() {
    this.service.Get_InwardCategory().subscribe(response => {
      // Auto increment SNO
      this.Get_InwardCategorys = response.table.map((item, index) => ({
        ...item,
        sNo: index + 1 // Add auto-incremented SNO
      }));

      this.columnDefs = [
        {
          headerName: 'Action',
          field: 'action',
          cellRenderer: this.actionRenderer.bind(this),
          minWidth: 70,
          maxWidth: 70,
          width: 70
        },
        {
          headerName: 'SNO',
          cellRenderer: this.customTooltipRenderer.bind(this),
          field: 'sNo',
          minWidth: 50,
          maxWidth: 50,
          width: 50
        },
        {
          headerName: 'Category',
          field: 'category',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 150,
          maxWidth: 150,
          width: 150,
          filter: true
        }
      ];
    });
  }
  GetSample() {
    this.service.Get_Inwardsample().subscribe(response => {
      // Auto increment SNO
      this.Get_Inwardsamples = response.table.map((item, index) => ({
        ...item,
        sNo: index + 1 // Add auto-incremented SNO
      }));

      this.columnDefss = [
        {
          headerName: 'Action',
          field: 'action',
          cellRenderer: this.actionRenderer1.bind(this),
          minWidth: 70,
          maxWidth: 70,
          width: 70
        },
        {
          headerName: 'SNO',
          cellRenderer: this.customTooltipRenderer.bind(this),
          field: 'sNo',
          minWidth: 50,
          maxWidth: 50,
          width: 50
        },
        {
          headerName: 'Sample',
          field: 'sample',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 150,
          maxWidth: 150,
          width: 150,
          filter: true
        }
      ];
    });
  }
  GetAccessories() {
    this.service.Get_InwardAccessories().subscribe(response => {
      // Auto increment SNO
      this.Get_InwardAccessoriess = response.table.map((item, index) => ({
        ...item,
        sNo: index + 1 // Add auto-incremented SNO
      }));

      this.columnDefsq = [
        {
          headerName: 'Action',
          field: 'action',
          cellRenderer: this.actionRenderer2.bind(this),
          minWidth: 70,
          maxWidth: 70,
          width: 70
        },
        {
          headerName: 'SNO',
          cellRenderer: this.customTooltipRenderer.bind(this),
          field: 'sNo',
          minWidth: 50,
          maxWidth: 50,
          width: 50
        },
        {
          headerName: 'Accessories',
          field: 'accessories',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 150,
          maxWidth: 150,
          width: 150,
          filter: true
        }
      ];
    });
  }

  actionRenderer(params: any) {
    const container = document.createElement('div');

    // Create Edit Button
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fa fa-edit" style="color:green;"></i>';
    editButton.className = 'mars';
    editButton.addEventListener('click', () => {
    this.Edit(params.data);
      this.accordion.openAll();
    });

    // Create Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa fa-trash" style="color:red;"></i>';
    deleteButton.className = 'mars';
    deleteButton.addEventListener('click', () => {
      this.Deltable(params.data);
    });
    container.appendChild(deleteButton);

    // Append buttons to container
    container.appendChild(editButton);


    return container;
  }
  actionRenderer1(params: any) {
    const container = document.createElement('div');

    // Create Edit Button
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fa fa-edit" style="color:green;"></i>';
    editButton.className = 'mars';
    editButton.addEventListener('click', () => {
    this.Edit1(params.data);
      this.accordion.openAll();
    });

    // Create Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa fa-trash" style="color:red;"></i>';
    deleteButton.className = 'mars';
    deleteButton.addEventListener('click', () => {
      this.Deltable1(params.data);
    });
    container.appendChild(deleteButton);

    // Append buttons to container
    container.appendChild(editButton);


    return container;
  }
  actionRenderer2(params: any) {
    const container = document.createElement('div');

    // Create Edit Button
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fa fa-edit" style="color:green;"></i>';
    editButton.className = 'mars';
    editButton.addEventListener('click', () => {
    this.Edit2(params.data);
      this.accordion.openAll();
    });

    // Create Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa fa-trash" style="color:red;"></i>';
    deleteButton.className = 'mars';
    deleteButton.addEventListener('click', () => {
      this.Deltable2(params.data);
    });
    container.appendChild(deleteButton);

    // Append buttons to container
    container.appendChild(editButton);


    return container;
  }

  //Refresh page
  refresh(): void {
    window.location.reload();
  }
  Edit(e:any){
debugger
this.form.cid =e.cid;
 this.form.category=e.category;
  }
  Edit1(e:any){
    debugger
    this.form1.sid =e.sid;
     this.form1.sample=e.sample;
      }
      Edit2(e:any){
        debugger
        this.form2.aid =e.aid;
         this.form2.accessories=e.accessories;
          }

  public isVisible: boolean = false;
  showAlert() : void {
     if (this.isVisible) {
       return;
     }
     this.isVisible = true;

   }
  noDelete(){

     setTimeout(()=> this.isVisible = false,500)
   }
  //Delete
  Deltable(d: any) {
    // Display a confirmation alert
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.PostManageCategory({cidd: d.cid,
          categoryy: d.category,
          str: 'DEL'}).subscribe(response => {
          this.DelDataByTables = response;
          console.log(this.DelDataByTables);
          Swal.fire("Great!", "Deleted Successfully!", "success");
          setTimeout(() => this.isVisible = false, 500);
          this.GetCategory();

        });
      }
    });
  }

  Deltable1(t: any) {
    // Display a confirmation alert
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deletion
        this.jsonParam1 = {
          sidd: t.sid,
          samplee: t.sample,
          str: 'DEL'
        };

        this.service.PostManageSample(this.jsonParam1).subscribe(response => {
          this.DelDataByTables = response;
          console.log(this.DelDataByTables);
          Swal.fire("Great!", "Deleted Successfully!", "success");
          setTimeout(() => this.isVisible = false, 500);
          this.GetSample();

        });
      }
    });
  }
  Deltable2(c: any) {
    // Display a confirmation alert
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with deletion
        this.jsonParam2 = {
          aidd: c.aid,
          accessoriess: c.accessories,
          str: 'DEL'
        };

        this.service.PostManageAccessories(this.jsonParam2).subscribe(response => {
          this.DelDataByTables = response;
          console.log(this.DelDataByTables);
          Swal.fire("Great!", "Deleted Successfully!", "success");
          setTimeout(() => this.isVisible = false, 500);
          this.GetAccessories();

        });
      }
    });
  }
  managecategory(){
        var cid = this.form.cid;
        var category = this.form.category;
        if(cid == 0){
        var str='ADD';
        }
        else{
           var str='UPD';
        }
        this.service
          .PostManageCategory({
            cidd : cid,
            categoryy : category,
         str:str
          })
          .subscribe(
            data => {
              if (data) {
                console.log(data);

                this.GetCategory();
                this.reset();
                Swal.fire("Great!", "Data Created Successfully!", "success");
              }
            },
            error => {


            }
          );
  }

  managesample(){
    var sid = this.form1.sid;
    var sample = this.form1.sample;
    if(sid == 0){
    var str='ADD';
    }
    else{
       var str='UPD';
    }
    this.service
      .PostManageSample({
        sidd : sid,
        samplee : sample,
     str:str
      })
      .subscribe(
        data => {
          if (data) {
            console.log(data);

            this.GetSample();
            this.reset();
            Swal.fire("Great!", "Data Created Successfully!", "success");
          }
        },
        error => {


        }
      );
}

manageaccessories(){
  var aid = this.form2.aid;
  var accessories = this.form2.accessories;
  if(aid == 0){
  var str='ADD';
  }
  else{
     var str='UPD';
  }
  this.service
    .PostManageAccessories({
      aidd : aid,
      accessoriess : accessories,
   str:str
    })
    .subscribe(
      data => {
        if (data) {
          console.log(data);

          this.GetAccessories();
          this.reset();
          Swal.fire("Great!", "Data Created Successfully!", "success");
        }
      },
      error => {


      }
    );
}

  EnableAppHeaderMenuList() {
    this.service.EnableHeaderMenuList();
  }
  home() {
    this.router.navigate(["/dashboard"]);
  }

  ngAfterViewInit() { }


reset(){
  this.form;
  this.form1;
  this.form2;
}

  }
  //Clear Date




export class Agent {
  model_For_BIS: string;
}
