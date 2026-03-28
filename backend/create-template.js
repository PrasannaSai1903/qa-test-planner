const { Document, Packer, Paragraph, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

async function createTemplate() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: "Test Plan Document", heading: HeadingLevel.TITLE }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "1. Introduction", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "1.1 Purpose" }),
        new Paragraph({ text: "Describe the purpose of this test plan." }),
        new Paragraph({ text: "1.2 Scope" }),
        new Paragraph({ text: "Define the scope of testing." }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "2. Test Strategy", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "2.1 Test Levels" }),
        new Paragraph({ text: "Define testing levels (Unit, Integration, System, UAT)." }),
        new Paragraph({ text: "2.2 Test Types" }),
        new Paragraph({ text: "Define testing types (Functional, Performance, Security, etc)." }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "3. Test Scenarios", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "List all test scenarios derived from requirements." }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "4. Test Cases", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "4.1 Test Case ID" }),
        new Paragraph({ text: "4.2 Test Case Description" }),
        new Paragraph({ text: "4.3 Preconditions" }),
        new Paragraph({ text: "4.4 Test Steps" }),
        new Paragraph({ text: "4.5 Expected Result" }),
        new Paragraph({ text: "4.6 Priority (High/Medium/Low)" }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "5. Entry and Exit Criteria", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "5.1 Entry Criteria" }),
        new Paragraph({ text: "5.2 Exit Criteria" }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "6. Test Environment", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "Define the test environment requirements." }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "7. Risks and Mitigations", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "Identify risks and corresponding mitigation strategies." }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "8. Approvals", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "Sign-off section for stakeholders." }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, 'templates', 'default.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('Default template created at:', outPath);
}

createTemplate().catch(console.error);
