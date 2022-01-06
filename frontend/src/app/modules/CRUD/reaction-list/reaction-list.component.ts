import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataFormatterService } from '../../../shared/services/data-formatter.service';
import { ReactionService } from '../../../shared/services/reaction.service';
import { routes } from '../../../consts';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../shared/popups/delete-popup/delete-popup.component';
import { Reaction } from '../../../shared/models/reaction.model';
import { MatPaginator } from '@angular/material/paginator';
import { FilterConfig, FilterItems } from '../../../shared/models/common';

@Component({
  selector: 'app-reaction-list',
  templateUrl: './reaction-list.component.html',
  styleUrls: ['./reaction-list.component.scss']
})
export class ReactionListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  reaction: Reaction[];
  loading = false;
  selectedId: string;
  deleteConfirmSubscription;
  public routes: typeof routes = routes;
  public displayedColumns: string[] = [
    'name','user','post', 'actions'
    ];
  public dataSource: MatTableDataSource<Reaction>;
  config: FilterConfig[] = [];
  showFilters = false;
  filters: FilterItems[] = [

    {label: 'User', title: 'user'},{label: 'Post', title: 'post'},
    ];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                public dialog: MatDialog,
                public dataFormatterService: DataFormatterService,
                private reactionService: ReactionService) {
  }

  ngOnInit(): void {
    this.getReaction();
  }

  addFilter(): void {
    !this.showFilters ? this.showFilters = true : null;
    this.config.push({});
  }

  submitHandler(request: string): void {
    this.reactionService.getFilteredData(request).subscribe(res => {
      this.reaction = res.rows;
      this.dataSource = new MatTableDataSource(res.rows);
      this.dataSource.paginator = this.paginator;
    });
  }

  clearFilters(): void {
    this.getReaction();
  }

  delFilter() {
    this.config.length === 0 ? this.showFilters = false : null;
  }

  create(): void {
    this.router.navigate([this.routes.Reaction_CREATE]);
  }

  edit(row: Reaction): void {
   this.router.navigate([routes.Reaction_EDIT, row.id]);
  }

  openDeleteModal(id: string): void {
    this.selectedId = id;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '512px'
    });

    this.deleteConfirmSubscription = dialogRef.componentInstance.deleteConfirmed.subscribe(result => {
      this.onDelete(this.selectedId);
      });
  }

  onDelete(id: string): void {
    this.reactionService.delete(id).subscribe({
        next: res => {
          this.deleteConfirmSubscription.unsubscribe();
          this.toastr.success('Reaction deleted successfully');
          this.reaction = this.reaction.filter(item => item.id !== id);
        },
        error: err => {
          this.toastr.error('Something was wrong. Try again');
        }
      });
  }

  private getReaction(): void {
    this.reactionService.getAll().subscribe(res => {
      this.reaction = res.rows;
      this.dataSource = new MatTableDataSource(res.rows);
      this.dataSource.paginator = this.paginator;
    });
  }

}
