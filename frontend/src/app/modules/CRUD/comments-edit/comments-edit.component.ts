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
import { CommentsService } from '../../../shared/services/comments.service';

import { PostsService } from '../../../shared/services/posts.service';

import { UsersService } from '../../../shared/services/users.service';

@Component({
  selector: 'app-comments-edit',
  templateUrl: './comments-edit.component.html',
  styleUrls: ['./comments-edit.component.scss'],
})
export class CommentsEditComponent implements OnInit {
  selectedComments;
  loading = false;
  public routes: typeof routes = routes;
  form: FormGroup;
  AUTO_COMPLETE_LIMIT = AUTO_COMPLETE_LIMIT;
  selectedId = this.route.snapshot.params.id;

  posts: AutoCompleteItem[] = [];

  users: AutoCompleteItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataFormatterService: DataFormatterService,

    private postsService: PostsService,

    private usersService: UsersService,

    private commentsService: CommentsService,
  ) {
    this.form = this.formBuilder.group({
      content: [''],

      post: [null],

      author: [null],
    });
  }

  ngOnInit(): void {
    this.getCommentsById();

    this.getPosts('');

    this.getUsers('');
  }

  onSave(): void {
    this.commentsService.update(this.form.value, this.selectedId).subscribe({
      next: (res) => {
        this.toastr.success('Comments updated successfully');
        this.router.navigate([this.routes.Comments]);
      },
      error: (err) => {
        this.toastr.error('Something was wrong. Try again');
      },
    });
  }

  onCancel(): void {
    this.router.navigate([this.routes.Comments]);
  }

  private getCommentsById(): void {
    this.commentsService.getById(this.selectedId).subscribe((res) => {
      res.post = res.post?.id;

      res.author = res.author?.id;

      this.form.patchValue(res);
    });
  }

  getPosts(searchValue: string): void {
    const query = searchValue;
    const limit = this.AUTO_COMPLETE_LIMIT;
    this.postsService.listAutocomplete(query, limit).subscribe((res) => {
      this.posts = res;
    });
  }

  getUsers(searchValue: string): void {
    const query = searchValue;
    const limit = this.AUTO_COMPLETE_LIMIT;
    this.usersService.listAutocomplete(query, limit).subscribe((res) => {
      this.users = res;
    });
  }
}
