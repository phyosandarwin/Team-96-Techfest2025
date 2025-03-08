// DOM Elements
const imageUploadForm = document.getElementById('imageUploadForm');
const urlForm = document.getElementById('urlForm');
const imageUpload = document.getElementById('imageUpload');
const dropZone = document.getElementById('dropZone');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImage = document.getElementById('removeImage');
const verifyImageBtn = document.getElementById('verifyImageBtn');
const verifyUrlBtn = document.getElementById('verifyUrlBtn');
const urlInput = document.getElementById('urlInput');

// Results elements
const resultsLoading = document.getElementById('resultsLoading');
const resultsContent = document.getElementById('resultsContent');
const noResults = document.getElementById('noResults');
const authenticityBar = document.getElementById('authenticityBar');
const authenticityText = document.getElementById('authenticityText');
const extractedContent = document.getElementById('extractedContent');
const matchedSources = document.getElementById('matchedSources');
const factorsTable = document.getElementById('factorsTable');

// Navigation elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

// API endpoints
const API_BASE_URL = '/api';
const VERIFY_IMAGE_ENDPOINT = `${API_BASE_URL}/verify/image`;
const VERIFY_URL_ENDPOINT = `${API_BASE_URL}/verify/url`;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI
    setupDropZone();
    setupForms();
    setupNavigation();
    setupAnimations();
    setupShareButton(); // Setup share button
});

// Navbar scroll effect
function setupNavigation() {
    // Change navbar background on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Setup Intersection Observer for scroll animations
function setupAnimations() {
    const animatedElements = document.querySelectorAll('.slide-up, .fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}

// Drop Zone Setup
function setupDropZone() {
    // Ensure elements exist
    if (!dropZone || !imageUpload || !removeImage || !imagePreview || !previewImg) {
        console.error('Required DOM elements for dropzone not found');
        return;
    }

    // Make sure the file input accepts images from mobile
    imageUpload.setAttribute('accept', 'image/*');

    // Visual feedback when dragging file over drop zone
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('bg-light');
        dropZone.style.transform = 'scale(1.03)';
        dropZone.style.borderColor = 'var(--harvard-crimson)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('bg-light');
        dropZone.style.transform = 'scale(1)';
        dropZone.style.borderColor = '';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('bg-light');
        dropZone.style.transform = 'scale(1)';
        dropZone.style.borderColor = '';
        
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            // Only validate file type
            if (file.type.match('image.*')) {
                imageUpload.files = e.dataTransfer.files;
                updateImagePreview(file);
            } else {
                showNotification('Please select an image file (JPEG, PNG, etc.)', 'danger');
            }
        }
    });

    // Enhanced file selection handler
    imageUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Only validate file type
            if (file.type.match('image.*')) {
                updateImagePreview(file);
            } else {
                showNotification('Please select an image file (JPEG, PNG, etc.)', 'danger');
                imageUpload.value = ''; // Clear the input
            }
        }
    });

    // Remove image button
    removeImage.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Add fade-out animation to preview
        imagePreview.style.opacity = '0';
        imagePreview.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            imageUpload.value = '';
            imagePreview.classList.add('d-none');
            
            // Add fade-in animation to dropzone
            dropZone.style.opacity = '0';
            dropZone.style.transform = 'scale(0.95)';
            dropZone.classList.remove('d-none');
            
            setTimeout(() => {
                dropZone.style.opacity = '1';
                dropZone.style.transform = 'scale(1)';
            }, 50);
            
            verifyImageBtn.disabled = true;
        }, 300);
    });

    // THIS IS THE KEY FIX: Direct, simple click handler for drop zone
    dropZone.addEventListener('click', function() {
        imageUpload.click();
    });
}

// Image preview function
function updateImagePreview(file) {
    if (!file) return;
    
    // No need to validate file type here as it's already validated in the event handlers
    
    // Show preview with animation
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImg.src = e.target.result;
        
        // Fade out drop zone
        dropZone.style.opacity = '0';
        dropZone.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            dropZone.classList.add('d-none');
            
            // Fade in image preview
            imagePreview.classList.remove('d-none');
            imagePreview.style.opacity = '0';
            imagePreview.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                imagePreview.style.opacity = '1';
                imagePreview.style.transform = 'scale(1)';
                verifyImageBtn.disabled = false;
            }, 50);
        }, 300);
    };
    reader.readAsDataURL(file);
}

