import { DOCUMENT } from "@angular/common";
import {
  Component,
  OnInit,
  HostListener,
  Inject,
  ViewChild
} from "@angular/core";
import { SharedService } from "src/app/shared.service";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { Keepalive } from "@ng-idle/keepalive";
import { BsModalService } from "ngx-bootstrap/modal";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ModalDirective } from "ngx-bootstrap/modal";
import { IdleServiceService } from "./idle-service.service";
import * as CryptoJS from 'crypto-js';
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  isShow: boolean;
  topPosToStartShowing = 100;
  idleState = "Not started.";
  timedOut = false;
  lastPing?: Date = null;
  public modalRef: BsModalRef;
  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  public sidebarShow: boolean = false;
  BISNotification: any;
  jsonParam: any;
  filterTerm!: string;
  elem: any;
  isFullScreen: boolean | undefined;
  PlantId: string;
  title: string;
  Roleid: string;

  //scroll to top
  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    console.log('[scroll]', scrollPosition);

    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  // TODO: Cross browsing
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  //scroll to bottom
  goToBottom() {

    window.scrollTo(0, document.body.scrollHeight);

  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(e: KeyboardEvent) {
    console.log(e)
    if (e.key === 'F12') {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.key === "C") {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.key === "J") {
      return false;
    }
    if (e.ctrlKey && e.key === "U") {
      return false;
    }
    return true;
  }

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private modalService: BsModalService,
    private IdleServiceService: IdleServiceService,
    private service: SharedService,
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });

    //auto logout
    idle.setIdle(360);

    idle.setTimeout(30);

    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = "No longer idle.";
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.childModal.hide();
      this.idleState = "Timed out!";
      this.timedOut = true;
      console.log(this.idleState);
      this.router.navigate(["/"]);
      window.location.reload();
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = "You've gone idle!";
      console.log(this.idleState);
      this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe(countdown => {
      this.idleState = "You will time out in " + countdown + " seconds!";
      console.log(this.idleState);
    });

    keepalive.interval(15);

    keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

    this.IdleServiceService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });
  }

  //logout
  reset() {
    this.idle.watch();

    this.timedOut = false;
  }

  hideChildModal(): void {
    this.childModal.hide();
  }
  //Stay page
  stay() {
    this.childModal.hide();
    this.reset();
  }

  @HostListener("document:fullscreenchange", ["$event"])
  @HostListener("document:webkitfullscreenchange", ["$event"])
  @HostListener("document:mozfullscreenchange", ["$event"])
  @HostListener("document:MSFullscreenChange", ["$event"])
  ActivateList: boolean = false;

  public subsVar: Subscription | undefined;
  ngOnInit() {
    this.PlantId = localStorage.getItem("PlantId");

    if (localStorage.getItem("PlantId") == "1") {
      this.title = "PONDY";
    } else if (localStorage.getItem("PlantId") == "2") {
      this.title = "TRADING";
    } else {
      this.title = "";
    }
    this.elem = document.documentElement;
    if (this.service.subsVar) {
      this.subsVar = this.service.invokeAppComponentFunction.subscribe(res => {
        console.log(res);
        this.EnableMain();
        // this.GetBISNotifications();
        this.reset();
        if (localStorage.getItem("PlantId") == "1") {
          this.title = " - PONDY";
        } else if (localStorage.getItem("PlantId") == "2") {
          this.title = " - TRADING";
        } else {
          this.title = "";
        }
        this.Roleid = localStorage.getItem("RoleID");
      });
    }
    // disableDevtool(
    //   {
    //     disableMenu: true,
    //     detectors: []
    //   }
    //   );
  }

  //Footer BIS Notification
  // GetBISNotifications() {
  //   this.jsonParam = {
  //     PlantId: localStorage.getItem("PlantId")
  //   };
  //   this.service.GetBISNotification(this.jsonParam).subscribe(response => {
  //     this.BISNotification = response;
  //   });
  // }

  //Full screen
  fullscreenmodes(event: any) {
    this.chkScreenMode();
  }
  chkScreenMode() {
    if (document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }
  //Open full screen
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
  //Close full screen
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
  //logout
  logout() {
    this.childModal.hide();
    this.IdleServiceService.setUserLoggedIn(false);
    localStorage.clear();
    this.router.navigate(["/auth/login"]);
    window.location.reload();
  }

  EnableMain() {
    this.ActivateList = true;
  }

  DisableMain() {
    this.ActivateList = false;
  }
}
