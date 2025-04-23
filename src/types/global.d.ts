// Global type definitions for the application

// Extend MUI's palette to include lighter shades
declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string;
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
  }
}

// Make JSX namespace available for React elements
declare namespace JSX {
  interface Element {}
}

// Declare modules for importing SVG and other asset files
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}
