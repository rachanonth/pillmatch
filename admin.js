// Admin Interface JavaScript
class PillMatchAdmin {
    constructor() {
        this.pillsData = { ...PILLS_DATABASE };
        this.currentSection = 'pillsList';
        this.editingIndex = null;
        this.brandNames = [];
        
        this.initializeElements();
        this.bindEvents();
        this.loadPillsTable();
        this.populateCategoryFilter();
    }

    initializeElements() {
        // Navigation
        this.viewPillsBtn = document.getElementById('viewPillsBtn');
        this.addPillBtn = document.getElementById('addPillBtn');
        this.exportDataBtn = document.getElementById('exportDataBtn');
        this.importDataBtn = document.getElementById('importDataBtn');

        // Sections
        this.pillsListSection = document.getElementById('pillsListSection');
        this.pillFormSection = document.getElementById('pillFormSection');
        this.dataSection = document.getElementById('dataSection');

        // Table elements
        this.pillsTableBody = document.getElementById('pillsTableBody');
        this.searchPills = document.getElementById('searchPills');
        this.categoryFilter = document.getElementById('categoryFilter');

        // Form elements
        this.pillForm = document.getElementById('pillForm');
        this.formTitle = document.getElementById('formTitle');
        this.editIndex = document.getElementById('editIndex');
        this.genericName = document.getElementById('genericName');
        this.category = document.getElementById('category');
        this.description = document.getElementById('description');
        this.brandNamesList = document.getElementById('brandNamesList');
        this.brandNameInput = document.getElementById('brandNameInput');
        this.addBrandBtn = document.getElementById('addBrandBtn');
        this.closeFormBtn = document.getElementById('closeFormBtn');
        this.cancelBtn = document.getElementById('cancelBtn');

        // Data management
        this.exportBtn = document.getElementById('exportBtn');
        this.importBtn = document.getElementById('importBtn');
        this.importFile = document.getElementById('importFile');
        this.importStatus = document.getElementById('importStatus');

        // Modal
        this.confirmModal = document.getElementById('confirmModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        this.confirmBtn = document.getElementById('confirmBtn');
        this.cancelModalBtn = document.getElementById('cancelModalBtn');
    }

    bindEvents() {
        // Navigation
        this.viewPillsBtn.addEventListener('click', () => this.showSection('pillsList'));
        this.addPillBtn.addEventListener('click', () => this.showAddForm());
        this.exportDataBtn.addEventListener('click', () => this.showSection('data'));
        this.importDataBtn.addEventListener('click', () => this.showSection('data'));

        // Search and filter
        this.searchPills.addEventListener('input', () => this.filterPills());
        this.categoryFilter.addEventListener('change', () => this.filterPills());

        // Form events
        this.pillForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.closeFormBtn.addEventListener('click', () => this.hideForm());
        this.cancelBtn.addEventListener('click', () => this.hideForm());
        this.addBrandBtn.addEventListener('click', () => this.addBrandName());
        this.brandNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addBrandName();
            }
        });

        // Data management
        this.exportBtn.addEventListener('click', () => this.exportData());
        this.importBtn.addEventListener('click', () => this.importFile.click());
        this.importFile.addEventListener('change', (e) => this.handleImport(e));

        // Modal events
        this.confirmBtn.addEventListener('click', () => this.handleConfirm());
        this.cancelModalBtn.addEventListener('click', () => this.hideModal());
        this.confirmModal.addEventListener('click', (e) => {
            if (e.target === this.confirmModal) this.hideModal();
        });
    }

    showSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        
        // Hide all sections
        this.pillsListSection.style.display = 'none';
        this.pillFormSection.style.display = 'none';
        this.dataSection.style.display = 'none';

        // Show selected section
        switch(section) {
            case 'pillsList':
                this.viewPillsBtn.classList.add('active');
                this.pillsListSection.style.display = 'block';
                break;
            case 'data':
                this.exportDataBtn.classList.add('active');
                this.dataSection.style.display = 'block';
                break;
        }
        
        this.currentSection = section;
    }

    loadPillsTable() {
        this.pillsTableBody.innerHTML = '';
        
        Object.entries(this.pillsData).forEach(([genericName, pillData], index) => {
            const row = this.createPillRow(genericName, pillData, index);
            this.pillsTableBody.appendChild(row);
        });
    }

    createPillRow(genericName, pillData, index) {
        const row = document.createElement('tr');
        
        // Brand names preview (first 3)
        const brandPreview = pillData.brandNames.slice(0, 3).map(brand => 
            `<span class="brand-tag">${brand}</span>`
        ).join('');
        const brandCount = pillData.brandNames.length > 3 ? 
            `<span class="brand-tag">+${pillData.brandNames.length - 3} more</span>` : '';

        // Groups preview (first 4)
        const groupsPreview = pillData.suitableGroups.slice(0, 4).map(group => 
            `<span class="group-tag">${group}</span>`
        ).join('');
        const groupCount = pillData.suitableGroups.length > 4 ? 
            `<span class="group-tag">+${pillData.suitableGroups.length - 4} more</span>` : '';

        row.innerHTML = `
            <td class="generic-name">${genericName}</td>
            <td><span class="category-badge">${pillData.category}</span></td>
            <td class="brand-names-cell">
                <div class="brand-names-preview">
                    ${brandPreview}${brandCount}
                </div>
            </td>
            <td class="groups-cell">
                <div class="groups-preview">
                    ${groupsPreview}${groupCount}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="admin.editPill(${index})">Edit</button>
                    <button class="btn btn-delete" onclick="admin.deletePill(${index})">Delete</button>
                </div>
            </td>
        `;
        
        return row;
    }

    populateCategoryFilter() {
        const categories = new Set();
        Object.values(this.pillsData).forEach(pill => categories.add(pill.category));
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = PILL_CATEGORIES[category] || category;
            this.categoryFilter.appendChild(option);
        });
    }

    filterPills() {
        const searchTerm = this.searchPills.value.toLowerCase();
        const selectedCategory = this.categoryFilter.value;
        
        const filteredPills = Object.entries(this.pillsData).filter(([genericName, pillData]) => {
            const matchesSearch = genericName.toLowerCase().includes(searchTerm) ||
                                pillData.brandNames.some(brand => brand.toLowerCase().includes(searchTerm)) ||
                                pillData.description.toLowerCase().includes(searchTerm);
            
            const matchesCategory = selectedCategory === 'all' || pillData.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });

        this.pillsTableBody.innerHTML = '';
        filteredPills.forEach(([genericName, pillData], index) => {
            const originalIndex = Object.keys(this.pillsData).indexOf(genericName);
            const row = this.createPillRow(genericName, pillData, originalIndex);
            this.pillsTableBody.appendChild(row);
        });
    }

    showAddForm() {
        this.editingIndex = null;
        this.formTitle.textContent = 'Add New Pill';
        this.editIndex.value = '';
        this.pillForm.reset();
        this.brandNames = [];
        this.updateBrandNamesList();
        this.clearGroupCheckboxes();
        
        this.pillsListSection.style.display = 'none';
        this.pillFormSection.style.display = 'block';
        
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        this.addPillBtn.classList.add('active');
    }

    editPill(index) {
        const genericNames = Object.keys(this.pillsData);
        const genericName = genericNames[index];
        const pillData = this.pillsData[genericName];
        
        this.editingIndex = index;
        this.formTitle.textContent = 'Edit Pill';
        this.editIndex.value = index;
        
        // Populate form
        this.genericName.value = genericName;
        this.category.value = pillData.category;
        this.description.value = pillData.description;
        this.brandNames = [...pillData.brandNames];
        this.updateBrandNamesList();
        
        // Check appropriate group checkboxes
        this.clearGroupCheckboxes();
        pillData.suitableGroups.forEach(group => {
            const checkbox = document.querySelector(`input[name="groups"][value="${group}"]`);
            if (checkbox) checkbox.checked = true;
        });
        
        this.pillsListSection.style.display = 'none';
        this.pillFormSection.style.display = 'block';
        
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        this.addPillBtn.classList.add('active');
    }

    addBrandName() {
        const brandName = this.brandNameInput.value.trim();
        if (brandName && !this.brandNames.includes(brandName)) {
            this.brandNames.push(brandName);
            this.updateBrandNamesList();
            this.brandNameInput.value = '';
        }
    }

    updateBrandNamesList() {
        this.brandNamesList.innerHTML = '';
        this.brandNames.forEach((brand, index) => {
            const tag = document.createElement('div');
            tag.className = 'brand-name-tag';
            tag.innerHTML = `
                ${brand}
                <button type="button" class="remove-brand" onclick="admin.removeBrandName(${index})">×</button>
            `;
            this.brandNamesList.appendChild(tag);
        });
    }

    removeBrandName(index) {
        this.brandNames.splice(index, 1);
        this.updateBrandNamesList();
    }

    clearGroupCheckboxes() {
        document.querySelectorAll('input[name="groups"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        const formData = this.getFormData();
        
        if (this.editingIndex !== null) {
            this.updatePill(formData);
        } else {
            this.addPill(formData);
        }
        
        this.hideForm();
        this.loadPillsTable();
    }

    validateForm() {
        const genericName = this.genericName.value.trim();
        const category = this.category.value;
        const description = this.description.value.trim();
        const selectedGroups = document.querySelectorAll('input[name="groups"]:checked');
        
        if (!genericName) {
            alert('Please enter a generic name');
            return false;
        }
        
        if (!category) {
            alert('Please select a category');
            return false;
        }
        
        if (!description) {
            alert('Please enter a description');
            return false;
        }
        
        if (this.brandNames.length === 0) {
            alert('Please add at least one brand name');
            return false;
        }
        
        if (selectedGroups.length === 0) {
            alert('Please select at least one suitable group');
            return false;
        }
        
        // Check for duplicate generic name (when adding new)
        if (this.editingIndex === null && this.pillsData[genericName]) {
            alert('A pill with this generic name already exists');
            return false;
        }
        
        return true;
    }

    getFormData() {
        const selectedGroups = Array.from(document.querySelectorAll('input[name="groups"]:checked'))
            .map(checkbox => checkbox.value);
        
        return {
            genericName: this.genericName.value.trim(),
            category: this.category.value,
            description: this.description.value.trim(),
            brandNames: [...this.brandNames],
            suitableGroups: selectedGroups
        };
    }

    addPill(formData) {
        this.pillsData[formData.genericName] = {
            brandNames: formData.brandNames,
            suitableGroups: formData.suitableGroups,
            category: formData.category,
            description: formData.description
        };
        
        // Update global database
        window.PILLS_DATABASE = { ...this.pillsData };
        
        alert('Pill added successfully!');
    }

    updatePill(formData) {
        const genericNames = Object.keys(this.pillsData);
        const oldGenericName = genericNames[this.editingIndex];
        
        // Remove old entry and add new one
        delete this.pillsData[oldGenericName];
        this.pillsData[formData.genericName] = {
            brandNames: formData.brandNames,
            suitableGroups: formData.suitableGroups,
            category: formData.category,
            description: formData.description
        };
        
        // Update global database
        window.PILLS_DATABASE = { ...this.pillsData };
        
        alert('Pill updated successfully!');
    }

    deletePill(index) {
        const genericNames = Object.keys(this.pillsData);
        const genericName = genericNames[index];
        
        this.showConfirmModal(
            'Delete Pill',
            `Are you sure you want to delete "${genericName}"? This action cannot be undone.`,
            () => {
                delete this.pillsData[genericName];
                window.PILLS_DATABASE = { ...this.pillsData };
                this.loadPillsTable();
                this.hideModal();
                alert('Pill deleted successfully!');
            }
        );
    }

    hideForm() {
        this.pillFormSection.style.display = 'none';
        this.pillsListSection.style.display = 'block';
        this.pillForm.reset();
        this.brandNames = [];
        this.updateBrandNamesList();
        this.clearGroupCheckboxes();
        
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        this.viewPillsBtn.classList.add('active');
    }

    exportData() {
        const dataStr = JSON.stringify(this.pillsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'pillmatch-database.json';
        link.click();
        
        alert('Database exported successfully!');
    }

    handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                
                // Validate imported data structure
                if (this.validateImportedData(importedData)) {
                    this.pillsData = importedData;
                    window.PILLS_DATABASE = { ...this.pillsData };
                    this.loadPillsTable();
                    this.populateCategoryFilter();
                    
                    this.importStatus.textContent = 'Database imported successfully!';
                    this.importStatus.className = 'import-status success';
                } else {
                    throw new Error('Invalid data structure');
                }
            } catch (error) {
                this.importStatus.textContent = 'Error: Invalid JSON file or data structure';
                this.importStatus.className = 'import-status error';
            }
        };
        
        reader.readAsText(file);
        e.target.value = ''; // Reset file input
    }

    validateImportedData(data) {
        if (typeof data !== 'object' || data === null) return false;
        
        for (const [genericName, pillData] of Object.entries(data)) {
            if (typeof genericName !== 'string' || genericName.trim() === '') return false;
            if (typeof pillData !== 'object' || pillData === null) return false;
            if (!Array.isArray(pillData.brandNames)) return false;
            if (!Array.isArray(pillData.suitableGroups)) return false;
            if (typeof pillData.category !== 'string') return false;
            if (typeof pillData.description !== 'string') return false;
        }
        
        return true;
    }

    showConfirmModal(title, message, onConfirm) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.confirmBtn.onclick = onConfirm;
        this.confirmModal.style.display = 'flex';
    }

    hideModal() {
        this.confirmModal.style.display = 'none';
    }

    handleConfirm() {
        // This will be set by showConfirmModal
        // The actual confirmation logic is passed as a parameter
    }
}

// Initialize admin interface
const admin = new PillMatchAdmin();

// Make admin globally available for onclick handlers
window.admin = admin; 