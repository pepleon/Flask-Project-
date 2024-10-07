import React, { useEffect, useState } from 'react';
import './videoplayer.css';

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoStream, setVideoStream] = useState('http://localhost:8000/video_feed');
  const [overlays, setOverlays] = useState([]); 
  const [savedOverlaySets, setSavedOverlaySets] = useState([]); 
  const [overlayContent, setOverlayContent] = useState(''); 
  const [overlayImage, setOverlayImage] = useState(''); 
  const [overlayPosition, setOverlayPosition] = useState({ x: 10, y: 30 }); 
  const [overlaySize, setOverlaySize] = useState({ width: 100, height: 50 }); 

  useEffect(() => {
    
    const fetchOverlays = async () => {
      const response = await fetch('/overlays');
      const data = await response.json();

      console.log("Fetched overlays:", data);
      if (Array.isArray(data)) {
        setSavedOverlaySets(data); 
      } else {
        console.error("Fetched data is not an array:", data);
      }
    };

    fetchOverlays();
  }, [overlays]);

  const togglePlayPause = async () => {
    const response = await fetch('/toggle_stream');
    const data = await response.json();
    setIsPlaying(data.streaming);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };



///////////////////////////////////////////////////////////

const handleAddOverlay2 = async () => {
  const newOverlay = { 
    content: overlayContent, 
    image: overlayImage, 
    x: overlayPosition.x, 
    y: overlayPosition.y, 
    width: overlaySize.width, 
    height: overlaySize.height 
  };

  
 const response = await fetch('/save-overlay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newOverlay)
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Overlay saved:', data);
    setOverlays([...overlays, newOverlay]); 
    setOverlayContent(''); 
    setOverlayImage(''); 
    setOverlayPosition({ x: 10, y: 30 }); 
    setOverlaySize({ width: 100, height: 50 }); 
  } else {
    console.error('Error saving overlay');
  }


};


/////////////////////////////////////////////




const handleAddOverlay = () => {

  const newOverlay = {
    content: overlayContent,
    image: overlayImage,
    x: overlayPosition.x,
    y: overlayPosition.y,
    width: overlaySize.width,
    height: overlaySize.height,
  };

  
  setOverlays([...overlays, newOverlay]);

  
  setOverlayContent(''); 
  setOverlayImage(''); 
  setOverlayPosition({ x: 10, y: 30 }); 
  setOverlaySize({ width: 100, height: 50 }); 
};
















///////////////////////////////////


const handleSaveOverlays = async () => {

  const mostRecentOverlay = overlays[overlays.length - 1];

  
 const response = await fetch('/save-overlay', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(mostRecentOverlay)
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Overlay saved:', data);
    setOverlays([mostRecentOverlay]); 
  
  } else {
    console.error('Error saving overlay');
  }

};















///////////////////////////////////////////////
  
  const handleSelectOverlaySet = (index) => {
   
    const selectedSet = savedOverlaySets[index]; 
    console.log("Selected Overlay Set Index:", index);
    console.log("Overlay Set Content:", savedOverlaySets[index]);

     
  if (selectedSet && typeof selectedSet === "object") {
  
    setOverlays([selectedSet]);
  } else {
    console.error("Selected overlay set is not defined or is not an object");
  }
  
  };



const handleDeleteOverlaySet = async (overlayId, index) => {
  
  if (!overlayId) {
    console.error("No overlay ID provided");
    return;
  }

  const response = await fetch(`/overlays/${overlayId}`, { method: 'DELETE' });

  if (!response.ok) {
    console.error(`Error deleting overlay with ID ${overlayId}`);
  } else {
    
    const updatedSets = savedOverlaySets.filter((_, i) => i !== index);
    setSavedOverlaySets(updatedSets); 
    
    if (overlays.some(overlay => overlay._id === overlayId)) {
      setOverlays(overlays.filter(overlay => overlay._id !== overlayId));
    }
  }
};




















  
  const handleNewOverlay = () => {
    setOverlays([]); 
  };

 
  const handleMouseDown = (e, overlayIndex) => {
    e.preventDefault();
    const offsetX = e.clientX - overlays[overlayIndex].x;
    const offsetY = e.clientY - overlays[overlayIndex].y;

    const mouseMoveHandler = (moveEvent) => {
      setOverlays((prevOverlays) => {
        const newOverlays = [...prevOverlays];
        newOverlays[overlayIndex] = {
          ...newOverlays[overlayIndex],
          x: moveEvent.clientX - offsetX,
          y: moveEvent.clientY - offsetY,
        };
        return newOverlays;
      });
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  
  const handleResize = (e, overlayIndex) => {
    const newWidth = e.clientX - overlays[overlayIndex].x;
    const newHeight = e.clientY - overlays[overlayIndex].y;

    if (newWidth > 20 && newHeight > 20) {
      setOverlays(overlays.map((overlay, index) => 
        index === overlayIndex ? { ...overlay, width: newWidth, height: newHeight } : overlay
      ));
    }
  };

  return (
    <div className='video-player'>
      <h1>Video Stream</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ position: 'relative', width: '640px', height: '360px' }}>
          <img 
            src={videoStream} 
            alt="Streaming Video" 
            style={{ width: '100%', height: '100%' }} 
          />
          {overlays.map((overlay, index) => (
            <div 
              key={index}
              style={{
                position: 'absolute',
                left: overlay.x,
                top: overlay.y,
                width: overlay.width,
                height: overlay.height,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '5px',
                borderRadius: '5px',
              }}
              onMouseDown={(e) => handleMouseDown(e, index)} 
            >
              {overlay.image && (
                <img 
                  src={overlay.image} 
                  alt="Overlay" 
                  style={{ width: '100%', height: 'auto', maxHeight: '100%', objectFit: 'contain' }} 
                />
              )}
              {overlay.content && <div>{overlay.content}</div>}
              <div
                onMouseDown={(e) => {
                  e.stopPropagation(); 
                  const mouseMoveHandler = (moveEvent) => handleResize(moveEvent, index);
                  const mouseUpHandler = () => {
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                  };
                  document.addEventListener('mousemove', mouseMoveHandler);
                  document.addEventListener('mouseup', mouseUpHandler);
                }}
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '10px',
                  height: '10px',
                  cursor: 'se-resize',
                  backgroundColor: 'white',
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginLeft: '20px' }}>
          <h3>Saved Overlay Sets</h3>
          <ul className='overlay-list '>
            {savedOverlaySets.map((set, index) => (
              <li key={index}>
                <button onClick={() => handleSelectOverlaySet(index)}>
                  Overlay Set {index + 1}
                </button>
                <button className='delete-btn' onClick={() => handleDeleteOverlaySet(set._id, index)} style={{ marginLeft: '10px' }}>
                  Delete
                </button>
           {console.log(set._id)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='control-buttons'>
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
  
      </div>
      <div className='utility'>
        <input 
          type="text" 
          value={overlayContent} 
          onChange={(e) => setOverlayContent(e.target.value)} 
          placeholder="Overlay text" 
        />
        <input 
          type="text" 
          value={overlayImage} 
          onChange={(e) => setOverlayImage(e.target.value)} 
          placeholder="Overlay image URL" 
        />
        <button onClick={handleAddOverlay}>Add Overlay</button>
        <button onClick={handleSaveOverlays}>Save Current Overlays</button>
        <button onClick={handleNewOverlay}>Clear Current Overlays</button>
      </div>
    </div>
  );
};

export default VideoPlayer;
