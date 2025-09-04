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
        this.elements.itemForm = document.getElementById('itemForm');
        this.elements.itemName = document.getElementById('itemName');
        this.elements.itemPool = document.getElementById('itemPool');
        this.elements.quantity = document.getElementById('quantity');
        this.elements.unit = document.getElementById('unit');
        this.elements.buyPrice = document.getElementById('buyPrice');
        this.elements.sellPrice = document.getElementById('sellPrice');
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

            this.closeAddItemModal();
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
            name: this.elements.itemName?.value.trim() || '',
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
        // Set default quantity to 1
        if (this.elements.quantity) {
            this.elements.quantity.value = '1';
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
        const buyPriceDisplay = item.buyPrice ? Utils.formatPriceInThousands(item.buyPrice) : '0';
        const sellPriceDisplay = item.sellPrice ? Utils.formatPriceInThousands(item.sellPrice) : '0';
        const buyTotalDisplay = Utils.formatPriceInThousands(buyTotal);
        const sellTotalDisplay = Utils.formatPriceInThousands(sellTotal);
        
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
                    buyPrice: Utils.parseNumber(formData.buyPrice),
                    sellPrice: Utils.parseNumber(formData.sellPrice)
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
            buyPrice: this.elements.editBuyPrice?.value || '',
            sellPrice: this.elements.editSellPrice?.value || ''
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
            this.elements.totalBuyAmount.textContent = Utils.formatPriceInThousands(stats.totalBuyAmount);
        }

        if (this.elements.totalSellAmount) {
            this.elements.totalSellAmount.textContent = Utils.formatPriceInThousands(stats.totalSellAmount);
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
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ShoppingApp();
});

// Make functions available for inline onclick handlers
window.app = window.app || {};