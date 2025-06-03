const fs = require('fs');

class ToggleTransformer {
  transform(figmaJson) {
    //Extracting all the necessary properties from the curled Figma JSON.
    const componentProps = figmaJson.componentProperties || {};
    const children = figmaJson.children || [];
    const textContent = this.extractTextContent(children);
    
    //Generate a random unique ID, which is a field, have to replace it with logic used on our website.
    const id = `b_${this.generateRandomId()}`;
    
    //Build the component structure to match no code json format.
    return {
      component: {
        componentType: "Toggle",
        appearance: {
          size: componentProps.Size?.value?.toLowerCase() || 'md',
          color: "brand" 
        },
        content: {
          label: textContent.mainText || "New Toggle",
          description: textContent.supportingText || ""
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

  //Setting the text add ons on our website, using the text and supporting text from Figma JSON.
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
  //Id generation logic, not necessary.
  generateRandomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

//Read the input file
const inputJson = JSON.parse(fs.readFileSync('toggle-2.json', 'utf-8'));

//Transform the component
const transformer = new ToggleTransformer();
const outputJson = transformer.transform(inputJson);

//Write the output to a new file
fs.writeFileSync('transformed-toggle.json', JSON.stringify(outputJson, null, 2));

console.log('Transformation complete. Output written to transformed-toggle.json');