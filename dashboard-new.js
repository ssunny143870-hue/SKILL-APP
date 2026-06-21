// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  body.classList.add('dark-mode');
  darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Animated Counters
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      
      // Trigger counter animation when statistics section is visible
      if (entry.target.querySelector('.stat-number')) {
        animateCounters();
      }
      
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections for animations
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Progress bar animations
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  
  progressBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0%';
    
    setTimeout(() => {
      bar.style.width = width;
    }, 500);
  });
}

// Trigger progress bar animations on page load
window.addEventListener('load', () => {
  setTimeout(animateProgressBars, 1000);
});

// Card hover effects with tilt
document.querySelectorAll('.feature-card, .category-card, .course-card, .badge-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// CTA Button click handler
document.querySelector('.cta-button')?.addEventListener('click', () => {
  const featureCards = document.querySelector('.feature-cards');
  if (featureCards) {
    featureCards.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

// Feature card buttons
document.querySelectorAll('.card-button').forEach(button => {
  button.addEventListener('click', (e) => {
    const card = e.target.closest('.feature-card');
    const cardTitle = card.querySelector('h3').textContent;
    
    // Add ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 1000);
    
    // Navigate to appropriate section (placeholder)
    console.log(`Navigating to ${cardTitle}`);
  });
});

// Course enrollment buttons
document.querySelectorAll('.course-button').forEach(button => {
  button.addEventListener('click', (e) => {
    const courseCard = e.target.closest('.course-card');
    const courseTitle = courseCard.querySelector('h3').textContent;
    
    // Add loading state
    button.textContent = 'Enrolling...';
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = 'Enrolled!';
      button.style.background = 'linear-gradient(135deg, #22C55E, #16A34A)';
      
      setTimeout(() => {
        button.textContent = 'Enroll Now';
        button.style.background = '';
        button.disabled = false;
      }, 2000);
    }, 1500);
  });
});

// Streak calendar interaction
document.querySelectorAll('.streak-day').forEach(day => {
  day.addEventListener('click', () => {
    if (!day.classList.contains('active') && !day.classList.contains('today')) {
      day.classList.add('active');
      day.innerHTML = '<i class="fas fa-check"></i>';
    }
  });
});

// Activity item click handlers
document.querySelectorAll('.activity-item').forEach(item => {
  item.addEventListener('click', () => {
    item.style.transform = 'scale(1.02)';
    setTimeout(() => {
      item.style.transform = 'scale(1)';
    }, 200);
  });
});

// Badge card hover effects
document.querySelectorAll('.badge-card').forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    if (badge.classList.contains('locked')) {
      badge.style.opacity = '0.8';
    }
  });
  
  badge.addEventListener('mouseleave', () => {
    if (badge.classList.contains('locked')) {
      badge.style.opacity = '0.6';
    }
  });
});

// Profile icon click handler
document.querySelector('.profile-icon')?.addEventListener('click', () => {
  // Toggle profile dropdown (placeholder)
  console.log('Profile clicked');
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Add scroll-based header shadow
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
  } else {
    header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  }
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
  // Press 'D' to toggle dark mode
  if (e.key === 'd' || e.key === 'D') {
    if (!e.target.matches('input, textarea')) {
      darkModeToggle.click();
    }
  }
});

// Lazy load images (if any)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img.lazy').forEach(img => {
    imageObserver.observe(img);
  });
}

// Add toast notification function
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Add ripple effect CSS dynamically
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    color: white;
    font-weight: 600;
    z-index: 10000;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .toast.show {
    transform: translateY(0);
    opacity: 1;
  }
  
  .toast-success {
    background: linear-gradient(135deg, #22C55E, #16A34A);
  }
  
  .toast-error {
    background: linear-gradient(135deg, #EF4444, #DC2626);
  }
  
  .toast-info {
    background: linear-gradient(135deg, #3B82F6, #1D4ED8);
  }
  
  body.loaded {
    opacity: 1;
  }
  
  body {
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  
  section.animate {
    animation: fadeInUp 0.6s ease forwards;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  console.log('SUN SKILLS Dashboard loaded successfully');
  
  // Show welcome toast after 2 seconds
  setTimeout(() => {
    showToast('Welcome back to SUN SKILLS!', 'info');
  }, 2000);
});

// Export functions for potential use in other scripts
window.SUNSkillsDashboard = {
  showToast,
  animateCounters,
  animateProgressBars
};
