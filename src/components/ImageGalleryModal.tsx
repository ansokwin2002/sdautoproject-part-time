'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Play, ZoomIn, ZoomOut, RotateCw, Download, Maximize2, Minimize2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/utils';

interface MediaItem {
  type: 'image' | 'video';
  url: string; // Can be full URL or YouTube video ID
}

interface ImageGalleryModalProps {
  media: MediaItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to get YouTube embed URL from video ID or URL
const getVideoEmbedUrl = (urlOrId: string): string => {
  // If it's already a full URL, use getYouTubeEmbedUrl utility
  if (urlOrId.startsWith('http')) {
    return getYouTubeEmbedUrl(urlOrId);
  }
  // If it's just a video ID (like "LiaePVHH9JQ"), create embed URL
  return `https://www.youtube.com/embed/${urlOrId}?autoplay=0&rel=0`;
};

// Helper function to get YouTube thumbnail from video ID or URL
const getVideoThumbnail = (urlOrId: string): string => {
  // If it's already a full URL, use getYouTubeThumbnail utility
  if (urlOrId.startsWith('http')) {
    return getYouTubeThumbnail(urlOrId) || '';
  }
  // If it's just a video ID, create thumbnail URL directly
  return `https://img.youtube.com/vi/${urlOrId}/mqdefault.jpg`;
};

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  media,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  // Reset zoom and position when changing images
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  }, [media.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  }, [media.length]);

  const handleZoomIn = useCallback(() => {
    setZoom((prevZoom) => Math.min(prevZoom * 1.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prevZoom) => Math.max(prevZoom / 1.5, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  }, [zoom, position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  }, [handleZoomIn, handleZoomOut]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'Escape') {
        onClose();
      } else if (event.key === '+' || event.key === '=') {
        handleZoomIn();
      } else if (event.key === '-') {
        handleZoomOut();
      } else if (event.key === '0') {
        handleResetZoom();
      } else if (event.key === 'r' || event.key === 'R') {
        handleRotate();
      }
    },
    [handlePrev, handleNext, onClose, handleZoomIn, handleZoomOut, handleResetZoom, handleRotate]
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    const currentMedia = media[currentIndex];
    if (currentMedia.type === 'image') {
      const link = document.createElement('a');
      link.href = currentMedia.url;
      link.download = `product-image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [media, currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  const handleMouseActivity = useCallback(() => {
    setShowControls(true);
  }, []);

  if (!isOpen || !media || media.length === 0) return null;

  const currentMedia = media[currentIndex];
  
  if (!currentMedia) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onMouseMove={handleMouseActivity}
      onClick={handleMouseActivity}
    >
      {/* Top Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4"
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">
                  Product Gallery ({currentIndex + 1} / {media.length})
                </h3>
                {currentMedia.type === 'image' && (
                  <div className="flex items-center gap-2 text-sm bg-black/50 px-3 py-1 rounded-full">
                    <ZoomIn size={14} />
                    {Math.round(zoom * 100)}%
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {currentMedia.type === 'image' && (
                  <>
                    <button
                      onClick={handleZoomOut}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Zoom out"
                    >
                      <ZoomOut size={20} />
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Zoom in"
                    >
                      <ZoomIn size={20} />
                    </button>
                    <button
                      onClick={handleRotate}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Rotate"
                    >
                      <RotateCw size={20} />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Download"
                    >
                      <Download size={20} />
                    </button>
                  </>
                )}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Close gallery"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <AnimatePresence>
        {showControls && media.length > 1 && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Main Media Display */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} mode="wait" custom={currentIndex}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {currentMedia.type === 'image' ? (
              <div
                ref={imageRef}
                className="relative cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
                onDoubleClick={zoom > 1 ? handleResetZoom : handleZoomIn}
              >
                <Image
                  src={currentMedia.url}
                  alt={`Product image ${currentIndex + 1}`}
                  width={1200}
                  height={800}
                  style={{ 
                    objectFit: 'contain',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                  className="rounded-lg"
                  priority
                />
              </div>
            ) : (
              <div className="relative w-[90vw] h-[90vh] max-w-[1200px] max-h-[675px] rounded-lg overflow-hidden bg-black">
                <iframe
                  src={getVideoEmbedUrl(currentMedia.url)}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`YouTube video ${currentIndex + 1}`}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Thumbnails */}
      <AnimatePresence>
        {showControls && media.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex gap-2 p-3 bg-black/70 backdrop-blur-sm rounded-xl max-w-[90vw] overflow-x-auto scrollbar-hide">
              {media.map((item, index) => (
                <div
                  key={index}
                  className={`relative w-16 h-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-110 ${
                    currentIndex === index ? 'border-blue-500 shadow-lg shadow-blue-500/50' : 'border-white/30 hover:border-white/60'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-gray-800">
                      <Image
                        src={getVideoThumbnail(item.url)}
                        alt={`Video thumbnail ${index + 1}`}
                        fill
                        className="object-cover opacity-70"
                      />
                      <Play size={20} className="absolute z-10 text-white drop-shadow-lg" />
                    </div>
                  )}
                  {currentIndex === index && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      <AnimatePresence>
        {showControls && currentMedia.type === 'image' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 left-4 z-40 bg-black/70 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm"
          >
            <div className="space-y-1">
              <div>Double-click to zoom • Scroll to zoom</div>
              <div>Drag to pan • R to rotate • 0 to reset</div>
              <div>← → to navigate • ESC to close</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGalleryModal;