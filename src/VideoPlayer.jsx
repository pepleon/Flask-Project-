import React, { useEffect, useState } from 'react';
import './videoplayer.css';

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoStream, setVideoStream] = useState('http://localhost:8000/video_feed');
  const [overlays, setOverlays] = useState([]); // Current overlays
  const [savedOverlaySets, setSavedOverlaySets] = useState([]); // Saved overlay sets
  const [overlayContent, setOverlayContent] = useState(''); // Overlay text
  const [overlayImage, setOverlayImage] = useState(''); // Overlay image URL
  const [overlayPosition, setOverlayPosition] = useState({ x: 10, y: 30 }); // Position for new overlay
  const [overlaySize, setOverlaySize] = useState({ width: 100, height: 50 }); // Size for new overlay

  useEffect(() => {
    // Fetch saved overlays when the component mounts
    const fetchOverlays = async () => {
      const response = await fetch('/overlays');
      const data = await response.json();
      ///setSavedOverlaySets(data); // Assuming data is an array of overlay sets
      console.log("Fetched overlays:", data);
      if (Array.isArray(data)) {
        setSavedOverlaySets(data); // Assuming data is an array of overlay sets
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

/*
  // Add new overlay
  const handleAddOverlay = async () => {
    const newOverlay = { 
      content: overlayContent, 
      image: overlayImage, 
      x: overlayPosition.x, 
      y: overlayPosition.y, 
      width: overlaySize.width, 
      height: overlaySize.height 
    };

    // Send a POST request to save the overlay
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
      setOverlays([...overlays, newOverlay]); // Add to current overlays
      setOverlayContent(''); // Reset content
      setOverlayImage(''); // Reset image URL
      setOverlayPosition({ x: 10, y: 30 }); // Reset position
      setOverlaySize({ width: 100, height: 50 }); // Reset size
    } else {
      console.error('Error saving overlay');
    }
  

  };
*/



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

  // Send a POST request to save the overlay
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
    setOverlays([...overlays, newOverlay]); // Add to current overlays
    setOverlayContent(''); // Reset content
    setOverlayImage(''); // Reset image URL
    setOverlayPosition({ x: 10, y: 30 }); // Reset position
    setOverlaySize({ width: 100, height: 50 }); // Reset size
  } else {
    console.error('Error saving overlay');
  }


};


/////////////////////////////////////////////



// Add new overlay locally, without calling the API
const handleAddOverlay = () => {

  const newOverlay = {
    content: overlayContent,
    image: overlayImage,
    x: overlayPosition.x,
    y: overlayPosition.y,
    width: overlaySize.width,
    height: overlaySize.height,
  };

  // Update the local overlay state (add the new overlay)
  setOverlays([...overlays, newOverlay]);

  // Reset input fields for adding a new overlay
  setOverlayContent(''); // Reset content
  setOverlayImage(''); // Reset image URL
  setOverlayPosition({ x: 10, y: 30 }); // Reset position
  setOverlaySize({ width: 100, height: 50 }); // Reset size
};














  // Save current overlays to the saved list (as a group/set)
  /*const handleSaveOverlays =  () => {
    if (overlays.length > 0) {
      setSavedOverlaySets([...savedOverlaySets, overlays]); // Save the entire set of overlays
      setOverlays([]); // Clear current overlays after saving
    }
  };
*/

///////////////////////////////////

// Save all overlays to the database after final creation/adjustment
const handleSaveOverlays = async () => {

  const mostRecentOverlay = overlays[overlays.length - 1];

  // Send a POST request to save the overlay
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
    setOverlays([mostRecentOverlay]); // Add to current overlays
  
  } else {
    console.error('Error saving overlay');
  }

};















///////////////////////////////////////////////
  // Select an overlay set from the saved list and display all overlays in that set
  const handleSelectOverlaySet = (index) => {
    //setOverlays(savedOverlaySets[index]); // Show all overlays from the selected set
    const selectedSet = savedOverlaySets[index]; 
    console.log("Selected Overlay Set Index:", index);
    console.log("Overlay Set Content:", savedOverlaySets[index]);

     // Check if selectedSet is an object
  if (selectedSet && typeof selectedSet === "object") {
    // Assuming 'overlays' is an array where you want to push the selected overlay
    setOverlays([selectedSet]); // Wrap it in an array
  } else {
    console.error("Selected overlay set is not defined or is not an object");
  }
  
  };



 /* 
  const handleSelectOverlaySet = async (index) => {
    const overlaySetId = savedOverlaySets[index]._id; // Assuming you have an ID for the overlay set
   console.log(overlaySetId);
   setOverlays(savedOverlaySets[index]);
    // Fetch overlays from the server
    const response = await fetch(`/overlays/${overlaySetId}`);
    if (response.ok) {
      const overlays = await response.json();
      console.log(overlays);
      // setOverlays(overlays); // Set fetched overlays
      
    } else {
      console.error('Error fetching overlays');
    }
  };
  

  */


/*
  // Delete an overlay set from the saved list
  const handleDeleteOverlaySet = async (overlayId, index) => {
    // Check if overlayId is provided
    if (!overlayId) {
      console.error("No overlay ID provided");
      return;
    }
  
    // Send a DELETE request to the server
    const response = await fetch(`/overlays/${overlayId}`, { method: 'DELETE' });
    
    if (!response.ok) {
      console.error(`Error deleting overlay with ID ${overlayId}`);
    } else {
      // Update the state to remove the overlay from the array
      const updatedSets = savedOverlaySets.map(set => 
        set.filter(overlay => overlay._id !== overlayId) // Remove the specific overlay
      );
  
      setSavedOverlaySets(updatedSets); // Update the saved overlay sets
    }

    const updatedOverlays = overlays.filter((_, i) => i !== index);
    setSavedOverlaySets(updatedOverlays);

  };
  
*/



const handleDeleteOverlaySet = async (overlayId, index) => {
  // Check if overlayId is provided
  if (!overlayId) {
    console.error("No overlay ID provided");
    return;
  }

  // Send a DELETE request to the server
  const response = await fetch(`/overlays/${overlayId}`, { method: 'DELETE' });

  if (!response.ok) {
    console.error(`Error deleting overlay with ID ${overlayId}`);
  } else {
    // Remove the deleted overlay set from the state by filtering it out
    const updatedSets = savedOverlaySets.filter((_, i) => i !== index);
    setSavedOverlaySets(updatedSets); // Update saved overlay sets

    // If necessary, also update the current `overlays` to remove any associated overlays
    if (overlays.some(overlay => overlay._id === overlayId)) {
      setOverlays(overlays.filter(overlay => overlay._id !== overlayId));
    }
  }
};




















  // Clear the current overlays but don't delete saved ones
  const handleNewOverlay = () => {
    setOverlays([]); // Clear current overlays
  };

  // Dragging logic for overlays
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

  // Handle resizing of the overlay
  const handleResize = (e, overlayIndex) => {
    const newWidth = e.clientX - overlays[overlayIndex].x;
    const newHeight = e.clientY - overlays[overlayIndex].y;

    if (newWidth > 20 && newHeight > 20) { // Minimum size constraints
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
              onMouseDown={(e) => handleMouseDown(e, index)} // Make draggable
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
                  e.stopPropagation(); // Prevent drag during resize
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
