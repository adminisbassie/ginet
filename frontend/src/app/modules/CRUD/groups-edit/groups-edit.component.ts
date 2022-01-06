
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { routes, AUTO_COMPLETE_LIMIT } from '../../../consts';
import { DataFormatterService } from '../../../shared/services/data-formatter.service';
import { AutoCompleteItem } from '../../../shared/models/common';
import {GroupsService} from '../../../shared/services/groups.service';

@Component({
  selector: 'app-groups-edit',
  templateUrl: './groups-edit.component.html',
  styleUrls: ['./groups-edit.component.scss']
})
export class GroupsEditComponent implements OnInit {

  selectedGroups;
  loading = false;
  public routes: typeof routes = routes;
  form: FormGroup;
  AUTO_COMPLETE_LIMIT = AUTO_COMPLETE_LIMIT;
  selectedId = this.route.snapshot.params.id;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private dataFormatterService: DataFormatterService,

              private groupsService: GroupsService) {
    this.form = this.formBuilder.group({

          name: [''],

          description: [''],

          images: [[]],

    });
  }

  ngOnInit(): void {
    this.getGroupsById();

  }

      imagesAdd(val) {
      this.form.value.images.push(val);
      }
      imagesDel(id) {
      this.form.value.images = this.form.value.images.filter(img => img.id !== id);
      }

  onSave(): void {
    this.groupsService.update(this.form.value, this.selectedId).subscribe({
      next: res => {
        this.toastr.success('Groups updated successfully');
        this.router.navigate([this.routes.Groups]);
      },
      error: err => {
        this.toastr.error('Something was wrong. Try again');
      }
    });
  }

  onCancel(): void {
    this.router.navigate([this.routes.Groups]);
  }

  private getGroupsById(): void {
    this.groupsService.getById(this.selectedId).subscribe(res => {

      this.form.patchValue(res);
    });
  }

}

