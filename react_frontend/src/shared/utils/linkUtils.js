export const generateRoomLink = (roomId, expiresIn = null) => {
    const baseUrl = window.location.origin;
    let link = `${baseUrl}/join-room/${roomId}`;
    
    // Add expiration if specified
    if (expiresIn) {
      const expires = Date.now() + expiresIn * 60 * 1000;
      link += `?expires=${expires}`;
    }
    
    return link;
  };
  
  /**
   * Validates if a room link is still valid
   * @param {string} url - The full room URL to validate
   * @returns {boolean} Whether the link is valid
   */
  export const validateRoomLink = (url) => {
    try {
      const urlObj = new URL(url);
      const expires = urlObj.searchParams.get('expires');
      
      // If no expiration is set, link is valid
      if (!expires) return true;
      
      // Check if link is expired
      return Date.now() < parseInt(expires);
    } catch (error) {
      console.error('Invalid URL format:', error);
      return false;
    }
  };
  
  /**
   * Extracts room ID from a room link
   * @param {string} url - The full room URL
   * @returns {string|null} The room ID or null if invalid
   */
  export const extractRoomIdFromLink = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const roomId = pathParts[pathParts.indexOf('join-room') + 1];
      return roomId || null;
    } catch (error) {
      console.error('Failed to extract room ID:', error);
      return null;
    }
  };