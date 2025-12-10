import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotesService, Note } from '../../services/notes.service';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {
  noteForm!: FormGroup;
  loading = false;
  error = '';
  isEditMode = false;
  noteId?: number;

  constructor(
    private formBuilder: FormBuilder,
    private notesService: NotesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Create form
    this.noteForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Check if editing existing note
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.noteId = parseInt(id, 10);
      this.loadNote(this.noteId);
    }
  }

  get f() { return this.noteForm.controls; }

  loadNote(id: number): void {
    this.loading = true;
    this.notesService.getNote(id).subscribe({
      next: (note) => {
        this.noteForm.patchValue({
          title: note.title,
          content: note.content
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading note', error);
        this.error = 'Failed to load note. It may have been deleted.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.noteForm.invalid) {
      Object.keys(this.noteForm.controls).forEach(key => {
        this.noteForm.controls[key].markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';

    const noteData: Note = {
      title: this.noteForm.value.title,
      content: this.noteForm.value.content
    };

    const request = this.isEditMode && this.noteId
      ? this.notesService.updateNote(this.noteId, noteData)
      : this.notesService.createNote(noteData);

    request.subscribe({
      next: (note) => {
        console.log(`Note ${this.isEditMode ? 'updated' : 'created'}`, note);
        this.router.navigate(['/notes']);
      },
      error: (error) => {
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} note`, error);
        this.error = `Failed to ${this.isEditMode ? 'update' : 'create'} note. Please try again.`;
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/notes']);
  }

  getCharacterCount(field: string): number {
    return this.noteForm.get(field)?.value?.length || 0;
  }
}
