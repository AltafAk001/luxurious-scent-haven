
import React from "react";

interface AhmadiLogoProps {
  size?: "small" | "medium" | "large";
  variant?: "light" | "dark";
}

export const AhmadiLogo = ({ size = "medium", variant = "dark" }: AhmadiLogoProps) => {
  // Determine size dimensions
  const dimensions = {
    small: { width: 120, height: 50 },
    medium: { width: 180, height: 75 },
    large: { width: 240, height: 100 },
  };

  // Determine colors based on variant
  const colors = {
    dark: {
      primary: "#1A1F2C", // Dark purple
      secondary: "#8B5CF6", // Vivid purple
      accent: "#D946EF", // Magenta pink
    },
    light: {
      primary: "#FFFFFF", // White
      secondary: "#D6BCFA", // Light purple
      accent: "#F97316", // Bright orange
    },
  };

  const { width, height } = dimensions[size];
  const { primary, secondary, accent } = colors[variant];

  return (
    <div 
      className="relative flex flex-col items-center justify-center" 
      style={{ width, height }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div 
          className="absolute w-10 h-10 rounded-full opacity-20"
          style={{ backgroundColor: accent, filter: "blur(10px)" }}
        ></div>
      </div>
      
      {/* Logo text */}
      <h1 
        className="text-center font-serif tracking-wider leading-none z-10"
        style={{ 
          color: primary, 
          fontSize: size === "small" ? "1.2rem" : size === "medium" ? "1.8rem" : "2.4rem",
        }}
      >
        AHMADI
      </h1>
      <p 
        className="text-center font-light tracking-widest z-10"
        style={{ 
          color: secondary, 
          fontSize: size === "small" ? "0.6rem" : size === "medium" ? "0.8rem" : "1rem",
          marginTop: size === "small" ? "2px" : size === "medium" ? "3px" : "4px"  
        }}
      >
        PERFUMES
      </p>
      
      {/* Decorative underline */}
      <div 
        className="mt-1 z-10"
        style={{ 
          height: "1px", 
          width: size === "small" ? "60px" : size === "medium" ? "90px" : "120px",
          background: `linear-gradient(90deg, transparent, ${secondary}, transparent)`
        }}
      ></div>
    </div>
  );
};
