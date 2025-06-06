// VarnikaKart Custom Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar is always open in super admin
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // Remove any collapsed state that might be set
    if (sidebar && sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
    }

    // Remove any expanded state from main content
    if (mainContent && mainContent.classList.contains('expanded')) {
        mainContent.classList.remove('expanded');
    }

    // Initialize Search Functionality
    initializeSearch();

    // Initialize Notifications
    initializeNotifications();

    // Initialize Dropdown Animations
    initializeDropdownAnimations();

    // Initialize Dark Mode
    initializeDarkMode();

    // Initialize Keyboard Shortcuts
    initializeKeyboardShortcuts();

    // Clear any stored sidebar state
    localStorage.removeItem('sidebarCollapsed');

    // Add subtle animation to nav links
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach((link, index) => {
        link.style.transitionDelay = `${0.05 * index}s`;

        // Add hover effect for icons
        const icon = link.querySelector('i');
        if (icon) {
            link.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2)';
            });

            link.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1)';
            });
        }
    });

    // Mobile Sidebar Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = sidebar.contains(event.target) || mobileToggle.contains(event.target);

            if (!isClickInside && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        });
    }

    // Tooltips
    const tooltips = document.querySelectorAll('[data-toggle="tooltip"]');
    tooltips.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });

    // Popovers
    const popovers = document.querySelectorAll('[data-toggle="popover"]');
    popovers.forEach(popover => {
        new bootstrap.Popover(popover);
    });

    // Dark Mode Toggle
    const darkModeToggle = document.querySelector('#darkModeToggle');
    const body = document.body;

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');

            // Save state to localStorage
            localStorage.setItem('darkMode', body.classList.contains('dark-mode'));

            // Update icon
            const icon = darkModeToggle.querySelector('i');
            if (body.classList.contains('dark-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });

        // Check localStorage for dark mode
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            body.classList.add('dark-mode');
            const icon = darkModeToggle.querySelector('i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // Dropdown Menus
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const dropdown = toggle.nextElementSibling;
            dropdown.classList.toggle('show');

            // Close other dropdowns
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    const otherDropdown = otherToggle.nextElementSibling;
                    if (otherDropdown && otherDropdown.classList.contains('show')) {
                        otherDropdown.classList.remove('show');
                    }
                }
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        dropdownToggles.forEach(toggle => {
            const dropdown = toggle.nextElementSibling;
            if (dropdown && dropdown.classList.contains('show') && !dropdown.contains(e.target) && !toggle.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    });

    // Initialize DataTables
    // This is now handled by datatable-utils.js
    // initDataTables();

    // Initialize Select2
    const select2Inputs = document.querySelectorAll('.select2');
    select2Inputs.forEach(select => {
        if ($.fn.select2) {
            $(select).select2({
                theme: 'bootstrap4',
                width: '100%'
            });
        }
    });

    // Initialize Flatpickr
    const dateInputs = document.querySelectorAll('.datepicker');
    dateInputs.forEach(input => {
        if (flatpickr) {
            flatpickr(input, {
                dateFormat: "Y-m-d",
                allowInput: true
            });
        }
    });

    // Initialize CKEditor
    const richTextEditors = document.querySelectorAll('.rich-text-editor');
    richTextEditors.forEach(editor => {
        if (CKEDITOR) {
            CKEDITOR.replace(editor.id, {
                toolbar: [
                    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
                    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
                    { name: 'links', items: [ 'Link', 'Unlink' ] },
                    { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar' ] },
                    { name: 'tools', items: [ 'Maximize' ] },
                    { name: 'document', items: [ 'Source' ] }
                ],
                height: 300
            });
        }
    });

    // File Input
    const fileInputs = document.querySelectorAll('.custom-file-input');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const fileName = this.files[0].name;
            const label = this.nextElementSibling;
            label.textContent = fileName;
        });
    });

    // Confirm Delete
    const deleteButtons = document.querySelectorAll('.delete-confirm');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                e.preventDefault();
            }
        });
    });

    // Bulk Actions
    const bulkActionForm = document.querySelector('#bulkActionForm');
    if (bulkActionForm) {
        const bulkActionSelect = bulkActionForm.querySelector('.bulk-action-select');
        const bulkActionSubmit = bulkActionForm.querySelector('.bulk-action-submit');

        bulkActionSubmit.addEventListener('click', function(e) {
            e.preventDefault();

            const selectedAction = bulkActionSelect.value;
            if (!selectedAction) {
                alert('Please select an action.');
                return;
            }

            const checkboxes = document.querySelectorAll('.bulk-select-checkbox:checked');
            if (checkboxes.length === 0) {
                alert('Please select at least one item.');
                return;
            }

            if (selectedAction === 'delete' && !confirm('Are you sure you want to delete the selected items? This action cannot be undone.')) {
                return;
            }

            bulkActionForm.submit();
        });
    }

    // Select All Checkboxes
    const selectAllCheckbox = document.querySelector('#selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.bulk-select-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });

        // Update select all checkbox when individual checkboxes change
        const checkboxes = document.querySelectorAll('.bulk-select-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const allChecked = Array.from(checkboxes).every(cb => cb.checked);
                const someChecked = Array.from(checkboxes).some(cb => cb.checked);

                selectAllCheckbox.checked = allChecked;
                selectAllCheckbox.indeterminate = someChecked && !allChecked;
            });
        });
    }

    // Order Status Change
    const orderStatusSelects = document.querySelectorAll('.order-status-select');
    orderStatusSelects.forEach(select => {
        select.addEventListener('change', function() {
            const orderId = this.dataset.orderId;
            const statusValue = this.value;
            const statusForm = document.querySelector(`#statusForm-${orderId}`);

            if (statusForm) {
                const statusInput = statusForm.querySelector('input[name="status"]');
                statusInput.value = statusValue;
                statusForm.submit();
            }
        });
    });

    // Image Preview
    const imageInputs = document.querySelectorAll('.image-input');
    imageInputs.forEach(input => {
        input.addEventListener('change', function() {
            const preview = document.querySelector(this.dataset.preview);
            if (preview) {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            }
        });
    });

    // Charts
    initCharts();

    // Notifications
    initNotifications();
});

