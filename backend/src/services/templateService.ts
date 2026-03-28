import mammoth from 'mammoth';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_SCHEMA = `
Test Plan Document

1. Introduction
  1.1 Purpose - Describe the purpose of this test plan.
  1.2 Scope - Define the scope of testing.

2. Test Strategy
  2.1 Test Levels - Define testing levels (Unit, Integration, System, UAT).
  2.2 Test Types - Define testing types (Functional, Performance, Security, etc).

3. Test Scenarios
  List all test scenarios derived from requirements.

4. Test Cases
  4.1 Test Case ID
  4.2 Test Case Description
  4.3 Preconditions
  4.4 Test Steps
  4.5 Expected Result
  4.6 Priority (High/Medium/Low)

5. Entry and Exit Criteria
  5.1 Entry Criteria
  5.2 Exit Criteria

6. Test Environment
  Define the test environment requirements.

7. Risks and Mitigations
  Identify risks and corresponding mitigation strategies.

8. Approvals
  Sign-off section for stakeholders.
`;

export class TemplateService {
  static async getTemplateSchema(templatePath: string): Promise<string> {
    try {
      if (!templatePath || !fs.existsSync(templatePath)) {
        console.log('Template not found, using built-in default schema.');
        return DEFAULT_SCHEMA;
      }
      
      const result = await mammoth.extractRawText({ path: templatePath });
      return result.value || DEFAULT_SCHEMA;
    } catch (error) {
      console.error('Error parsing template, falling back to default:', error);
      return DEFAULT_SCHEMA;
    }
  }

  static getDefaultTemplatePath(): string {
    return path.join(process.cwd(), 'templates', 'default.docx');
  }
}
