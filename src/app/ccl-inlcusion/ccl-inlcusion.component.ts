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
  selector: 'app-ccl-inlcusion',
  templateUrl: './ccl-inlcusion.component.html',
  styleUrls: ['./ccl-inlcusion.component.css']
})
export class CclInlcusionComponent implements OnInit {
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
    series_Model: any;
    ccL_ID: any;
    biS_Inclusion_ID:any
    category: string;
    fy: string;
    status: string;
    product:string;
    model_For_BIS: any;
    complaince_ID: string;
    components: string;
    component_Model: string;
    manufacturer: string;
    technical_Data: any;
    lenovo_Part_Number: string;
    str:any;
    // Invoice_No:any;
  };


  //Change date format
  Quotation_Date = new FormControl(new Date("yyyy-mm-dd"));
  PO_Date = new FormControl(new Date("yyyy-mm-dd"));
  Invoice_date = new FormControl(new Date("yyyy-mm-dd"));
  Payment_Release_Date = new FormControl(new Date("yyyy-mm-dd"));


  //Varibale declare
  fileToUpload: any;
  POID = 0;
  searchTerm: any;
  status: any = "";
  shared: any;
  jsonParam: any = [];
  formgroup: any;
  SharedService: any;
  message: string;
  isActiveDiv: boolean;
  OperatingMasterLists: any;
  fileName: string;
  License_Doc: any;
  OperatingMasterList: void;
  DelDataByTables: any;
  POMasterList: any;
  POMasterLists: any;
  PlantId: string;
  Upload_Quotation: any;
  Upload_PO_Reference: any;
  Upload_Invoice: any;
  Roleid: any;
  GetBISProduct: any;
  BISProduct: any;
  BISModel: any = [];
  BISSeries: any;
  BISCategory: any;
  BISYear: any;
  BISMfg: any;
  GetMfgList: any;
  GetBISProductListByParam: any;
  stringJson: string;
  stringObject: any;
  selected: any;
  dropdownListsub: string;
  mdl_for_BIS_Array: any = [];
  myString: any;
  edit_Model_str: any = [];
  temp_ModelForBIS_str: any = [];
  //pusheditems: { [mod_for_Bis: string]: any; } = {};
  public Modelform: {
    model_For_BIS: any;
  };
  public agents: Agent[];
  rowDatas: any[];
  filterbyinclusion: any;
  filterbymodelbis: any;
  filterbyfy: any;
  filterbycategory: any;
  category: any;
  KeyFiltersBy_Param: any;
  mobis: boolean;
  mobis1: boolean;
  cclinclusion: any;
  modelbiss: any;
  KeyFiltersBy_series: any;
  CCL_Component_List: any;
  Nbdata: { category: string; product: string; modelForBis: string; seriesModel: string; status: string; plantId: number; mfgPlantID: number;};
  categoryform: any;
  productdata: any;
  modeldata: any;
  includata: any;
  serdata: any;
  fydata: any;
  statdata: any;
  Get_InwardCategorys: any;
  constructor(
    private authService: AuthService,
    private service: SharedService,
    private notifyService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.uploadStatus = new EventEmitter<ProgressStatus>();
    let agents: Agent[] = [];
    this.agents = agents;
    this.Modelform = {
      model_For_BIS: ""
    };

    this.form = {
      ccL_ID: 0,
    biS_Inclusion_ID:0,
    category:'',
    series_Model:'',
    fy:'',
    status:'',
    product:'',
    model_For_BIS:'',
    complaince_ID:'',
    components:'',
    component_Model:'',
    manufacturer:'',
    technical_Data:'',
    lenovo_Part_Number:'',
    str:'',
    };
  }


  ngOnInit(): void {
    // this.GetKeyFiltersBy_Product();
    // this.GetMfgPlantList();
    this.GetCategory();
this.Get_CCL_Component_List();
    this.EnableAppHeaderMenuList();
    this.PlantId = localStorage.getItem("PlantId");
    this.CategoryProductFilter();
    let type = this.activatedRoute.snapshot.params["type"];
    this.Roleid = localStorage.getItem("RoleID");
    this.GetPOMasterLists();
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
      ],
      defaultToolPanel: "columns",
    },
  };
  GetCategory() {
    this.service.Get_InwardCategory().subscribe(response => {
      // Auto increment SNO
      this.Get_InwardCategorys = response.table
    });
  }
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

  goToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  //Common Filter
  CategoryProductFilter() {
    this.jsonParam = {
      PlantId: localStorage.getItem("PlantId")
    };

    this.service.ProductPOFilters(this.jsonParam).subscribe(response => {
      this.GetBISProduct = response;
      this.BISProduct = this.GetBISProduct.table;
      this.BISModel = this.GetBISProduct.table1;
      this.BISSeries = this.GetBISProduct.table2;
      this.dropdownList = this.BISModel;
      this.BISCategory = this.GetBISProduct.table4;
      this.BISYear = this.GetBISProduct.table6;
      this.BISMfg = this.GetBISProduct.table5;
      this.dropdownSettings = {
        singleSelection: true,
        idField: "model_For_BIS",
        textField: "model_For_BIS",
        allowSearchFilter: true,
        clearSearchFilter: true
      };

      console.log(this.GetBISProduct);
    });
  }
  Postcategory(cate:any,prod:any,mod:any,ser:any,statu:any)
  {
    this.Nbdata = {

        category:cate,
        product: prod,
        modelForBis:mod,
        seriesModel: ser,
        status: statu,
        plantId: 1,
        mfgPlantID: 1,


    };

    this.service.Postcategory_Data_CCLInclusion(this.Nbdata).subscribe(response => {
      this.categoryform = response.table;
      this.productdata=response.table1;
      this.modeldata=response.table2;
      this.serdata=response.table3;
      this.statdata=response.table6;

      this.dropdownList = this.modeldata;

      this.dropdownSettings = {
        singleSelection: true,
        idField: "model_For_BIS",
        textField: "model_For_BIS",
        allowSearchFilter: true,
        clearSearchFilter: true
      };
      this.fydata=response.table4;
      this.includata=response.table5;

    });

  }
  //Get MFG List
  GetMfgPlantList() {
    this.service.GetMfgPlant().subscribe(
      response => {
        this.GetMfgList = response.table;
      },
      error => {
        this.authService.logout();
      }
    );
  }

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
  // Get_CCL_Component_List
  Get_CCL_Component_List() {
    debugger
    this.service.Get_CCL_Component_List().subscribe(
      (response) => {
        this.CCL_Component_List = response.table;
      },
      (error) => {
        this.authService.logout();
      }
    );
  }
  //end region
  //List of PO
  GetPOMasterLists() {

    this.service.PostCCLInclusion({
    ccL_ID: 0,
    biS_Inclusion_ID:0,
    category:'',
    fy:'',
    status:'',
    product:'',
    series_Model:'',
    model_For_BIS:'',
    complaince_ID:'',
    components:'',
    component_Model:'',
    manufacturer:'',
    technical_Data:'',
    lenovo_Part_Number:'',
    str:'REPORT',
    }).subscribe(response => {
      this.POMasterLists = response.table;
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
          headerName: 'FY',
          cellRenderer: this.customTooltipRenderer.bind(this),
          field: 'fy',
          minWidth: 70,
          maxWidth: 70,
          width: 70,
          filter: true
        },

        {
          headerName: 'Category',
          field: 'category',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 150,
          maxWidth: 150,
          width: 150,
          filter: true
        },
        {
          headerName: 'Product',
          cellRenderer: this.customTooltipRenderer.bind(this),
          field: 'product',
          minWidth: 200,
          maxWidth: 200,
          width: 200,
          filter: true
        },
        {
          headerName: 'Status',
          cellRenderer: this.customTooltipRenderer.bind(this),
          field: 'status',
          minWidth: 100,
          maxWidth: 150,
          width: 150,
          filter: true
        },
        {
          headerName: 'Model for BIS',
          field: 'model_For_BIS',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 150,
          maxWidth: 150,
          width: 150,
          filter: true
        },
        {
          headerName: 'biS_Inclusion_ID',
          field: 'biS_Inclusion_ID',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 100,
          maxWidth: 150,
          width: 150,
          filter: true
        },
        {
          headerName: 'Lead Model',
          field: 'complaince_ID',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 250,
          maxWidth: 250,
          width: 250,
          filter: true
        },
        {
          headerName: 'Series Model',
          field: 'series_Model',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 250,
          maxWidth: 250,
          width: 250,
          filter: true
        },
        {
          headerName: 'components',
          field: 'components',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 200,
          maxWidth: 200,
          width: 200,
          filter: true
        },
        {
          headerName: 'component_Model',
          field: 'component_Model',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 250,
          maxWidth: 250,
          width: 250,
          filter: true
        },
        {
          headerName: 'manufacturer',
          field: 'manufacturer',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 300,
          maxWidth: 300,
          width: 300,
          filter: true
        },
        {
          headerName: 'technical_Data',
          field: 'technical_Data',
          cellRenderer: this.customTooltipRenderer.bind(this),
          minWidth: 300,
          maxWidth: 300,
          width: 300,
          filter: true
        },
        {
          headerName: 'lenovo_Part_Number',
          field: 'lenovo_Part_Number',
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
    this.EditPOMaster(params.data);
      this.accordion.openAll();
    });
    if (this.Roleid <= 3) {
    // Create Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa fa-trash" style="color:red;"></i>';
    deleteButton.className = 'mars';
    deleteButton.addEventListener('click', () => {
      this.PostDelDataByTables(params.data);
    });
    container.appendChild(deleteButton);
  }
    // Append buttons to container
    container.appendChild(editButton);


    return container;
  }
  editButtonRenderer(params: any) {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-edit"></i>';
    button.addEventListener('click', () => {
      this.EditPOMaster(params.data);
      this.accordion.openAll()
    });
    return button;
  }
  delButtonRenderer(params: any) {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fa fa-trash"></i>';
    button.addEventListener('click', () => {
      this.PostDelDataByTables(params.data);

    });
    return button;
  }
  //Refresh page
  refresh(): void {
    window.location.reload();
  }
  EditPOMaster(e:any){
debugger
this.form.ccL_ID =e.ccL_ID;
 this.form.category=e.category;
 this.form.product=e.product;
this.form.fy=e.fy;
 this.form.biS_Inclusion_ID=e.biS_Inclusion_ID;
 this.form.model_For_BIS=e.model_For_BIS;

 this.form.complaince_ID=e.complaince_ID;
 this.form.series_Model=e.series_Model;
 this.form.components=e.components;
 this.form.component_Model=e.component_Model;
 this.form.manufacturer=e.manufacturer;
 this.form.technical_Data=e.technical_Data;
 this.form.lenovo_Part_Number=e.lenovo_Part_Number;
 this.form.status=e.status;

  }
  //Edit
  // EditPOMaster(element: any) {
  //   this.isActiveDiv = true;
  //   this.form.POID = element.poid;
  //   this.form.Category = element.category;
  //   this.form.Product = element.product;
  //   this.form.PO_Type = element.pO_Type;
  //   this.form.Supplier_Name = element.supplier_Name;
  //   this.form.Quotation_Reference_No = element.quotation_Reference_No;
  //   this.form.Quotation_Date = element.quotation_Date;
  //   this.form.PO_Reference_No = element.pO_Reference_No;
  //   this.form.PO_Value_in_INR = element.pO_Value_in_INR;
  //   this.form.PO_Date = element.pO_Date;
  //   this.form.Invoice_No = element.invoice_No;
  //   this.form.Invoice_date = element.invoice_date;
  //   this.form.Payment_Release_Date = element.payment_Release_Date;
  //   this.form.Payment_Value_in_INR = element.payment_Value_in_INR;
  //   this.form.Payment_Term_In_Days = element.payment_Term_In_Days;
  //   this.form.Invoice_Remarks = element.invoice_Remarks;
  //   this.form.PO_Remarks = element.pO_Remarks;
  //   this.form.Balance_Amount = element.balance_Amount;
  //   this.form.CreatedBy = element.createdBy;
  //   this.form.PlantId = element.plantId;

  //   this.CategoryProductFilter();
  //   this.mdl_for_BIS_Array.splice(0);
  //   this.myString = this.mdl_for_BIS_Array.toString();
  //   this.dropdownList.splice(0);
  //   this.form.Model_for_BIS = {};
  //   let arraylist = new Agent();
  //   this.agents.splice(0);
  //   // this.form.Model_for_BIS=this.agents;
  //   // this.selectedItems = null;
  //   this.jsonParam = {
  //     Category: element.category,
  //     plantId: localStorage.getItem("PlantId"),
  //     product: "",
  //     mfgPlantID: 1
  //   };

  //   this.service.GetBISKeyFiltersBy_ParamPO(this.jsonParam).subscribe(
  //     response => {
  //       this.GetBISProductListByParam = response;
  //       this.BISProduct = this.GetBISProductListByParam.table;
  //       console.log(this.GetBISProductListByParam);
  //     },
  //     error => {
  //       this.authService.logout();
  //     }
  //   );

  //   this.jsonParam = {
  //     category: element.category,
  //     product: element.product,
  //     plantId: localStorage.getItem("PlantId"),
  //     mfgPlantID: 1
  //   };

  //   this.service.GetBISKeyFiltersBy_ModelforbisPO(this.jsonParam).subscribe(
  //     response => {
  //       this.dropdownList.splice(0);
  //       this.form.model_For_BIS = {};
  //       this.GetBISProductListByParam = response;
  //       this.BISModel = this.GetBISProductListByParam.table;
  //       this.dropdownList = this.BISModel;
  //       this.dropdownSettings = {
  //         singleSelection: false,
  //         idField: "model_For_BIS",
  //         textField: "model_For_BIS",
  //         selectAllText: "Select All",
  //         unSelectAllText: "UnSelect All",
  //         itemsShowLimit: 3,
  //         allowSearchFilter: true,
  //         clearSearchFilter: true
  //       };

  //       this.edit_Model_str = element.model_for_BIS.split(",");
  //       let arraylist = new Agent();
  //       this.agents.splice(0);
  //       let pusheditems = {};
  //       this.edit_Model_str.forEach(obj => {
  //         pusheditems["mod_for_biss"] = obj;
  //         this.agents.push(<Agent>{
  //           model_For_BIS: pusheditems["mod_for_biss"]
  //         });

  //       });
  //       this.form.model_For_BIS = this.agents;
  //       console.log(this.form.model_For_BIS);


  //       // this.selectedItems = this.agents;

  //       console.log(this.GetBISProductListByParam);
  //     },
  //     error => {
  //       this.authService.logout();
  //     }
  //   );

  //   this.edit_Model_str = element.model_for_BIS.split(",");
  //   this.edit_Model_str.forEach(obj => {
  //     this.mdl_for_BIS_Array.push(obj);
  //   });



  // }
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
  PostDelDataByTables(param: any) {
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
        this.jsonParam = {
          ccL_ID: param.ccL_ID,
          category: param.category,
          product: param.product,
          fy: param.fy,
          biS_Inclusion_ID: param.biS_Inclusion_ID,
          model_For_BIS: param.model_For_BIS,
          complaince_ID: param.complaince_ID,
          series_Model: param.series_Model,
          components: param.components,
          component_Model: param.component_Model,
          manufacturer: param.manufacturer,
          technical_Data: param.technical_Data,
          lenovo_Part_Number: param.lenovo_Part_Number,
          status: param.status,
          str: 'DEL'
        };

        this.service.PostCCLInclusion(this.jsonParam).subscribe(response => {
          this.DelDataByTables = response;
          console.log(this.DelDataByTables);
          Swal.fire("Great!", "Deleted Successfully!", "success");
          setTimeout(() => this.isVisible = false, 500);
          this.GetPOMasterLists();
          // if (response.success === "DeleteSuccess") {

          // }
        });
      }
    });
  }


  fliterinclusion(inid:any){
    debugger
    this.form.model_For_BIS = null;
    this.mdl_for_BIS_Array;
    this.myString = this.mdl_for_BIS_Array.toString();
    this.jsonParam = {
      inclusion_Request_Id:inid,
      PlantId: localStorage.getItem("PlantId"),
      mfgPlantId:1
    };
    this.service.PostBISQueryFilterByInclusionID(this.jsonParam).subscribe(response => {
      this.filterbycategory = response.table;

      this.form.category=this.filterbycategory[0].category;
      this.filterbyfy = response.table1;
      this.form.fy = this.filterbyfy[0].fy;
      this.filterbyinclusion = response.table2;
      this.filterbymodelbis = response.table3;
      this.modelbiss=this.filterbymodelbis[0].model_For_BISs;
      if(this.filterbymodelbis.length > 1){
        this.mobis=true;
      }
      else{
        this.mobis=false;
      }
      if(this.filterbymodelbis.length === 1){
        this.mobis1=true;
        this.leadmodel(this.modelbiss);
      }
      else{
        this.mobis1=false;
        this.form.model_For_BIS=this.filterbymodelbis.model_For_BISs;
      }

      this.form.product = this.filterbyinclusion[0].product;


      console.log(this.filterbymodelbis);

    });
  }


  //Model for BIS de select
  onItemDeSelect(item: any) {

    let index: number = this.mdl_for_BIS_Array.indexOf(item.model_For_BISs);
    if (index > -1) {
      this.mdl_for_BIS_Array.splice(index, 1);
      this.myString = this.mdl_for_BIS_Array.toString();
      console.log(this.myString);
    }
  }
  // Select  model for BIS
  onItemSelect(itemselect: any) {
    debugger;

    // Reset the selection array to ensure only one item is selected
    this.mdl_for_BIS_Array = [itemselect.model_For_BIS];

    // Update the string representation of the selection
    this.myString = this.mdl_for_BIS_Array.toString();

    // Log the updated string for debugging
    console.log(this.myString);
    this.Postcategory(this.form.category,this.form.product,this.myString,this.form.series_Model,this.form.status)
    // Call the method with the updated string
    this.leadmodel(this.myString);
  }

  //Select all model for BIS
  onSelectAll(items: any) {
    console.log(items);
    this.mdl_for_BIS_Array.splice(0);
    var num = items.forEach(x => {
      this.mdl_for_BIS_Array.push(x.model_For_BIS);
    });
    this.myString = this.mdl_for_BIS_Array.toString();
    console.log(this.myString);
  }
  //Filter by category
  leadmodel(lead:any) {
    debugger

this.jsonParam = {
fy: "",
plantId: localStorage.getItem("PlantId"),
mfgPlantID:1,
modelForBis: lead,
product: "",
seriesModel: "",
status: "",
    };

    this.service.PostKeyFiltersBy_Param(this.jsonParam).subscribe(
      response => {
        this.KeyFiltersBy_Param = response.table;
        this.KeyFiltersBy_series = response.table1;
        this.form.complaince_ID = this.KeyFiltersBy_Param[0].lead_Model;
        this.form.series_Model = this.KeyFiltersBy_series[0].series_Model;
        this.form.fy=this.fydata[0].fy;
        this.form.biS_Inclusion_ID=this.includata[0].inclusion_Request_Id;
        this.form.status=this.statdata[0].status;

      },
      error => {
        this.authService.logout();
      }
    );
  }
  //Create Po Reference
  public POApplication() {

    if (this.form.ccL_ID > 0) {
      debugger
      this.myString = this.mdl_for_BIS_Array.toString();
    }


    var ccL_ID = this.form.ccL_ID;
    var category = this.form.category;
    var product = this.form.product;
    var fy = this.form.fy;
    var biS_Inclusion_ID=this.form.biS_Inclusion_ID;
    var model_For_BIS = this.myString;
    var complaince_ID = this.form.complaince_ID;
    var series_Model = this.form.series_Model;
    var components = this.form.components;
    var component_Model =this.form.component_Model ;
    var manufacturer = this.form.manufacturer;
    var technical_Data = this.form.technical_Data;
    var lenovo_Part_Number = this.form.lenovo_Part_Number;
    var status=this.form.status;
    if(ccL_ID == 0){
    var str='ADD';
    }
    else{
       var str='UPD';
    }


    this.service
      .PostCCLInclusion({
     ccL_ID : ccL_ID,
     category : category,
     product : product,
     fy : fy,
     biS_Inclusion_ID:biS_Inclusion_ID,
     model_For_BIS : model_For_BIS,
     complaince_ID : complaince_ID,
     series_Model:series_Model,
     components : components,
     component_Model :component_Model ,
     manufacturer : manufacturer,
     technical_Data :technical_Data,
     lenovo_Part_Number : lenovo_Part_Number,
     status:status,
     str:str
      })
      .subscribe(
        data => {
          if (data) {
            console.log(data);

            this.dropdownList.splice(0);
            this.form.model_For_BIS = {};
            this.agents.splice(0);
            this.mdl_for_BIS_Array.splice(0);
            this.form.model_For_BIS = this.agents;
            this.dropdownList = this.agents;
            this.dropdownSettings = {
              singleSelection: true,
              idField: "model_For_BIS",
              textField: "model_For_BIS",

              allowSearchFilter: true,
              clearSearchFilter: true
            };



            // console.log(this.selectedItems);
            console.log(this.form.model_For_BIS);

            this.GetPOMasterLists();
            this.reset();
            Swal.fire("Great!", "Data Created Successfully!", "success");
          }
        },
        error => {
          this.inputFile.nativeElement.value = "";
          this.uploadStatus.emit({ status: ProgressStatusEnum.ERROR });
        }
      );
  }
  //Upload File
  public upload(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
      this.uploadStatus.emit({ status: ProgressStatusEnum.START });
    }
  }
  //Get Days by PO Type

  //Upload file
  uploadfile() {
    this.service.uploadFile(this.fileToUpload).subscribe(
      data => {
        if (data) {
          switch (data.type) {
            case HttpEventType.UploadProgress:
              this.uploadStatus.emit({
                status: ProgressStatusEnum.IN_PROGRESS,
                percentage: Math.round((data.loaded / data.total) * 100)
              });
              break;
            case HttpEventType.Response:
              this.inputFile.nativeElement.value = "";
              this.uploadStatus.emit({ status: ProgressStatusEnum.COMPLETE });
              break;
          }
        }
      },
      error => {
        this.inputFile.nativeElement.value = "";
        this.uploadStatus.emit({ status: ProgressStatusEnum.ERROR });
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
  downloadRenderer(params: any) {
    const container = document.createElement('div');

    // Check if the file URL exists
    if (params.value) {
      const fileName = params.value.split('/').pop(); // Extract the file name from URL
      const link = document.createElement('a');
      link.href = '#'; // Prevent default link behavior
      link.innerHTML = `<i class="fa fa-download"></i> ${fileName}`;
      link.style.cursor = 'pointer';

      // Map column field names to the required string
      let type: string;
      switch (params.colDef.field) {
        case 'upload_Quotation':
          type = 'POQuotation';
          break;
        case 'upload_PO_Reference':
          type = 'POReference';
          break;
        case 'upload_Invoice':
          type = 'POInvoice';
          break;
        default:
          type = 'Unknown'; // Default case if needed
      }

      // Add click event to call the Download method
      link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default link action
        this.Download(params.value, type); // Call the Download method with the mapped type
      });

      container.appendChild(link);
    }

    return container;
  }

  Download(fileName: any, Str: any): void {
    this.jsonParam = {
      fileName: fileName,
      Str: Str
    };

    this.service
      .DownloadFile(this.jsonParam)
      .subscribe(blob => saveAs(blob, fileName));
  }

  // Download DOC
  downloadFile() {
    this.Upload_Quotation.download().subscribe(
      res => {
        const blob = new Blob([res.blob()], {
          type: "application/vnd.ms.excel"
        });
        const file = new File([blob], this.fileName + ".xlsx", {
          type: "application/vnd.ms.excel"
        });
      },
      res => { }
    );
    this.Upload_PO_Reference.download().subscribe(
      res => {
        const blob = new Blob([res.blob()], {
          type: "application/vnd.ms.excel"
        });
        const file = new File([blob], this.fileName + ".xlsx", {
          type: "application/vnd.ms.excel"
        });
      },
      res => { }
    );
    this.Upload_Invoice.download().subscribe(
      res => {
        const blob = new Blob([res.blob()], {
          type: "application/vnd.ms.excel"
        });
        const file = new File([blob], this.fileName + ".xlsx", {
          type: "application/vnd.ms.excel"
        });
      },
      res => { }
    );
  }

  //Reset form
  // resetForm() {


  //   this.form.POID = 0;
  //   this.myString = "";
  //   this.edit_Model_str = "";
  //   this.mdl_for_BIS_Array.splice(0);
  //   this.form.Category = "";
  //   this.form.Product = "";
  //   this.form.PO_Type = "";
  //   this.form.Model_for_BIS = "";
  //   this.form.Supplier_Name = "";
  //   this.form.Quotation_Reference_No = "";
  //   this.form.Quotation_Date = "";
  //   this.form.PO_Reference_No = "";
  //   this.form.PO_Date = "";
  //   this.form.PO_Value_in_INR = "";
  //   this.form.Invoice_No = "";
  //   this.form.Invoice_date = "";
  //   this.form.Payment_Release_Date = "";
  //   this.form.Payment_Value_in_INR = "";
  //   this.form.Balance_Amount = "";
  //   this.form.Upload_Quotation = null;
  //   this.form.Upload_PO_Reference = null;
  //   this.form.Upload_Invoice = null;
  //   this.form.Payment_Term_In_Days = "";
  //   this.form.PO_Remarks = "";
  //   this.form.Invoice_Remarks = "";
  //   this.form.Invoice_No = "";
  //   this.inputvar1.nativeElement.value = "";
  //   this.inputvar2.nativeElement.value = "";
  //   this.inputvar3.nativeElement.value = "";
reset(){
  this.form = {
    ccL_ID: 0,
  biS_Inclusion_ID:0,
  category:'',
  series_Model:'',
  fy:'',
  status:'',
  product:'',
  model_For_BIS:'',
  complaince_ID:'',
  components:'',
  component_Model:'',
  manufacturer:'',
  technical_Data:'',
  lenovo_Part_Number:'',
  str:'',
  };
}

  }
  //Clear Date




export class Agent {
  model_For_BIS: string;
}
