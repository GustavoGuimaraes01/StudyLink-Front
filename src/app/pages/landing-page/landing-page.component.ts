import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements AfterViewInit {

  constructor(private router: Router) {}

  ngAfterViewInit() {
    const authToken = this.getCookie('auth-token');

    if (authToken) {
      this.router.navigate(['/home']); 
    } else {
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

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
}
