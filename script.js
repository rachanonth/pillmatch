// DOM elements
const bmiForm = document.getElementById('bmiForm');
const resultsContainer = document.getElementById('results');
const ageValue = document.getElementById('ageValue');
const ageGroup = document.getElementById('ageGroup');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const bmiGroup = document.getElementById('bmiGroup');
const finalResult = document.getElementById('finalResult');
const resetBtn = document.getElementById('resetBtn');

// Pills display elements
const pillsContainer = document.getElementById('pillsContainer');
const noPillsMessage = document.getElementById('noPillsMessage');
const categoryFilter = document.getElementById('categoryFilter');
const showBrandNames = document.getElementById('showBrandNames');

// Group info toggle elements
const toggleGroupInfo = document.getElementById('toggleGroupInfo');
const groupInfo = document.getElementById('groupInfo');
const toggleText = document.querySelector('.toggle-text');
const toggleIcon = document.querySelector('.toggle-icon');

// BMI and Age calculation and grouping logic
class PillMatchCalculator {
    constructor() {
        this.bmiGroups = {
            underweight: { min: 0, max: 18.5, name: 'Underweight', group: 1 },
            normal: { min: 18.5, max: 25, name: 'Normal weight', group: 2 },
            overweight: { min: 25, max: 30, name: 'Overweight', group: 3 },
            obese: { min: 30, max: Infinity, name: 'Obese', group: 4 }
        };

        this.ageGroups = {
            young: { min: 13, max: 19, name: 'Young', group: 'Young' },
            adult: { min: 19, max: 40, name: 'Adult', group: 'Adult' },
            mature: { min: 40, max: 100, name: 'Mature', group: 'Mature' }
        };
    }

    // Calculate BMI using weight (kg) and height (cm)
    calculateBMI(weight, height) {
        if (weight <= 0 || height <= 0) {
            throw new Error('Weight and height must be positive numbers');
        }
        
        // Convert height from cm to meters
        const heightInMeters = height / 100;
        
        // BMI formula: weight (kg) / height (m)²
        const bmi = weight / (heightInMeters * heightInMeters);
        
        return Math.round(bmi * 10) / 10; // Round to 1 decimal place
    }

    // Get BMI category based on calculated BMI
    getBMICategory(bmi) {
        for (const [key, group] of Object.entries(this.bmiGroups)) {
            if (bmi >= group.min && bmi < group.max) {
                return {
                    name: group.name,
                    group: group.group,
                    key: key
                };
            }
        }
        
        // Fallback for very high BMI values
        return {
            name: this.bmiGroups.obese.name,
            group: this.bmiGroups.obese.group,
            key: 'obese'
        };
    }

    // Get age group based on age
    getAgeGroup(age) {
        for (const [key, group] of Object.entries(this.ageGroups)) {
            if (age >= group.min && age < group.max) {
                return {
                    name: group.name,
                    group: group.group,
                    key: key
                };
            }
        }
        
        // Fallback for very high age values
        return {
            name: this.ageGroups.mature.name,
            group: this.ageGroups.mature.group,
            key: 'mature'
        };
    }

    // Determine final BMI group considering health conditions
    getFinalBMIGroup(bmi, hasHealthConditions) {
        const bmiCategory = this.getBMICategory(bmi);
        
        // If user has health conditions, they are automatically assigned to Group 4
        if (hasHealthConditions) {
            return {
                group: 4,
                name: 'Group 4',
                reason: 'Health conditions override - assigned to Group 4',
                originalGroup: bmiCategory.group,
                originalCategory: bmiCategory.name
            };
        }
        
        return {
            group: bmiCategory.group,
            name: `Group ${bmiCategory.group}`,
            reason: `Based on BMI category: ${bmiCategory.name}`,
            originalGroup: bmiCategory.group,
            originalCategory: bmiCategory.name
        };
    }

    // Generate final result combining age group and BMI group
    getFinalResult(ageGroupInfo, bmiGroupInfo) {
        const ageGroup = ageGroupInfo.group;
        const bmiGroup = bmiGroupInfo.group;
        
        // Create a combined result string
        const result = `${ageGroup} - BMI Group ${bmiGroup}`;
        
        return {
            result: result,
            ageGroup: ageGroupInfo,
            bmiGroup: bmiGroupInfo,
            description: `${ageGroupInfo.name} age group with ${bmiGroupInfo.name} BMI category`
        };
    }

