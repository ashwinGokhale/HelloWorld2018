import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, FormControl } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation'

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { User } from '../user';
import { Application } from '../application';

import { AlertService, UserService } from '../services/index';
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  //for autocomplete
  majorCtrl: FormControl;
  filteredMajors: any;
  majors = [];

  currentUser: User;

  model: any = {};
  loading = false;
  appSubmitted = false;

  filename = null;

  class_years = [
    {value: 'freshman', viewValue: 'Freshman'},
    {value: 'sophomore', viewValue: 'Sophomore'},
    {value: 'junior', viewValue: 'Junior'},
    {value: 'senior', viewValue: 'Senior'}
  ];

  grad_years = ["2018","2019","2020","2021","2022","2023","2024","2025"];

  referrals = [
    {value: 'social_media', viewValue: 'Social Media'},
    {value: 'website', viewValue: 'Purdue Hackers Website'},
    {value: 'flyers', viewValue: 'Flyers'},
    {value: 'class', viewValue: 'Class Callout'},
    {value: 'friend', viewValue: 'Friend'}
  ];

  shirt_sizes = [
    {value: 's', viewValue: 'S'},
    {value: 'm', viewValue: 'M'},
    {value: 'l', viewValue: 'L'},
    {value: 'xl', viewValue: 'XL'},
    {value: 'xxl', viewValue: 'XXL'}
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.majorCtrl = new FormControl();
      this.filteredMajors = this.majorCtrl.valueChanges
          .startWith(null)
          .map(name => this.filterMajors(name));
      this.majors = Application.getMajors();
      this.model.firstName = this.currentUser.firstname;
      this.model.lastName = this.currentUser.lastname;
      this.model.email = this.currentUser.email;
  }

  ngOnInit() {
    this.loadApplication();
  }

  filterMajors(val: string) {
    return val ? this.majors.filter(s => s.toLowerCase().indexOf(val.toLowerCase()) === 0)
               : this.majors;
  }

  setFile(event){
    console.log('upload', event.target.files);
    this.model.resume = event.target.files[0];
    this.filename = event.target.files[0].name;
  }

  apply() {
    this.loading = true;
    this.userService.apply(this.model)
      .subscribe(
          data => {
              this.alertService.success('Application successfully submitted.', true);
              this.router.navigate(['/home']);
          },
          error => {
              error = error.json();
              this.alertService.error(error.message);
              this.loading = false;
          });
  }

  private loadApplication() {
      this.userService.getApplication()
        .subscribe(
          result => {
            this.model = result.application;
            if(result.message === "success")
              this.appSubmitted = true;
            console.log(result);
          }, error => {
            console.log(error);
            this.loading = false;
            //this.alertService.error(error);
          }
      );
  }

}
