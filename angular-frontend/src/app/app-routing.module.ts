import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteFormComponent } from './components/note-form/note-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/notes', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'notes', 
    component: NotesListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'notes/new', 
    component: NoteFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'notes/edit/:id', 
    component: NoteFormComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/notes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
