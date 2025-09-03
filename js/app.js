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
        this.elements.dateStep = document.getElementById('dateStep');
        this.elements.hotelStep = document.getElementById('hotelStep');
        this.elements.sectionStep = document.getElementById('sectionStep');
        this.elements.currentSelection = document.getElementById('currentSelection');
        this.elements.itemEntry = document.getElementById('itemEntry');
        this.elements.itemsList = document.getElementById('itemsList');

        // Form elements
        this.elements.selectedDate = document.getElementById('selectedDate');
        this.elements.todayBtn = document.getElementById('todayBtn');
        this.elements.itemForm = document.getElementById('itemForm');
        this.elements.itemName = document.getElementById('itemName');
        this.elements.itemPool = document.getElementById('itemPool');
        this.elements.quantity = document.getElementById('quantity');
        this.elements.unit = document.getElementById('unit');
        this.elements.buyPrice = document.getElementById('buyPrice');
        this.elements.sellPrice = document.getElementById('sellPrice');
        this.elements.clearFormBtn = document.getElementById('clearFormBtn');

        // Selection elements
        this.elements.hotelCards = document.querySelectorAll('.hotel-card');
        this.elements.sectionCards = document.querySelectorAll('.section-card');

        // Summary elements
        this.elements.summaryDate = document.getElementById('summaryDate');
        this.elements.summaryHotel = document.getElementById('summaryHotel');
        this.elements.summarySection = document.getElementById('summarySection');
        this.elements.changeSelectionBtn = document.getElementById('changeSelectionBtn');

        // List elements
        this.elements.listTitle = document.getElementById('listTitle');
        this.elements.searchInput = document.getElementById('searchInput');
        this.elements.statusFilter = document.getElementById('statusFilter');
        this.elements.itemsTableBody = document.getElementById('itemsTableBody');
        this.elements.itemsTableFooter = document.getElementById('itemsTableFooter');
        this.elements.totalBuyAmount = document.getElementById('totalBuyAmount');
        this.elements.totalSellAmount = document.getElementById('totalSellAmount');
        this.elements.itemCount = document.getElementById('itemCount');
        this.elements.emptyState = document.getElementById('emptyState');

        // Action buttons
        this.elements.markAllDoneBtn = document.getElementById('markAllDoneBtn');
        this.elements.clearDoneBtn = document.getElementById('clearDoneBtn');
        this.elements.fab = document.getElementById('fab');

        // Menu elements
        this.elements.menuToggle = document.getElementById('menuToggle');
        this.elements.mobileMenu = document.getElementById('mobileMenu');
        this.elements.menuClose = document.getElementById('menuClose');
        this.elements.menuItems = document.querySelectorAll('.menu-item');

        // File input
        this.elements.fileInput = document.getElementById('fileInput');
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Date selection
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

        // Hotel selection
        this.elements.hotelCards.forEach(card => {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    card, 
                    'click', 
                    () => this.handleHotelSelect(card.dataset.hotel)
                )
            );
        });

        // Section selection
        this.elements.sectionCards.forEach(card => {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    card, 
                    'click', 
                    () => this.handleSectionSelect(card.dataset.section)
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

        // Change selection button
        if (this.elements.changeSelectionBtn) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.changeSelectionBtn, 
                    'click', 
                    () => this.resetSelection()
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

        // Bulk actions
        if (this.elements.markAllDoneBtn) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.markAllDoneBtn, 
                    'click', 
                    () => this.handleMarkAllDone()
                )
            );
        }

        if (this.elements.clearDoneBtn) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.clearDoneBtn, 
                    'click', 
                    () => this.handleClearCompleted()
                )
            );
        }

        // FAB
        if (this.elements.fab) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.fab, 
                    'click', 
                    () => this.scrollToForm()
                )
            );
        }

        // Menu
        if (this.elements.menuToggle) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.menuToggle, 
                    'click', 
                    () => this.toggleMenu()
                )
            );
        }

        if (this.elements.menuClose) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.menuClose, 
                    'click', 
                    () => this.closeMenu()
                )
            );
        }

        // Menu items
        this.elements.menuItems.forEach(item => {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    item, 
                    'click', 
                    () => this.handleMenuAction(item.dataset.action)
                )
            );
        });

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

        // Menu overlay close
        if (this.elements.mobileMenu) {
            this.cleanupFunctions.push(
                Utils.addEventListenerWithCleanup(
                    this.elements.mobileMenu, 
                    'click', 
                    (e) => {
                        if (e.target === this.elements.mobileMenu) {
                            this.closeMenu();
                        }
                    }
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
        this.updateSelectionSummary();
        this.enableStep('hotel');
        
        // If hotel and section are already selected, load items
        if (this.currentState.selectedHotel && this.currentState.selectedSection) {
            this.loadCurrentItems();
        }
    }

    /**
     * Handle hotel selection
     */
    handleHotelSelect(hotel) {
        if (!this.currentState.selectedDate) {
            Utils.showToast('Vui lòng chọn ngày trước', 'warning');
            return;
        }

        this.currentState.selectedHotel = hotel;
        
        // Update UI
        this.updateHotelCards();
        this.updateSelectionSummary();
        this.enableStep('section');
        
        // If section is already selected, load items
        if (this.currentState.selectedSection) {
            this.loadCurrentItems();
        }
    }

    /**
     * Handle section selection
     */
    handleSectionSelect(section) {
        if (!this.currentState.selectedHotel) {
            Utils.showToast('Vui lòng chọn khách sạn trước', 'warning');
            return;
        }

        this.currentState.selectedSection = section;
        
        // Update UI
        this.updateSectionCards();
        this.updateSelectionSummary();
        this.loadItemPool(section);
        this.loadCurrentItems();
        this.showMainInterface();
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
            option.textContent = `${item.name} (${Utils.formatCurrency(item.suggestedBuyPrice)})`;
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
                { name: 'Thịt bò', unit: 'kg', suggestedBuyPrice: 300000, suggestedSellPrice: 350000 },
                { name: 'Thịt heo', unit: 'kg', suggestedBuyPrice: 120000, suggestedSellPrice: 140000 },
                { name: 'Thịt gà', unit: 'kg', suggestedBuyPrice: 80000, suggestedSellPrice: 95000 },
                { name: 'Cá basa', unit: 'kg', suggestedBuyPrice: 45000, suggestedSellPrice: 55000 },
                { name: 'Tôm', unit: 'kg', suggestedBuyPrice: 300000, suggestedSellPrice: 350000 }
            ],
            rau: [
                { name: 'Cải thảo', unit: 'kg', suggestedBuyPrice: 15000, suggestedSellPrice: 18000 },
                { name: 'Rau muống', unit: 'kg', suggestedBuyPrice: 8000, suggestedSellPrice: 12000 },
                { name: 'Cà chua', unit: 'kg', suggestedBuyPrice: 25000, suggestedSellPrice: 30000 },
                { name: 'Hành tây', unit: 'kg', suggestedBuyPrice: 20000, suggestedSellPrice: 25000 },
                { name: 'Khoai tây', unit: 'kg', suggestedBuyPrice: 18000, suggestedSellPrice: 22000 }
            ],
            dokho: [
                { name: 'Gạo tẻ', unit: 'kg', suggestedBuyPrice: 20000, suggestedSellPrice: 25000 },
                { name: 'Dầu ăn', unit: 'lít', suggestedBuyPrice: 65000, suggestedSellPrice: 75000 },
                { name: 'Nước mắm', unit: 'chai', suggestedBuyPrice: 45000, suggestedSellPrice: 55000 },
                { name: 'Đường trắng', unit: 'kg', suggestedBuyPrice: 25000, suggestedSellPrice: 30000 },
                { name: 'Muối', unit: 'gói', suggestedBuyPrice: 8000, suggestedSellPrice: 12000 }
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
        const validation = Utils.validateForm(formData, ['itemName', 'quantity', 'unit']);

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

            this.clearForm();
            this.loadCurrentItems();
            
            Utils.showToast(`Đã thêm ${newItem.name}`, 'success');
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
            itemName: this.elements.itemName?.value.trim() || '',
            quantity: this.elements.quantity?.value || '',
            unit: this.elements.unit?.value || 'kg',
            buyPrice: this.elements.buyPrice?.value || '',
            sellPrice: this.elements.sellPrice?.value || ''
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

        row.innerHTML = `
            <td class="col-checkbox">
                <input type="checkbox" class="item-checkbox" 
                       ${item.isDone ? 'checked' : ''} 
                       onchange="app.toggleItemCompletion('${item.id}')">
            </td>
            <td class="col-name">
                <strong>${Utils.sanitizeHtml(item.name)}</strong>
            </td>
            <td class="col-unit">
                ${item.quantity} ${item.unit}
            </td>
            <td class="col-price">
                <input type="number" class="price-input" 
                       value="${item.buyPrice || ''}" 
                       placeholder="0"
                       onchange="app.updateItemPrice('${item.id}', 'buyPrice', this.value)"
                       min="0">
            </td>
            <td class="col-price">
                <input type="number" class="price-input" 
                       value="${item.sellPrice || ''}" 
                       placeholder="0"
                       onchange="app.updateItemPrice('${item.id}', 'sellPrice', this.value)"
                       min="0">
            </td>
            <td class="col-total">
                ${Utils.formatCurrency(buyTotal)}
            </td>
            <td class="col-total">
                ${Utils.formatCurrency(sellTotal)}
            </td>
            <td class="col-actions">
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
     * Handle mark all done
     */
    async handleMarkAllDone() {
        if (!this.isSelectionComplete()) return;

        try {
            DataManager.markAllItems(
                this.currentState.selectedHotel,
                this.currentState.selectedDate,
                this.currentState.selectedSection,
                true
            );

            this.loadCurrentItems();
            Utils.showToast('Đã đánh dấu tất cả hoàn thành', 'success');
        } catch (error) {
            console.error('Error marking all done:', error);
            Utils.showToast('Lỗi khi đánh dấu hoàn thành', 'error');
        }
    }

    /**
     * Handle clear completed items
     */
    async handleClearCompleted() {
        if (!this.isSelectionComplete()) return;

        const confirmed = await Utils.showConfirm(
            'Xóa sản phẩm đã hoàn thành',
            'Bạn có chắc chắn muốn xóa tất cả sản phẩm đã hoàn thành?'
        );

        if (!confirmed) return;

        try {
            const deletedCount = DataManager.deleteCompletedItems(
                this.currentState.selectedHotel,
                this.currentState.selectedDate,
                this.currentState.selectedSection
            );

            this.loadCurrentItems();
            Utils.showToast(`Đã xóa ${deletedCount} sản phẩm đã hoàn thành`, 'success');
        } catch (error) {
            console.error('Error clearing completed items:', error);
            Utils.showToast('Lỗi khi xóa sản phẩm đã hoàn thành', 'error');
        }
    }

    /**
     * Update totals in footer
     */
    updateTotals(items) {
        const stats = Utils.calculateStats(items);

        if (this.elements.totalBuyAmount) {
            this.elements.totalBuyAmount.textContent = Utils.formatCurrency(stats.totalBuyAmount);
        }

        if (this.elements.totalSellAmount) {
            this.elements.totalSellAmount.textContent = Utils.formatCurrency(stats.totalSellAmount);
        }

        if (this.elements.itemCount) {
            this.elements.itemCount.textContent = `${stats.totalItems} sản phẩm`;
        }
    }

    /**
     * Update UI based on current state
     */
    updateUI() {
        this.updateSelectionSummary();
        this.updateStepStates();
        this.updateMainInterface();
    }

    /**
     * Update selection summary
     */
    updateSelectionSummary() {
        if (this.elements.summaryDate) {
            const dateText = this.currentState.selectedDate 
                ? `📅 ${Utils.formatDate(this.currentState.selectedDate)}`
                : '📅';
            this.elements.summaryDate.textContent = dateText;
        }

        if (this.elements.summaryHotel) {
            const hotelInfo = this.currentState.selectedHotel 
                ? Utils.getHotelInfo(this.currentState.selectedHotel)
                : { icon: '🏨', name: '' };
            this.elements.summaryHotel.textContent = `${hotelInfo.icon} ${hotelInfo.name}`;
        }

        if (this.elements.summarySection) {
            const sectionInfo = this.currentState.selectedSection 
                ? Utils.getSectionInfo(this.currentState.selectedSection)
                : { icon: '📦', name: '' };
            this.elements.summarySection.textContent = `${sectionInfo.icon} ${sectionInfo.name}`;
        }

        // Update list title
        if (this.elements.listTitle && this.isSelectionComplete()) {
            const sectionInfo = Utils.getSectionInfo(this.currentState.selectedSection);
            const hotelInfo = Utils.getHotelInfo(this.currentState.selectedHotel);
            this.elements.listTitle.textContent = 
                `📝 ${sectionInfo.name} - ${hotelInfo.name} (${Utils.formatDate(this.currentState.selectedDate)})`;
        }
    }

    /**
     * Update step states
     */
    updateStepStates() {
        // Enable/disable steps based on current state
        if (this.currentState.selectedDate) {
            this.enableStep('hotel');
        } else {
            this.disableStep('hotel');
            this.disableStep('section');
        }

        if (this.currentState.selectedHotel) {
            this.enableStep('section');
        } else {
            this.disableStep('section');
        }
    }

    /**
     * Update main interface visibility
     */
    updateMainInterface() {
        const isComplete = this.isSelectionComplete();
        
        // Show/hide current selection summary
        if (this.elements.currentSelection) {
            this.elements.currentSelection.style.display = isComplete ? 'block' : 'none';
        }

        // Show/hide item entry form
        if (this.elements.itemEntry) {
            this.elements.itemEntry.style.display = isComplete ? 'block' : 'none';
        }

        // Show/hide items list
        if (this.elements.itemsList) {
            this.elements.itemsList.style.display = isComplete ? 'block' : 'none';
        }

        // Show/hide FAB
        if (this.elements.fab) {
            this.elements.fab.style.display = isComplete ? 'block' : 'none';
        }

        // Hide selection steps when complete
        if (isComplete) {
            this.hideSelectionSteps();
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
        this.updateHotelCards();
        this.updateSectionCards();
        this.clearForm();
        
        // Show selection steps
        this.showSelectionSteps();
        this.updateUI();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Update hotel cards UI
     */
    updateHotelCards() {
        this.elements.hotelCards.forEach(card => {
            if (card.dataset.hotel === this.currentState.selectedHotel) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    }

    /**
     * Update section cards UI
     */
    updateSectionCards() {
        this.elements.sectionCards.forEach(card => {
            if (card.dataset.section === this.currentState.selectedSection) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
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
     * Scroll to form
     */
    scrollToForm() {
        if (this.elements.itemEntry) {
            this.elements.itemEntry.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
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
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ShoppingApp();
});

// Make functions available for inline onclick handlers
window.app = window.app || {};