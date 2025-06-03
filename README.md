# Mapping: Figma Design → No-Code Component Configuration

This document outlines the key mappings between the Figma design specification (`toggle-2.json`) and the no-code component configuration (`toggle_components.json`).

---

## Component Property Mappings

### **Size Configuration**
- **Figma**:  
  `componentProperties.Size.value`: `"sm"`  
- **Component**:  
  `appearance.size`: `"sm"`

---

### **Label Text and Position**
- **Figma**:  
  `componentProperties["Label Position"].value`: `"Left"`  
  Text content: `"Remember me"` (nested text element)  
- **Component**:  
  `appearance.labelPosition`: `"left"`  
  `content.label`: `"Control Visibility"`

---

### **Supporting Text / Description**
- **Figma**:  
  Supporting text element: `"Save my login details for next time."`  
- **Component**:  
  `content.description`: `"Select conditions to control visibility of this field"`

---

## Styling Mappings

### **Layout and Spacing**
- **Figma**:  
  `itemSpacing`: `12` (horizontal spacing between label and toggle)  
- **Component**:  
  `styles.padding.all`: `"p-md"` (overall component padding)

---

### **Visual Appearance**
- **Figma**:  
  - Background color variables for toggle states  
  - `cornerRadius`: `9999` (fully rounded)  
- **Component**:  
  - `styles.backgroundColor`: `"bg-subtle"`  
  - `styles.borderRadius`: `"rounded-full"`  
  - `styles.width`: `"w-fit"`

---

> **Note**: Checked it on the website by changing the hierarchical file and posting it to the website by updating the version number.
