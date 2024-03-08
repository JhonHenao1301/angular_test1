import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '@services/users.service';
import { User } from '@models/user.model';
import { FollowUser } from '@models/followUser.model';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ 
    CommonModule, 
    ReactiveFormsModule, 
    RouterLinkWithHref,
    MatFormFieldModule,
    MatInputModule ],
  templateUrl: './home.component.html'
})

export class HomeComponent {
  users:User[] = []
  followers: FollowUser[] = []
  
  search: string = ''
  searchCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^((?!mariogiron).)*$'),
      Validators.minLength(4),
      Validators.maxLength(20)
    ] 
  })
  chart: Chart | undefined

  constructor(
    private userService: UsersService,
  ){}

  getErrorMessage() {
    if(this.searchCtrl.hasError('required')) {
      return 'You must enter a value'
    }
    else if (this.searchCtrl.hasError('pattern')) {
      return 'This username is not allow'
    }
    else if (this.searchCtrl.hasError('maxLength')) {
      return 'Number of characters maximin are 20'
    }
    return this.searchCtrl.hasError('minLength') 
    ? 'Minimum characters 4' : ''
  }

  searchUsers($event: any): void {
    $event.preventDefault()
    if (this.searchCtrl.valid) {
      this.search = this.searchCtrl.value
      this.userService.searchUsers(this.search)
      .subscribe({
        next: (data) => {
          const { items } = data
          this.users = items
          this.getFollowersData()
          this.searchCtrl.setValue('')
        },
        error: () => {}
      })
    }
  }

  getFollowersData() {
    this.users.map(user => {
      this.userService.searchOneUser(user.login)
      .subscribe({
        next: (data) => {
          this.followers.push({
            name: data.login,
            followers: data.followers
          });
          if (this.followers.length === this.users.length) {
            this.drawChart();
            this.followers = []
          }
        } 
      })
    });
  }
  
  drawChart() {
    const labels = this.followers.map(data => data.name);
    const data = this.followers.map(data => data.followers);

    if(this.chart) {
      this.chart.destroy()
    }

    this.chart = new Chart('followersChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Followers',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
