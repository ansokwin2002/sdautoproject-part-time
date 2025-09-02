
'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

const SafeImage = (props: ImageProps) => {
  const { src, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);
  const placeholderImg = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0VFRUVFRSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDEgMC04LTMuNTktOC04czMuNTktOCA4IDggOCAzLjU5IDggOC0zLjU5IDgtOCA4eiIvPjwvc3ZnPg==`;

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc || placeholderImg}
      onError={() => {
        setImgSrc(placeholderImg);
      }}
    />
  );
};

export default SafeImage;
