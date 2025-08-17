import { test, expect } from '@playwright/test';

test.describe('FozzieDesktop E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
  });

  test('should load the welcome screen', async ({ page }) => {
    // Check that the welcome screen is visible
    await expect(page.locator('text=Welcome')).toBeVisible();
    
    // Check for the new chat button
    await expect(page.locator('button:has-text("New Chat")')).toBeVisible();
  });

  test('should create a new chat', async ({ page }) => {
    // Click the new chat button
    await page.click('button:has-text("New Chat")');
    
    // Should show chat interface
    await expect(page.locator('textarea[placeholder*="message"]')).toBeVisible();
    
    // Should show send button
    await expect(page.locator('button:has-text("Send")')).toBeVisible();
  });

  test('should send a message and receive response', async ({ page }) => {
    // Create new chat
    await page.click('button:has-text("New Chat")');
    
    // Type a message
    const messageInput = page.locator('textarea[placeholder*="message"]');
    await messageInput.fill('Hello, how are you?');
    
    // Send the message
    await page.click('button:has-text("Send")');
    
    // Should show the user message
    await expect(page.locator('text=Hello, how are you?')).toBeVisible();
    
    // Should show loading indicator
    await expect(page.locator('text=Thinking')).toBeVisible();
    
    // Should eventually show AI response (mock response)
    await expect(page.locator('text=mock response')).toBeVisible({ timeout: 10000 });
  });

  test('should open and close settings', async ({ page }) => {
    // Click settings button
    await page.click('button[aria-label*="Settings"], button:has-text("⚙")');
    
    // Should show settings panel
    await expect(page.locator('text=Settings')).toBeVisible();
    
    // Should show API key input
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Close settings
    await page.click('button:has-text("Cancel")');
    
    // Settings should be hidden
    await expect(page.locator('text=Settings')).not.toBeVisible();
  });

  test('should configure API key', async ({ page }) => {
    // Open settings
    await page.click('button[aria-label*="Settings"], button:has-text("⚙")');
    
    // Enter API key
    const apiKeyInput = page.locator('input[type="password"]');
    await apiKeyInput.fill('sk-test123456789abcdef');
    
    // Change model
    await page.selectOption('select', 'openai/gpt-4');
    
    // Save settings
    await page.click('button:has-text("Save")');
    
    // Settings should close
    await expect(page.locator('text=Settings')).not.toBeVisible();
    
    // Verify settings are persisted (check localStorage)
    const settings = await page.evaluate(() => localStorage.getItem('fozzie-settings'));
    expect(settings).toContain('sk-test123456789abcdef');
    expect(settings).toContain('openai/gpt-4');
  });

  test('should toggle Fozzie mode', async ({ page }) => {
    // Create new chat first
    await page.click('button:has-text("New Chat")');
    
    // Find and click Fozzie mode toggle
    await page.click('button:has-text("Fozzie"), input[type="checkbox"]');
    
    // Send a message
    const messageInput = page.locator('textarea[placeholder*="message"]');
    await messageInput.fill('Tell me something');
    await page.click('button:has-text("Send")');
    
    // Should show Fozzie response with "Wocka wocka!"
    await expect(page.locator('text=Wocka wocka!')).toBeVisible({ timeout: 10000 });
  });

  test('should handle multiple chats', async ({ page }) => {
    // Create first chat
    await page.click('button:has-text("New Chat")');
    
    // Send a message to establish the chat
    await page.fill('textarea[placeholder*="message"]', 'First chat message');
    await page.click('button:has-text("Send")');
    
    // Wait for response
    await expect(page.locator('text=First chat message')).toBeVisible();
    
    // Create second chat
    await page.click('button:has-text("New Chat")');
    
    // Should be in a new empty chat
    await expect(page.locator('text=First chat message')).not.toBeVisible();
    
    // Send message in second chat
    await page.fill('textarea[placeholder*="message"]', 'Second chat message');
    await page.click('button:has-text("Send")');
    
    // Should show second chat message
    await expect(page.locator('text=Second chat message')).toBeVisible();
    
    // Should see both chats in sidebar
    await expect(page.locator('text=New Chat').first()).toBeVisible();
  });

  test('should handle theme switching', async ({ page }) => {
    // Open settings
    await page.click('button[aria-label*="Settings"], button:has-text("⚙")');
    
    // Switch to dark theme
    await page.selectOption('select:has(option:text("Light"))', 'dark');
    
    // Save settings
    await page.click('button:has-text("Save")');
    
    // Check that dark theme is applied
    const appElement = page.locator('.app, [data-theme]');
    await expect(appElement).toHaveAttribute('data-theme', 'dark');
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Create new chat
    await page.click('button:has-text("New Chat")');
    
    // Test Ctrl+N for new chat
    await page.keyboard.press('Control+n');
    
    // Should create another new chat
    // We can verify this by checking if we're in a fresh chat state
    
    // Test Ctrl+, for settings
    await page.keyboard.press('Control+,');
    
    // Should open settings
    await expect(page.locator('text=Settings')).toBeVisible();
    
    // Close settings
    await page.keyboard.press('Escape');
    
    // Settings should close
    await expect(page.locator('text=Settings')).not.toBeVisible();
  });

  test('should display error for invalid API configuration', async ({ page }) => {
    // Open settings
    await page.click('button[aria-label*="Settings"], button:has-text("⚙")');
    
    // Enter invalid API key
    await page.fill('input[type="password"]', 'invalid-key');
    
    // Save settings
    await page.click('button:has-text("Save")');
    
    // Create new chat and send message
    await page.click('button:has-text("New Chat")');
    await page.fill('textarea[placeholder*="message"]', 'Test message');
    await page.click('button:has-text("Send")');
    
    // Should show error message about invalid API key
    await expect(page.locator('text=Invalid API key')).toBeVisible({ timeout: 10000 });
  });

  test('should persist chat history across page reloads', async ({ page }) => {
    // Create chat and send message
    await page.click('button:has-text("New Chat")');
    await page.fill('textarea[placeholder*="message"]', 'Persistent message');
    await page.click('button:has-text("Send")');
    
    // Wait for message to appear
    await expect(page.locator('text=Persistent message')).toBeVisible();
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Should still see the chat and message
    await expect(page.locator('text=Persistent message')).toBeVisible();
  });
});