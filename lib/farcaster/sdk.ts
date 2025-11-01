/**
 * FARCASTER SDK INTEGRATION
 * Centralized Farcaster SDK setup and utilities
 */

import { sdk as miniappSDK } from '@farcaster/miniapp-sdk';

// Export configured SDK
export const sdk = miniappSDK;

/**
 * Initialize the Farcaster mini app
 * Call this when the app first loads
 */
export async function initializeMiniApp() {
  try {
    // Get initial context
    const context = await sdk.context;
    
    // Call ready() to hide splash screen
    await sdk.actions.ready();
    
    return context;
  } catch (error) {
    console.error('Failed to initialize mini app:', error);
    throw error;
  }
}

/**
 * Check if running in Farcaster mini app
 */
export async function isInMiniApp(): Promise<boolean> {
  try {
    return await sdk.isInMiniApp();
  } catch {
    return false;
  }
}

/**
 * Get current user context
 */
export async function getCurrentUser() {
  try {
    const context = await sdk.context;
    return context.user;
  } catch (error) {
    // Dev mode: Return mock user for local testing
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('Running in dev mode - using mock user');
      return {
        fid: 1,
        username: 'dev_user',
        displayName: 'Dev Player',
        pfpUrl: '',
      };
    }
    throw error;
  }
}

/**
 * Get current platform type (mobile/web)
 */
export async function getPlatformType(): Promise<'mobile' | 'web' | undefined> {
  const context = await sdk.context;
  return context.client.platformType;
}

/**
 * Check if user has added the app
 */
export async function hasUserAddedApp(): Promise<boolean> {
  const context = await sdk.context;
  return context.client.added;
}

/**
 * Prompt user to add the mini app
 */
export async function promptToAddApp(): Promise<void> {
  await sdk.actions.addMiniApp();
}

/**
 * Close the mini app
 */
export async function closeMiniApp(): Promise<void> {
  await sdk.actions.close();
}

/**
 * Open URL in external browser
 */
export async function openUrl(url: string): Promise<void> {
  await sdk.actions.openUrl(url);
}

/**
 * Compose and share a cast
 */
export async function composeCast(text: string, embeds?: [string] | [string, string]) {
  return await sdk.actions.composeCast({ text, embeds });
}

/**
 * View a user's profile
 */
export async function viewProfile(fid: number): Promise<void> {
  await sdk.actions.viewProfile({ fid });
}

/**
 * Get safe area insets for mobile layout
 */
export async function getSafeAreaInsets() {
  const context = await sdk.context;
  return context.client.safeAreaInsets;
}

/**
 * Get notification details if available
 */
export async function getNotificationDetails() {
  const context = await sdk.context;
  return context.client.notificationDetails;
}

/**
 * Subscribe to SDK events
 */
export function onSDKEvent(
  event: string,
  callback: (data: unknown) => void
): () => void {
  sdk.on(event as any, callback);
  
  // Return unsubscribe function
  return () => {
    sdk.off(event as any, callback);
  };
}

/**
 * Subscribe to miniapp added event
 */
export function onMiniAppAdded(callback: () => void): () => void {
  return onSDKEvent('miniappAdded', callback);
}

/**
 * Subscribe to miniapp removed event
 */
export function onMiniAppRemoved(callback: () => void): () => void {
  return onSDKEvent('miniappRemoved', callback);
}

/**
 * Subscribe to notifications enabled event
 */
export function onNotificationsEnabled(callback: () => void): () => void {
  return onSDKEvent('notificationsEnabled', callback);
}

/**
 * Subscribe to notifications disabled event
 */
export function onNotificationsDisabled(callback: () => void): () => void {
  return onSDKEvent('notificationsDisabled', callback);
}

