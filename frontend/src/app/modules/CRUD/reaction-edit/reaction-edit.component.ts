
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { routes, AUTO_COMPLETE_LIMIT } from '../../../consts';
import { DataFormatterService } from '../../../shared/services/data-formatter.service';
import { AutoCompleteItem } from '../../../shared/models/common';
import {ReactionService} from '../../../shared/services/reaction.service';

    import {UsersService} from '../../../shared/services/users.service';

    import {PostsService} from '../../../shared/services/posts.service';

@Component({
  selector: 'app-reaction-edit',
  templateUrl: './reaction-edit.component.html',
  styleUrls: ['./reaction-edit.component.scss']
})
export class ReactionEditComponent implements OnInit {

  selectedReaction;
  loading = false;
  public routes: typeof routes = routes;
  form: FormGroup;
  AUTO_COMPLETE_LIMIT = AUTO_COMPLETE_LIMIT;
  selectedId = this.route.snapshot.params.id;

      nameList = [{name: 'like'},{name: 'dislike'},{name: 'love'},{name: 'sad'},{name: 'care'},{name: 'haha'},{name: 'wow'},{name: 'angry'},];

    users: AutoCompleteItem[] = [];

    posts: AutoCompleteItem[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private dataFormatterService: DataFormatterService,

              private usersService: UsersService,

              private postsService: PostsService,

              private reactionService: ReactionService) {
    this.form = this.formBuilder.group({

          name: [null],

          user: [null],

          post: [null],

    });
  }

  ngOnInit(): void {
    this.getReactionById();

      this.getUsers('');

      this.getPosts('');

  }

  onSave(): void {
    this.reactionService.update(this.form.value, this.selectedId).subscribe({
      next: res => {
        this.toastr.success('Reaction updated successfully');
        this.router.navigate([this.routes.Reaction]);
      },
      error: err => {
        this.toastr.error('Something was wrong. Try again');
      }
    });
  }

  onCancel(): void {
    this.router.navigate([this.routes.Reaction]);
  }

  private getReactionById(): void {
    this.reactionService.getById(this.selectedId).subscribe(res => {

      res.user = res.user?.id;

      res.post = res.post?.id;

      this.form.patchValue(res);
    });
  }

      getUsers(searchValue: string): void {
        const query = searchValue;
        const limit = this.AUTO_COMPLETE_LIMIT;
        this.usersService.listAutocomplete(query, limit).subscribe(res => {
          this.users = res;
        });
      }

      getPosts(searchValue: string): void {
        const query = searchValue;
        const limit = this.AUTO_COMPLETE_LIMIT;
        this.postsService.listAutocomplete(query, limit).subscribe(res => {
          this.posts = res;
        });
      }

}

