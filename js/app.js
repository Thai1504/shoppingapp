/**
 * Core Application Logic for Shopping Management App v2.0
 * Handles UI interactions, flow control, and state management
 */

class ShoppingApp {
    constructor() {
        // Current state
        this.currentState = {
            selectedDate: null,
            selectedHotel: null,
            selectedSection: null,
            currentItems: [],
            isLoading: false
        };

        // Scroll state
        this.scrollState = {
            lastScrollY: 0,
            scrollDirection: 'up',
            scrolling: false
        };

        // UI elements
        this.elements = {};

        // Event cleanup functions
        this.cleanupFunctions = [];

        // Initialize app
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            this.showLoading(true);
            
            // Cache DOM elements
            this.cacheElements();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Set default date to today
            this.setDefaultDate();
            
            // Load item pools
            this.loadItemPools();
            
            // Initialize UI state
            this.updateUI();
            
            this.showLoading(false);
            
            Utils.showToast('Ứng dụng đã sẵn sàng!', 'success', 2000);
        } catch (error) {
            console.error('Initialization error:', error);
            Utils.showToast('Lỗi khởi tạo ứng dụng', 'error');
            this.showLoading(false);
        }
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        // Main containers
        this.elements.loadingIndicator = document.getElementById('loadingIndicator');
        this.elements.stickyNav = document.getElementById('stickyNav');
        this.elements.searchSection = document.getElementById('searchSection');
        this.elements.itemsList = document.getElementById('itemsList');

        // Form elements
        this.elements.selectedDate = document.getElementById('selectedDate');
        this.elements.todayBtn = document.getElementById('todayBtn');
        this.elements.cleanupBtn = document.getElementById('cleanupBtn');
        this.elements.itemForm = document.getElementById('itemForm');
        this.elements.itemName = document.getElementById('itemName');
        this.elements.itemPool = document.getElementById('itemPool');
        this.elements.quantity = document.getElementById('quantity');
        this.elements.unit = document.getElementById('unit');
        this.elements.buyPrice = document.getElementById('buyPrice');
        this.elements.sellPrice = document.getElementById('sellPrice');
        this.elements.saveToPool = document.getElementById('saveToPool');
        this.elements.clearFormBtn = document.getElementById('clearFormBtn');

        // Selection elements
        this.elements.hotelSelect = document.getElementById('hotelSelect');
        this.elements.sectionTabs = document.querySelectorAll('.section-tab');


        // List elements
        this.elements.searchInput = document.getElementById('searchInput');
        this.elements.statusFilter = document.getElementById('statusFilter');
        this.elements.itemsTableBody = document.getElementById('itemsTableBody');
        this.elements.itemsTableFooter = document.getElementById('itemsTableFooter');
        this.elements.totalBuyAmount = document.getElementById('totalBuyAmount');
        this.elements.totalSellAmount = document.getElementById('totalSellAmount');
        this.elements.itemCount = document.getElementById('itemCount');
        this.elements.emptyState = document.getElementById('emptyState');

        // Action buttons
        this.elements.addItemBtn = document.getElementById('addItemBtn');
        
        // Modal elements
        this.elements.addItemModal = document.getElementById('addItemModal');
        this.elements.modalClose = document.getElementById('modalClose');
        
        // Edit modal elements
        this.elements.editItemModal = document.getElementById('editItemModal');
        this.elements.editModalClose = document.getElementById('editModalClose');
        this.elements.editItemForm = document.getElementById('editItemForm');
        this.elements.editItemId = document.getElementById('editItemId');
        this.elements.editItemName = document.getElementById('editItemName');
        this.elements.editQuantity = document.getElementById('editQuantity');
        this.elements.editUnit = document.getElementById('editUnit');
        this.elements.editBuyPrice = document.getElementById('editBuyPrice');
        this.elements.editSellPrice = document.getElementById('editSellPrice');
        this.elements.editCancelBtn = document.getElementById('editCancelBtn');

        // Cleanup modal elements
        this.elements.cleanupModal = document.getElementById('cleanupModal');
        this.elements.cleanupModalClose = document.getElementById('cleanupModalClose');
        this.elements.cleanupForm = document.getElementById('cleanupForm');
        this.elements.cleanupFromDate = document.getElementById('cleanupFromDate');
        this.elements.cleanupToDate = document.getElementById('cleanupToDate');
        this.elements.previewCleanupBtn = document.getElementById('previewCleanupBtn');
        this.elements.executeCleanupBtn = document.getElementById('executeCleanupBtn');
        this.elements.cleanupCancelBtn = document.getElementById('cleanupCancelBtn');
        this.elements.cleanupPreview = document.getElementById('cleanupPreview');

