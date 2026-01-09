// Global variables
let allProjects = [];
let displayedProjects = 0;
const projectsPerLoad = 9;

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
}));

// Smooth scrolling
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

// Skills animation
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
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
            if (entry.target.classList.contains('skills')) {
                animateSkills();
            }
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// GitHub API integration
async function fetchGitHubProjects() {
    const username = 'Prajwalpraju17';
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        const repos = await response.json();
        
        if (Array.isArray(repos)) {
            allProjects = repos.map(repo => ({
                name: repo.name,
                description: repo.description || 'No description available',
                language: repo.language || 'Unknown',
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                url: repo.html_url,
                topics: repo.topics || [],
                updated: new Date(repo.updated_at)
            }));
            
            displayProjects(allProjects.slice(0, projectsPerLoad));
            displayedProjects = projectsPerLoad;
        } else {
            showErrorMessage();
        }
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        showErrorMessage();
    }
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'HTML': '#e34c26',
        'CSS': '#1572B6',
        'TypeScript': '#2b7489',
        'C++': '#f34b7d',
        'C': '#555555',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Swift': '#ffac45',
        'Jupyter Notebook': '#DA5B0B'
    };
    return colors[language] || '#667eea';
}

function categorizeProject(project) {
    const name = project.name.toLowerCase();
    const description = project.description.toLowerCase();
    const topics = project.topics.join(' ').toLowerCase();
    const content = `${name} ${description} ${topics}`;
    
    const categories = [];
    
    if (content.includes('machine learning') || content.includes('ml') || content.includes('sklearn') || content.includes('classification') || content.includes('regression')) {
        categories.push('machine-learning');
    }
    
    if (content.includes('deep learning') || content.includes('neural') || content.includes('tensorflow') || content.includes('pytorch') || content.includes('keras')) {
        categories.push('deep-learning');
    }
    
    if (content.includes('gen ai') || content.includes('generative') || content.includes('gpt') || content.includes('llm') || content.includes('chatbot')) {
        categories.push('gen-ai');
    }
    
    if (project.language === 'Python' || content.includes('python')) {
        categories.push('python');
    }
    
    return categories.length > 0 ? categories : ['other'];
}

function displayProjects(projects) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    
    projects.forEach((project, index) => {
        const categories = categorizeProject(project);
        const projectCard = document.createElement('div');
        projectCard.className = `project-card ${categories.join(' ')}`;
        projectCard.style.animationDelay = `${index * 0.1}s`;
        
        projectCard.innerHTML = `
            <div class="project-header">
                <i class="fas fa-folder-open"></i>
                <h3>${project.name}</h3>
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-meta">
                <div class="project-language">
                    <div class="language-dot" style="background: ${getLanguageColor(project.language)}"></div>
                    <span>${project.language}</span>
                </div>
                <div class="project-stats">
                    <span><i class="fas fa-star"></i> ${project.stars}</span>
                    <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
                </div>
            </div>
            <a href="${project.url}" target="_blank" class="project-link">
                <i class="fab fa-github"></i> View Project
            </a>
        `;
        
        container.appendChild(projectCard);
    });
    
    // Update load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (displayedProjects >= allProjects.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
}

function showErrorMessage() {
    const container = document.getElementById('projects-container');
    container.innerHTML = `
        <div class="project-card" style="grid-column: 1 / -1; text-align: center;">
            <div class="project-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Unable to load projects</h3>
            </div>
            <p class="project-description">Please visit my GitHub profile directly to view all projects.</p>
            <a href="https://github.com/Prajwalpraju17" target="_blank" class="project-link">
                <i class="fab fa-github"></i> Visit GitHub Profile
            </a>
        </div>
    `;
}

// Project filtering
function setupProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    let filteredProjects = allProjects;
    
    if (filter !== 'all') {
        filteredProjects = allProjects.filter(project => {
            const categories = categorizeProject(project);
            return categories.includes(filter);
        });
    }
    
    displayProjects(filteredProjects.slice(0, projectsPerLoad));
    displayedProjects = Math.min(projectsPerLoad, filteredProjects.length);
    
    // Update load more button for filtered results
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (displayedProjects >= filteredProjects.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-flex';
    }
}

// Load more projects
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    loadMoreBtn?.addEventListener('click', () => {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        let projectsToShow = allProjects;
        
        if (activeFilter !== 'all') {
            projectsToShow = allProjects.filter(project => {
                const categories = categorizeProject(project);
                return categories.includes(activeFilter);
            });
        }
        
        const nextBatch = projectsToShow.slice(displayedProjects, displayedProjects + projectsPerLoad);
        const container = document.getElementById('projects-container');
        
        nextBatch.forEach((project, index) => {
            const categories = categorizeProject(project);
            const projectCard = document.createElement('div');
            projectCard.className = `project-card ${categories.join(' ')}`;
            projectCard.style.animationDelay = `${index * 0.1}s`;
            
            projectCard.innerHTML = `
                <div class="project-header">
                    <i class="fas fa-folder-open"></i>
                    <h3>${project.name}</h3>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <div class="project-language">
                        <div class="language-dot" style="background: ${getLanguageColor(project.language)}"></div>
                        <span>${project.language}</span>
                    </div>
                    <div class="project-stats">
                        <span><i class="fas fa-star"></i> ${project.stars}</span>
                        <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
                    </div>
                </div>
                <a href="${project.url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i> View Project
                </a>
            `;
            
            container.appendChild(projectCard);
        });
        
        displayedProjects += nextBatch.length;
        
        if (displayedProjects >= projectsToShow.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Observe sections for animations
    const sections = document.querySelectorAll('.skills, .projects, .contact');
    sections.forEach(section => observer.observe(section));
    
    // Setup project functionality
    setupProjectFilters();
    setupLoadMore();
    
    // Fetch and display projects
    fetchGitHubProjects();
});

// Add some loading animations
const style = document.createElement('style');
style.textContent = `
    .project-card {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);