// Initialize Charts
function initCharts() {
    // Sales Chart
    const salesChartCanvas = document.getElementById('salesChart');
    if (salesChartCanvas && typeof Chart !== 'undefined') {
        const salesChart = new Chart(salesChartCanvas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Sales',
                    data: typeof salesData !== 'undefined' ? salesData : [65, 59, 80, 81, 56, 55, 40, 60, 75, 85, 90, 100],
                    backgroundColor: 'rgba(78, 115, 223, 0.05)',
                    borderColor: 'rgba(78, 115, 223, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(78, 115, 223, 1)',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10,
                        right: 25,
                        top: 25,
                        bottom: 0
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            maxTicksLimit: 12
                        }
                    },
                    y: {
                        ticks: {
                            maxTicksLimit: 5,
                            padding: 10,
                            callback: function(value) {
                                return '$' + value;
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        bodyColor: '#858796',
                        titleColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                        callbacks: {
                            label: function(context) {
                                return 'Sales: $' + context.raw;
                            }
                        }
                    }
                }
            }
        });
    }

    // Revenue Sources Chart
    const revenueSourcesCanvas = document.getElementById('revenueSources');
    if (revenueSourcesCanvas && typeof Chart !== 'undefined') {
        const revenueSourcesChart = new Chart(revenueSourcesCanvas, {
            type: 'doughnut',
            data: {
                labels: typeof revenueSourcesData !== 'undefined' && revenueSourcesData.labels ? revenueSourcesData.labels : ['Direct', 'Social', 'Referral', 'Organic'],
                datasets: [{
                    data: typeof revenueSourcesData !== 'undefined' && revenueSourcesData.data ? revenueSourcesData.data : [55, 30, 15, 10],
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
                    hoverBorderColor: 'rgba(234, 236, 244, 1)',
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        bodyColor: '#858796',
                        titleColor: '#6e707e',
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + '%';
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Orders Status Chart
    const ordersStatusCanvas = document.getElementById('ordersStatus');
    if (ordersStatusCanvas && typeof Chart !== 'undefined') {
        const ordersStatusChart = new Chart(ordersStatusCanvas, {
            type: 'bar',
            data: {
                labels: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
                datasets: [{
                    label: 'Orders',
                    data: typeof ordersStatusData !== 'undefined' ? ordersStatusData : [25, 20, 30, 15, 10],
                    backgroundColor: [
                        'rgba(246, 194, 62, 0.8)',
                        'rgba(54, 185, 204, 0.8)',
                        'rgba(78, 115, 223, 0.8)',
                        'rgba(28, 200, 138, 0.8)',
                        'rgba(231, 74, 59, 0.8)'
                    ],
                    borderColor: [
                        'rgba(246, 194, 62, 1)',
                        'rgba(54, 185, 204, 1)',
                        'rgba(78, 115, 223, 1)',
                        'rgba(28, 200, 138, 1)',
                        'rgba(231, 74, 59, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            beginAtZero: true,
                            maxTicksLimit: 5,
                            padding: 10
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false,
                            borderDash: [2],
                            zeroLineBorderDash: [2]
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        bodyColor: '#858796',
                        titleColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10
                    }
                }
            }
        });
    }
}

// Initialize Search Functionality
function initializeSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchInput = document.querySelector('.search-input');
    const searchSubmit = document.querySelector('.search-submit');
    const searchInputContainer = document.querySelector('.search-input-container');

    if (searchToggle && searchInput) {
        // Focus input when search icon is clicked
        searchToggle.addEventListener('click', function() {
            searchInputContainer.style.opacity = '1';
            searchInputContainer.style.width = window.innerWidth < 576 ? '160px' : window.innerWidth < 768 ? '200px' : '250px';
            searchInput.focus();
        });

        // Handle search submission
        if (searchSubmit) {
            searchSubmit.addEventListener('click', function() {
                performSearch(searchInput.value);
            });
        }

        // Handle enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });

        // Hide search input when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchToggle.contains(e.target) &&
                !searchInputContainer.contains(e.target) &&
                searchInputContainer.style.opacity === '1') {
                searchInputContainer.style.opacity = '0';
                searchInputContainer.style.width = '40px';
            }
        });
    }
}

// Perform search
function performSearch(query) {
    if (query.trim() === '') return;

    // You can customize this to search in different areas
    // For now, we'll just redirect to the Django admin search
    window.location.href = '/admin/search/?q=' + encodeURIComponent(query);
}

// Initialize Dropdown Animations
function initializeDropdownAnimations() {
    // Add animation class to all dropdowns
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');

    if (dropdownMenus.length > 0) {
        dropdownMenus.forEach(menu => {
            menu.classList.add('animated--fade-in');
        });
    }

    // Add hover effect to dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    if (dropdownItems.length > 0) {
        dropdownItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(3px)';
                    icon.style.color = 'var(--primary-color)';
                }
            });

            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'translateX(0)';
                    icon.style.color = '';
                }
            });
        });
    }
}

