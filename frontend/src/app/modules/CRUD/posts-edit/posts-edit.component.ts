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
import { PostsService } from '../../../shared/services/posts.service';

import { GroupsService } from '../../../shared/services/groups.service';

@Component({
  selector: 'app-posts-edit',
  templateUrl: './posts-edit.component.html',
  styleUrls: ['./posts-edit.component.scss'],
})
export class PostsEditComponent implements OnInit {
  selectedPosts;
  loading = false;
  public routes: typeof routes = routes;
  form: FormGroup;
  AUTO_COMPLETE_LIMIT = AUTO_COMPLETE_LIMIT;
  selectedId = this.route.snapshot.params.id;

  groups: AutoCompleteItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataFormatterService: DataFormatterService,

    private groupsService: GroupsService,

    private postsService: PostsService,
  ) {
    this.form = this.formBuilder.group({
      title: [''],

      content: [''],

      images: [[]],

      group: [null],
    });
  }

  ngOnInit(): void {
    this.getPostsById();

    this.getGroups('');
  }

  imagesAdd(val) {
    this.form.value.images.push(val);
  }
  imagesDel(id) {
    this.form.value.images = this.form.value.images.filter(
      (img) => img.id !== id,
    );
  }

  onSave(): void {
    this.postsService.update(this.form.value, this.selectedId).subscribe({
      next: (res) => {
        this.toastr.success('Posts updated successfully');
        this.router.navigate([this.routes.Posts]);
      },
      error: (err) => {
        this.toastr.error('Something was wrong. Try again');
      },
    });
  }

  onCancel(): void {
    this.router.navigate([this.routes.Posts]);
  }

  private getPostsById(): void {
    this.postsService.getById(this.selectedId).subscribe((res) => {
      res.group = res.group?.id;

      this.form.patchValue(res);
    });
  }

  getGroups(searchValue: string): void {
    const query = searchValue;
    const limit = this.AUTO_COMPLETE_LIMIT;
    this.groupsService.listAutocomplete(query, limit).subscribe((res) => {
      this.groups = res;
    });
  }
}
