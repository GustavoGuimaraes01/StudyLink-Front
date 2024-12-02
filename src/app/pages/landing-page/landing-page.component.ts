import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements AfterViewInit {
  ngAfterViewInit() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.fade-in');
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      const callback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            observer.unobserve(entry.target); 
          }
        });
      };

      const observer = new IntersectionObserver(callback, options);
      elements.forEach(element => {
        observer.observe(element);
      });
    }, 100); 
  }
}