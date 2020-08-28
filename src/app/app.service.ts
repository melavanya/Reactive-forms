import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GPNData, loopbackData, } from './appData';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  loopbackData: any = [];
  constructor() {
    this.loopbackData = loopbackData;
  }

  getGPNData(): Observable<[]> {
    return of(GPNData);
  }

  saveLoopbackData(loopbackDetails): Observable<any> {
    loopbackDetails = Object.assign({}, loopbackDetails, { counter: 0 })
    let index = this.loopbackData.findIndex((gpn) => (loopbackDetails.gpn == gpn.gpn && gpn.SNRequired == 'yes'))
    if (index !== -1 && loopbackDetails.SNRequired == 'yes') {
      this.loopbackData[index] = loopbackDetails;
    } else {
      this.loopbackData.push(loopbackDetails);
   }
    return of({message: "Success"});
  }

  getLoopbackData(): Observable<[]> {
    return of(this.loopbackData);
  }

  savelotCount(gpn) {
this.loopbackData.forEach(element => {
  if (element.gpn == gpn) {
    element.counter = element.counter+1;
  }
});
    console.log(this.loopbackData)
  }

}
