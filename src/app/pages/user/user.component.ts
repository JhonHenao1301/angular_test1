import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { UsersService } from '@services/users.service';
import { User } from '@models/user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [ CommonModule, RouterLinkActive ],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit{
  
  @Input() login?: string
  user: User = {
    id: 0,
    login: '',
    avatar_url: ''
  }

  constructor(
    private userService : UsersService
  ){}

  ngOnInit() {
    if(this.login) {
      this.userService.searchOneUser(this.login)
      .subscribe({
        next: (user) => {
          this.user = user
        },
        error: () => {
    
        }
      })
    }
  }
}