    // Validate input values
    validateInputs(age, weight, height) {
        const errors = [];
        
        if (!age || age <= 0) {
            errors.push('Age must be a positive number');
        }
        
        if (!weight || weight <= 0) {
            errors.push('Weight must be a positive number');
        }
        
        if (!height || height <= 0) {
            errors.push('Height must be a positive number');
        }
        
        if (age < 13 || age > 100) {
            errors.push('Age should be between 13 and 100 years');
        }
        
        if (weight < 20 || weight > 300) {
            errors.push('Weight should be between 20 and 300 kg');
        }
        
        if (height < 100 || height > 250) {
            errors.push('Height should be between 100 and 250 cm');
        }
        
        return errors;
    }
}

// Pills display and filtering logic
class PillsDisplay {
    constructor() {
        this.currentPills = [];
        this.filteredPills = [];
        this.currentCategory = 'all';
        this.showBrands = true;
    }

    // Get pills suitable for the user's group
    getSuitablePills(userGroup) {
        const suitablePills = [];
        
        for (const [genericName, pillData] of Object.entries(PILLS_DATABASE)) {
            if (pillData.suitableGroups.includes(userGroup)) {
                suitablePills.push({
                    genericName: genericName,
                    ...pillData
                });
            }
        }
        
        return suitablePills;
    }

    // Display pills in the container
    displayPills(pills, userGroup) {
        this.currentPills = pills;
        this.filteredPills = [...pills];
        
        // Populate category filter
        this.populateCategoryFilter();
        
        // Display pills
        this.renderPills();
        
        // Show/hide no pills message
        if (pills.length === 0) {
            pillsContainer.style.display = 'none';
            noPillsMessage.style.display = 'block';
        } else {
            pillsContainer.style.display = 'grid';
            noPillsMessage.style.display = 'none';
        }
    }

    // Populate category filter dropdown
    populateCategoryFilter() {
        const categories = new Set();
        categories.add('all');
        
        this.currentPills.forEach(pill => {
            categories.add(pill.category);
        });
        
        // Clear existing options except "All Categories"
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        // Add category options
        categories.forEach(category => {
            if (category !== 'all') {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = PILL_CATEGORIES[category] || category;
                categoryFilter.appendChild(option);
            }
        });
    }

    // Filter pills by category
    filterByCategory(category) {
        this.currentCategory = category;
        
        if (category === 'all') {
            this.filteredPills = [...this.currentPills];
        } else {
            this.filteredPills = this.currentPills.filter(pill => pill.category === category);
        }
        
        this.renderPills();
    }

    // Toggle brand names display
    toggleBrandNames(show) {
        this.showBrands = show;
        this.renderPills();
    }

    // Render pills in the container
    renderPills() {
        pillsContainer.innerHTML = '';
        
        this.filteredPills.forEach(pill => {
            const pillCard = this.createPillCard(pill);
            pillsContainer.appendChild(pillCard);
        });
    }

    // Create individual pill card
    createPillCard(pill) {
        const card = document.createElement('div');
        card.className = 'pill-card';
        
        const categoryDisplay = PILL_CATEGORIES[pill.category] || pill.category;
        
        card.innerHTML = `
            <div class="pill-header">
                <div>
                    <div class="pill-name">${pill.genericName}</div>
                </div>
                <span class="pill-category">${pill.category}</span>
            </div>
            <div class="pill-description">${pill.description}</div>
            <div class="pill-brands">
                <div class="pill-brands-title">Brand Names:</div>
                ${this.showBrands ? 
                    `<div class="pill-brands-list">
                        ${pill.brandNames.map(brand => `<span class="pill-brand">${brand}</span>`).join('')}
                    </div>` : 
                    `<div class="pill-brands-hidden">Brand names hidden (${pill.brandNames.length} available)</div>`
                }
            </div>
        `;
        
        return card;
    }

    // Clear pills display
    clear() {
        this.currentPills = [];
        this.filteredPills = [];
        pillsContainer.innerHTML = '';
        pillsContainer.style.display = 'none';
        noPillsMessage.style.display = 'none';
    }
}

// Initialize calculator and pills display
const calculator = new PillMatchCalculator();
const pillsDisplay = new PillsDisplay();

// Form submission handler
bmiForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const age = parseInt(document.getElementById('age').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const hasHealthConditions = document.getElementById('healthConditions').checked;
    
    // Validate inputs
    const validationErrors = calculator.validateInputs(age, weight, height);
    
    if (validationErrors.length > 0) {
        alert('Please correct the following errors:\n' + validationErrors.join('\n'));
        return;
    }
    
    try {
        // Get age group
        const ageGroupInfo = calculator.getAgeGroup(age);
        
        // Calculate BMI
        const bmi = calculator.calculateBMI(weight, height);
        
        // Get BMI category
        const bmiCategoryInfo = calculator.getBMICategory(bmi);
        
        // Get final BMI group
        const finalBMIGroupInfo = calculator.getFinalBMIGroup(bmi, hasHealthConditions);
        
        // Get final result combining age and BMI
        const finalResultInfo = calculator.getFinalResult(ageGroupInfo, finalBMIGroupInfo);
        
        // Display results
        displayResults(age, ageGroupInfo, bmi, bmiCategoryInfo, finalBMIGroupInfo, finalResultInfo);
        
        // Get and display suitable pills
        const suitablePills = pillsDisplay.getSuitablePills(finalResultInfo.result);
        pillsDisplay.displayPills(suitablePills, finalResultInfo.result);
        
        // Show results container
        resultsContainer.style.display = 'block';
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        alert('Error calculating results: ' + error.message);
    }
});