// Initialize Notifications
function initNotifications() {
    // Update notification badge
    updateNotificationBadge();

    // Add click event to notification items
    const notificationItems = document.querySelectorAll('.notification-item');

    if (notificationItems.length > 0) {
        notificationItems.forEach(item => {
            item.addEventListener('click', function() {
                // Mark as read when clicked
                this.classList.remove('unread');

                // Update badge count
                updateNotificationBadge();
            });
        });
    }

    // Add click event to "Mark all as read" button
    const markAllReadBtn = document.querySelector('.mark-all-read');
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Mark all notifications as read
            const unreadNotifications = document.querySelectorAll('.notification-item.unread');
            unreadNotifications.forEach(notification => {
                notification.classList.remove('unread');
            });

            // Update badge count
            updateNotificationBadge();

            // Show success message
            if (typeof showNotification === 'function') {
                showNotification('All notifications marked as read', 'success');
            }
        });
    }

    // Show notification toast
    const showNotification = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        toast.innerHTML = `
            <div class="toast-header">
                <i class="fas fa-${type === 'info' ? 'info-circle' : type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'} me-2"></i>
                <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <small>Just now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        const toastContainer = document.querySelector('.toast-container');
        if (toastContainer) {
            toastContainer.appendChild(toast);

            const bsToast = new bootstrap.Toast(toast, {
                autohide: true,
                delay: 5000
            });
            bsToast.show();

            // Remove toast after it's hidden
            toast.addEventListener('hidden.bs.toast', function() {
                toast.remove();
            });
        }
    };

    // Show notifications from server
    const notifications = document.querySelectorAll('.notification-data');
    notifications.forEach(notification => {
        const message = notification.dataset.message;
        const type = notification.dataset.type || 'info';

        if (message) {
            showNotification(message, type);
        }

        // Remove the notification data element
        notification.remove();
    });

    // Expose showNotification function globally
    window.showNotification = showNotification;
}

// Initialize Dark Mode
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;

    if (darkModeToggle) {
        // Check if dark mode is enabled in localStorage
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

        // Set initial state
        if (isDarkMode) {
            htmlElement.classList.add('dark-mode');
            darkModeToggle.checked = true;

            // Update icon and text
            updateDarkModeUI(true);
        }

        // Add event listener for toggle
        darkModeToggle.addEventListener('change', function() {
            toggleDarkMode(this.checked);
        });
    }
}

// Toggle Dark Mode
function toggleDarkMode(enable) {
    const htmlElement = document.documentElement;

    if (enable) {
        // Enable Dark Mode
        htmlElement.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');

        // Update UI
        updateDarkModeUI(true);

        // Show notification
        if (typeof showNotification === 'function') {
            showNotification('Dark mode enabled', 'info');
        }
    } else {
        // Disable Dark Mode
        htmlElement.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');

        // Update UI
        updateDarkModeUI(false);

        // Show notification
        if (typeof showNotification === 'function') {
            showNotification('Light mode enabled', 'info');
        }
    }

    // Update toggle if it exists
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = enable;
    }
}

// Update Dark Mode UI
function updateDarkModeUI(isDarkMode) {
    // Update icon
    const darkModeIcon = document.querySelector('.theme-switcher i');
    if (darkModeIcon) {
        if (isDarkMode) {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
        } else {
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
        }
    }

    // Update text
    const darkModeText = document.querySelector('.theme-switcher span');
    if (darkModeText) {
        if (isDarkMode) {
            darkModeText.innerHTML = '<i class="fas fa-sun me-2"></i>Light Mode';
        } else {
            darkModeText.innerHTML = '<i class="fas fa-moon me-2"></i>Dark Mode';
        }
    }
}

// Initialize Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    // Show keyboard shortcuts modal when ? is pressed
    document.addEventListener('keydown', function(e) {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        // Show keyboard shortcuts modal
        if (e.key === '?') {
            e.preventDefault();
            const keyboardShortcutsModal = new bootstrap.Modal(document.getElementById('keyboardShortcutsModal'));
            keyboardShortcutsModal.show();
        }

        // Focus search when / is pressed
        if (e.key === '/') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                const searchInputContainer = document.querySelector('.search-input-container');
                if (searchInputContainer) {
                    searchInputContainer.style.opacity = '1';
                    searchInputContainer.style.width = window.innerWidth < 576 ? '160px' : window.innerWidth < 768 ? '200px' : '250px';
                }
                searchInput.focus();
            }
        }

        // Toggle dark mode when Shift+D is pressed
        if (e.key === 'D' && e.shiftKey) {
            e.preventDefault();
            const isDarkMode = document.documentElement.classList.contains('dark-mode');
            toggleDarkMode(!isDarkMode);
        }

        // Navigation shortcuts
        if (e.key === 'g' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
            // Start navigation sequence
            const navigationTimeout = setTimeout(() => {
                window.navigationKeyPressed = false;
            }, 1000);

            window.navigationKeyPressed = true;
            window.navigationTimeout = navigationTimeout;

            return;
        }

        // Handle second key in navigation sequence
        if (window.navigationKeyPressed) {
            clearTimeout(window.navigationTimeout);
            window.navigationKeyPressed = false;

            switch (e.key) {
                case 'h': // Go to Dashboard
                    window.location.href = '/admin/';
                    break;
                case 'p': // Go to Products
                    window.location.href = '/admin/products/product/';
                    break;
                case 'o': // Go to Orders
                    window.location.href = '/admin/orders/order/';
                    break;
                case 'u': // Go to Users
                    window.location.href = '/admin/auth/user/';
                    break;
                case 's': // Go to Settings
                    window.location.href = '/admin/site_settings/';
                    break;
            }
        }

        // Create new item with N
        if (e.key === 'n' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
            // Check if we're on a list page
            const addButton = document.querySelector('a.btn-primary[href*="add"]');
            if (addButton) {
                e.preventDefault();
                addButton.click();
            }
        }
    });
}

// Update notification badge
function updateNotificationBadge() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    const badge = document.querySelector('.notification-badge');

    if (badge) {
        if (unreadNotifications.length > 0) {
            badge.textContent = unreadNotifications.length;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}
