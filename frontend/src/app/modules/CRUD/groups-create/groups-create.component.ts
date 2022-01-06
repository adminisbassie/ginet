import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { routes, AUTO_COMPLETE_LIMIT } from '../../../consts';
import { DataFormatterService } from '../../../shared/services/data-formatter.service';
import { AutoCompleteItem } from '../../../shared/models/common';
import { GroupsService } from '../../../shared/services/groups.service';

@Component({
  selector: 'app-groups-create',
  templateUrl: './groups-create.component.html',
  styleUrls: ['./groups-create.component.scss'],
})
export class GroupsCreateComponent implements OnInit {
  loading = false;
  public routes: typeof routes = routes;
  form: FormGroup;
  AUTO_COMPLETE_LIMIT = AUTO_COMPLETE_LIMIT;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataFormatterService: DataFormatterService,

    private groupsService: GroupsService,
  ) {
    this.form = this.formBuilder.group({
      name: [''],

      description: [''],

      images: [[]],
    });
  }

  ngOnInit(): void {}

  imagesAdd(val) {
    this.form.value.images.push(val);
  }
  imagesDel(id) {
    this.form.value.images = this.form.value.images.filter(
      (img) => img.id !== id,
    );
  }

  onCreate(): void {
    this.groupsService.create(this.form.value).subscribe({
      next: (res) => {
        this.toastr.success('Groups created successfully');
        this.router.navigate([this.routes.Groups]);
      },
      error: (err) => {
        this.toastr.error('Something was wrong. Try again');
      },
    });
  }

  onCancel(): void {
    this.router.navigate([this.routes.Groups]);
  }
}
