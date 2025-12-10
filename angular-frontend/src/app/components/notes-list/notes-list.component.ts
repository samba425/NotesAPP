import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotesService, Note } from '../../services/notes.service';
import { AuthService, User } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {
  notes: Note[] = [];
  loading = true;
  error = '';
  currentUser: User | null = null;
  backendType = environment.backendType;
  searchTerm = '';
  viewMode: 'grid' | 'list' = 'grid';
  isDarkMode = false;

  constructor(
    private notesService: NotesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadNotes();
    this.loadThemePreference();
  }

  loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');
    // Default to light theme if nothing is saved or if explicitly set to light
    if (!savedTheme || savedTheme === 'light') {
      this.isDarkMode = false;
      localStorage.setItem('theme', 'light'); // Ensure it's saved
    } else {
      this.isDarkMode = true;
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      console.log('🌙 Dark theme activated');
    } else {
      document.body.classList.remove('dark-theme');
      console.log('☀️ Light theme activated');
    }
  }

  loadNotes(): void {
    this.loading = true;
    this.error = '';
    
    this.notesService.getAllNotes().subscribe({
      next: (notes) => {
        this.notes = notes.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA; // Most recent first
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notes', error);
        this.error = 'Failed to load notes. Please try again.';
        this.loading = false;
      }
    });
  }

  get filteredNotes(): Note[] {
    if (!this.searchTerm) {
      return this.notes;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.notes.filter(note => 
      note.title.toLowerCase().includes(term) || 
      note.content.toLowerCase().includes(term)
    );
  }

  createNote(): void {
    this.router.navigate(['/notes/new']);
  }

  editNote(id: number): void {
    this.router.navigate(['/notes/edit', id]);
  }

  deleteNote(note: Note): void {
    if (!note.id) return;
    
    if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
      this.notesService.deleteNote(note.id).subscribe({
        next: () => {
          this.notes = this.notes.filter(n => n.id !== note.id);
        },
        error: (error) => {
          console.error('Error deleting note', error);
          alert('Failed to delete note. Please try again.');
        }
      });
    }
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  getTodayNotesCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.notes.filter(note => {
      const noteDate = new Date(note.createdAt || 0);
      noteDate.setHours(0, 0, 0, 0);
      return noteDate.getTime() === today.getTime();
    }).length;
  }

  getRecentActivityCount(): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return this.notes.filter(note => {
      const noteDate = new Date(note.createdAt || 0);
      return noteDate >= weekAgo;
    }).length;
  }

  getTruncatedContent(content: string, maxLength: number = 150): string {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }

  getTimeAgo(date: Date | string | undefined): string {
    if (!date) return 'Unknown';
    
    const now = new Date().getTime();
    const then = new Date(date).getTime();
    const diff = now - then;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }
}
