// Token debugging utility
export const debugToken = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('=== TOKEN DEBUG ===');
  console.log('Token exists:', !!token);
  console.log('Token length:', token?.length || 0);
  console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('User data:', user ? JSON.parse(user) : 'null');
  
  if (token) {
    try {
      // Decode JWT payload (without verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Token expiry:', new Date(payload.exp * 1000));
      console.log('Token expired:', Date.now() > payload.exp * 1000);
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
  }
  console.log('==================');
};

// Call this in browser console: window.debugToken()
if (typeof window !== 'undefined') {
  window.debugToken = debugToken;
}
