import { Component } from '@angular/core';
import { dataName } from '../interfaces/data';
import { ApiUser } from '../services/api-user';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {
  users: dataName[] = [];
  successMessage: string = '';
  selectedUser: dataName | undefined;

  constructor(private apiUser: ApiUser) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.apiUser.getUsers().subscribe((data: dataName[]) => {
      this.users = data;
      console.log(this.users);
    });
  }

  addUser(data: dataName, form: NgForm) {
    if (
      !data.name ||
      !data.email ||
      data.age === undefined ||
      data.age === null
    ) {
      this.successMessage = 'All fields are required.';
      return;
    }

    const isDuplicate = this.users.some(
      (user) =>
        user.id !== this.selectedUser?.id &&
        (user.name.toLowerCase() === data.name.toLowerCase() ||
          user.email.toLowerCase() === data.email.toLowerCase())
    );

    if (isDuplicate) {
      this.successMessage = 'User with same name or email already exists.';
      return;
    }

    if (!this.selectedUser) {
      this.apiUser.saveUsers(data).subscribe((data: dataName) => {
        if (data) {
          this.getUser();
          form.resetForm();
          this.successMessage = 'User added successfully.';
        }
      });
    } else {
      const userData = { ...data, id: this.selectedUser.id };
      this.apiUser.updateUser(userData).subscribe((data) => {
        if (data) {
          this.getUser();
          this.selectedUser = undefined;
          form.resetForm();
          this.successMessage = 'User updated successfully.';
        }
      });
    }
  }

  cancelEdit(form: NgForm) {
    this.selectedUser = undefined;
    form.resetForm();
    this.successMessage = '';
  }

  deleteUser(id: string) {
    this.apiUser.deleteUser(id).subscribe((data: dataName) => {
      if (data) {
        this.getUser();
        this.successMessage = 'User deleted successfully.';
      }
    });
  }

  selectUser(id: string) {
    this.apiUser.getSelectedUser(id).subscribe((data: dataName) => {
      this.selectedUser = data;
      this.successMessage = '';
    });
  }
}
