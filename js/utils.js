/**
 * Utility functions for Shopping Management App v2.0
 * Contains formatting, calculation, and helper functions
 */

// Currency formatting
const Utils = {
    /**
     * Format number as Vietnamese currency
     * @param {number} amount - Amount to format
     * @returns {string} Formatted currency string
     */
    formatCurrency(amount) {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return '0₫';
        }
        
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Format date as Vietnamese format
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        if (!date) return '';
        
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return '';
        
        return dateObj.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    /**
     * Format date for input fields (YYYY-MM-DD)
     * @param {string|Date} date - Date to format
     * @returns {string} ISO date string
     */
    formatDateForInput(date) {
        if (!date) return '';
        
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return '';
        
        return dateObj.toISOString().split('T')[0];
    },

    /**
     * Get current date in YYYY-MM-DD format
     * @returns {string} Today's date
     */
    getTodayString() {
        return new Date().toISOString().split('T')[0];
    },

    /**
     * Parse number from input, handling empty strings
     * @param {string|number} value - Value to parse
     * @returns {number} Parsed number or 0
     */
    parseNumber(value) {
        if (value === '' || value === null || value === undefined) {
            return 0;
        }
        
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    },

    /**
     * Calculate total amount (quantity × price)
     * @param {number} quantity - Quantity
     * @param {number} price - Unit price
     * @returns {number} Total amount
     */
    calculateTotal(quantity, price) {
        const qty = this.parseNumber(quantity);
        const prc = this.parseNumber(price);
        return qty * prc;
    },

    /**
     * Generate unique ID for items
     * @returns {string} Unique ID
     */
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Debounce function for search and input handlers
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Sanitize HTML content to prevent XSS
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    sanitizeHtml(str) {
        if (!str) return '';
        
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Show toast notification
     * @param {string} message - Message to show
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in milliseconds (default: 3000)
     */
    showToast(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        container.appendChild(toast);

        // Trigger show animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    },

    /**
     * Show confirmation modal
     * @param {string} title - Modal title
     * @param {string} message - Modal message
     * @returns {Promise<boolean>} Promise that resolves to true/false
     */
    showConfirm(title, message) {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirmModal');
            const titleEl = document.getElementById('confirmTitle');
            const messageEl = document.getElementById('confirmMessage');
            const yesBtn = document.getElementById('confirmYes');
            const noBtn = document.getElementById('confirmNo');

            if (!modal) {
                resolve(false);
                return;
            }

            titleEl.textContent = title;
            messageEl.textContent = message;

            modal.classList.add('active');

            const handleResponse = (result) => {
                modal.classList.remove('active');
                yesBtn.removeEventListener('click', handleYes);
                noBtn.removeEventListener('click', handleNo);
                modal.removeEventListener('click', handleOutside);
                resolve(result);
            };

            const handleYes = () => handleResponse(true);
            const handleNo = () => handleResponse(false);
            const handleOutside = (e) => {
                if (e.target === modal) handleResponse(false);
            };

            yesBtn.addEventListener('click', handleYes);
            noBtn.addEventListener('click', handleNo);
            modal.addEventListener('click', handleOutside);
        });
    },

    /**
     * Get hotel display name with icon
     * @param {string} hotelCode - Hotel code (36LS, 16TX, etc.)
     * @returns {object} Object with icon and name
     */
    getHotelInfo(hotelCode) {
        const hotelMap = {
            '36LS': { icon: '🏨', name: '36LS' },
            '16TX': { icon: '🏩', name: '16TX' },
            '55HT': { icon: '🏪', name: '55HT' },
            '49HG': { icon: '🏬', name: '49HG' }
        };

        return hotelMap[hotelCode] || { icon: '🏨', name: hotelCode };
    },

    /**
     * Get section display name with icon
     * @param {string} sectionCode - Section code (thit, rau, dokho)
     * @returns {object} Object with icon and name
     */
    getSectionInfo(sectionCode) {
        const sectionMap = {
            'thit': { icon: '🥩', name: 'Thịt' },
            'rau': { icon: '🥬', name: 'Rau' },
            'dokho': { icon: '🌾', name: 'Đồ khô' }
        };

        return sectionMap[sectionCode] || { icon: '📦', name: sectionCode };
    },

    /**
     * Validate required form fields
     * @param {Object} data - Form data object
     * @param {Array} requiredFields - Array of required field names
     * @returns {Object} Validation result with isValid and errors
     */
    validateForm(data, requiredFields) {
        const errors = [];
        
        requiredFields.forEach(field => {
            if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
                errors.push(`Vui lòng nhập ${this.getFieldDisplayName(field)}`);
            }
        });

        // Additional validations
        if (data.quantity !== undefined && this.parseNumber(data.quantity) <= 0) {
            errors.push('Số lượng phải lớn hơn 0');
        }

        if (data.buyPrice !== undefined && this.parseNumber(data.buyPrice) < 0) {
            errors.push('Giá mua không thể âm');
        }

        if (data.sellPrice !== undefined && this.parseNumber(data.sellPrice) < 0) {
            errors.push('Giá bán không thể âm');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Get display name for form fields
     * @param {string} fieldName - Field name
     * @returns {string} Display name
     */
    getFieldDisplayName(fieldName) {
        const fieldMap = {
            'name': 'tên sản phẩm',
            'itemName': 'tên sản phẩm',
            'quantity': 'số lượng',
            'unit': 'đơn vị',
            'buyPrice': 'giá mua',
            'sellPrice': 'giá bán'
        };

        return fieldMap[fieldName] || fieldName;
    },

    /**
     * Filter items based on search term and status
     * @param {Array} items - Array of items to filter
     * @param {string} searchTerm - Search term
     * @param {string} status - Status filter ('all', 'pending', 'done')
     * @returns {Array} Filtered items
     */
    filterItems(items, searchTerm = '', status = 'all') {
        if (!Array.isArray(items)) return [];

        return items.filter(item => {
            // Search filter
            const matchesSearch = !searchTerm || 
                item.name.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            let matchesStatus = true;
            if (status === 'pending') {
                matchesStatus = !item.isDone;
            } else if (status === 'done') {
                matchesStatus = item.isDone;
            }

            return matchesSearch && matchesStatus;
        });
    },

    /**
     * Sort items by various criteria
     * @param {Array} items - Items to sort
     * @param {string} sortBy - Sort criteria ('name', 'total', 'date', 'status')
     * @param {string} order - Sort order ('asc', 'desc')
     * @returns {Array} Sorted items
     */
    sortItems(items, sortBy = 'name', order = 'asc') {
        if (!Array.isArray(items)) return [];

        const sorted = [...items].sort((a, b) => {
            let aVal, bVal;

            switch (sortBy) {
                case 'name':
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                    break;
                case 'buyTotal':
                    aVal = this.calculateTotal(a.quantity, a.buyPrice);
                    bVal = this.calculateTotal(b.quantity, b.buyPrice);
                    break;
                case 'sellTotal':
                    aVal = this.calculateTotal(a.quantity, a.sellPrice);
                    bVal = this.calculateTotal(b.quantity, b.sellPrice);
                    break;
                case 'date':
                    aVal = new Date(a.createdAt || 0);
                    bVal = new Date(b.createdAt || 0);
                    break;
                case 'status':
                    aVal = a.isDone ? 1 : 0;
                    bVal = b.isDone ? 1 : 0;
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return order === 'asc' ? -1 : 1;
            if (aVal > bVal) return order === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    },

    /**
     * Calculate statistics for items
     * @param {Array} items - Items to analyze
     * @returns {Object} Statistics object
     */
    calculateStats(items) {
        if (!Array.isArray(items) || items.length === 0) {
            return {
                totalItems: 0,
                completedItems: 0,
                pendingItems: 0,
                totalBuyAmount: 0,
                totalSellAmount: 0,
                profit: 0,
                completionRate: 0
            };
        }

        const stats = items.reduce((acc, item) => {
            const buyTotal = this.calculateTotal(item.quantity, item.buyPrice);
            const sellTotal = this.calculateTotal(item.quantity, item.sellPrice);

            acc.totalItems++;
            acc.totalBuyAmount += buyTotal;
            acc.totalSellAmount += sellTotal;

            if (item.isDone) {
                acc.completedItems++;
            } else {
                acc.pendingItems++;
            }

            return acc;
        }, {
            totalItems: 0,
            completedItems: 0,
            pendingItems: 0,
            totalBuyAmount: 0,
            totalSellAmount: 0
        });

        stats.profit = stats.totalSellAmount - stats.totalBuyAmount;
        stats.completionRate = stats.totalItems > 0 
            ? Math.round((stats.completedItems / stats.totalItems) * 100) 
            : 0;

        return stats;
    },

    /**
     * Export data to JSON file
     * @param {Object} data - Data to export
     * @param {string} filename - Filename
     */
    exportToJson(data, filename) {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Import data from JSON file
     * @param {File} file - File to import
     * @returns {Promise<Object>} Parsed data
     */
    importFromJson(file) {
        return new Promise((resolve, reject) => {
            if (!file || file.type !== 'application/json') {
                reject(new Error('Vui lòng chọn file JSON hợp lệ'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error('File JSON không hợp lệ: ' + error.message));
                }
            };

            reader.onerror = () => {
                reject(new Error('Không thể đọc file'));
            };

            reader.readAsText(file);
        });
    },

    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile
     */
    isMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Add event listener with automatic cleanup
     * @param {Element} element - Element to add listener to
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    addEventListenerWithCleanup(element, event, handler, options = {}) {
        if (!element || typeof handler !== 'function') return () => {};

        element.addEventListener(event, handler, options);

        // Return cleanup function
        return () => {
            element.removeEventListener(event, handler, options);
        };
    }
};

// Make Utils available globally
window.Utils = Utils;