function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function createStar() {
  const star = document.createElement('div');
  star.className = 'star';

  const size = Math.random() * 3 + 1;
  const color = randomColor();

  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.left = `${Math.random() * 100}vw`;
  star.style.top = `${Math.random() * 100}vh`;
  star.style.backgroundColor = color;
  star.style.setProperty('--color', color);
  star.style.setProperty('--duration', `${Math.random() * 3 + 1}s`);
  star.style.setProperty('--delay', `${Math.random() * 2}s`);

  document.body.appendChild(star);
}

function createBigStar() {
  const star = document.createElement('div');
  star.className = 'star';

  const size = 10;
  const color = randomColor();

  star.style.width = `${size}px`;
  star.style.height = `${size}px`;
  star.style.left = `${Math.random() * 100}vw`;
  star.style.top = `${Math.random() * 100}vh`;
  star.style.backgroundColor = color;
  star.style.setProperty('--color', color);
  star.style.setProperty('--duration', `${Math.random() * 4 + 2}s`);
  star.style.setProperty('--delay', `${Math.random() * 3}s`);

  document.body.appendChild(star);
}

class Astronaut {
  constructor() {
    this.element = document.getElementById('astronaut');
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.rotation = 0;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.prevX = this.x;
    this.prevY = this.y;
    this.dragDistance = 0;
    this.dragThreshold = 10;
    
    this.setupEventListeners();
    this.updatePosition();
    this.animate();
  }

  setupEventListeners() {
    this.element.addEventListener('mousedown', (e) => this.startDrag(e));
    this.element.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.stopDrag());
    
    this.element.addEventListener('touchstart', (e) => this.startDrag(e));
    document.addEventListener('touchmove', (e) => this.drag(e));
    document.addEventListener('touchend', () => this.stopDrag());
  }

  handleClick(e) {
    if (this.dragDistance < this.dragThreshold) {
      const content = document.querySelector('.content');
      content.classList.toggle('active');
    }
  }

  startDrag(e) {
    this.isDragging = true;
    this.dragDistance = 0;
    const rect = this.element.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    this.dragOffsetX = clientX - rect.left;
    this.dragOffsetY = clientY - rect.top;
    
    this.prevX = this.x;
    this.prevY = this.y;
  }

  drag(e) {
    if (!this.isDragging) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - this.dragOffsetX;
    const newY = clientY - this.dragOffsetY;
    
    this.dragDistance += Math.hypot(newX - this.x, newY - this.y);
    
    this.prevX = this.x;
    this.prevY = this.y;
    
    this.x = newX;
    this.y = newY;
    
    this.updatePosition();
  }

  stopDrag() {
    if (this.isDragging) {
      if (this.dragDistance >= this.dragThreshold) {
        this.vx = (this.x - this.prevX) * 0.8;
        this.vy = (this.y - this.prevY) * 0.8;
      } else {
        this.vx = 0;
        this.vy = 0;
      }
    }
    this.isDragging = false;
  }

  applyPhysics() {
    if (this.isDragging) return;
    
    if (Math.random() < 0.02) {
      this.vx += (Math.random() - 0.5) * 0.5;
      this.vy += (Math.random() - 0.5) * 0.5;
    }
    
    this.vx *= 0.98;
    this.vy *= 0.98;
    
    this.x += this.vx;
    this.y += this.vy;
    
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;
    
    if (this.x < 0) {
      this.x = 0;
      this.vx *= -0.8;
    } else if (this.x + width > window.innerWidth) {
      this.x = window.innerWidth - width;
      this.vx *= -0.8;
    }
    
    if (this.y < 0) {
      this.y = 0;
      this.vy *= -0.8;
    } else if (this.y + height > window.innerHeight) {
      this.y = window.innerHeight - height;
      this.vy *= -0.8;
    }
    
    this.rotation += this.vx * 2;
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = `rotate(${this.rotation}deg)`;
  }

  animate() {
    this.applyPhysics();
    this.updatePosition();
    requestAnimationFrame(() => this.animate());
  }
}

let astronaut;

function initEmailJS() {
  emailjs.init('YOUR_PUBLIC_KEY');
  
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('from_name').value;
      const email = document.getElementById('from_email').value;
      const message = document.getElementById('message').value;
      const statusDiv = document.getElementById('form-status');
      
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_email: 'chrstphrdlmr1@gmail.com'
      };
      
      statusDiv.textContent = 'Sending...';
      statusDiv.style.color = '#7dd3fc';
      
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then((response) => {
          statusDiv.textContent = '✓ Message sent successfully!';
          statusDiv.style.color = '#4ade80';
          contactForm.reset();
          setTimeout(() => {
            statusDiv.textContent = '';
          }, 3000);
        })
        .catch((error) => {
          statusDiv.textContent = '✗ Failed to send. Try again.';
          statusDiv.style.color = '#ef4444';
          console.error('EmailJS error:', error);
        });
    });
  }
}

function initNavPopups() {
  const navLinks = document.querySelectorAll('.nav-link');
  let overlay = document.querySelector('.popup-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    document.body.appendChild(overlay);
  }
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const popupId = href.substring(1) + '-popup';
      const popup = document.getElementById(popupId);
      
      if (popup) {
        popup.classList.add('active');
        overlay.classList.add('active');
      }
    });
  });
  
  const popupCloseButtons = document.querySelectorAll('.popup-close');
  popupCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const popup = button.closest('.popup');
      popup.classList.remove('active');
      overlay.classList.remove('active');
    });
  });
  
  overlay.addEventListener('click', () => {
    const activePopup = document.querySelector('.popup.active');
    if (activePopup) {
      activePopup.classList.remove('active');
      overlay.classList.remove('active');
    }
  });
}

function initMenuToggle() {
  const toggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('#sidebar');
  const links = document.querySelectorAll('.nav-link');

  if (!toggle || !sidebar) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initMenuToggle();
  initNavPopups();
  
  for (let i = 0; i < 100; i++) {
    createStar();
  }
  
  for (let i = 0; i < 20; i++) {
    createBigStar();
  }
  
  astronaut = new Astronaut();
});
