// RoomInviteHandler.jsx
import React, { useState, useEffect } from 'react';
import { Send, Copy, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const RoomInviteHandler = ({ roomId, onInviteSent }) => {
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [showInvitePanel, setShowInvitePanel] = useState(false);

  // Generate the invite link when component mounts
  useEffect(() => {
    const baseUrl = window.location.origin;
    setInviteLink(`${baseUrl}/join-room/${roomId}`);
  }, [roomId]);

  // Copy link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Send email invitation
  const sendInvite = (e) => {
    e.preventDefault();
    
    if (!email) return;
    
    // In a real app, you would make an API call here
    // This is a mock implementation
    const newInvite = {
      id: Date.now().toString(),
      email,
      status: 'pending',
      sentAt: new Date(),
      roomId
    };
    
    setPendingInvites([...pendingInvites, newInvite]);
    setEmail('');
    
    // Simulate API response
    setTimeout(() => {
      setPendingInvites(current => 
        current.map(invite => 
          invite.id === newInvite.id 
            ? { ...invite, status: Math.random() > 0.2 ? 'sent' : 'failed' } 
            : invite
        )
      );
      
      if (onInviteSent) {
        onInviteSent(email, roomId);
      }
    }, 1500);
  };

  // Resend a failed invitation
  const resendInvite = (inviteId) => {
    setPendingInvites(current => 
      current.map(invite => 
        invite.id === inviteId 
          ? { ...invite, status: 'pending' } 
          : invite
      )
    );
    
    // Simulate resend API call
    setTimeout(() => {
      setPendingInvites(current => 
        current.map(invite => 
          invite.id === inviteId 
            ? { ...invite, status: Math.random() > 0.2 ? 'sent' : 'failed', sentAt: new Date() } 
            : invite
        )
      );
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Toggle button for invite panel */}
      <button 
        onClick={() => setShowInvitePanel(!showInvitePanel)}
        className="w-full bg-blue-600 text-white p-3 font-medium flex items-center justify-center"
      >
        {showInvitePanel ? 'Hide Invite Options' : 'Invite Users'}
      </button>
      
      {showInvitePanel && (
        <div className="p-4">
          {/* Copy Link Section */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Share Invite Link</h3>
            <div className="flex">
              <input 
                type="text" 
                value={inviteLink} 
                readOnly 
                className="flex-1 border rounded-l-md px-3 py-2 bg-gray-50"
              />
              <button
                onClick={copyLinkToClipboard}
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
          </div>
          
          {/* Email Invite Section */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Send Email Invite</h3>
            <form onSubmit={sendInvite} className="flex">
              <input 
                type="email" 
                placeholder="user@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border rounded-l-md px-3 py-2"
              />
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                <Send size={16} />
                Invite
              </button>
            </form>
          </div>
          
          {/* Pending Invites Section */}
          {pendingInvites.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Recent Invites</h3>
              <div className="border rounded-md overflow-hidden">
                {pendingInvites.map((invite) => (
                  <div 
                    key={invite.id} 
                    className="flex items-center justify-between p-3 border-b last:border-b-0"
                  >
                    <div>
                      <p className="font-medium">{invite.email}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(invite.sentAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {invite.status === 'pending' && (
                        <div className="flex items-center text-yellow-500">
                          <RefreshCw size={16} className="animate-spin mr-1" />
                          <span>Sending...</span>
                        </div>
                      )}
                      {invite.status === 'sent' && (
                        <div className="flex items-center text-green-500">
                          <CheckCircle size={16} className="mr-1" />
                          <span>Sent</span>
                        </div>
                      )}
                      {invite.status === 'failed' && (
                        <div className="flex items-center">
                          <div className="flex items-center text-red-500 mr-2">
                            <XCircle size={16} className="mr-1" />
                            <span>Failed</span>
                          </div>
                          <button
                            onClick={() => resendInvite(invite.id)}
                            className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Example of integration in Room component
const Room = ({ roomId }) => {
  const handleInviteSent = (email, roomId) => {
    console.log(`Invitation sent to ${email} for room ${roomId}`);
    // You could add a notification here or update UI
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-screen">
      {/* Main video area */}
      <div className="col-span-3 bg-gray-900 p-4 relative">
        {/* Video content would go here */}
        <div className="bg-gray-800 rounded-lg aspect-video"></div>
        
        {/* Video controls at bottom */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          {/* Control buttons */}
        </div>
      </div>
      
      {/* Right sidebar for chat, participants, and invites */}
      <div className="bg-gray-100 p-4 overflow-y-auto">
        {/* Tabs for Chat, Participants, etc. would go here */}
        
        {/* Room invite handler */}
        <div className="mb-4">
          <RoomInviteHandler 
            roomId={roomId} 
            onInviteSent={handleInviteSent} 
          />
        </div>
        
        {/* Rest of sidebar content */}
      </div>
    </div>
  );
};

export default Room;