// Setup form submissions with improved feedback
function setupForms() {
    // Ensure elements exist
    if (!imageUploadForm || !urlForm) {
        console.error('Form elements not found');
        return;
    }

    // Simplified image form submission
    imageUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Minimal validation, just check if a file exists
        if (!imageUpload.files || !imageUpload.files[0]) {
            showNotification('Please select an image to upload', 'warning');
            return;
        }
        
        // Show loading state with animation
        showLoading();
        
        // Add button loading state
        verifyImageBtn.disabled = true;
        verifyImageBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Verifying...';
        
        // Create form data with image
        const formData = new FormData();
        formData.append('image', imageUpload.files[0]);
        
        try {
            // Simulate network latency for demo purposes
            setTimeout(async () => {
                const result = await mockApiResponse();
                displayResults(result);
                
                // Reset button state
                verifyImageBtn.disabled = false;
                verifyImageBtn.innerHTML = '<i class="bi bi-shield-check me-1"></i> Verify Image';
                
                // Show success notification
                showNotification('Image successfully verified!', 'success');
            }, 1500);
            
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error verifying image: ' + error.message, 'danger');
            hideLoading();
            
            // Reset button state
            verifyImageBtn.disabled = false;
            verifyImageBtn.innerHTML = '<i class="bi bi-shield-check me-1"></i> Verify Image';
        }
    });
    
    // URL form submission with improved validation
    urlForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        if (!url) {
            showNotification('Please enter a URL', 'warning');
            urlInput.focus();
            return;
        }
        
        // Basic URL validation
        if (!isValidUrl(url)) {
            showNotification('Please enter a valid URL', 'warning');
            urlInput.focus();
            return;
        }
        
        // Show loading state
        showLoading();
        
        // Add button loading state
        verifyUrlBtn.disabled = true;
        verifyUrlBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Verifying...';
        
        try {
            // For demo/development, use the mock response instead of actual API call
            // const response = await fetch(VERIFY_URL_ENDPOINT, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ url })
            // });
            
            // if (!response.ok) {
            //     throw new Error('Failed to verify URL');
            // }
            
            // const result = await response.json();
            
            // Simulate network latency for demo purposes
            setTimeout(async () => {
                const result = await mockApiResponse();
                displayResults(result);
                
                // Reset button state
                verifyUrlBtn.disabled = false;
                verifyUrlBtn.innerHTML = '<i class="bi bi-shield-check me-1"></i> Verify URL';
                
                // Show success notification
                showNotification('URL successfully verified!', 'success');
            }, 1500);
            
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error verifying URL: ' + error.message, 'danger');
            hideLoading();
            
            // Reset button state
            verifyUrlBtn.disabled = false;
            verifyUrlBtn.innerHTML = '<i class="bi bi-shield-check me-1"></i> Verify URL';
        }
    });
}

// Display verification results with animations
function displayResults(result) {
    hideLoading();
    
    // Show results container with fade-in
    resultsContent.classList.remove('d-none');
    resultsContent.style.opacity = '0';
    
    // Hide no results message
    noResults.classList.add('d-none');
    
    setTimeout(() => {
        resultsContent.style.opacity = '1';
        
        // Animate authenticity score bar
        setTimeout(() => {
            // Set authenticity score with animation
            const score = result.authenticity_score;
            authenticityBar.style.width = `${score}%`;
            authenticityBar.textContent = `${score}%`;
            
            // Set appropriate color class based on score
            authenticityBar.className = 'progress-bar';
            if (score < 40) {
                authenticityBar.classList.add('low');
                authenticityText.innerHTML = '<strong>Low Authenticity:</strong> This content appears to be misleading or false.';
            } else if (score < 70) {
                authenticityBar.classList.add('medium');
                authenticityText.innerHTML = '<strong>Moderate Authenticity:</strong> This content contains some accurate information but may be misleading.';
            } else {
                authenticityBar.classList.add('high');
                authenticityText.innerHTML = '<strong>High Authenticity:</strong> This content appears to be authentic and from reliable sources.';
            }
            
            // Show extracted content with animation
            extractedContent.textContent = result.extracted_text || 'No text could be extracted';
            
            // Display matched sources with staggered animation
            if (result.matched_sources && result.matched_sources.length > 0) {
                let sourcesHtml = '';
                result.matched_sources.forEach((source, index) => {
                    const reliabilityClass = getReliabilityClass(source.reliability);
                    sourcesHtml += `
                        <div class="matched-source" style="opacity: 0; transform: translateY(10px); transition: all 0.3s ease; transition-delay: ${0.1 * index}s;">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">${source.title}</h6>
                                <span class="source-reliability ${reliabilityClass}">
                                    ${capitalizeFirstLetter(source.reliability)} Reliability
                                </span>
                            </div>
                            <p class="small text-muted mb-2">${source.source_name} - ${formatDate(source.published_date)}</p>
                            <p class="mb-2">${source.snippet}</p>
                            <a href="${source.url}" target="_blank" class="btn btn-sm btn-outline-primary">View Source</a>
                        </div>
                    `;
                });
                matchedSources.innerHTML = sourcesHtml;
                
                // Trigger animations for sources
                setTimeout(() => {
                    const sourceElements = document.querySelectorAll('.matched-source');
                    sourceElements.forEach(element => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    });
                }, 100);
            } else {
                matchedSources.innerHTML = '<p class="text-muted fst-italic">No matching sources found.</p>';
            }
            
            // Display verification factors with staggered animation
            if (result.factors && result.factors.length > 0) {
                let factorsHtml = '';
                result.factors.forEach((factor, index) => {
                    const scoreClass = getScoreClass(factor.score);
                    factorsHtml += `
                        <tr style="opacity: 0; transform: translateY(10px); transition: all 0.3s ease; transition-delay: ${0.1 * index}s;">
                            <td>${factor.name}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="score-badge ${scoreClass} me-2">${factor.score}%</div>
                                    <div>${factor.description}</div>
                                </div>
                            </td>
                            <td>${factor.weight}%</td>
                        </tr>
                    `;
                });
                factorsTable.innerHTML = factorsHtml;
                
                // Trigger animations for factors
                setTimeout(() => {
                    const factorRows = factorsTable.querySelectorAll('tr');
                    factorRows.forEach(row => {
                        row.style.opacity = '1';
                        row.style.transform = 'translateY(0)';
                    });
                }, 100);
            } else {
                factorsTable.innerHTML = '<tr><td colspan="3" class="text-center">No verification factors available.</td></tr>';
            }
            
            // Show results
            resultsContent.classList.remove('d-none');
            noResults.classList.add('d-none');
            
            // Update share button to visible and enable it
            const shareResultsBtn = document.getElementById('shareResultsBtn');
            if (shareResultsBtn) {
                shareResultsBtn.style.display = 'flex';
                setupShareButton(); // Ensure share button functionality is set up
            }
        }, 100);
    }, 100);
}

