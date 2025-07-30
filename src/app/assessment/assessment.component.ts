import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


interface KanbanItem {
  id: number;
  title: string;
  stage: 'Idea' | 'Prototype' | 'Development' | 'Ship';
  createdAt: Date;
}

@Component({
  selector: 'app-assessment',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss'
})
export class AssessmentComponent {
newItemTitle: string = '';
  items: KanbanItem[] = [];
  private itemIdCounter: number = 1;

  readonly stages: Array<'Idea' | 'Prototype' | 'Development' | 'Ship'> = [
    'Idea', 'Prototype', 'Development', 'Ship'
  ];

  constructor() {
    // Initialize with some sample data
    this.addSampleData();
  }

  addItem(): void {
    if (this.newItemTitle.trim()) {
      const newItem: KanbanItem = {
        id: this.itemIdCounter++,
        title: this.newItemTitle.trim(),
        stage: 'Idea',
        createdAt: new Date()
      };
      
      this.items.push(newItem);
      this.newItemTitle = '';
    }
  }

  getItemsForStage(stage: 'Idea' | 'Prototype' | 'Development' | 'Ship'): KanbanItem[] {
    return this.items.filter(item => item.stage === stage);
  }

  moveToNextStage(item: KanbanItem): void {
    const currentIndex = this.stages.indexOf(item.stage);
    if (currentIndex < this.stages.length - 1) {
      item.stage = this.stages[currentIndex + 1];
    }
  }

  moveToPreviousStage(item: KanbanItem): void {
    const currentIndex = this.stages.indexOf(item.stage);
    if (currentIndex > 0) {
      item.stage = this.stages[currentIndex - 1];
    }
  }

  private clickTimeout: any = null;

  onItemClick(item: KanbanItem): void {
    // Clear any existing timeout to prevent single-click when double-clicking
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      return;
    }

    // Set a timeout to handle single-click after a delay
    this.clickTimeout = setTimeout(() => {
      this.moveToNextStage(item);
      this.clickTimeout = null;
    }, 250); // 250ms delay to detect double-click
  }

  onItemDoubleClick(item: KanbanItem): void {
    // Clear the single-click timeout to prevent it from executing
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    
    // Execute double-click action immediately
    this.moveToPreviousStage(item);
  }

  getStageColor(stage: string): string {
    const colors = {
      'Idea': '#e3f2fd',
      'Prototype': '#fff3e0',
      'Development': '#f3e5f5',
      'Ship': '#e8f5e8'
    };
    return colors[stage as keyof typeof colors] || '#f5f5f5';
  }

  getStageHeaderColor(stage: string): string {
    const colors = {
      'Idea': '#1976d2',
      'Prototype': '#f57c00',
      'Development': '#7b1fa2',
      'Ship': '#388e3c'
    };
    return colors[stage as keyof typeof colors] || '#666';
  }

  private addSampleData(): void {
    const sampleItems = [
      { title: 'Mobile App Redesign', stage: 'Idea' as const },
      { title: 'User Authentication System', stage: 'Prototype' as const },
      { title: 'Payment Integration', stage: 'Development' as const },
      { title: 'Dashboard Analytics', stage: 'Ship' as const }
    ];

    sampleItems.forEach(sample => {
      this.items.push({
        id: this.itemIdCounter++,
        title: sample.title,
        stage: sample.stage,
        createdAt: new Date()
      });
    });
  }


  trackByItemId(index: number, item: any): any {
  return item.id;
}
}
