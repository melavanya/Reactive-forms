import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AppService } from '../app.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {
  @ViewChild('alert1', { static: true }) alert1: ElementRef;

  searchText = '';
  GPNData = [];
  results: any[] = [];
  serialNumber: FormArray;
  insertionForm: FormGroup;
  gpn: any;
  visible = false;

  constructor(private formBuilder: FormBuilder, public appService: AppService) { }

  ngOnInit(): void {
    this.initForm();
    this.appService.getLoopbackData().subscribe(result => {
      result.forEach((gpn: any) => {
        if (gpn.serialNumbers.length == gpn.quantity) {
          this.results.push(gpn.gpn);
          this.GPNData.push(gpn.gpn);
        }
      })
    });
  }
  initForm() {
    this.insertionForm = this.formBuilder.group({
      gpn: ['', Validators.required]
    });
  }
  formReset() {
    this.insertionForm.reset();
    this.visible = false;
  }
  checkGPN(option) {
    this.alert1.nativeElement.classList.add('hide');
    let GPN = option;
    this.appService.getLoopbackData().subscribe(results => {
      let gpn = results.find((gpn: any) => (gpn.gpn == GPN))
      if (gpn) {
        this.gpn = gpn;
      }
    })
  }
  closeAlert(value) {
    if (value == "alert1") {
      this.alert1.nativeElement.classList.add('hide')
    }
  }
  filter(value) {
    if (value !== null) {
      const filterValue = value.toLowerCase();
      this.results = this.GPNData.filter((item: string) => item.toLowerCase().includes(filterValue));
    }
  }
  onFormSubmit() {
    if (this.gpn.counter == this.gpn.maxCount) {
    this.alert1.nativeElement.classList.remove('hide');
    } else {
      this.visible = true;
      this.appService.savelotCount(this.gpn.gpn)
    }

  }
}
