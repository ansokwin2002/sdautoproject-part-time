'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface ImageGalleryModalProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'Escape') {
        onClose();
      }
    },
    [handlePrev, handleNext, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative w-full h-full max-w-screen-xl max-h-screen-xl flex items-center justify-center">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Navigation Buttons */}
        <button
          className="absolute left-4 text-white hover:text-gray-300 transition-colors z-50"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-12 w-12" />
        </button>
        <button
          className="absolute right-4 text-white hover:text-gray-300 transition-colors z-50"
          onClick={handleNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-12 w-12" />
        </button>

        {/* Image Display */}
        <AnimatePresence initial={false} mode="wait" custom={currentIndex}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Image
              src={images[currentIndex]}
              alt={`Product image ${currentIndex + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
            />
          </motion.div>
        </AnimatePresence>

        {/* Image Counter */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto p-2 rounded-lg bg-black/70 max-w-full scrollbar-hide">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative w-16 h-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 ${currentIndex === index ? 'border-blue-500' : 'border-transparent'}`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryModal;
