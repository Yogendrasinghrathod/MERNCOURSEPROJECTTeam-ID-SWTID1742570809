import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import { generateRoomLink } from '../utils/linkUtils';

const LinkDisplay = ({ roomId }) => {
  const [copied, setCopied] = useState(false);
  const [expiresIn, setExpiresIn] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  
  // Generate link based on current expiration setting
  const inviteLink = generateRoomLink(roomId, expiresIn);
  
  // Copy link to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-2">Room Invite Link</h3>
      
      <div className="flex mb-3">
        <input
          type="text"
          value={inviteLink}
          readOnly
          className="flex-1 border rounded-l-md px-3 py-2 bg-gray-50"
        />
        <button
          onClick={copyLink}
          className={`flex items-center gap-1 px-4 py-2 rounded-r-md ${
            copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          {copied ? (
            <>
              <CheckCircle size={16} />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>
      </div>
      
      <div className="mb-2">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showOptions ? 'Hide options' : 'Show options'}
        </button>
      </div>
      
      {showOptions && (
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Link expiration:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setExpiresIn(null)}
              className={`text-sm px-3 py-1 rounded ${
                expiresIn === null ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
            >
              Never
            </button>
            <button
              onClick={() => setExpiresIn(30)}
              className={`text-sm px-3 py-1 rounded ${
                expiresIn === 30 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
            >
              30 minutes
            </button>
            <button
              onClick={() => setExpiresIn(60)}
              className={`text-sm px-3 py-1 rounded ${
                expiresIn === 60 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
            >
              1 hour
            </button>
            <button
              onClick={() => setExpiresIn(24 * 60)}
              className={`text-sm px-3 py-1 rounded ${
                expiresIn === 24 * 60 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
              }`}
            >
              24 hours
            </button>
          </div>
        </div>
      )}
    </div>
  );
};