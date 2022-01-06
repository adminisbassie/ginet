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
import { ReactionService } from '../../../shared/services/reaction.service';

import { UsersService } from '../../../shared/services/users.service';

import { PostsService } from '../../../shared/services/posts.service';

@Component({
  selector: 'app-reaction-create',
  templateUrl: './reaction-create.component.html',
  styleUrls: ['./reaction-create.component.scss'],
})
export class ReactionCreateComponent implements OnInit {
  loading = false;
  public routes: typeof routes = routes;
  form: FormGroup;
  AUTO_COMPLETE_LIMIT = AUTO_COMPLETE_LIMIT;

  nameList = [
    { name: 'like' },
    { name: 'dislike' },
    { name: 'love' },
    { name: 'sad' },
    { name: 'care' },
    { name: 'haha' },
    { name: 'wow' },
    { name: 'angry' },
  ];

  users: AutoCompleteItem[] = [];

  posts: AutoCompleteItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataFormatterService: DataFormatterService,

    private usersService: UsersService,

    private postsService: PostsService,

    private reactionService: ReactionService,
  ) {
    this.form = this.formBuilder.group({
      name: [null],

      user: [null],

      post: [null],
    });
  }

  ngOnInit(): void {
    this.getUsers('');

    this.getPosts('');
  }

  onCreate(): void {
    this.reactionService.create(this.form.value).subscribe({
      next: (res) => {
        this.toastr.success('Reaction created successfully');
        this.router.navigate([this.routes.Reaction]);
      },
      error: (err) => {
        this.toastr.error('Something was wrong. Try again');
      },
    });
  }

  onCancel(): void {
    this.router.navigate([this.routes.Reaction]);
  }

  getUsers(searchValue: string): void {
    const query = searchValue;
    const limit = this.AUTO_COMPLETE_LIMIT;
    this.usersService.listAutocomplete(query, limit).subscribe((res) => {
      this.users = res;
    });
  }

  getPosts(searchValue: string): void {
    const query = searchValue;
    const limit = this.AUTO_COMPLETE_LIMIT;
    this.postsService.listAutocomplete(query, limit).subscribe((res) => {
      this.posts = res;
    });
  }
}
