import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { validateRoomLink } from '../utils/linkUtils';

const JoinHandler = ({ onJoinRoom }) => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(true);
  
  useEffect(() => {
    // Construct the full URL for validation
    const expires = searchParams.get('expires');
    const fullUrl = `${window.location.origin}/join-room/${roomId}${expires ? `?expires=${expires}` : ''}`;
    
    // Validate the link
    const valid = validateRoomLink(fullUrl);
    setIsValid(valid);
    setIsValidating(false);
    
    // If valid, join the room
    if (valid && onJoinRoom) {
      onJoinRoom(roomId);
    }
  }, [roomId, searchParams, onJoinRoom]);
  
  // Handle expired or invalid links
  if (!isValidating && !isValid) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Invitation</h2>
          <p className="mb-6">This invitation link has expired or is no longer valid.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-lg">Validating invitation...</p>
          <div className="mt-4 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // If valid and not showing loading state, render nothing (parent component will handle)
  return null;
};