// Function to handle sharing functionality
function setupShareButton() {
    const shareResultsBtn = document.getElementById('shareResultsBtn');
    if (!shareResultsBtn) return;
    
    // Check if modal exists, create it if not
    let shareModal = document.getElementById('shareModal');
    if (!shareModal) {
        // Create modal element if it doesn't exist yet
        const modalHTML = `
        <div class="modal fade" id="shareModal" tabindex="-1" aria-labelledby="shareModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="shareModalLabel">Share Verification Results</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h6 class="mb-3">Share via</h6>
                        <div class="d-flex flex-wrap justify-content-center gap-3 mb-4">
                            <a href="#" class="btn btn-outline-primary share-btn" data-platform="facebook">
                                <i class="bi bi-facebook me-2"></i>Facebook
                            </a>
                            <a href="#" class="btn btn-outline-info share-btn" data-platform="twitter">
                                <i class="bi bi-twitter-x me-2"></i>Twitter
                            </a>
                            <a href="#" class="btn btn-outline-success share-btn" data-platform="whatsapp">
                                <i class="bi bi-whatsapp me-2"></i>WhatsApp
                            </a>
                            <a href="#" class="btn btn-outline-danger share-btn" data-platform="gmail">
                                <i class="bi bi-envelope-fill me-2"></i>Email
                            </a>
                            <a href="#" class="btn btn-outline-info share-btn" data-platform="telegram">
                                <i class="bi bi-telegram me-2"></i>Telegram
                            </a>
                        </div>
                        <div class="mb-3">
                            <label for="shareUrl" class="form-label">Or copy this link</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="shareUrl" readonly>
                                <button class="btn btn-outline-secondary" type="button" id="copyShareUrl">
                                    <i class="bi bi-clipboard"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        // Append modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstChild);
        
        // Get the modal element
        shareModal = document.getElementById('shareModal');
    }
    
    // Initialize Bootstrap modal
    const modal = new bootstrap.Modal(shareModal);
    const shareUrl = document.getElementById('shareUrl');
    const copyShareUrl = document.getElementById('copyShareUrl');
    const shareButtons = document.querySelectorAll('.share-btn');
    
    // Create a unique share URL with result info
    function generateShareUrl() {
        // Create a URL with verification data encoded as parameters
        const score = document.getElementById('authenticityBar').textContent;
        const textContent = document.getElementById('extractedContent').textContent;
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        
        params.append('score', score);
        params.append('text', textContent.substring(0, 100) + '...');
        
        return `${baseUrl}?${params.toString()}`;
    }
    
    // Handle the share button click
    shareResultsBtn.addEventListener('click', function() {
        const url = generateShareUrl();
        shareUrl.value = url;
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: 'Verification Results from SG News Verifier',
                text: `Authenticity Score: ${document.getElementById('authenticityBar').textContent}`,
                url: url
            })
            .then(() => console.log('Shared successfully'))
            .catch((error) => {
                console.log('Error sharing:', error);
                // Fallback to modal if sharing fails
                modal.show();
            });
        } else {
            // Fallback for browsers without Web Share API
            modal.show();
        }
    });
    
    // Copy URL to clipboard
    if (copyShareUrl) {
        copyShareUrl.addEventListener('click', function() {
            shareUrl.select();
            document.execCommand('copy');
            
            // Show feedback
            const originalHTML = copyShareUrl.innerHTML;
            copyShareUrl.innerHTML = '<i class="bi bi-check"></i>';
            
            setTimeout(() => {
                copyShareUrl.innerHTML = originalHTML;
            }, 2000);
        });
    }
    
    // Handle share button clicks
    if (shareButtons) {
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const platform = this.getAttribute('data-platform');
                const url = encodeURIComponent(shareUrl.value);
                const text = encodeURIComponent(`Verification Results from SG News Verifier: Authenticity Score: ${document.getElementById('authenticityBar').textContent}`);
                
                let shareUrl;
                
                switch(platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${text}%20${url}`;
                        break;
                    case 'gmail':
                        shareUrl = `mailto:?subject=Verification%20Results&body=${text}%20${url}`;
                        break;
                    case 'telegram':
                        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank');
                }
            });
        });
    }
}

