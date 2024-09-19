import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MatIconModule } from "@angular/material/icon";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatSliderModule } from "@angular/material/slider";
import { LoginComponent } from "./_component/login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { JwtModule } from "@auth0/angular-jwt";
import { ToastrModule } from "ngx-toastr";
import { SharedService } from "./shared.service";
import { SearchFilterPipe } from "./search-filter.pipe";
import { NgxSpinnerModule } from "ngx-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatModule } from "./material-module";
import { CclProgramComponent } from "./_component/ccl-program/ccl-program.component";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import {
  DatePipe,
  HashLocationStrategy,
  LocationStrategy
} from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { MomentModule } from "ngx-moment";

import { MatSelectModule } from '@angular/material/select';
import { ModalModule, BsModalService } from "ngx-bootstrap/modal";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { NgxUsefulSwiperModule } from "ngx-useful-swiper";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { SidebarModule } from "@syncfusion/ej2-angular-navigations";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { MatExpansionModule } from "@angular/material/expansion";
import { IdleServiceService } from "./idle-service.service";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { AgGridModule } from 'ag-grid-angular';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { CclInlcusionComponent } from './ccl-inlcusion/ccl-inlcusion.component';
import { BisInwardComponent } from './bis-inward/bis-inward.component';
import { CclListManagementComponent } from './ccl-list-management/ccl-list-management.component';
import { RMMaterialComponent } from './rm-material/rm-material.component';



const MY_FORMATS = {
  parse: {
    dateInput: "DD MMMM YYYY"
  },
  display: {
    dateInput: "DD MMMM YYYY",
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchFilterPipe,
    CclProgramComponent,
    CclInlcusionComponent,
    BisInwardComponent,
    CclListManagementComponent,
    RMMaterialComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SidebarModule,
    BrowserModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    AppRoutingModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    NgxUsefulSwiperModule,
    MatSelectModule,
    MatSliderModule,
    Ng2SearchPipeModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatTabsModule,
    NgbModule,
    FormsModule,
    MatModule,
    MatDatepickerModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    NgIdleKeepaliveModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    MomentModule,
    ModalModule,
    MatMomentDateModule,
    NgxSpinnerModule,
    FormsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    NgbModule,
    NgxDocViewerModule,
    MatPaginatorModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem("access_token");
        },
        allowedDomains: ["localhost"],
        disallowedRoutes: ["localhost/auth/login"]
      }
    }),
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 15000,
      progressBar: true
    }),
    NgxScrollTopModule,
    AgGridModule.withComponents([])
  ],
  providers: [
    SharedService,
    DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    BsModalService,
    IdleServiceService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
