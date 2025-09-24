import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactModalComponent } from "../../../pages/contact-modal/contact-modal.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, ContactModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  showSpinner: boolean = true
  showContactModal = false;


  ngOnInit(): void {
        setTimeout(()=>{
          this.showSpinner = false;
        }, 1500)
  }

  openContactModal() {
  this.showContactModal = true;
}

closeContactModal() {
  this.showContactModal = false;
}

}
