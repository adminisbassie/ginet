import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataFormatterService } from '../../../shared/services/data-formatter.service';
import { CommentsService } from '../../../shared/services/comments.service';
import { routes } from '../../../consts';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../shared/popups/delete-popup/delete-popup.component';
import { Comments } from '../../../shared/models/comments.model';
import { MatPaginator } from '@angular/material/paginator';
import { FilterConfig, FilterItems } from '../../../shared/models/common';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss'],
})
export class CommentsListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  comments: Comments[];
  loading = false;
  selectedId: string;
  deleteConfirmSubscription;
  public routes: typeof routes = routes;
  public displayedColumns: string[] = ['content', 'post', 'author', 'actions'];
  public dataSource: MatTableDataSource<Comments>;
  config: FilterConfig[] = [];
  showFilters = false;
  filters: FilterItems[] = [
    { label: 'Content', title: 'content' },

    { label: 'Post', title: 'post' },
    { label: 'Author', title: 'author' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dataFormatterService: DataFormatterService,
    private commentsService: CommentsService,
  ) {}

  ngOnInit(): void {
    this.getComments();
  }

  addFilter(): void {
    !this.showFilters ? (this.showFilters = true) : null;
    this.config.push({});
  }

  submitHandler(request: string): void {
    this.commentsService.getFilteredData(request).subscribe((res) => {
      this.comments = res.rows;
      this.dataSource = new MatTableDataSource(res.rows);
      this.dataSource.paginator = this.paginator;
    });
  }

  clearFilters(): void {
    this.getComments();
  }

  delFilter() {
    this.config.length === 0 ? (this.showFilters = false) : null;
  }

  create(): void {
    this.router.navigate([this.routes.Comments_CREATE]);
  }

  edit(row: Comments): void {
    this.router.navigate([routes.Comments_EDIT, row.id]);
  }

  openDeleteModal(id: string): void {
    this.selectedId = id;
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '512px',
    });

    this.deleteConfirmSubscription =
      dialogRef.componentInstance.deleteConfirmed.subscribe((result) => {
        this.onDelete(this.selectedId);
      });
  }

  onDelete(id: string): void {
    this.commentsService.delete(id).subscribe({
      next: (res) => {
        this.deleteConfirmSubscription.unsubscribe();
        this.toastr.success('Comments deleted successfully');
        this.comments = this.comments.filter((item) => item.id !== id);
      },
      error: (err) => {
        this.toastr.error('Something was wrong. Try again');
      },
    });
  }

  private getComments(): void {
    this.commentsService.getAll().subscribe((res) => {
      this.comments = res.rows;
      this.dataSource = new MatTableDataSource(res.rows);
      this.dataSource.paginator = this.paginator;
    });
  }
}
