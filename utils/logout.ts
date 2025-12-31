export const logout = () => {
  // Clear all auth cookies
  document.cookie = 'token=; Max-Age=0; path=/;';
  document.cookie = 'role=; Max-Age=0; path=/;';
  
  // Redirect to login page
  window.location.href = '/login';
};
