import { DOCUMENT } from "@angular/common";
import {
  Component,
  OnInit,
  HostListener,
  Inject,
  ViewChild
} from "@angular/core";
import { AuthService } from "../../_services/auth.service";
import { NotificationService } from "src/app/notification.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { MatAccordion } from "@angular/material/expansion";
import { IdleServiceService } from "src/app/idle-service.service";
import encryptStorage from "encrypt-storage/dist/encrypt-storage";
import { encryptLocalStorage } from "src/app/storage";
declare var jQuery: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  model: any = {};
  public submitted: boolean = false;
  toastr: any;
  elem: any;
  isFullScreen: boolean | undefined;
  inputDisabled: boolean = true;
  loading = false;
  // Loading Time
  load() {
    console.log("click");
    this.loading = true;
    setTimeout(() => (this.loading = false), 50000);
  }
  constructor(
    private authService: AuthService,
    private notifyService: NotificationService,
    private idleServiceService: IdleServiceService,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) { }

  @HostListener("document:fullscreenchange", ["$event"])
  @HostListener("document:webkitfullscreenchange", ["$event"])
  @HostListener("document:mozfullscreenchange", ["$event"])
  @HostListener("document:MSFullscreenChange", ["$event"])
  ngOnInit() {
    this.authService.logout();
    this.model.Plant = "";
  }
  //Fullscreen mode
  fullscreenmodes(event: any) {
    this.chkScreenMode();
  }
  chkScreenMode() {
    if (document.fullscreenElement) {
      //fullscreen
      this.isFullScreen = true;
    } else {
      //not in full screen
      this.isFullScreen = false;
    }
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  changeCity(e: any) {
    this.inputDisabled = false;
  }
  //login authorized
  login() {
    this.model.action = "login";
    this.authService.loginForm(this.model).subscribe(
      response => {
        if (response.status === "Authorized") {
          console.log(response);

          this.authService.setUser(response);

          localStorage.setItem("name", response.userName);
          encryptLocalStorage.setItem("access_token", response.token);

          localStorage.setItem("Status", response.status);
          localStorage.setItem("RoleID", response.roleID);
          localStorage.setItem("PlantId", response.plantId);
          localStorage.setItem("ActiveStatus", response.activeStatus);
          localStorage.setItem("EmailID", response.emailID);
          if (response.plantId == "1") {
            this.router.navigate(["/ccl-program"]);
          }  else {
            this.router.navigate(["/auth/login"]);
          }
          this.idleServiceService.setUserLoggedIn(true);

          (function ($) {
            $(document).ready(function () {
              const bclick = document.getElementById("kt_button_1");
              if (bclick) {
                bclick.removeAttribute("data-kt-indicator");
              }
            });
          })(jQuery);
        }
      },
      error => {
        (function ($) {
          $(document).ready(function () {
            const bclick = document.getElementById("kt_button_1");
            if (bclick) {
              bclick.removeAttribute("data-kt-indicator");
            }
          });
        })(jQuery);

        Swal.fire(
          "Error!",
          "Unauthorized User Or Invalid Username Password !!!",
          "error"
        );
        //window.location.reload();
      }
    );
  }
}
