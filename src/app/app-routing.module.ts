import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./_guards/auth.guard";
import { LoginComponent } from "./_component/login/login.component";
import { CclProgramComponent } from "./_component/ccl-program//ccl-program.component";
import { CclInlcusionComponent } from "./ccl-inlcusion/ccl-inlcusion.component";
import { BisInwardComponent } from "./bis-inward/bis-inward.component";
import { CclListManagementComponent } from "./ccl-list-management/ccl-list-management.component";
import { RMMaterialComponent } from "./rm-material/rm-material.component";

const routes: Routes = [

  {
    path: "ccl-program",
    canActivate: [AuthGuard],
    component: CclProgramComponent
  },
  {
    path: "ccl-inclusion",
    canActivate: [AuthGuard],
    component: CclInlcusionComponent
  },
  {
    path: "bis-inward",
    canActivate: [AuthGuard],
    component: BisInwardComponent
  },
  {
    path: "CCL_management",
    canActivate: [AuthGuard],
    component: CclListManagementComponent
  },
  {
    path: "RM_Material",
    canActivate: [AuthGuard],
    component: RMMaterialComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "**", redirectTo: "/login" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
