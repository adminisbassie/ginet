
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { routes, AUTO_COMPLETE_LIMIT } from '../../../consts';
import { DataFormatterService } from '../../../shared/services/data-formatter.service';
import { AutoCompleteItem } from '../../../shared/models/common';
import {PostsService} from '../../../shared/services/posts.service';

    import { GroupsService } from '../../../shared/services/groups.service';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.scss']
})
export class PostsCreateComponent implements OnInit {

  loading = false;
  public routes: typeof routes = routes;
  form: FormGroup;
  AUTO_COMPLETE_LIMIT = AUTO_COMPLETE_LIMIT;

    groups: AutoCompleteItem[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private dataFormatterService: DataFormatterService,

              private groupsService: GroupsService,

              private postsService: PostsService) {
    this.form = this.formBuilder.group({

          title: [''],

          content: [''],

          images: [[]],

          group: [null],

    });
  }

  ngOnInit(): void {

      this.getGroups('');

  }

      imagesAdd(val) {
      this.form.value.images.push(val);
      }
      imagesDel(id) {
      this.form.value.images = this.form.value.images.filter(img => img.id !== id);
      }

  onCreate(): void {
    this.postsService.create(this.form.value).subscribe({
      next: res => {
        this.toastr.success('Posts created successfully');
        this.router.navigate([this.routes.Posts]);
      },
      error: err => {
        this.toastr.error('Something was wrong. Try again');
      }
    });
  }

  onCancel(): void {
    this.router.navigate([this.routes.Posts]);
  }

      getGroups(searchValue: string): void {
        const query = searchValue;
        const limit = this.AUTO_COMPLETE_LIMIT;
        this.groupsService.listAutocomplete(query, limit).subscribe(res => {
          this.groups = res;
      });
      }

}

