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
import { MessagesService } from '../../../shared/services/messages.service';

import { UsersService } from '../../../shared/services/users.service';

@Component({
  selector: 'app-messages-edit',
  templateUrl: './messages-edit.component.html',
  styleUrls: ['./messages-edit.component.scss'],
})
export class MessagesEditComponent implements OnInit {
  selectedMessages;
  loading = false;
  public routes: typeof routes = routes;
  form: FormGroup;
  AUTO_COMPLETE_LIMIT = AUTO_COMPLETE_LIMIT;
  selectedId = this.route.snapshot.params.id;

  users: AutoCompleteItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataFormatterService: DataFormatterService,

    private usersService: UsersService,

    private messagesService: MessagesService,
  ) {
    this.form = this.formBuilder.group({
      body: [''],

      from: [null],

      to: [null],
    });
  }

  ngOnInit(): void {
    this.getMessagesById();

    this.getUsers('');

    this.getUsers('');
  }

  onSave(): void {
    this.messagesService.update(this.form.value, this.selectedId).subscribe({
      next: (res) => {
        this.toastr.success('Messages updated successfully');
        this.router.navigate([this.routes.Messages]);
      },
      error: (err) => {
        this.toastr.error('Something was wrong. Try again');
      },
    });
  }

  onCancel(): void {
    this.router.navigate([this.routes.Messages]);
  }

  private getMessagesById(): void {
    this.messagesService.getById(this.selectedId).subscribe((res) => {
      res.from = res.from?.id;

      res.to = res.to?.id;

      this.form.patchValue(res);
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
