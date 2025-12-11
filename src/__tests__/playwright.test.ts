import * as fs from 'fs';
import * as path from 'path';
import { parsePlaywrightReport, findPlaywrightReport } from '../playwright';

describe('Playwright utilities', () => {
  describe('parsePlaywrightReport', () => {
    it('should throw error if report file does not exist', () => {
      expect(() => {
        parsePlaywrightReport('/nonexistent/path/report.json');
      }).toThrow('Playwright report file not found');
    });

    it('should parse empty array report', () => {
      const tempFile = path.join(__dirname, 'temp-report.json');
      fs.writeFileSync(tempFile, JSON.stringify([]));

      try {
        const result = parsePlaywrightReport(tempFile);
        expect(result).toEqual([]);
      } finally {
        fs.unlinkSync(tempFile);
      }
    });

    it('should parse report with specs array format', () => {
      const tempFile = path.join(__dirname, 'temp-report.json');
      const mockReport = [
        {
          file: 'test.spec.ts',
          suites: [
            {
              tests: [
                {
                  title: 'Test 1',
                  results: [{ status: 'passed', duration: 100 }],
                },
              ],
            },
          ],
        },
      ];
      fs.writeFileSync(tempFile, JSON.stringify(mockReport));

      try {
        const result = parsePlaywrightReport(tempFile);
        expect(result).toHaveLength(1);
        expect(result[0].file).toBe('test.spec.ts');
        expect(result[0].tests).toHaveLength(1);
        expect(result[0].tests[0].title).toBe('Test 1');
        expect(result[0].tests[0].status).toBe('passed');
      } finally {
        fs.unlinkSync(tempFile);
      }
    });
  });

  describe('findPlaywrightReport', () => {
    it('should return null if no report found', () => {
      // Create a temporary directory that won't have reports
      const tempDir = fs.mkdtempSync(path.join(__dirname, 'temp-'));
      try {
        const result = findPlaywrightReport(tempDir);
        expect(result).toBeNull();
      } finally {
        fs.rmdirSync(tempDir);
      }
    });
  });
});