// Display results function
function displayResults(age, ageGroupInfo, bmi, bmiCategoryInfo, bmiGroupInfo, finalResultInfo) {
    // Display age and age group
    ageValue.textContent = age + ' years';
    ageGroup.textContent = ageGroupInfo.name;
    ageGroup.className = 'result-value age-badge age-' + ageGroupInfo.key;
    
    // Display BMI value and category
    bmiValue.textContent = bmi;
    bmiCategory.textContent = bmiCategoryInfo.name;
    
    // Display BMI group
    bmiGroup.textContent = bmiGroupInfo.name;
    bmiGroup.className = 'result-value group-badge group-' + bmiGroupInfo.group;
    
    // Display final result
    finalResult.textContent = finalResultInfo.result;
    finalResult.className = 'result-value final-badge';
    
    // Add tooltip with detailed information
    let tooltipText = finalResultInfo.description;
    if (bmiGroupInfo.reason.includes('Health conditions override')) {
        tooltipText += `\nNote: ${bmiGroupInfo.reason}`;
    }
    finalResult.title = tooltipText;
}

// Group info toggle handler
toggleGroupInfo.addEventListener('click', function() {
    const isVisible = groupInfo.style.display !== 'none';
    
    if (isVisible) {
        // Hide group info
        groupInfo.style.display = 'none';
        toggleText.textContent = 'Show Group Information';
        toggleIcon.textContent = '▼';
        toggleGroupInfo.classList.remove('active');
    } else {
        // Show group info
        groupInfo.style.display = 'block';
        toggleText.textContent = 'Hide Group Information';
        toggleIcon.textContent = '▲';
        toggleGroupInfo.classList.add('active');
    }
});

// Pills filtering and display controls
categoryFilter.addEventListener('change', function() {
    pillsDisplay.filterByCategory(this.value);
});

showBrandNames.addEventListener('change', function() {
    pillsDisplay.toggleBrandNames(this.checked);
});

// Reset button handler
resetBtn.addEventListener('click', function() {
    // Hide results
    resultsContainer.style.display = 'none';
    
    // Reset form
    bmiForm.reset();
    
    // Clear any previous results
    ageValue.textContent = '';
    ageGroup.textContent = '';
    ageGroup.className = 'result-value age-badge';
    bmiValue.textContent = '';
    bmiCategory.textContent = '';
    bmiGroup.textContent = '';
    bmiGroup.className = 'result-value group-badge';
    finalResult.textContent = '';
    finalResult.className = 'result-value final-badge';
    
    // Clear pills display
    pillsDisplay.clear();
    
    // Reset controls
    categoryFilter.value = 'all';
    showBrandNames.checked = true;
    
    // Reset group info toggle
    groupInfo.style.display = 'none';
    toggleText.textContent = 'Show Group Information';
    toggleIcon.textContent = '▼';
    toggleGroupInfo.classList.remove('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Real-time validation for input fields
function setupInputValidation() {
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    
    function validateField(input, min, max, fieldName) {
        const value = parseFloat(input.value);
        
        if (input.value && (value < min || value > max)) {
            input.style.borderColor = '#e53e3e';
            input.style.backgroundColor = '#fed7d7';
        } else {
            input.style.borderColor = '#e2e8f0';
            input.style.backgroundColor = '#f7fafc';
        }
    }
    
    ageInput.addEventListener('input', function() {
        validateField(this, 13, 100, 'age');
    });
    
    weightInput.addEventListener('input', function() {
        validateField(this, 20, 300, 'weight');
    });
    
    heightInput.addEventListener('input', function() {
        validateField(this, 100, 250, 'height');
    });
}

// Initialize input validation
setupInputValidation();

// Add some helpful features
document.addEventListener('DOMContentLoaded', function() {
    // Focus on first input field
    document.getElementById('age').focus();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (bmiForm.checkValidity()) {
                bmiForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to reset
        if (e.key === 'Escape') {
            resetBtn.click();
        }
    });
});

// Export calculator for potential future use
window.PillMatchCalculator = PillMatchCalculator;
window.PillsDisplay = PillsDisplay; 