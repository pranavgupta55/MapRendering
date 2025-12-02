import React, { useState } from 'react';
import { CITIES } from '../constants';
import { City } from '../types';
import { ChevronRight, ChevronLeft, MapPin, Building2, GraduationCap } from 'lucide-react';

interface CitySelectorProps {
  onSelectCity: (city: City) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({ onSelectCity }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCity = () => {
    setActiveIndex((prev) => (prev + 1) % CITIES.length);
  };

  const prevCity = () => {
    setActiveIndex((prev) => (prev - 1 + CITIES.length) % CITIES.length);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden">
      {/* Background Grid Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(17,24,39,0.9), rgba(17,24,39,0.9)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')`
        }}
      ></div>
      <div 
        className="absolute inset-0"
        style={{
            backgroundImage: `linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)'
        }}
      ></div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
          NEONPATH
        </h1>
        <p className="text-slate-400 uppercase tracking-[0.3em] text-sm mt-2">
          Global Tactical Navigation System
        </p>
      </div>

      {/* 3D Wheel Container */}
      <div className="relative z-10 w-full max-w-4xl h-[400px] flex items-center justify-center perspective-[1000px]">
        <button 
          onClick={prevCity}
          className="absolute left-4 md:left-12 z-20 p-3 rounded-full bg-slate-800/50 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 transition-all group"
        >
          <ChevronLeft className="w-8 h-8 text-slate-400 group-hover:text-cyan-400" />
        </button>

        <div className="relative w-[300px] md:w-[400px] h-[500px] flex items-center justify-center transition-all duration-500 preserve-3d">
            {CITIES.map((city, index) => {
               const isActive = index === activeIndex;
               
               // Inline styles for 3D transforms to be safe
               const transformStyle = isActive 
                ? 'scale(1) translateZ(0) translateX(0) rotateY(0deg)'
                : 'scale(0.75) translateZ(-200px) translateX(100px) rotateY(12deg)';
               
               return (
                 <div 
                    key={city.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${isActive ? 'z-10 blur-0' : 'z-0 blur-sm grayscale opacity-40'}`}
                    style={{ transform: transformStyle }}
                 >
                    <div className="w-full h-full bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden group">
                        {/* Card Glow */}
                        <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 ${isActive ? 'animate-pulse' : ''}`}></div>
                        
                        <div className="relative h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono border border-cyan-500/20">
                                        SECTOR {index + 1}
                                    </span>
                                    {isActive && <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>}
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-2">{city.name}</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">{city.description}</p>
                            </div>

                            <div className="space-y-4 my-6">
                                {city.highlights.map((h, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-300">
                                        {h.includes('University') ? <GraduationCap className="w-4 h-4 text-purple-400"/> : <Building2 className="w-4 h-4 text-cyan-400"/>}
                                        <span className="text-sm">{h}</span>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => onSelectCity(city)}
                                className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2
                                    ${isActive 
                                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25' 
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                    }
                                `}
                                disabled={!isActive}
                            >
                                {isActive ? (
                                    <>Initialize <ChevronRight className="w-4 h-4" /></>
                                ) : 'Locked'}
                            </button>
                        </div>
                    </div>
                 </div>
               );
            })}
        </div>

        <button 
          onClick={nextCity}
          className="absolute right-4 md:right-12 z-20 p-3 rounded-full bg-slate-800/50 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 transition-all group"
        >
          <ChevronRight className="w-8 h-8 text-slate-400 group-hover:text-cyan-400" />
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <div className="flex items-center gap-2 text-slate-500 text-xs tracking-wider">
           <MapPin className="w-3 h-3" />
           SYSTEM STATUS: ONLINE
           <span className="mx-2">|</span>
           DATA SOURCE: GOOGLE MAPS PLATFORM
        </div>
      </div>
    </div>
  );
};