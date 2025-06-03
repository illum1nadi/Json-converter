const fs = require('fs');

//for deciding the typography of the toggle component based on the Figma JSON input. No color option in figma as of now.
class ToggleTransformer {
  // Typography mappings based on your specifications
  typographyMappings = {
    // Text variants
    '10': { variant: 'text-xxxs' },
    '11': { variant: 'text-xxs' },
    '12': { variant: 'text-xs' },
    '14': { variant: 'text-sm' },
    '16': { variant: 'text-md' },
    '18': { variant: 'text-lg' },
    '20': { variant: 'text-xl' },
    
    // Display variants
    '24': { variant: 'display-xs' },
    '30': { variant: 'display-sm' },
    '44': { variant: 'display-md' },
    '48': { variant: 'display-lg' },
    '60': { variant: 'display-xl' },
    '72': { variant: 'display-2xl' },

    // Font weights
    '300': { weight: 'light' },
    '400': { weight: 'regular' },
    '500': { weight: 'medium' },
    '600': { weight: 'semi-bold' },
    '700': { weight: 'bold' }
  };

  colorMappings = {
    'brand': { color: 'text-brand-medium' },
    'warning': { color: 'text-warning-secondary' },
    'secondary': { color: 'text-secondary' }
  };

  transform(figmaJson) {
    const componentProps = figmaJson.componentProperties || {};
    const children = figmaJson.children || [];
    const textContent = this.extractTextContent(children);
    const textStyles = this.extractTextStyles(children);
    
    const id = `b_${this.generateRandomId()}`;
    
    return {
      component: {
        componentType: "Toggle",
        appearance: {
          size: componentProps.Size?.value?.toLowerCase() || 'md',
          color: "brand" 
        },
        content: {
          label: textContent.mainText || "New Toggle",
          description: textContent.supportingText || "",
          addOns: {
            label: {
              variant: textStyles.label?.variant || 'text-md',
              weight: textStyles.label?.weight || 'medium', // Default to medium (500) as per your Figma style
              color: textStyles.label?.color || 'text-brand-medium'
            },
            description: {
              variant: textStyles.description?.variant || 'text-sm',
              weight: textStyles.description?.weight || 'regular',
              color: textStyles.description?.color || 'text-secondary'
            }
          }
        }
      },
      visibility: {
        value: true
      },
      dpOn: [],
      displayName: figmaJson.name || "Toggle_1",
      dataSourceIds: [],
      id: id,
      parentId: "root_id"
    };
  }

  extractTextContent(children) {
    const result = { mainText: "", supportingText: "" };
    
    for (const child of children) {
      if (child.name === "Text and supporting text" && child.children) {
        for (const textChild of child.children) {
          if (textChild.name === "Text" && textChild.characters) {
            result.mainText = textChild.characters;
          } else if (textChild.name === "Supporting text" && textChild.characters) {
            result.supportingText = textChild.characters;
          }
        }
      }
    }
    
    return result;
  }

  extractTextStyles(children) {
    const result = { label: {}, description: {} };
    
    for (const child of children) {
      if (child.name === "Text and supporting text" && child.children) {
        for (const textChild of child.children) {
          if (textChild.style) {
            const style = textChild.style;
            const fontSize = Math.round(style.fontSize).toString();
            const fontWeight = style.fontWeight || 500; // Default to medium (500)
            
            const variantMatch = this.typographyMappings[fontSize]?.variant;
            const weightMatch = this.typographyMappings[fontWeight.toString()]?.weight;
            
            if (textChild.name === "Text") {
              result.label = {
                variant: variantMatch || 'text-md', // Default to medium if no match
                weight: weightMatch || 'medium',   // Default to medium if no match
                color: this.determineColor(style.fills)
              };
            } else if (textChild.name === "Supporting text") {
              result.description = {
                variant: variantMatch || 'text-sm', // Default to small if no match
                weight: weightMatch || 'regular',   // Default to regular if no match
                color: this.determineColor(style.fills)
              };
            }
          }
        }
      }
    }
    
    return result;
  }

  determineColor(fills) {
    if (!fills || !fills.length) return 'text-brand-medium';
    
    // Extract the hex color from Figma fills
    const fill = fills[0];
    if (fill.color) {
      const hex = this.rgbToHex(fill.color.r, fill.color.g, fill.color.b);
      
      // Check if this matches any of our known colors
      if (hex === '#4E1D09') return 'text-warning-secondary';
      // Add more color checks as needed
    }
    
    return 'text-brand-medium';
  }

  rgbToHex(r, g, b) {
    return '#' + [r, g, b]
      .map(x => Math.round(x * 255).toString(16).padStart(2, '0')
      .join('').toUpperCase());
  }

  generateRandomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

// Read the input file
const inputJson = JSON.parse(fs.readFileSync('figma-toggle.json', 'utf-8'));

// Transform the component
const transformer = new ToggleTransformer();
const outputJson = transformer.transform(inputJson);

// Write the output to a new file
fs.writeFileSync('transformed-toggle.json', JSON.stringify(outputJson, null, 2));

console.log('Transformation complete. Output written to transformed-toggle.json');