        // File input
        this.elements.fileInput = document.getElementById('fileInput');
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Date selection with clearing logic
        if (this.elements.selectedDate) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.selectedDate, 
                    'change', 
                    (e) => this.handleDateChange(e.target.value)
                )
            );
        }

        if (this.elements.todayBtn) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.todayBtn, 
                    'click', 
                    () => this.setToday()
                )
            );
        }

        if (this.elements.cleanupBtn) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.cleanupBtn, 
                    'click', 
                    () => this.openCleanupModal()
                )
            );
        }

        // Hotel selection with clearing logic
        if (this.elements.hotelSelect) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.hotelSelect, 
                    'change', 
                    (e) => this.handleHotelSelect(e.target.value)
                )
            );
        }

        // Section selection
        this.elements.sectionTabs.forEach(tab => {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    tab, 
                    'click', 
                    () => this.handleSectionSelect(tab.dataset.section)
                )
            );
        });

        // Form submission
        if (this.elements.itemForm) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.itemForm, 
                    'submit', 
                    (e) => this.handleFormSubmit(e)
                )
            );
        }

        // Item pool selection
        if (this.elements.itemPool) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.itemPool, 
                    'change', 
                    (e) => this.handleItemPoolSelect(e.target.value)
                )
            );
        }

        // Clear form button
        if (this.elements.clearFormBtn) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.clearFormBtn, 
                    'click', 
                    () => this.clearForm()
                )
            );
        }


        // Search and filter
        if (this.elements.searchInput) {
            const debouncedSearch = Utils.debounce(() => this.filterAndRenderItems(), 300);
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.searchInput, 
                    'input', 
                    debouncedSearch
                )
            );
        }

        if (this.elements.statusFilter) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.statusFilter, 
                    'change', 
                    () => this.filterAndRenderItems()
                )
            );
        }


        // Add Item Button
        if (this.elements.addItemBtn) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.addItemBtn, 
                    'click', 
                    () => this.openAddItemModal()
                )
            );
        }

        // Modal close
        if (this.elements.modalClose) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.modalClose, 
                    'click', 
                    () => this.closeAddItemModal()
                )
            );
        }

        // Modal backdrop close
        if (this.elements.addItemModal) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.addItemModal, 
                    'click', 
                    (e) => {
                        if (e.target === this.elements.addItemModal) {
                            this.closeAddItemModal();
                        }
                    }
                )
            );
        }

        // Edit modal events
        if (this.elements.editModalClose) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.editModalClose, 
                    'click', 
                    () => this.closeEditModal()
                )
            );
        }

        if (this.elements.editCancelBtn) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.editCancelBtn, 
                    'click', 
                    () => this.closeEditModal()
                )
            );
        }

        if (this.elements.editItemForm) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.editItemForm, 
                    'submit', 
                    (e) => this.handleEditFormSubmit(e)
                )
            );
        }

        if (this.elements.editItemModal) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.editItemModal, 
                    'click', 
                    (e) => {
                        if (e.target === this.elements.editItemModal) {
                            this.closeEditModal();
                        }
                    }
                )
            );
        }

        // Cleanup modal events
        if (this.elements.cleanupModalClose) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.cleanupModalClose, 
                    'click', 
                    () => this.closeCleanupModal()
                )
            );
        }

        if (this.elements.cleanupCancelBtn) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.cleanupCancelBtn, 
                    'click', 
                    () => this.closeCleanupModal()
                )
            );
        }

        if (this.elements.previewCleanupBtn) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.previewCleanupBtn, 
                    'click', 
                    () => this.previewCleanup()
                )
            );
        }

        if (this.elements.cleanupForm) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.cleanupForm, 
                    'submit', 
                    (e) => this.handleCleanupSubmit(e)
                )
            );
        }

        if (this.elements.cleanupModal) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.cleanupModal, 
                    'click', 
                    (e) => {
                        if (e.target === this.elements.cleanupModal) {
                            this.closeCleanupModal();
                        }
                    }
                )
            );
        }

        // Scroll behavior
        this.cleanupFunctions.push(
            Utils.addEventListenerWithCleanup(
                window,
                'scroll',
                Utils.debounce(() => this.handleScroll(), 10)
            )
        );


        // File input for import
        if (this.elements.fileInput) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.fileInput, 
                    'change', 
                    (e) => this.handleFileImport(e)
                )
            );
        }

    }

    /**
     * Set default date to today
     */
    setDefaultDate() {
        const today = Utils.getTodayString();
        if (this.elements.selectedDate) {
            this.elements.selectedDate.value = today;
            this.handleDateChange(today);
        }
    }

    /**
     * Set date to today
     */
    setToday() {
        this.setDefaultDate();
    }

    /**
     * Handle date change
     */
    handleDateChange(date) {
        if (!date) return;

        this.currentState.selectedDate = date;
        
        // Clear dependent selections
        this.currentState.selectedHotel = null;
        this.currentState.selectedSection = null;
        this.currentState.currentItems = [];
        
        // Reset UI
        if (this.elements.hotelSelect) {
            this.elements.hotelSelect.value = '';
        }
        this.updateSectionTabs();
        
        this.updateMainInterface();
    }

    /**
     * Handle hotel selection
     */
    handleHotelSelect(hotel) {
        if (!hotel) return;

        this.currentState.selectedHotel = hotel;
        
        // Clear dependent selection
        this.currentState.selectedSection = null;
        this.currentState.currentItems = [];
        
        // Reset section UI
        this.updateSectionTabs();
        
        this.updateMainInterface();
    }

    /**
     * Handle section selection
     */
    handleSectionSelect(section) {
        this.currentState.selectedSection = section;
        
        // Update UI
        this.updateSectionTabs();
        this.loadItemPool(section);
        this.loadCurrentItems();
        this.updateMainInterface();
    }

    /**
     * Load item pool for section
     */
    loadItemPool(section) {
        const pool = DataManager.getItemPool(section);
        const select = this.elements.itemPool;
        
        if (!select) return;

        // Clear existing options except first
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }

        // Add pool items
        pool.forEach(item => {
            const option = document.createElement('option');
            option.value = JSON.stringify({
                name: item.name,
                unit: item.unit,
                buyPrice: item.suggestedBuyPrice,
                sellPrice: item.suggestedSellPrice
            });
            option.textContent = `${item.name} (${item.suggestedBuyPrice}k₫)`;
            select.appendChild(option);
        });
    }

    /**
     * Load all item pools on app start
     */
    loadItemPools() {
        // Pre-populate with common items for each section
        this.populateDefaultItemPools();
    }

    /**
     * Populate default item pools if empty
     */
    populateDefaultItemPools() {
        const defaultPools = {
            thit: [
                { name: 'Thịt bò mông', unit: 'kg', suggestedBuyPrice: 230, suggestedSellPrice: 230 },
                { name: 'Thịt nạc vai', unit: 'kg', suggestedBuyPrice: 130, suggestedSellPrice: 130 },
                { name: 'Thịt dẻ sườn bò', unit: 'kg', suggestedBuyPrice: 180, suggestedSellPrice: 180 },
                { name: 'Thịt nạm bò', unit: 'kg', suggestedBuyPrice: 180, suggestedSellPrice: 180 },
                { name: 'Thịt Bò', unit: 'kg', suggestedBuyPrice: 230, suggestedSellPrice: 230 },
                { name: 'Cá Rô Phi Lê', unit: 'kg', suggestedBuyPrice: 90, suggestedSellPrice: 90 },
                { name: 'Ngao', unit: 'kg', suggestedBuyPrice: 20, suggestedSellPrice: 20 },
                { name: 'Chân Giò', unit: 'kg', suggestedBuyPrice: 120, suggestedSellPrice: 120 },
                { name: 'Tôm Lớp Nhỏ', unit: 'kg', suggestedBuyPrice: 160, suggestedSellPrice: 160 },
                { name: 'Gà', unit: 'kg', suggestedBuyPrice: 120, suggestedSellPrice: 120 }
            ],
            rau: [
                { name: 'Cà rốt', unit: 'kg', suggestedBuyPrice: 13, suggestedSellPrice: 13 },
                { name: 'Ớt xanh', unit: 'quả', suggestedBuyPrice: 8, suggestedSellPrice: 8 },
                { name: 'Ớt đỏ', unit: 'quả', suggestedBuyPrice: 8, suggestedSellPrice: 8 },
                { name: 'Ngô (bắp)', unit: 'kg', suggestedBuyPrice: 13, suggestedSellPrice: 13 },
                { name: 'Xoài', unit: 'kg', suggestedBuyPrice: 25, suggestedSellPrice: 25 },
                { name: 'Đậu Phụ', unit: 'bìa', suggestedBuyPrice: 3, suggestedSellPrice: 3 },
                { name: 'Giá đỗ', unit: 'kg', suggestedBuyPrice: 15, suggestedSellPrice: 15 },
                { name: 'Tỏi', unit: 'kg', suggestedBuyPrice: 45, suggestedSellPrice: 45 },
                { name: 'Lá nếp', unit: 'kg', suggestedBuyPrice: 50, suggestedSellPrice: 50 },
                { name: 'Bắp cải', unit: 'quả', suggestedBuyPrice: 15, suggestedSellPrice: 15 },
                { name: 'Lơ trắng', unit: 'kg', suggestedBuyPrice: 40, suggestedSellPrice: 40 },
                { name: 'Dưa chuột', unit: 'kg', suggestedBuyPrice: 20, suggestedSellPrice: 20 },
                { name: 'Chanh Leo', unit: 'kg', suggestedBuyPrice: 30, suggestedSellPrice: 30 },
                { name: 'Dưa hấu', unit: 'kg', suggestedBuyPrice: 16, suggestedSellPrice: 16 },
                { name: 'Chuối', unit: 'nải', suggestedBuyPrice: 30, suggestedSellPrice: 30 },
                { name: 'Rau Mùi', unit: 'kg', suggestedBuyPrice: 80, suggestedSellPrice: 80 },
                { name: 'Hành Khô Thái', unit: 'kg', suggestedBuyPrice: 35, suggestedSellPrice: 35 },
                { name: 'Hành Tây', unit: 'kg', suggestedBuyPrice: 12, suggestedSellPrice: 12 },
                { name: 'Ớt Vàng', unit: 'kg', suggestedBuyPrice: 50, suggestedSellPrice: 50 },
                { name: 'Cuộn Trắng', unit: 'kg', suggestedBuyPrice: 40, suggestedSellPrice: 40 },
                { name: 'Cuộn Tím', unit: 'kg', suggestedBuyPrice: 90, suggestedSellPrice: 90 },
                { name: 'Dưa Vàng', unit: 'kg', suggestedBuyPrice: 25, suggestedSellPrice: 25 },
                { name: 'Xà Lách', unit: 'kg', suggestedBuyPrice: 25, suggestedSellPrice: 25 },
                { name: 'Quất', unit: 'kg', suggestedBuyPrice: 20, suggestedSellPrice: 20 },
                { name: 'Cà Chua', unit: 'kg', suggestedBuyPrice: 28, suggestedSellPrice: 28 },
                { name: 'Nấm Hải Sản', unit: 'kg', suggestedBuyPrice: 35, suggestedSellPrice: 35 },
                { name: 'Ớt Đà Lạt', unit: 'kg', suggestedBuyPrice: 40, suggestedSellPrice: 40 },
                { name: 'Hoa Hồng', unit: 'bông', suggestedBuyPrice: 4, suggestedSellPrice: 4 },
                { name: 'Táo', unit: 'kg', suggestedBuyPrice: 80, suggestedSellPrice: 80 },
                { name: 'Rau Muống', unit: 'mớ', suggestedBuyPrice: 25, suggestedSellPrice: 25 },
                { name: 'Cà Pháo', unit: 'kg', suggestedBuyPrice: 23, suggestedSellPrice: 23 },
                { name: 'Riềng', unit: 'kg', suggestedBuyPrice: 10, suggestedSellPrice: 10 }
            ],
            dokho: [
                { name: 'Phở', unit: 'kg', suggestedBuyPrice: 15, suggestedSellPrice: 15 },
                { name: 'Đậu cove', unit: 'kg', suggestedBuyPrice: 30, suggestedSellPrice: 30 },
                { name: 'Củ đậu', unit: 'kg', suggestedBuyPrice: 12, suggestedSellPrice: 12 },
                { name: 'Dấm Trắng', unit: 'thùng', suggestedBuyPrice: 265, suggestedSellPrice: 265 },
                { name: 'Phô Mai lá', unit: 'gói', suggestedBuyPrice: 275, suggestedSellPrice: 275 },
                { name: 'Phô Mai bào', unit: 'kg', suggestedBuyPrice: 220, suggestedSellPrice: 220 },
                { name: 'Phô Mai Moza', unit: 'gói', suggestedBuyPrice: 85, suggestedSellPrice: 85 },
                { name: 'Bột Mỳ', unit: 'kg', suggestedBuyPrice: 20, suggestedSellPrice: 20 },
                { name: 'Đường', unit: 'kg', suggestedBuyPrice: 21, suggestedSellPrice: 21 },
                { name: 'Bún', unit: 'kg', suggestedBuyPrice: 15, suggestedSellPrice: 15 },
                { name: 'Phở Lá', unit: 'kg', suggestedBuyPrice: 15, suggestedSellPrice: 15 },
                { name: 'Mắm Nam Ngư', unit: 'chai', suggestedBuyPrice: 55, suggestedSellPrice: 55 },
                { name: 'Dầu Ăn', unit: 'thùng', suggestedBuyPrice: 800, suggestedSellPrice: 800 },
                { name: 'Nước rửa bát', unit: 'thùng', suggestedBuyPrice: 280, suggestedSellPrice: 280 },
                { name: 'Đường Phèn', unit: 'kg', suggestedBuyPrice: 30, suggestedSellPrice: 30 },
                { name: 'Miến Dong', unit: 'kg', suggestedBuyPrice: 70, suggestedSellPrice: 70 },
                { name: 'Bột Chiên Giòn', unit: 'kg', suggestedBuyPrice: 30, suggestedSellPrice: 30 },
                { name: 'Cà Pháo Chua Ngọt', unit: 'lọ', suggestedBuyPrice: 60, suggestedSellPrice: 60 },
                { name: 'Dưa Muối', unit: 'kg', suggestedBuyPrice: 24, suggestedSellPrice: 24 },
                { name: 'Kem Tươi', unit: 'hộp', suggestedBuyPrice: 160, suggestedSellPrice: 160 },
                { name: 'Cốt Dừa', unit: 'hộp', suggestedBuyPrice: 30, suggestedSellPrice: 30 },
                { name: 'Ngũ Cốc Milo', unit: 'hộp', suggestedBuyPrice: 100, suggestedSellPrice: 100 },
                { name: 'Ngũ Cốc Ngô To', unit: 'hộp', suggestedBuyPrice: 125, suggestedSellPrice: 125 },
                { name: 'Ngũ Cốc Ngô Nhỏ', unit: 'hộp', suggestedBuyPrice: 85, suggestedSellPrice: 85 }
            ]
        };

        Object.keys(defaultPools).forEach(section => {
            const existingPool = DataManager.getItemPool(section);
            if (existingPool.length === 0) {
                defaultPools[section].forEach(item => {
                    DataManager.addToItemPool(section, item);
                });
            }
        });
    }

    /**
     * Handle item pool selection
     */
    handleItemPoolSelect(value) {
        if (!value) return;

        try {
            const item = JSON.parse(value);
            
            // Fill form fields
            if (this.elements.itemName) this.elements.itemName.value = item.name;
            if (this.elements.unit) this.elements.unit.value = item.unit || 'kg';
            if (this.elements.buyPrice) this.elements.buyPrice.value = item.buyPrice || '';
            if (this.elements.sellPrice) this.elements.sellPrice.value = item.sellPrice || '';
            
            // Focus quantity field
            if (this.elements.quantity) {
                this.elements.quantity.focus();
            }
        } catch (error) {
            console.error('Error parsing pool item:', error);
        }
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit(e) {
        e.preventDefault();

        if (!this.isSelectionComplete()) {
            Utils.showToast('Vui lòng chọn đầy đủ ngày, khách sạn và danh mục', 'warning');
            return;
        }

        const formData = this.getFormData();
        const validation = Utils.validateForm(formData, ['name', 'quantity', 'unit']);

        if (!validation.isValid) {
            Utils.showToast(validation.errors[0], 'error');
            return;
        }

        try {
            const newItem = DataManager.addItem(
                this.currentState.selectedHotel,
                this.currentState.selectedDate,
                this.currentState.selectedSection,
                formData
            );

            // Save to pool if checkbox is checked
            if (this.elements.saveToPool && this.elements.saveToPool.checked) {
                const poolItem = {
                    name: formData.name,
                    unit: formData.unit,
                    suggestedBuyPrice: formData.buyPrice, // Already in thousands format
                    suggestedSellPrice: formData.sellPrice // Already in thousands format
                };
                
                DataManager.addToItemPool(this.currentState.selectedSection, poolItem);
                // Reload the item pool dropdown to include the new item
                this.loadItemPool(this.currentState.selectedSection);
                Utils.showToast(`Đã thêm "${formData.name}" và lưu vào danh sách`, 'success');
            } else {
                Utils.showToast(`Đã thêm ${newItem.name}`, 'success');
            }

            this.closeAddItemModal();
            this.loadCurrentItems();
        } catch (error) {
            console.error('Error adding item:', error);
            Utils.showToast('Lỗi khi thêm sản phẩm', 'error');
        }
    }

    /**
     * Get form data
     */
    getFormData() {
        return {
            name: this.elements.itemName?.value.trim() || '',
            quantity: this.elements.quantity?.value || '',
            unit: this.elements.unit?.value || 'kg',
            buyPrice: this.elements.buyPrice?.value ? Utils.parseNumber(this.elements.buyPrice.value) : '',
            sellPrice: this.elements.sellPrice?.value ? Utils.parseNumber(this.elements.sellPrice.value) : ''
        };
    }

    /**
     * Clear form
     */
    clearForm() {
        if (this.elements.itemForm) {
            this.elements.itemForm.reset();
        }
        if (this.elements.itemPool) {
            this.elements.itemPool.value = '';
        }
        // Set default quantity to 1
        if (this.elements.quantity) {
            this.elements.quantity.value = '1';
        }
        // Reset save to pool checkbox
        if (this.elements.saveToPool) {
            this.elements.saveToPool.checked = false;
        }
        if (this.elements.itemName) {
            this.elements.itemName.focus();
        }
    }

    /**
     * Load current items from data
     */
    loadCurrentItems() {
        if (!this.isSelectionComplete()) {
            this.currentState.currentItems = [];
            this.renderItems([]);
            return;
        }

        try {
            const items = DataManager.getItems(
                this.currentState.selectedHotel,
                this.currentState.selectedDate,
                this.currentState.selectedSection
            );

            this.currentState.currentItems = items;
            this.filterAndRenderItems();
        } catch (error) {
            console.error('Error loading items:', error);
            Utils.showToast('Lỗi khi tải danh sách sản phẩm', 'error');
        }
    }

    /**
     * Filter and render items based on current filters
     */
    filterAndRenderItems() {
        const searchTerm = this.elements.searchInput?.value || '';
        const statusFilter = this.elements.statusFilter?.value || 'all';
        
        const filteredItems = Utils.filterItems(this.currentState.currentItems, searchTerm, statusFilter);
        this.renderItems(filteredItems);
    }

    /**
     * Render items in the table
     */
    renderItems(items) {
        const tbody = this.elements.itemsTableBody;
        const footer = this.elements.itemsTableFooter;
        const emptyState = this.elements.emptyState;

        if (!tbody) return;

        // Clear table
        tbody.innerHTML = '';

        if (items.length === 0) {
            // Show empty state
            if (emptyState) emptyState.style.display = 'block';
            if (footer) footer.style.display = 'none';
            return;
        }

        // Hide empty state
        if (emptyState) emptyState.style.display = 'none';
        if (footer) footer.style.display = 'table-footer-group';

        // Render items
        items.forEach(item => {
            const row = this.createItemRow(item);
            tbody.appendChild(row);
        });

        // Update totals
        this.updateTotals(items);
    }

    /**
     * Create table row for item
     */
    createItemRow(item) {
        const row = document.createElement('tr');
        row.className = `item-row ${item.isDone ? 'completed' : ''}`;
        
        const buyTotal = Utils.calculateTotal(item.quantity, item.buyPrice);
        const sellTotal = Utils.calculateTotal(item.quantity, item.sellPrice);

        // Format calculation display in thousands
        const buyPriceDisplay = item.buyPrice ? item.buyPrice : '0';
        const sellPriceDisplay = item.sellPrice ? item.sellPrice : '0';
        const buyTotalDisplay = buyTotal;
        const sellTotalDisplay = sellTotal;
        
        const buyCalculation = item.buyPrice ? 
            `${buyPriceDisplay} × ${item.quantity}${item.unit} = ${buyTotalDisplay}` : 
            `Chưa có giá`;
        
        const sellCalculation = item.sellPrice ? 
            `${sellPriceDisplay} × ${item.quantity}${item.unit} = ${sellTotalDisplay}` : 
            `Chưa có giá`;

        row.innerHTML = `
            <td class="col-checkbox">
                <input type="checkbox" class="item-checkbox" 
                       ${item.isDone ? 'checked' : ''} 
                       onchange="app.toggleItemCompletion('${item.id}')">
            </td>
            <td class="col-name-unit">
                <div class="item-name">${Utils.sanitizeHtml(item.name)}</div>
                <div class="item-quantity">x${item.quantity} ${item.unit}</div>
            </td>
            <td class="col-price edit-mode-only" style="display: none;">
                <input type="number" class="price-input" 
                       value="${item.buyPrice || ''}" 
                       placeholder="0"
                       onchange="app.updateItemPrice('${item.id}', 'buyPrice', this.value)"
                       min="0">
            </td>
            <td class="col-price edit-mode-only" style="display: none;">
                <input type="number" class="price-input" 
                       value="${item.sellPrice || ''}" 
                       placeholder="0"
                       onchange="app.updateItemPrice('${item.id}', 'sellPrice', this.value)"
                       min="0">
            </td>
            <td class="col-total">
                <div class="total-calculation">${buyCalculation}</div>
            </td>
            <td class="col-total">
                <div class="total-calculation">${sellCalculation}</div>
            </td>
            <td class="col-actions">
                <button class="btn btn-edit btn-sm" 
                        onclick="app.openEditModal('${item.id}')"
                        title="Chỉnh sửa">
                    ✏️
                </button>
                <button class="btn btn-danger btn-sm" 
                        onclick="app.deleteItem('${item.id}')"
                        title="Xóa sản phẩm">
                    🗑️
                </button>
            </td>
        `;

        return row;
    }

    /**
     * Toggle item completion status
     */
    async toggleItemCompletion(itemId) {
        try {
            DataManager.toggleItemCompletion(
                this.currentState.selectedHotel,
                this.currentState.selectedDate,
                this.currentState.selectedSection,
                itemId
            );

            this.loadCurrentItems();
        } catch (error) {
            console.error('Error toggling item completion:', error);
            Utils.showToast('Lỗi khi cập nhật trạng thái', 'error');
        }
    }

    /**
     * Update item price
     */
    async updateItemPrice(itemId, priceType, value) {
        try {
            const updates = {};
            updates[priceType] = Utils.parseNumber(value);

            DataManager.updateItem(
                this.currentState.selectedHotel,
                this.currentState.selectedDate,
                this.currentState.selectedSection,
                itemId,
                updates
            );

            // Refresh display
            this.loadCurrentItems();
        } catch (error) {
            console.error('Error updating item price:', error);
            Utils.showToast('Lỗi khi cập nhật giá', 'error');
        }
    }

    /**
     * Open edit modal for item
     */
    openEditModal(itemId) {
        if (!this.isSelectionComplete()) return;

        // Find the item
        const item = this.currentState.currentItems.find(item => item.id === itemId);
        if (!item) {
            Utils.showToast('Không tìm thấy sản phẩm', 'error');
            return;
        }

        // Populate form fields
        if (this.elements.editItemId) this.elements.editItemId.value = item.id;
        if (this.elements.editItemName) this.elements.editItemName.value = item.name;
        if (this.elements.editQuantity) this.elements.editQuantity.value = item.quantity;
        if (this.elements.editUnit) this.elements.editUnit.value = item.unit;
        if (this.elements.editBuyPrice) this.elements.editBuyPrice.value = item.buyPrice || '';
        if (this.elements.editSellPrice) this.elements.editSellPrice.value = item.sellPrice || '';

        // Open modal
        if (this.elements.editItemModal) {
            this.elements.editItemModal.classList.add('active');
            
            // Focus first input
            if (this.elements.editItemName) {
                this.elements.editItemName.focus();
            }
        }
    }

    /**
     * Close edit modal
     */
    closeEditModal() {
        if (this.elements.editItemModal) {
            this.elements.editItemModal.classList.remove('active');
        }
    }

    /**
     * Handle edit form submission
     */
    async handleEditFormSubmit(e) {
        e.preventDefault();

        const formData = this.getEditFormData();
        const validation = Utils.validateForm(formData, ['name', 'quantity', 'unit']);

        if (!validation.isValid) {
            Utils.showToast(validation.errors[0], 'error');
            return;
        }

        try {
            const itemId = this.elements.editItemId?.value;
            if (!itemId) {
                Utils.showToast('Lỗi: Không xác định được sản phẩm', 'error');
                return;
            }

            DataManager.updateItem(
                this.currentState.selectedHotel,
                this.currentState.selectedDate,
                this.currentState.selectedSection,
                itemId,
                {
                    name: formData.name,
                    quantity: Utils.parseNumber(formData.quantity),
                    unit: formData.unit,
                    buyPrice: formData.buyPrice, // Already in thousands format
                    sellPrice: formData.sellPrice // Already in thousands format
                }
            );

            this.closeEditModal();
            this.loadCurrentItems();
            
            Utils.showToast('Đã cập nhật sản phẩm', 'success');
        } catch (error) {
            console.error('Error updating item:', error);
            Utils.showToast('Lỗi khi cập nhật sản phẩm', 'error');
        }
    }

    /**
     * Get edit form data
     */
    getEditFormData() {
        return {
            name: this.elements.editItemName?.value.trim() || '',
            quantity: this.elements.editQuantity?.value || '',
            unit: this.elements.editUnit?.value || 'kg',
            buyPrice: this.elements.editBuyPrice?.value ? Utils.parseNumber(this.elements.editBuyPrice.value) : '',
            sellPrice: this.elements.editSellPrice?.value ? Utils.parseNumber(this.elements.editSellPrice.value) : ''
        };
    }

    /**
     * Delete item
     */
    async deleteItem(itemId) {
        const confirmed = await Utils.showConfirm(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa sản phẩm này?'
        );

        if (!confirmed) return;

        try {
            const success = DataManager.deleteItem(
                this.currentState.selectedHotel,
                this.currentState.selectedDate,
                this.currentState.selectedSection,
                itemId
            );

            if (success) {
                this.loadCurrentItems();
                Utils.showToast('Đã xóa sản phẩm', 'success');
            } else {
                Utils.showToast('Không thể xóa sản phẩm', 'error');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            Utils.showToast('Lỗi khi xóa sản phẩm', 'error');
        }
    }


    /**
     * Update totals in footer
     */
    updateTotals(items) {
        const stats = Utils.calculateStats(items);

        if (this.elements.totalBuyAmount) {
            this.elements.totalBuyAmount.textContent = stats.totalBuyAmount;
        }

        if (this.elements.totalSellAmount) {
            this.elements.totalSellAmount.textContent = stats.totalSellAmount;
        }

        if (this.elements.itemCount) {
            this.elements.itemCount.textContent = `${stats.totalItems} sản phẩm`;
        }
    }

    /**
     * Update UI based on current state
     */
    updateUI() {
        this.updateMainInterface();
    }

    /**
     * Update main interface visibility
     */
    updateMainInterface() {
        const canShowContent = this.currentState.selectedDate && 
                               this.currentState.selectedHotel && 
                               this.currentState.selectedSection;
        
        // Show/hide search section
        if (this.elements.searchSection) {
            this.elements.searchSection.style.display = canShowContent ? 'flex' : 'none';
        }

        // Show/hide items list
        if (this.elements.itemsList) {
            this.elements.itemsList.style.display = canShowContent ? 'block' : 'none';
        }

        // Show/hide add item button
        if (this.elements.addItemBtn) {
            this.elements.addItemBtn.style.display = canShowContent ? 'flex' : 'none';
        }
    }

    /**
     * Show main interface after selection is complete
     */
    showMainInterface() {
        this.updateMainInterface();
        
        // Scroll to form
        setTimeout(() => {
            this.scrollToForm();
        }, 300);
    }

    /**
     * Hide selection steps
     */
    hideSelectionSteps() {
        if (this.elements.dateStep) this.elements.dateStep.style.display = 'none';
        if (this.elements.hotelStep) this.elements.hotelStep.style.display = 'none';
        if (this.elements.sectionStep) this.elements.sectionStep.style.display = 'none';
    }

    /**
     * Show selection steps
     */
    showSelectionSteps() {
        if (this.elements.dateStep) this.elements.dateStep.style.display = 'block';
        if (this.elements.hotelStep) this.elements.hotelStep.style.display = 'block';
        if (this.elements.sectionStep) this.elements.sectionStep.style.display = 'block';
    }

    /**
     * Reset selection
     */
    resetSelection() {
        this.currentState.selectedDate = null;
        this.currentState.selectedHotel = null;
        this.currentState.selectedSection = null;
        this.currentState.currentItems = [];

        // Reset UI
        if (this.elements.selectedDate) this.elements.selectedDate.value = '';
        if (this.elements.hotelSelect) this.elements.hotelSelect.value = '';
        this.updateSectionTabs();
        this.clearForm();
        
        // Show selection steps
        this.showSelectionSteps();
        this.updateUI();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Update section tabs UI
     */
    updateSectionTabs() {
        this.elements.sectionTabs.forEach(tab => {
            if (tab.dataset.section === this.currentState.selectedSection) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    /**
     * Enable a step
     */
    enableStep(step) {
        const stepElement = this.elements[`${step}Step`];
        if (stepElement) {
            stepElement.classList.remove('disabled');
        }
    }

    /**
     * Disable a step
     */
    disableStep(step) {
        const stepElement = this.elements[`${step}Step`];
        if (stepElement) {
            stepElement.classList.add('disabled');
        }
    }

    /**
     * Check if selection is complete
     */
    isSelectionComplete() {
        return this.currentState.selectedDate && 
               this.currentState.selectedHotel && 
               this.currentState.selectedSection;
    }

    /**
     * Open add item modal
     */
    openAddItemModal() {
        if (this.elements.addItemModal) {
            this.elements.addItemModal.classList.add('active');
            
            // Focus first input
            if (this.elements.itemName) {
                this.elements.itemName.focus();
            }
        }
    }

    /**
     * Close add item modal
     */
    closeAddItemModal() {
        if (this.elements.addItemModal) {
            this.elements.addItemModal.classList.remove('active');
            this.clearForm();
        }
    }

    /**
     * Handle scroll behavior for sticky header
     */
    handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - this.scrollState.lastScrollY;
        
        // Determine scroll direction
        if (Math.abs(scrollDelta) > 10) {
            this.scrollState.scrollDirection = scrollDelta > 0 ? 'down' : 'up';
            this.scrollState.scrolling = true;
            
            // Clear scrolling state after a delay
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.scrollState.scrolling = false;
            }, 150);
        }
        
        this.scrollState.lastScrollY = currentScrollY;
        this.updateStickyBehavior();
    }

    /**
     * Update sticky header behavior based on scroll
     */
    updateStickyBehavior() {
        if (!this.elements.stickyNav) return;
        
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            // Enable compact mode when scrolled down
            if (this.scrollState.scrollDirection === 'down' && this.scrollState.scrolling) {
                this.elements.stickyNav.classList.add('compact');
            }
            
            // Enable full mode when scrolling up
            if (this.scrollState.scrollDirection === 'up' && this.scrollState.scrolling) {
                this.elements.stickyNav.classList.remove('compact');
            }
        } else {
            // Always full mode at top
            this.elements.stickyNav.classList.remove('compact');
        }
    }

    /**
     * Show/hide loading indicator
     */
    showLoading(show) {
        if (this.elements.loadingIndicator) {
            this.elements.loadingIndicator.style.display = show ? 'flex' : 'none';
        }
        this.currentState.isLoading = show;
    }

    /**
     * Toggle menu
     */
    toggleMenu() {
        if (this.elements.mobileMenu) {
            this.elements.mobileMenu.classList.toggle('active');
        }
    }

    /**
     * Close menu
     */
    closeMenu() {
        if (this.elements.mobileMenu) {
            this.elements.mobileMenu.classList.remove('active');
        }
    }

    /**
     * Handle menu actions
     */
    async handleMenuAction(action) {
        this.closeMenu();

        switch (action) {
            case 'export':
                this.exportData();
                break;
            case 'import':
                this.importData();
                break;
            case 'print':
                window.print();
                break;
            case 'help':
                this.showHelp();
                break;
            case 'about':
                this.showAbout();
                break;
            default:
                console.log('Unknown menu action:', action);
        }
    }

    /**
     * Export data
     */
    exportData() {
        try {
            const data = DataManager.exportData();
            const filename = `shopping-data-${Utils.getTodayString()}.json`;
            
            Utils.exportToJson(data, filename);
            Utils.showToast('Đã xuất dữ liệu thành công!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            Utils.showToast('Lỗi khi xuất dữ liệu', 'error');
        }
    }

    /**
     * Import data
     */
    importData() {
        if (this.elements.fileInput) {
            this.elements.fileInput.click();
        }
    }

    /**
     * Handle file import
     */
    async handleFileImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const data = await Utils.importFromJson(file);
            
            const confirmed = await Utils.showConfirm(
                'Xác nhận nhập dữ liệu',
                'Việc nhập dữ liệu sẽ thay thế toàn bộ dữ liệu hiện tại. Bạn có chắc chắn?'
            );

            if (!confirmed) {
                e.target.value = '';
                return;
            }

            const success = DataManager.importData(data);
            
            if (success) {
                // Refresh current view
                this.loadCurrentItems();
                Utils.showToast('Đã nhập dữ liệu thành công!', 'success');
            }
        } catch (error) {
            console.error('Import error:', error);
            Utils.showToast('Lỗi khi nhập dữ liệu: ' + error.message, 'error');
        }

        // Reset file input
        e.target.value = '';
    }

    /**
     * Show help
     */
    showHelp() {
        Utils.showToast('Tính năng hướng dẫn đang phát triển', 'info');
    }

    /**
     * Show about
     */
    showAbout() {
        const message = `Quản Lý Mua Sắm v2.0
        
Ứng dụng quản lý mua sắm cho 4 khách sạn
- 36LS, 16TX, 55HT, 49HG

Dung lượng dữ liệu: ${DataManager.getFormattedDataSize()}

Phát triển bởi Shopping Manager Team`;

        Utils.showConfirm('Thông tin ứng dụng', message);
    }

    /**
     * Cleanup function
     */
    destroy() {
        // Run all cleanup functions
        this.cleanupFunctions.forEach(cleanup => {
            if (typeof cleanup === 'function') {
                cleanup();
            }
        });
        
        this.cleanupFunctions = [];
    }

    /**
     * Open cleanup modal
     */
    openCleanupModal() {
        if (this.elements.cleanupModal) {
            this.elements.cleanupModal.classList.add('active');
            
            // Set default date range (30 days ago to yesterday)
            const today = new Date();
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(today.getDate() - 30);
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            
            if (this.elements.cleanupFromDate) {
                this.elements.cleanupFromDate.value = Utils.formatDateForInput(thirtyDaysAgo);
            }
            if (this.elements.cleanupToDate) {
                this.elements.cleanupToDate.value = Utils.formatDateForInput(yesterday);
            }
            
            // Reset preview and button state
            if (this.elements.cleanupPreview) {
                this.elements.cleanupPreview.textContent = 'Chọn khoảng ngày để xem trước dữ liệu sẽ bị xóa';
            }
            if (this.elements.executeCleanupBtn) {
                this.elements.executeCleanupBtn.disabled = true;
            }
        }
    }

    /**
     * Close cleanup modal
     */
    closeCleanupModal() {
        if (this.elements.cleanupModal) {
            this.elements.cleanupModal.classList.remove('active');
        }
    }

    /**
     * Set cleanup date range based on days ago
     */
    setCleanupRange(daysAgo) {
        const today = new Date();
        const fromDate = new Date(today);
        fromDate.setDate(today.getDate() - daysAgo);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        if (this.elements.cleanupFromDate) {
            this.elements.cleanupFromDate.value = Utils.formatDateForInput(fromDate);
        }
        if (this.elements.cleanupToDate) {
            this.elements.cleanupToDate.value = Utils.formatDateForInput(yesterday);
        }
    }

    /**
     * Preview cleanup data
     */
    previewCleanup() {
        if (!this.elements.cleanupFromDate || !this.elements.cleanupToDate || !this.elements.cleanupPreview) {
            return;
        }

        const fromDate = this.elements.cleanupFromDate.value;
        const toDate = this.elements.cleanupToDate.value;

        if (!fromDate || !toDate) {
            Utils.showToast('Vui lòng chọn khoảng ngày', 'warning');
            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {
            Utils.showToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'warning');
            return;
        }

        try {
            const dataInRange = DataManager.getDataInRange(fromDate, toDate);
            
            if (dataInRange.length === 0) {
                this.elements.cleanupPreview.innerHTML = '🔍 <strong>Không tìm thấy dữ liệu nào trong khoảng thời gian này</strong>';
                if (this.elements.executeCleanupBtn) {
                    this.elements.executeCleanupBtn.disabled = true;
                }
            } else {
                const totalItems = dataInRange.reduce((sum, day) => sum + day.totalItems, 0);
                const totalDays = dataInRange.length;
                
                this.elements.cleanupPreview.innerHTML = `
                    <strong>📊 Dữ liệu sẽ bị xóa:</strong><br>
                    • <strong>${totalDays}</strong> ngày<br>
                    • <strong>${totalItems}</strong> sản phẩm<br>
                    • Từ <strong>${Utils.formatDate(fromDate)}</strong> đến <strong>${Utils.formatDate(toDate)}</strong>
                `;
                
                if (this.elements.executeCleanupBtn) {
                    this.elements.executeCleanupBtn.disabled = false;
                }
            }
        } catch (error) {
            console.error('Preview cleanup error:', error);
            Utils.showToast('Lỗi khi xem trước dữ liệu', 'error');
        }
    }

    /**
     * Handle cleanup form submission
     */
    async handleCleanupSubmit(e) {
        e.preventDefault();

        if (!this.elements.cleanupFromDate || !this.elements.cleanupToDate) {
            return;
        }

        const fromDate = this.elements.cleanupFromDate.value;
        const toDate = this.elements.cleanupToDate.value;

        if (!fromDate || !toDate) {
            Utils.showToast('Vui lòng chọn khoảng ngày', 'warning');
            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {
            Utils.showToast('Ngày bắt đầu phải nhỏ hơn ngày kết thúc', 'warning');
            return;
        }

        try {
            const confirmed = await Utils.showConfirm(
                'Xác nhận xóa dữ liệu',
                `Bạn có chắc chắn muốn xóa tất cả dữ liệu từ ${Utils.formatDate(fromDate)} đến ${Utils.formatDate(toDate)}? Hành động này không thể hoàn tác.`
            );

            if (!confirmed) {
                return;
            }

            const result = DataManager.cleanupDataInRange(fromDate, toDate);
            
            this.closeCleanupModal();
            
            // Refresh current view if affected
            if (this.currentState.selectedDate && 
                this.currentState.selectedDate >= fromDate && 
                this.currentState.selectedDate <= toDate) {
                this.loadCurrentItems();
            }
            
            Utils.showToast(
                `Đã xóa ${result.deletedItems} sản phẩm từ ${result.deletedDates} ngày`,
                'success'
            );
        } catch (error) {
            console.error('Cleanup error:', error);
            Utils.showToast('Lỗi khi xóa dữ liệu', 'error');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ShoppingApp();
});

// Make functions available for inline onclick handlers
window.app = window.app || {};