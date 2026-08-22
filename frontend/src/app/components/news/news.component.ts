import { Component } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {

   trends: any[] = [];

  constructor(private backend1: BackendService) {}

  ngOnInit(): void {
    this.backend1.getNews().subscribe((data) => {
      this.trends = data;
    });
  }

}
