import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataFormatterService } from '../../../shared/services/data-formatter.service';
import { PostsService } from '../../../shared/services/posts.service';
import { routes } from '../../../consts';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../shared/popups/delete-popup/delete-popup.component';
import { Posts } from '../../../shared/models/posts.model';
import { MatPaginator } from '@angular/material/paginator';
import { FilterConfig, FilterItems } from '../../../shared/models/common';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  posts: Posts[];
  loading = false;
  selectedId: string;
  deleteConfirmSubscription;
  public routes: typeof routes = routes;
  public displayedColumns: string[] = [
    'title',
    'content',
    'images',
    'group',
    'actions',
  ];
  public dataSource: MatTableDataSource<Posts>;
  config: FilterConfig[] = [];
  showFilters = false;
  filters: FilterItems[] = [
    { label: 'Title', title: 'title' },
    { label: 'Content', title: 'content' },

    { label: 'Group', title: 'group' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dataFormatterService: DataFormatterService,
    private postsService: PostsService,
  ) {}

  ngOnInit(): void {
    this.getPosts();
  }

  addFilter(): void {
    !this.showFilters ? (this.showFilters = true) : null;
    this.config.push({});
  }

  submitHandler(request: string): void {
    this.postsService.getFilteredData(request).subscribe((res) => {
      this.posts = res.rows;
      this.dataSource = new MatTableDataSource(res.rows);
      this.dataSource.paginator = this.paginator;
    });
  }

  clearFilters(): void {
    this.getPosts();
  }

  delFilter() {
    this.config.length === 0 ? (this.showFilters = false) : null;
  }

  create(): void {
    this.router.navigate([this.routes.Posts_CREATE]);
  }

  edit(row: Posts): void {
    this.router.navigate([routes.Posts_EDIT, row.id]);
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
    this.postsService.delete(id).subscribe({
      next: (res) => {
        this.deleteConfirmSubscription.unsubscribe();
        this.toastr.success('Posts deleted successfully');
        this.posts = this.posts.filter((item) => item.id !== id);
      },
      error: (err) => {
        this.toastr.error('Something was wrong. Try again');
      },
    });
  }

  private getPosts(): void {
    this.postsService.getAll().subscribe((res) => {
      this.posts = res.rows;
      this.dataSource = new MatTableDataSource(res.rows);
      this.dataSource.paginator = this.paginator;
    });
  }
}
