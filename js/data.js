/**
 * Data Management Layer for Shopping Management App v2.0
 * Handles data storage, retrieval, and management with new structure
 */

const DataManager = {
    // Storage key for localStorage
    STORAGE_KEY: 'shopping-manager-v2-data',
    
    // Current app version
    APP_VERSION: '2.0',
    
    // Data structure template
    getEmptyDataStructure() {
        return {
            version: this.APP_VERSION,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            hotels: {
                '36LS': {},
                '16TX': {},
                '55HT': {},
                '49HG': {}
            },
            itemPool: {
                thit: [],
                rau: [],
                dokho: [],
                hoaqua: []
            },
            settings: {
                autoSave: true,
                showCompletedItems: true,
                defaultUnit: 'kg',
                currency: 'VND'
            }
        };
    },

    /**
     * Initialize data structure
     */
    init() {
        if (!this.hasData()) {
            this.save(this.getEmptyDataStructure());
        } else {
            // Migrate old data if needed
            this.migrateData();
        }
    },

    /**
     * Check if data exists in localStorage
     * @returns {boolean} True if data exists
     */
    hasData() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    },

    /**
     * Load all data from localStorage
     * @returns {Object} Complete data structure
     */
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (!data) {
                return this.getEmptyDataStructure();
            }

            const parsed = JSON.parse(data);
            
            // Ensure data structure is complete
            return this.validateAndFixDataStructure(parsed);
        } catch (error) {
            console.error('Error loading data:', error);
            console.error('Corrupted data:', localStorage.getItem(this.STORAGE_KEY));
            
            // Clear corrupted data
            localStorage.removeItem(this.STORAGE_KEY);
            
            Utils.showToast('Dữ liệu bị lỗi, đã khôi phục về mặc định', 'warning');
            return this.getEmptyDataStructure();
        }
    },

    /**
     * Save all data to localStorage
     * @param {Object} data - Complete data structure
     */
    save(data) {
        try {
            data.lastModified = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
            Utils.showToast('Lỗi khi lưu dữ liệu', 'error');
        }
    },

    /**
     * Get items for specific hotel, date, and section
     * @param {string} hotel - Hotel code
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} section - Section code
     * @returns {Array} Array of items
     */
    getItems(hotel, date, section) {
        const data = this.load();
        
        if (!data.hotels[hotel]) {
            data.hotels[hotel] = {};
        }
        
        if (!data.hotels[hotel][date]) {
            data.hotels[hotel][date] = {};
        }
        
        if (!data.hotels[hotel][date][section]) {
            data.hotels[hotel][date][section] = [];
        }
        
        return data.hotels[hotel][date][section] || [];
    },

    /**
     * Set items for specific hotel, date, and section
     * @param {string} hotel - Hotel code
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} section - Section code
     * @param {Array} items - Array of items
     */
    setItems(hotel, date, section, items) {
        const data = this.load();
        
        if (!data.hotels[hotel]) {
            data.hotels[hotel] = {};
        }
        
        if (!data.hotels[hotel][date]) {
            data.hotels[hotel][date] = {};
        }
        
        data.hotels[hotel][date][section] = items;
        this.save(data);
    },

    /**
     * Add new item
     * @param {string} hotel - Hotel code
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} section - Section code
     * @param {Object} item - Item data
     * @returns {Object} Added item with ID
     */
    addItem(hotel, date, section, item) {
        const items = this.getItems(hotel, date, section);
        
        const newItem = {
            id: Utils.generateId(),
            name: item.name.trim(),
            quantity: Utils.parseNumber(item.quantity),
            unit: item.unit || 'kg',
            buyPrice: Utils.parseNumber(item.buyPrice),
            sellPrice: Utils.parseNumber(item.sellPrice),
            isDone: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        items.push(newItem);
        this.setItems(hotel, date, section, items);
        
        return newItem;
    },

    /**
     * Update existing item
     * @param {string} hotel - Hotel code
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} section - Section code
     * @param {string} itemId - Item ID
     * @param {Object} updates - Updates to apply
     * @returns {Object|null} Updated item or null if not found
     */
    updateItem(hotel, date, section, itemId, updates) {
        const items = this.getItems(hotel, date, section);
        const itemIndex = items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            return null;
        }
        
        const item = items[itemIndex];
        const updatedItem = {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        // Ensure numeric fields are properly parsed
        if (updates.quantity !== undefined) {
            updatedItem.quantity = Utils.parseNumber(updates.quantity);
        }
        if (updates.buyPrice !== undefined) {
            updatedItem.buyPrice = Utils.parseNumber(updates.buyPrice);
        }
        if (updates.sellPrice !== undefined) {
            updatedItem.sellPrice = Utils.parseNumber(updates.sellPrice);
        }
        
        items[itemIndex] = updatedItem;
        this.setItems(hotel, date, section, items);
        
        return updatedItem;
    },

    /**
     * Delete item
     * @param {string} hotel - Hotel code
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} section - Section code
     * @param {string} itemId - Item ID
     * @returns {boolean} True if deleted, false if not found
     */
    deleteItem(hotel, date, section, itemId) {
        const items = this.getItems(hotel, date, section);
        const itemIndex = items.findIndex(item => item.id === itemId);
        
        if (itemIndex === -1) {
            return false;
        }
        
        items.splice(itemIndex, 1);
        this.setItems(hotel, date, section, items);
        
        return true;
    },

    /**
     * Toggle item completion status
     * @param {string} hotel - Hotel code
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} section - Section code
     * @param {string} itemId - Item ID
     * @returns {Object|null} Updated item or null if not found
     */
    toggleItemCompletion(hotel, date, section, itemId) {
        const items = this.getItems(hotel, date, section);
        const item = items.find(item => item.id === itemId);
        
        if (!item) {
            return null;
        }
        
        return this.updateItem(hotel, date, section, itemId, {
            isDone: !item.isDone
        });
    },

    /**
     * Mark all items as done or undone
     * @param {string} hotel - Hotel code
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} section - Section code
     * @param {boolean} isDone - Done status
     */
    markAllItems(hotel, date, section, isDone) {
        const items = this.getItems(hotel, date, section);
        
        items.forEach(item => {
            item.isDone = isDone;
            item.updatedAt = new Date().toISOString();
        });
        
        this.setItems(hotel, date, section, items);
    },

    /**
     * Delete all completed items
     * @param {string} hotel - Hotel code
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} section - Section code
     * @returns {number} Number of deleted items
     */
    deleteCompletedItems(hotel, date, section) {
        const items = this.getItems(hotel, date, section);
        const initialCount = items.length;
        
        const remainingItems = items.filter(item => !item.isDone);
        this.setItems(hotel, date, section, remainingItems);
        
        return initialCount - remainingItems.length;
    },

    /**
     * Get item pool for a section
     * @param {string} section - Section code
     * @returns {Array} Array of template items
     */
    getItemPool(section) {
        const data = this.load();
        return data.itemPool[section] || [];
    },

    /**
     * Add item to pool
     * @param {string} section - Section code
     * @param {Object} poolItem - Pool item data
     */
    addToItemPool(section, poolItem) {
        const data = this.load();
        
        if (!data.itemPool[section]) {
            data.itemPool[section] = [];
        }
        
        const newPoolItem = {
            id: Utils.generateId(),
            name: poolItem.name.trim(),
            unit: poolItem.unit || 'kg',
            suggestedBuyPrice: Utils.parseNumber(poolItem.suggestedBuyPrice),
            suggestedSellPrice: Utils.parseNumber(poolItem.suggestedSellPrice),
            createdAt: new Date().toISOString()
        };
        
        data.itemPool[section].push(newPoolItem);
        this.save(data);
        
        return newPoolItem;
    },

    /**
     * Get statistics for a specific context
     * @param {string} hotel - Hotel code
     * @param {string} date - Date string (YYYY-MM-DD)
     * @param {string} section - Section code
     * @returns {Object} Statistics object
     */
    getStatistics(hotel, date, section) {
        const items = this.getItems(hotel, date, section);
        return Utils.calculateStats(items);
    },

    /**
     * Get all data for a specific hotel and date
     * @param {string} hotel - Hotel code
     * @param {string} date - Date string (YYYY-MM-DD)
     * @returns {Object} Hotel day data
     */
    getHotelDayData(hotel, date) {
        const data = this.load();
        return data.hotels[hotel] && data.hotels[hotel][date] || {};
    },

    /**
     * Export data for backup
     * @returns {Object} Exportable data
     */
    exportData() {
        const data = this.load();
        return {
            ...data,
            exportedAt: new Date().toISOString(),
            exportedBy: 'Shopping Manager v2.0'
        };
    },

    /**
     * Import data from backup
     * @param {Object} importData - Data to import
     * @returns {boolean} True if successful
     */
    importData(importData) {
        try {
            // Validate import data
            if (!importData || typeof importData !== 'object') {
                throw new Error('Dữ liệu import không hợp lệ');
            }

            // Validate structure
            const validatedData = this.validateAndFixDataStructure(importData);
            
            // Save imported data
            this.save(validatedData);
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            Utils.showToast('Lỗi import dữ liệu: ' + error.message, 'error');
            return false;
        }
    },

    /**
     * Validate and fix data structure
     * @param {Object} data - Data to validate
     * @returns {Object} Fixed data structure
     */
    validateAndFixDataStructure(data) {
        const template = this.getEmptyDataStructure();
        
        // Merge with template to ensure all required fields exist
        const fixed = {
            ...template,
            ...data
        };

        // Ensure hotels exist
        if (!fixed.hotels || typeof fixed.hotels !== 'object') {
            fixed.hotels = template.hotels;
        }

        // Ensure all hotels exist
        ['36LS', '16TX', '55HT', '49HG'].forEach(hotel => {
            if (!fixed.hotels[hotel]) {
                fixed.hotels[hotel] = {};
            }
        });

        // Ensure item pool exists
        if (!fixed.itemPool || typeof fixed.itemPool !== 'object') {
            fixed.itemPool = template.itemPool;
        }

        // Ensure all sections exist in item pool
        ['thit', 'rau', 'dokho', 'hoaqua'].forEach(section => {
            if (!Array.isArray(fixed.itemPool[section])) {
                fixed.itemPool[section] = [];
            }
        });

        // Ensure settings exist
        if (!fixed.settings || typeof fixed.settings !== 'object') {
            fixed.settings = template.settings;
        }

        return fixed;
    },

    /**
     * Migrate data from older versions
     */
    migrateData() {
        try {
            const data = this.load();
            
            // Check if migration is needed
            if (data.version === this.APP_VERSION) {
                return; // Already current version
            }

            // Migrate from v1.0 structure if needed
            if (!data.version || data.version === '1.0') {
                this.migrateFromV1(data);
            }

            // Update version
            data.version = this.APP_VERSION;
            data.migratedAt = new Date().toISOString();
            
            this.save(data);
            Utils.showToast('Dữ liệu đã được cập nhật lên phiên bản mới', 'info');
        } catch (error) {
            console.error('Migration error:', error);
            Utils.showToast('Lỗi khi cập nhật dữ liệu', 'error');
        }
    },

    /**
     * Migrate from v1.0 structure
     * @param {Object} data - Current data
     */
    migrateFromV1(data) {
        // If old structure exists, try to convert it
        if (data.hotels && typeof data.hotels === 'object') {
            // Old structure might have different hotel names
            const oldHotels = Object.keys(data.hotels);
            const newHotelMap = {
                0: '36LS',
                1: '16TX', 
                2: '55HT',
                3: '49HG',
                'hotel1': '36LS',
                'hotel2': '16TX',
                'hotel3': '55HT',
                'hotel4': '49HG'
            };

            const newHotels = {};

            oldHotels.forEach(oldKey => {
                const newKey = newHotelMap[oldKey] || oldKey;
                if (['36LS', '16TX', '55HT', '49HG'].includes(newKey)) {
                    newHotels[newKey] = data.hotels[oldKey] || {};
                }
            });

            data.hotels = newHotels;
        }

        // Ensure all required hotels exist
        ['36LS', '16TX', '55HT', '49HG'].forEach(hotel => {
            if (!data.hotels[hotel]) {
                data.hotels[hotel] = {};
            }
        });
    },

    /**
     * Clear all data
     */
    clearAllData() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.init();
    },

    /**
     * Get data size in bytes
     * @returns {number} Size in bytes
     */
    getDataSize() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? new Blob([data]).size : 0;
    },

    /**
     * Get formatted data size
     * @returns {string} Formatted size string
     */
    getFormattedDataSize() {
        const bytes = this.getDataSize();
        
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    },

    /**
     * Get all dates with data within a range
     * @param {string} fromDate - Start date (YYYY-MM-DD)
     * @param {string} toDate - End date (YYYY-MM-DD)
     * @returns {Array} Array of dates with data info
     */
    getDataInRange(fromDate, toDate) {
        const data = this.load();
        const result = [];
        
        const start = new Date(fromDate);
        const end = new Date(toDate);
        
        Object.keys(data.hotels).forEach(hotel => {
            const hotelData = data.hotels[hotel];
            
            Object.keys(hotelData).forEach(date => {
                const dateObj = new Date(date);
                
                if (dateObj >= start && dateObj <= end) {
                    const sections = hotelData[date];
                    let totalItems = 0;
                    
                    Object.keys(sections).forEach(section => {
                        if (Array.isArray(sections[section])) {
                            totalItems += sections[section].length;
                        }
                    });
                    
                    if (totalItems > 0) {
                        const existing = result.find(item => item.date === date);
                        
                        if (existing) {
                            existing.hotels.push(hotel);
                            existing.totalItems += totalItems;
                        } else {
                            result.push({
                                date: date,
                                hotels: [hotel],
                                totalItems: totalItems,
                                sections: Object.keys(sections).length
                            });
                        }
                    }
                }
            });
        });
        
        return result.sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    /**
     * Delete data within a date range
     * @param {string} fromDate - Start date (YYYY-MM-DD)
     * @param {string} toDate - End date (YYYY-MM-DD)
     * @returns {Object} Cleanup result with deleted count
     */
    cleanupDataInRange(fromDate, toDate) {
        const data = this.load();
        let deletedDates = 0;
        let deletedItems = 0;
        
        const start = new Date(fromDate);
        const end = new Date(toDate);
        
        Object.keys(data.hotels).forEach(hotel => {
            const hotelData = data.hotels[hotel];
            const datesToDelete = [];
            
            Object.keys(hotelData).forEach(date => {
                const dateObj = new Date(date);
                
                if (dateObj >= start && dateObj <= end) {
                    const sections = hotelData[date];
                    
                    Object.keys(sections).forEach(section => {
                        if (Array.isArray(sections[section])) {
                            deletedItems += sections[section].length;
                        }
                    });
                    
                    datesToDelete.push(date);
                }
            });
            
            datesToDelete.forEach(date => {
                delete hotelData[date];
                deletedDates++;
            });
        });
        
        this.save(data);
        
        return {
            deletedDates,
            deletedItems,
            fromDate,
            toDate
        };
    }
};

// Initialize data manager
DataManager.init();

// Make DataManager available globally
window.DataManager = DataManager;