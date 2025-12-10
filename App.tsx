import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { MagicTree } from './components/MagicTree';
import { LightTheme } from './types';
import { GestureController } from './components/GestureController';

const App: React.FC = () => {
  const [exploded, setExploded] = useState(false);
  const [particleCount, setParticleCount] = useState(5500);
  const [lightTheme, setLightTheme] = useState<LightTheme>(LightTheme.Classic);
  const [photos, setPhotos] = useState<string[]>([]);
  const [highlightedPhotoIndex, setHighlightedPhotoIndex] = useState<number>(-1);
  
  // UI States
  const [showDecorControls, setShowDecorControls] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [titleScale, setTitleScale] = useState(1.0);
  const [titleColor1, setTitleColor1] = useState('#ffffff');
  const [titleColor2, setTitleColor2] = useState('#60a5fa');
  
  // Gesture Settings
  const [isGestureEnabled, setIsGestureEnabled] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0);

  // Tree Settings
  const [leafColor, setLeafColor] = useState('#1F4F28');

  // Lights
  const [lightSize, setLightSize] = useState(1.4);
  const [lightQuantity, setLightQuantity] = useState(0.08); // 8% default
  const [customLightColor, setCustomLightColor] = useState('#ffdd00');
  const [lightIntensity, setLightIntensity] = useState(2.0);

  // Ornaments
  const [ornamentSize, setOrnamentSize] = useState(1.2);
  const [ornamentQuantity, setOrnamentQuantity] = useState(0.05); // 5% default
  const [ornamentColor, setOrnamentColor] = useState('#FFD700');
  const [isOrnamentTwoTone, setIsOrnamentTwoTone] = useState(false);
  const [ornamentColor2, setOrnamentColor2] = useState('#C0C0C0');

  // Handle Image Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string]);
          setShowGallery(true); // Auto-open gallery on upload
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Photo Removal
  const handleRemovePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRotation = useCallback((speed: number) => {
    setRotationSpeed(prev => {
      if (prev !== speed) return speed;
      return prev;
    });
  }, []);

  const handlePhotoSelect = useCallback((index: number) => {
    setHighlightedPhotoIndex(prev => {
      if (prev !== index) return index;
      return prev;
    });
  }, []);

  const festiveFont = '"Mountains of Christmas", "Brush Script MT", cursive';

  return (
    <div className="relative w-full h-full bg-[#111] overflow-hidden">
      
      {/* --- TOP CENTER: TITLE --- */}
      <div className="absolute top-2 md:top-6 left-0 right-0 z-30 flex justify-center pointer-events-none select-none transition-transform duration-200 ease-out pb-8">
        <h1 
          className="text-5xl md:text-8xl font-bold tracking-wide transition-all artistic-text-anim"
          style={{ 
            fontFamily: festiveFont,
            transform: `scale(${titleScale})`,
            transformOrigin: 'top center',
            backgroundImage: `linear-gradient(to bottom, ${titleColor1}, ${titleColor2})`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            // Drop shadow is handled by the animation class in index.html for better browser support
            WebkitTextStroke: '1px rgba(255,255,255,0.15)'
          }}
        >
          Merry Christmas
        </h1>
      </div>

      {/* --- TOP LEFT: GESTURES --- */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-3 items-start pointer-events-none">
         <div className="flex gap-2 pointer-events-auto">
             <button
               onClick={() => setIsGestureEnabled(!isGestureEnabled)}
               className={`group flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border border-white/20 shadow-lg transition-all ${isGestureEnabled ? 'bg-green-500/30 text-green-400 ring-1 ring-green-400' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}
               title="Toggle Gestures"
             >
                <span className="text-xl md:text-2xl">✋</span>
             </button>
         </div>

         {/* Gesture Window */}
         {isGestureEnabled && (
          <GestureController 
            isExploded={exploded}
            onExplode={() => !exploded && setExploded(true)}
            onAssemble={() => exploded && setExploded(false)}
            onRotate={handleRotation}
            photoCount={photos.length}
            onPhotoSelect={handlePhotoSelect}
          />
        )}
      </div>

      {/* --- CANVAS --- */}
      <Canvas
        camera={{ position: [0, 2, 25], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#111']} />
        <Environment preset="city" />
        <ambientLight intensity={0.2} />
        
        <MagicTree 
          exploded={exploded} 
          particleCount={particleCount} 
          leafColor={leafColor}
          lightTheme={lightTheme}
          photos={photos}
          highlightedPhotoIndex={highlightedPhotoIndex}
          rotationSpeed={rotationSpeed}
          lightSize={lightSize}
          lightQuantity={lightQuantity}
          customLightColor={customLightColor}
          lightIntensity={lightIntensity}
          ornamentSize={ornamentSize}
          ornamentQuantity={ornamentQuantity}
          ornamentColor={ornamentColor}
          isOrnamentTwoTone={isOrnamentTwoTone}
          ornamentColor2={ornamentColor2}
        />

        <OrbitControls 
          enablePan={false} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2 + 0.2}
          minDistance={10}
          maxDistance={50}
        />
      </Canvas>

      {/* --- BOTTOM CENTER: ACTION BUTTON --- */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none z-40">
        <button
          onClick={() => setExploded((prev) => !prev)}
          className="pointer-events-auto px-8 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-bold tracking-[0.2em] hover:bg-white/15 transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-white/10 group"
        >
          {exploded ? 'ASSEMBLE' : 'EXPLODE'}
        </button>
      </div>

      {/* --- BOTTOM LEFT: GALLERY --- */}
      <div className="absolute bottom-8 left-4 md:bottom-8 md:left-8 z-50 flex flex-col items-start gap-4 pointer-events-none">
         
         {/* Photo Strip (Expandable) */}
         {showGallery && (
           <div className="pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300 origin-bottom-left">
              <div className="bg-black/80 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-2xl max-w-[240px] md:max-w-[320px]">
                
                {/* Scrollable Area */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-2 min-h-[60px]">
                  {photos.length === 0 ? (
                    <span className="text-[10px] text-white/30 italic w-full text-center py-4">No photos added yet</span>
                  ) : (
                    photos.map((photo, index) => (
                      <div key={index} className={`relative flex-shrink-0 w-12 h-16 bg-white/5 rounded-md overflow-hidden group border transition-all ${index === highlightedPhotoIndex ? 'border-yellow-400 ring-1 ring-yellow-400 scale-105' : 'border-white/10 hover:border-white/30'}`}>
                        <img src={photo} alt="mini" className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs hover:text-red-400 transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Button */}
                <label className="flex items-center justify-center gap-2 w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[10px] text-white font-bold tracking-wider cursor-pointer transition-all">
                   <span>+ ADD PHOTO</span>
                   <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
           </div>
         )}

         {/* Gallery Toggle Button */}
         <button 
            onClick={() => setShowGallery(!showGallery)}
            className={`pointer-events-auto flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border border-white/20 shadow-lg transition-all ${showGallery ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
            title="Photo Gallery"
         >
            <span className="text-lg md:text-xl">📷</span>
         </button>
      </div>

      {/* --- BOTTOM RIGHT: SETTINGS --- */}
      <div className="absolute bottom-8 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-4 pointer-events-none">
        
        {/* Settings Panel */}
        {showDecorControls && (
          <div className="pointer-events-auto bg-black/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 text-white w-72 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200 max-h-[70vh] overflow-y-auto scrollbar-hide">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
               <span className="text-sm font-bold tracking-widest text-white/90" style={{ fontFamily: festiveFont }}>SETTINGS</span>
               <button onClick={() => setShowDecorControls(false)} className="text-white/40 hover:text-white transition-colors">✕</button>
            </div>

            {/* Title Settings */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50 uppercase font-bold tracking-wider">
                  <span style={{ fontFamily: festiveFont, fontSize: '12px' }}>Title Size</span>
                  <span>{titleScale.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="2.5" step="0.1" 
                  value={titleScale} 
                  onChange={(e) => setTitleScale(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-300"
                />
                
                <div className="flex justify-between items-center pt-1">
                   <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider" style={{ fontFamily: festiveFont, fontSize: '12px' }}>Gradient</span>
                   <div className="flex gap-1">
                       <input 
                         type="color" 
                         value={titleColor1} 
                         onChange={(e) => setTitleColor1(e.target.value)}
                         className="w-6 h-6 rounded border-none bg-transparent cursor-pointer"
                         title="Top Color"
                       />
                       <input 
                         type="color" 
                         value={titleColor2} 
                         onChange={(e) => setTitleColor2(e.target.value)}
                         className="w-6 h-6 rounded border-none bg-transparent cursor-pointer"
                         title="Bottom Color"
                       />
                   </div>
                </div>
            </div>

            {/* Tree Settings */}
            <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-xs text-green-500/80 uppercase font-bold tracking-wider" style={{ fontFamily: festiveFont, fontSize: '14px' }}>Tree</span>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-white/50 uppercase font-bold tracking-wider">
                    <span>Density</span>
                    <span>{particleCount}</span>
                  </div>
                  <input 
                    type="range" min="2500" max="15000" step="250" 
                    value={particleCount} 
                    onChange={(e) => setParticleCount(parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                   <span className="text-[10px] text-white/50 uppercase font-bold tracking-wider">Leaf Color</span>
                   <input 
                     type="color" 
                     value={leafColor} 
                     onChange={(e) => setLeafColor(e.target.value)}
                     className="w-6 h-6 rounded border-none bg-transparent cursor-pointer"
                   />
                </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-white/5 w-full"></div>

            {/* Ornaments Section */}
            <div className="space-y-3">
               <span className="text-xs text-yellow-500/80 uppercase font-bold tracking-wider" style={{ fontFamily: festiveFont, fontSize: '14px' }}>Ornaments</span>
               
               {/* Quantity & Size Grid */}
               <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                     <span className="text-[9px] text-white/40 block">Count</span>
                     <input 
                       type="range" min="0" max="0.15" step="0.01" 
                       value={ornamentQuantity} 
                       onChange={(e) => setOrnamentQuantity(parseFloat(e.target.value))}
                       className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                     />
                   </div>
                   <div className="space-y-1">
                     <span className="text-[9px] text-white/40 block">Size</span>
                     <input 
                       type="range" min="0.5" max="2.5" step="0.1" 
                       value={ornamentSize} 
                       onChange={(e) => setOrnamentSize(parseFloat(e.target.value))}
                       className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                     />
                   </div>
               </div>

               {/* Colors */}
               <div className="flex items-center justify-between">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                       type="checkbox" 
                       checked={isOrnamentTwoTone}
                       onChange={(e) => setIsOrnamentTwoTone(e.target.checked)}
                       className="accent-yellow-400 w-3 h-3"
                    />
                    <span className="text-[10px] text-white/60">Mix Colors</span>
                 </label>
                 
                 <div className="flex gap-1">
                    <input 
                        type="color" value={ornamentColor} onChange={(e) => setOrnamentColor(e.target.value)}
                        className="w-5 h-5 rounded-full border-none bg-transparent cursor-pointer"
                    />
                    {isOrnamentTwoTone && (
                        <input 
                            type="color" value={ornamentColor2} onChange={(e) => setOrnamentColor2(e.target.value)}
                            className="w-5 h-5 rounded-full border-none bg-transparent cursor-pointer"
                        />
                    )}
                 </div>
               </div>
            </div>

            {/* Lights Section */}
            <div className="space-y-3 pt-2 border-t border-white/5">
               <span className="text-xs text-cyan-500/80 uppercase font-bold tracking-wider" style={{ fontFamily: festiveFont, fontSize: '14px' }}>Lights</span>

               {/* Quantity & Size & Intensity */}
               <div className="grid grid-cols-3 gap-2">
                   <div className="space-y-1">
                     <span className="text-[9px] text-white/40 block">Count</span>
                     <input 
                       type="range" min="0" max="0.30" step="0.01" 
                       value={lightQuantity} onChange={(e) => setLightQuantity(parseFloat(e.target.value))}
                       className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                     />
                   </div>
                   <div className="space-y-1">
                     <span className="text-[9px] text-white/40 block">Size</span>
                     <input 
                       type="range" min="0.5" max="4.0" step="0.1" 
                       value={lightSize} onChange={(e) => setLightSize(parseFloat(e.target.value))}
                       className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                     />
                   </div>
                   <div className="space-y-1">
                     <span className="text-[9px] text-white/40 block">Bright</span>
                     <input 
                       type="range" min="0.1" max="10.0" step="0.1" 
                       value={lightIntensity} onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                       className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                     />
                   </div>
               </div>

               {/* Theme Buttons */}
               <div className="grid grid-cols-4 gap-1">
                    {[LightTheme.Classic, LightTheme.Warm, LightTheme.Cool, LightTheme.Rainbow].map(t => (
                       <button 
                         key={t}
                         onClick={() => setLightTheme(t)}
                         className={`py-1.5 rounded-md text-[8px] font-bold border transition-all ${lightTheme === t ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-transparent hover:bg-white/10 text-white/50'}`}
                       >
                         {t.substring(0, 4)}
                       </button>
                    ))}
               </div>
               
               {/* Custom Color */}
               <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                   <button 
                      onClick={() => setLightTheme(LightTheme.Custom)}
                      className={`text-[9px] font-bold ${lightTheme === LightTheme.Custom ? 'text-cyan-400' : 'text-white/50'}`}
                   >
                      CUSTOM COLOR
                   </button>
                   {lightTheme === LightTheme.Custom && (
                      <input 
                        type="color" value={customLightColor} onChange={(e) => setCustomLightColor(e.target.value)}
                        className="w-5 h-5 rounded-full border-none bg-transparent cursor-pointer"
                      />
                   )}
               </div>
            </div>

          </div>
        )}

        {/* Toggle Button */}
        <button 
          onClick={() => setShowDecorControls(!showDecorControls)}
          className={`pointer-events-auto flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-md border border-white/20 shadow-lg transition-all ${showDecorControls ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
          title="Tree Settings"
        >
           <span className="text-lg md:text-xl">⚙️</span>
        </button>
      </div>
    </div>
  );
};

export default App;