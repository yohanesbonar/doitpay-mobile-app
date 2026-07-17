declare module "*.svg" {
  import React from 'react';
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.css';

declare module 'react-native-image-picker' {
  export type ImageLibraryOptions = {
    mediaType?: 'photo' | 'video' | 'mixed';
    selectionLimit?: number;
    quality?: number;
  };

  export function launchImageLibrary(options?: ImageLibraryOptions): Promise<any>;
}