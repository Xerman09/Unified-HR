import { describe, expect, it } from 'vitest';
import { APP_GROUPS, isPayrollApp, getAppMetaByUrl, APP_INDEX, ALLOWED_URLS } from '../lib/apps';

describe('Apps Configuration', () => {
  it('should have a valid APP_GROUPS configuration', () => {
    expect(APP_GROUPS.length).toBeGreaterThan(0);
    APP_GROUPS.forEach(group => {
      expect(group.group).toBeDefined();
      expect(group.items.length).toBeGreaterThan(0);
      group.items.forEach(item => {
        expect(item.id).toBeDefined();
        expect(item.label).toBeDefined();
        expect(item.url).toBeDefined();
      });
    });
  });

  it('should include the newly added RSM group', () => {
    const rsmGroup = APP_GROUPS.find(g => g.group === 'RSM');
    expect(rsmGroup).toBeDefined();
    expect(rsmGroup?.items.some(i => i.id === 'rsm-attendance')).toBe(true);
    expect(rsmGroup?.items.some(i => i.id === 'rsm-users')).toBe(true);
    expect(rsmGroup?.items.some(i => i.id === 'rsm-payroll')).toBe(true);
  });

  describe('isPayrollApp', () => {
    it('should identify payroll apps correctly by ID suffix', () => {
      expect(isPayrollApp({ id: 'test-payroll', label: 'Test', url: '' })).toBe(true);
      expect(isPayrollApp({ id: 'test-apps', label: 'Test', url: '' })).toBe(false);
    });

    it('should identify payroll apps correctly by isPayroll flag', () => {
      expect(isPayrollApp({ id: 'any-id', label: 'Test', url: '', isPayroll: true })).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(isPayrollApp(null)).toBe(false);
      expect(isPayrollApp(undefined)).toBe(false);
    });
  });

  describe('getAppMetaByUrl', () => {
    it('should return correct meta for a known URL', () => {
      const firstApp = APP_GROUPS[0].items[0];
      const meta = getAppMetaByUrl(firstApp.url);
      expect(meta).toBeDefined();
      expect(meta?.id).toBe(firstApp.id);
      expect(meta?.group).toBe(APP_GROUPS[0].group);
    });

    it('should return correct meta for a fallback URL', () => {
      const hanvinApp = APP_GROUPS.find(g => g.group === 'HANVIN')?.items[0];
      if (hanvinApp?.fallbackUrl) {
        const meta = getAppMetaByUrl(hanvinApp.fallbackUrl);
        expect(meta).toBeDefined();
        expect(meta?.id).toBe(hanvinApp.id);
      }
    });

    it('should return null for unknown URLs', () => {
      expect(getAppMetaByUrl('http://invalid-url')).toBeNull();
    });
  });

  it('should not have duplicate app IDs', () => {
    const ids = APP_GROUPS.flatMap(g => g.items.map(i => i.id));
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should have all URLs in the ALLOWED_URLS set', () => {
    const allUrls = APP_GROUPS.flatMap(g => g.items.flatMap(i => [i.url, i.fallbackUrl])).filter(Boolean);
    allUrls.forEach(url => {
        expect(ALLOWED_URLS.has(url as string)).toBe(true);
    });
  });
});
