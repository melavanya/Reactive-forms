import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TrackingComponent } from './tracking/tracking.component';
import { CreationComponent } from './creation/creation.component';


const routes: Routes = [
  {path:'', component: TrackingComponent},
  {path: 'tracking', component: TrackingComponent },
  {path: 'create', component: CreationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
