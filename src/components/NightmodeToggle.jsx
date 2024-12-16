import React, { useState } from 'react';

const NightModeToggle = ({onToggle}) => {
  const [isNightMode, setIsNightMode] = useState(false);

  // Apply Night Mode class to the body element
 const toggleTheme = () =>{
    const newMode = !isNightMode;
   setIsNightMode(newMode);

    const themeStyle = document.getElementById("theme-stylesheet");

    if(themeStyle) {
        themeStyle.href = newMode ? '/Nightmode.css' : '/App.css';
    }

    if(onToggle){
        onToggle(newMode);
    }
 };

  return (
   <div>
<button id =  "nightmode" onClick={toggleTheme}>
        {isNightMode ? "Light" : "Dark"} 
        Mode</button>
   </div>
  );
};

export default NightModeToggle;
