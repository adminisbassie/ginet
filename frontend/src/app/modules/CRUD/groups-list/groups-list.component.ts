import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataFormatterService } from '../../../shared/services/data-formatter.service';
import { GroupsService } from '../../../shared/services/groups.service';
import { routes } from '../../../consts';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeletePopupComponent } from '../../../shared/popups/delete-popup/delete-popup.component';
import { Groups } from '../../../shared/models/groups.model';
import { MatPaginator } from '@angular/material/paginator';
import { FilterConfig, FilterItems } from '../../../shared/models/common';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss'],
})
export class GroupsListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  groups: Groups[];
  loading = false;
  selectedId: string;
  deleteConfirmSubscription;
  public routes: typeof routes = routes;
  public displayedColumns: string[] = [
    'name',
    'description',
    'images',
    'actions',
  ];
  public dataSource: MatTableDataSource<Groups>;
  config: FilterConfig[] = [];
  showFilters = false;
  filters: FilterItems[] = [
    { label: 'Name', title: 'name' },
    { label: 'Description', title: 'description' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dataFormatterService: DataFormatterService,
    private groupsService: GroupsService,
  ) {}

  ngOnInit(): void {
    this.getGroups();
  }

  addFilter(): void {
    !this.showFilters ? (this.showFilters = true) : null;
    this.config.push({});
  }

  submitHandler(request: string): void {
    this.groupsService.getFilteredData(request).subscribe((res) => {
      this.groups = res.rows;
      this.dataSource = new MatTableDataSource(res.rows);
      this.dataSource.paginator = this.paginator;
    });
  }

  clearFilters(): void {
    this.getGroups();
  }

  delFilter() {
    this.config.length === 0 ? (this.showFilters = false) : null;
  }

  create(): void {
    this.router.navigate([this.routes.Groups_CREATE]);
  }

  edit(row: Groups): void {
    this.router.navigate([routes.Groups_EDIT, row.id]);
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
    this.groupsService.delete(id).subscribe({
      next: (res) => {
        this.deleteConfirmSubscription.unsubscribe();
        this.toastr.success('Groups deleted successfully');
        this.groups = this.groups.filter((item) => item.id !== id);
      },
      error: (err) => {
        this.toastr.error('Something was wrong. Try again');
      },
    });
  }

  private getGroups(): void {
    this.groupsService.getAll().subscribe((res) => {
      this.groups = res.rows;
      this.dataSource = new MatTableDataSource(res.rows);
      this.dataSource.paginator = this.paginator;
    });
  }
}