// Helper Functions
function showLoading() {
    if (!resultsLoading || !resultsContent || !noResults) {
        console.error('Loading elements not found');
        return;
    }

    resultsLoading.classList.remove('d-none');
    resultsContent.classList.add('d-none');
    noResults.classList.add('d-none');
    
    // Add loading animation
    resultsLoading.style.opacity = '0';
    setTimeout(() => {
        resultsLoading.style.opacity = '1';
    }, 50);
}

function hideLoading() {
    if (!resultsLoading) {
        return;
    }

    resultsLoading.style.opacity = '0';
    setTimeout(() => {
        resultsLoading.classList.add('d-none');
    }, 300);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function getReliabilityClass(reliability) {
    switch (reliability.toLowerCase()) {
        case 'high':
            return 'reliability-high';
        case 'medium':
            return 'reliability-medium';
        case 'low':
            return 'reliability-low';
        default:
            return '';
    }
}

function getScoreClass(score) {
    if (score >= 70) {
        return 'score-high';
    } else if (score >= 40) {
        return 'score-medium';
    } else {
        return 'score-low';
    }
}

function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Return original string if there's an error
    }
}

// Create and show notification toast
function showNotification(message, type = 'info') {
    try {
        // First, check if toast container exists, if not create it
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast show align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.setAttribute('id', toastId);
        
        // Create toast content
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        // Add toast to container
        toastContainer.appendChild(toast);
        
        // Initialize Bootstrap toast if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            const bootstrapToast = new bootstrap.Toast(toast, {
                autohide: true,
                delay: 5000
            });
            
            // Show toast
            bootstrapToast.show();
        }
        
        // Fallback for showing/hiding if Bootstrap JS is not available
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        // Add click handler for close button
        const closeBtn = toast.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                toast.remove();
            });
        }
    } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to alert for critical messages
        if (type === 'danger') {
            alert(message);
        }
    }
}

// For development/testing - mock API response
// This can be removed once the actual backend is implemented
async function mockApiResponse() {
    return {
        authenticity_score: 85,
        extracted_text: "Singapore Prime Minister announces new healthcare policies aimed at supporting elderly care. The Ministry of Health will be increasing subsidies for long-term care services starting next month.",
        matched_sources: [
            {
                title: "PM announces enhanced healthcare subsidies for elderly",
                source_name: "The Straits Times",
                reliability: "high",
                published_date: "2025-03-05T08:30:00Z",
                url: "https://www.straitstimes.com/singapore/health/pm-announces-healthcare-subsidies",
                snippet: "Prime Minister announced today an increase in healthcare subsidies aimed at supporting the elderly population. The new policy will take effect from April 1."
            },
            {
                title: "Government boosts elderly care support with new subsidies",
                source_name: "Channel News Asia",
                reliability: "high",
                published_date: "2025-03-05T09:15:00Z",
                url: "https://www.channelnewsasia.com/singapore/elderly-care-subsidies-increase",
                snippet: "The Ministry of Health will be increasing subsidies for long-term care services, with additional support for lower-income families."
            }
        ],
        factors: [
            {
                name: "Source Credibility",
                score: 90,
                weight: 30,
                description: "Content matches highly credible sources"
            },
            {
                name: "Content Consistency",
                score: 85,
                weight: 25,
                description: "Information consistent across multiple sources"
            },
            {
                name: "Image Manipulation",
                score: 95,
                weight: 20,
                description: "No signs of image manipulation detected"
            },
            {
                name: "Context Accuracy",
                score: 75,
                weight: 15,
                description: "Context generally accurate with minor discrepancies"
            },
            {
                name: "Publication Recency",
                score: 80,
                weight: 10,
                description: "Content is recent and up-to-date"
            }
        ]
    };
}