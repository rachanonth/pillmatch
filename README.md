# PillMatch - Contraceptive Selection Tool

A modern web application for calculating BMI and determining user groups for contraceptive selection recommendations based on both age and BMI, with dynamic pill recommendations.

## Features

- **Age Assessment**: Age grouping for contraceptive recommendations
- **BMI Calculation**: Accurate BMI calculation using weight (kg) and height (cm)
- **Combined Results**: Final result combining age group and BMI group
- **Dynamic Pill Recommendations**: Personalized contraceptive pill suggestions based on user's group
- **Pill Filtering**: Filter pills by category (Combined, Progestin-only, Extended cycle, etc.)
- **Brand Name Toggle**: Show/hide brand names for privacy or preference
- **Health Conditions Override**: Users with health conditions are automatically assigned to BMI Group 4
- **Modern UI**: Clean, responsive design with beautiful gradients and animations
- **Real-time Validation**: Input validation with visual feedback
- **Accessibility**: Keyboard shortcuts and screen reader friendly

## Age Groups

| Group | Age Range | Category |
|-------|-----------|----------|
| Young | < 19 years | Young |
| Adult | 19 - 40 years | Adult |
| Mature | > 40 years | Mature |

## BMI Groups

| Group | BMI Range | Category |
|-------|-----------|----------|
| Group 1 | < 18.5 | Underweight |
| Group 2 | 18.5 - 25 | Normal weight |
| Group 3 | 25 - 30 | Overweight |
| Group 4 | > 30 | Obese |

**Note**: Users with health conditions are automatically assigned to BMI Group 4 regardless of their calculated BMI.

## Final Results

The application combines age group and BMI group to provide a comprehensive result:
- **Format**: `[Age Group] - BMI Group [Number]`
- **Examples**: 
  - "Adult - BMI Group 2" (Adult age group with normal BMI)
  - "Young - BMI Group 4" (Young age group with obese BMI or health conditions)
  - "Mature - BMI Group 1" (Mature age group with underweight BMI)

## Pill Recommendations

### Pill Categories
- **Combined Oral Contraceptives**: Estrogen + Progestin pills
- **Progestin-Only Pills**: Mini-pills (no estrogen)
- **Extended Cycle Pills**: Reduce periods to 4 times per year
- **Low-Dose Combined Pills**: Lower estrogen content for mature women
- **Emergency Contraception**: For emergency use only

### Pill Data Structure
Each pill includes:
- **Generic Name**: Active ingredients
- **Brand Names**: Available brand versions
- **Suitable Groups**: Age-BMI combinations where the pill is recommended
- **Category**: Type of contraceptive
- **Description**: Brief explanation of the pill

### Filtering Options
- **Category Filter**: Filter pills by contraceptive type
- **Brand Name Toggle**: Show/hide brand names for privacy
- **Dynamic Display**: Only shows pills suitable for user's specific group

## Usage

1. Open `index.html` in a web browser
2. Enter your age in years
3. Enter your weight in kilograms
4. Enter your height in centimeters
5. Check the box if you have health conditions (optional)
6. Click "Calculate BMI & Group" to see your results
7. Review your personalized pill recommendations
8. Use filters to narrow down options by category
9. Toggle brand names on/off as needed
10. Use "Calculate Again" to reset and start over

## Input Validation

- **Age**: 13-100 years
- **Weight**: 20-300 kg
- **Height**: 100-250 cm
- All inputs must be positive numbers

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: Submit form
- `Escape`: Reset form

## Technical Details

### BMI Formula
```
BMI = weight (kg) / height (m)²
```

### Age Group Logic
- Young: 13-19 years
- Adult: 19-40 years  
- Mature: 40+ years

### Result Generation
The final result combines both age and BMI considerations:
1. Determine age group based on age
2. Calculate BMI and determine BMI group
3. Apply health conditions override if applicable
4. Combine age group and BMI group for final result
5. Filter pills database for suitable options

### Pill Matching Logic
- Matches user's combined group (e.g., "Adult - BMI Group 2") against pill database
- Shows only pills where user's group is in the `suitableGroups` array
- Progestin-only pills are available for all groups (including high BMI)
- Combined pills have restrictions for high BMI and mature age groups

### Browser Compatibility
- Modern browsers with ES6+ support
- Responsive design for mobile and desktop

## File Structure

```
pillmatch/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript logic
├── pills-data.js       # Pill database and categories
└── README.md           # This file
```

## Development

The application is built with vanilla HTML, CSS, and JavaScript. No build process or dependencies are required.

### Key Components

- **PillMatchCalculator Class**: Handles all BMI and age calculations and grouping logic
- **PillsDisplay Class**: Manages pill recommendations, filtering, and display
- **PILLS_DATABASE**: Comprehensive database of contraceptive pills with suitability data
- **Age Group Logic**: Determines age group based on age ranges
- **Combined Results**: Generates final result combining age and BMI groups
- **Dynamic Filtering**: Real-time pill filtering by category and brand display
- **Form Validation**: Real-time input validation with visual feedback
- **Results Display**: Dynamic results display with group-specific styling
- **Responsive Design**: Mobile-first approach with modern CSS

### Pill Database Structure
```javascript
{
    "Generic Name": {
        brandNames: ["Brand1", "Brand2", ...],
        suitableGroups: ["Young - BMI Group 1", "Adult - BMI Group 2", ...],
        category: "Combined Oral Contraceptive",
        description: "Description of the pill"
    }
}
```

## Future Enhancements

- Integration with contraceptive recommendation database
- User profile management
- Medical history tracking
- Multi-language support
- Offline functionality
- Detailed contraceptive recommendations based on combined groups
- Side effects and contraindications information
- Cost comparison and insurance coverage
- User reviews and ratings
- Integration with pharmacy locators

## Medical Disclaimer

This tool provides general information about contraceptive options based on age and BMI groups. It is not a substitute for professional medical advice. Always consult with a healthcare provider for personalized contraceptive recommendations, especially if you have health conditions or concerns.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 