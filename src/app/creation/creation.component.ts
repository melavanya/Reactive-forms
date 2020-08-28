import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { AppService } from '../app.service';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss']
})
export class CreationComponent implements OnInit {
  @ViewChild('alert1', { static: true }) alert1: ElementRef;
  @ViewChild('alert2', { static: true }) alert2: ElementRef;

  searchText = '';
  GPNData = [];
  results: any[];
  SNumberInputs = 0;
  showLoopbacks = false;
  serialNumber: FormArray;
  initialSNumbers = 0;

  creationForm: FormGroup;
  constructor(private formBuilder: FormBuilder, public appService: AppService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.appService.getGPNData().subscribe(result => {
      this.results = result;
      this.GPNData = result;
    });
  }
  initForm() {
    this.creationForm = this.formBuilder.group({
      gpn: ['', Validators.required],
      quantity: ['', Validators.required],
      maxCount: [null],
      SNRequired: ['', Validators.required],
      serialNumbers: this.formBuilder.array([])
    });
  }
  checkGPN(option) {
    this.alert1.nativeElement.classList.add('hide');
    this.alert2.nativeElement.classList.add('hide');
    let GPN = option;

    this.appService.getLoopbackData().subscribe(results => {
      let gpn: any = results.find((gpn: any) => (gpn.gpn == GPN && gpn.SNRequired == 'yes'));
      if (gpn) {
        if (gpn.serialNumbers.length !== gpn.quantity) {
          this.creationForm = this.formBuilder.group({
            gpn: [gpn.gpn, Validators.required],
            quantity: [gpn.quantity, Validators.required],
            maxCount: [gpn.maxCount],
            SNRequired: [gpn.SNRequired, Validators.required],
            serialNumbers: this.formBuilder.array(gpn.serialNumbers)
          });
          this.showLoopbacks = true;
          this.initialSNumbers = gpn.serialNumbers.length;
          this.alert2.nativeElement.classList.remove('hide');
          this.SNumberInputs = gpn.quantity - gpn.serialNumbers.length;
          this.generateSerialNumberInputs();
        }
      } else {
        this.creationForm = this.formBuilder.group({
          gpn: [GPN, Validators.required],
          quantity: ['', Validators.required],
          maxCount: [null],
          SNRequired: ['', Validators.required],
          serialNumbers: this.formBuilder.array([])
        });
        this.showLoopbacks = false;
        this.initialSNumbers = 0;
        this.alert1.nativeElement.classList.add('hide');
        this.alert2.nativeElement.classList.add('hide');
      }
    })
  }
  filter(value) {
    if (value !== null) {
      const filterValue = value.toLowerCase();
      this.results = this.GPNData.filter((item: string) => item.toLowerCase().includes(filterValue));
    }
  }

  closeAlert(value) {
    if (value == "alert1") {
      this.alert1.nativeElement.classList.add('hide')
    } else {
      this.alert2.nativeElement.classList.add('hide')
    }
  }
  cancelLoopbacks() {
    this.showLoopbacks = false;
    this.serialNumber = this.creationForm.get('serialNumbers') as FormArray;
    this.serialNumber.clear();
  }

  onFormSubmit() {
    let formValues = this.creationForm.value;
    if (formValues.SNRequired == 'no') {
      let request = {
        gpn: formValues.gpn,
        quantity: formValues.quantity,
        maxCount: 0,
        SNRequired: formValues.SNRequired,
        serialNumbers: []
      };
      this.appService.saveLoopbackData(request).subscribe(res => {
        this.showLoopbacks = false;
        this.alert1.nativeElement.classList.remove('hide')
        this.creationForm.reset();
      })
    } else {
      this.showLoopbacks = true;
      this.SNumberInputs = formValues.quantity;
      this.generateSerialNumberInputs();
    }
  }
  previousInput() {
    this.serialNumber = this.creationForm.get('serialNumbers') as FormArray;
    if (this.serialNumber.controls.length > 1) {
      this.serialNumber.removeAt(this.serialNumber.length - 1);
      this.SNumberInputs++;
    }
  }
  formReset() {
    this.creationForm.reset();
  }
  generateSerialNumberInputs() {
    this.serialNumber = this.creationForm.get('serialNumbers') as FormArray;
    if (this.SNumberInputs >= 1)
      this.serialNumber.push(this.formBuilder.group({
        serialNumber: ['', Validators.required]
      }));
    this.SNumberInputs--;
  }

  saveLoopbacks() {
    let formValues = this.creationForm.value;
    let request = {
      gpn: formValues.gpn,
      quantity: formValues.quantity,
      maxCount: formValues.maxCount,
      SNRequired: formValues.SNRequired,
      serialNumbers: formValues.serialNumbers
    };
    this.appService.saveLoopbackData(request).subscribe(res => {
      this.showLoopbacks = false;
      this.alert1.nativeElement.classList.remove('hide');
      this.creationForm.reset();
      this.serialNumber.clear();
    });
  }
}
