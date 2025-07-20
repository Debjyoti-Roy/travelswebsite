import React, { useEffect, useState } from 'react';
import { FaShare, FaCopy, FaWhatsapp, FaFacebook, FaTwitter } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ShareButton = ({ hotel, className = "" }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);

  // useEffect(() => {
  //   console.log("hotel", hotel);
  // }, [hotel])

  // useEffect(() => {
  //   console.log("hotel", hotel);
  // }, [])
  
  

  // Get current URL parameters from the page state or URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentState = window.history.state?.usr || {};
  
  // Create a shareable URL with all necessary parameters
  const baseUrl = window.location.origin + window.location.pathname;
  const shareParams = new URLSearchParams();
  
  // Add hotel ID and booking parameters - prioritize URL params over state
  const id = urlParams.get('id') || currentState.id;
  const checkIn = urlParams.get('checkIn') || currentState.checkIn;
  const checkOut = urlParams.get('checkOut') || currentState.checkOut;
  const total = urlParams.get('total') || currentState.total;
  const room = urlParams.get('room') || currentState.room;
  const location = urlParams.get('location') || currentState.location;
  const startingPrice = urlParams.get('startingPrice') || currentState.startingPrice || hotel?.startingPrice;
  
  if (id) shareParams.set('id', id);
  if (checkIn) shareParams.set('checkIn', checkIn);
  if (checkOut) shareParams.set('checkOut', checkOut);
  if (total) shareParams.set('total', total);
  if (room) shareParams.set('room', room);
  if (location) shareParams.set('location', location);
  if (startingPrice) shareParams.set('startingPrice', startingPrice);
  
  const shareData = {
    id,
    checkIn,
    checkOut,
    total,
    room,
    location,
    startingPrice
  };

  // Encode as base64
  const encoded = btoa(encodeURIComponent(JSON.stringify(shareData)));
  const shareUrl = `${baseUrl}?data=${encoded}`;
  const shareText = `Check out this amazing hotel: ${hotel?.name} - ${hotel?.address}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hotel?.name,
          text: shareText,
          url: shareUrl,
        });
        setShowShareOptions(false);
      } catch (error) {
        // console.log('Error sharing:', error);
        // Fallback to copy link
        handleCopyLink();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      setShowShareOptions(false);
    } catch (error) {
      // console.error('Failed to copy link:', error);
      toast.error('Failed to copy link', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareOptions(false);
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
    setShowShareOptions(false);
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
    setShowShareOptions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowShareOptions(!showShareOptions)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <FaShare className="text-sm" />
        <span className="text-sm font-medium">Share</span>
      </button>

      {showShareOptions && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowShareOptions(false)}
          />
          
          {/* Share Options */}
          <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 min-w-[200px]">
            <div className="space-y-2">
              <button
                onClick={handleNativeShare}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <FaShare className="text-blue-600" />
                <span className="text-sm text-black">Share via...</span>
              </button>
              
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <FaCopy className="text-green-600" />
                <span className="text-sm text-black">Copy Link</span>
              </button>
              
              <hr className="my-2" />
              
              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <FaWhatsapp className="text-green-500" />
                <span className="text-sm text-black">WhatsApp</span>
              </button>
              
              <button
                onClick={handleFacebookShare}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <FaFacebook className="text-blue-600" />
                <span className="text-sm text-black">Facebook</span>
              </button>
              
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
              >
                <FaTwitter className="text-blue-400" />
                <span className="text-sm text-black">Twitter</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton; 