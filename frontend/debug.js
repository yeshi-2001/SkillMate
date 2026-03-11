// Debug utility - paste this in browser console to check token

console.log('=== SkillMate Debug Info ===');
console.log('Token:', localStorage.getItem('token'));
console.log('Token exists:', !!localStorage.getItem('token'));

if (localStorage.getItem('token')) {
  const token = localStorage.getItem('token');
  const parts = token.split('.');
  
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(atob(parts[1]));
      console.log('Token Payload:', payload);
      console.log('User ID:', payload.sub);
      console.log('Expires:', new Date(payload.exp * 1000));
      console.log('Is Expired:', Date.now() > payload.exp * 1000);
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
  } else {
    console.error('Invalid token format');
  }
}

console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
console.log('========================');
