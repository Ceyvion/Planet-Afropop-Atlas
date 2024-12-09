import React, { useState, useCallback, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { motion, AnimatePresence } from 'framer-motion';

interface GeographicViewProps {
  className?: string;
}

interface MusicCity {
  id: string;
  lat: number;
  lng: number;
  name: string;
  genre: string;
  description: string;
  artists: string[];
  stats: {
    streams: string;
    venues: number;
    festivals: number;
    yearlyEvents: number;
  };
  topSongs: Array<{
    title: string;
    year: number;
    streams: string;
  }>;
  culturalImpact: string[];
}

const MUSIC_CITIES: MusicCity[] = [
  {
    id: 'lagos',
    lat: 6.5244,
    lng: 3.3792,
    name: 'Lagos',
    genre: 'Afrobeats',
    description: 'The beating heart of modern African music, Lagos pulses with innovative sounds and vibrant culture.',
    artists: ['Wizkid', 'Burna Boy', 'Davido'],
    stats: {
      streams: '2.5B+',
      venues: 150,
      festivals: 12,
      yearlyEvents: 200
    },
    topSongs: [
      { title: 'Essence', year: 2020, streams: '400M+' },
      { title: 'Last Last', year: 2022, streams: '300M+' },
      { title: 'Fall', year: 2017, streams: '250M+' }
    ],
    culturalImpact: [
      'Global mainstream breakthrough of Afrobeats',
      'Pioneer of modern African pop production',
      'Cultural bridge between Africa and global music scene',
      'Birthplace of contemporary African music innovation'
    ]
  },
  {
    id: 'nairobi',
    lat: -1.2921,
    lng: 36.8219,
    name: 'Nairobi',
    genre: 'Benga & Genge',
    description: 'A fusion of traditional and modern sounds, Nairobi represents East African musical innovation.',
    artists: ['Sauti Sol', 'Nyashinski', 'Khaligraph Jones'],
    stats: {
      streams: '800M+',
      venues: 80,
      festivals: 8,
      yearlyEvents: 120
    },
    topSongs: [
      { title: 'Midnight Train', year: 2020, streams: '150M+' },
      { title: 'Suzanna', year: 2019, streams: '120M+' },
      { title: 'Short N Sweet', year: 2018, streams: '100M+' }
    ],
    culturalImpact: [
      'Evolution of traditional Benga music',
      'Integration of Swahili and urban culture',
      'East African musical identity formation',
      'Youth empowerment through music'
    ]
  },
  {
    id: 'johannesburg',
    lat: -26.2041,
    lng: 28.0473,
    name: 'Johannesburg',
    genre: 'Kwaito & Amapiano',
    description: 'South Africa\'s musical powerhouse, where traditional rhythms meet electronic innovation.',
    artists: ['Black Coffee', 'Kabza De Small', 'DJ Maphorisa'],
    stats: {
      streams: '1.8B+',
      venues: 120,
      festivals: 15,
      yearlyEvents: 180
    },
    topSongs: [
      { title: 'Osama', year: 2021, streams: '200M+' },
      { title: 'Asibe Happy', year: 2021, streams: '180M+' },
      { title: 'Superman', year: 2019, streams: '150M+' }
    ],
    culturalImpact: [
      'Global rise of Amapiano',
      'Evolution of electronic African music',
      'Post-apartheid cultural renaissance',
      'International dance music influence'
    ]
  },
  {
    id: 'accra',
    lat: 5.6037,
    lng: -0.1870,
    name: 'Accra',
    genre: 'Highlife & Afrobeats',
    description: 'A vibrant hub where traditional Highlife meets modern Afrobeats, creating a unique Ghanaian sound.',
    artists: ['Sarkodie', 'Stonebwoy', 'Shatta Wale'],
    stats: {
      streams: '1.2B+',
      venues: 90,
      festivals: 10,
      yearlyEvents: 150
    },
    topSongs: [
      { title: 'Non Living Thing', year: 2022, streams: '180M+' },
      { title: 'Second Sermon', year: 2021, streams: '150M+' },
      { title: 'Adonai', year: 2020, streams: '120M+' }
    ],
    culturalImpact: [
      'Evolution of Highlife music',
      'Bridge between traditional and modern sounds',
      'Pan-African musical collaboration hub',
      'Innovation in music video production'
    ]
  },
  {
    id: 'kinshasa',
    lat: -4.4419,
    lng: 15.2663,
    name: 'Kinshasa',
    genre: 'Rumba & Soukous',
    description: 'The capital of Congolese Rumba, where African rhythms blend with Latin influences.',
    artists: ['Fally Ipupa', 'Koffi Olomide', 'Ferre Gola'],
    stats: {
      streams: '900M+',
      venues: 70,
      festivals: 8,
      yearlyEvents: 100
    },
    topSongs: [
      { title: 'Eloko Oyo', year: 2021, streams: '120M+' },
      { title: 'Tokoss', year: 2020, streams: '100M+' },
      { title: 'Maria Rosa', year: 2019, streams: '90M+' }
    ],
    culturalImpact: [
      'Preservation of Rumba heritage',
      'Innovation in dance styles',
      'Cultural exchange with Latin America',
      'Urban music modernization'
    ]
  },
  {
    id: 'dakar',
    lat: 14.7167,
    lng: -17.4677,
    name: 'Dakar',
    genre: 'Mbalax & Hip-Hop',
    description: 'Senegal\'s musical capital, blending traditional Mbalax rhythms with contemporary urban sounds.',
    artists: ['Youssou N\'Dour', 'Wally Seck', 'Akon'],
    stats: {
      streams: '700M+',
      venues: 60,
      festivals: 7,
      yearlyEvents: 90
    },
    topSongs: [
      { title: '7 Seconds', year: 1994, streams: '150M+' },
      { title: 'Birima', year: 2000, streams: '100M+' },
      { title: 'Set', year: 2018, streams: '80M+' }
    ],
    culturalImpact: [
      'Preservation of Senegalese musical heritage',
      'Fusion of traditional and modern styles',
      'Global recognition of African music',
      'Youth empowerment through hip-hop'
    ]
  }
];

const GeographicView: React.FC<GeographicViewProps> = ({ className = '' }) => {
  const [selectedCity, setSelectedCity] = useState<MusicCity | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'impact' | 'stats'>('overview');
  const [hoverData, setHoverData] = useState<{lat: number, lng: number, name: string} | null>(null);
  const globeEl = useRef<any>();

  const getGlobeColors = useCallback(() => ({
    backgroundColor: '#000000',
    globeColor: '#1a1a1a',
    markerColor: '#ff3333',
    atmosphereColor: '#4A0404',
    textColor: '#FFFFFF',
  }), []);

  useEffect(() => {
    if (!globeEl.current) return;

    const globe = globeEl.current;
    
    // Initial position
    globe.pointOfView({
      lat: 0,
      lng: 20,
      altitude: 2.5
    }, 1000);

    // Configure controls
    const controls = globe.controls();
    if (controls) {
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.2;
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.minDistance = 200;
      controls.maxDistance = 500;
    }

    // Scene setup
    const scene = globe.scene();
    if (!scene) return;

    // Clear existing lights
    scene.children = scene.children.filter((child: THREE.Object3D) => !(child instanceof THREE.Light));

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x222222, 1);
    scene.add(ambientLight);

    // Add point lights for glow effect
    const addPointLight = (color: number, intensity: number, position: [number, number, number]) => {
      const light = new THREE.PointLight(color, intensity, 1000);
      light.position.set(...position);
      scene.add(light);
    };

    // Add multiple colored lights for atmospheric effect
    addPointLight(0xff3333, 2, [100, 100, 100]);
    addPointLight(0xff3333, 2, [-100, -100, 100]);
    addPointLight(0xff0000, 1, [100, -100, -100]);
    addPointLight(0xff0000, 1, [-100, 100, -100]);

    // Add post-processing for glow effect
    const composer = globe.postProcessingComposer();
    if (composer) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,  // strength
        0.4,  // radius
        0.85  // threshold
      );
      composer.addPass(bloomPass);
    }

    // Enhance globe material
    const material = globe._globeMaterial;
    if (material) {
      material.color = new THREE.Color(0x1a1a1a);
      material.emissive = new THREE.Color(0x220000);
      material.emissiveIntensity = 0.1;
      material.shininess = 0.5;
    }

    return () => {
      const currentScene = globe.scene();
      if (currentScene) {
        currentScene.children = currentScene.children.filter((child: THREE.Object3D) => !(child instanceof THREE.Light));
      }
    };
  }, []);

  useEffect(() => {
    if (selectedCity && globeEl.current) {
      globeEl.current.pointOfView({
        lat: selectedCity.lat,
        lng: selectedCity.lng,
        altitude: 1.8
      }, 1000);
    }
  }, [selectedCity]);

  const colors = getGlobeColors();

  const handlePointClick = useCallback((point: any) => {
    const city = MUSIC_CITIES.find(city => city.lat === point.lat && city.lng === point.lng);
    if (city) {
      setSelectedCity(city);
      setActiveTab('overview');
    }
  }, []);

  const handlePointHover = useCallback((point: any) => {
    if (!point) {
      setHoverData(null);
      return;
    }
    
    const city = MUSIC_CITIES.find(city => city.lat === point.lat && city.lng === point.lng);
    if (city) {
      setHoverData({
        lat: city.lat,
        lng: city.lng,
        name: city.name
      });
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      <div 
        className="absolute inset-0"
        style={{ background: colors.backgroundColor }}
      >
        <Globe
          ref={globeEl}
          backgroundColor={colors.backgroundColor}
          atmosphereColor={colors.atmosphereColor}
          atmosphereAltitude={0.25}
          pointsData={MUSIC_CITIES}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => colors.markerColor}
          pointAltitude={0.1}
          pointRadius={2}
          pointsMerge={false}
          pointResolution={32}
          pointsTransitionDuration={1000}
          onPointClick={handlePointClick}
          onPointHover={handlePointHover}
          pointLabel={() => ''}
          ringsData={selectedCity ? [selectedCity] : []}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => colors.markerColor}
          ringMaxRadius={5}
          ringPropagationSpeed={3}
          ringRepeatPeriod={2000}
          ringAltitude={0.1}
          width={window.innerWidth}
          height={window.innerHeight}
        />

        {/* Hover Label */}
        <AnimatePresence>
          {hoverData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="fixed transform -translate-x-1/2 px-4 py-2 bg-dark-900/90 text-white rounded-lg text-sm pointer-events-none"
              style={{
                left: `${window.innerWidth / 2}px`,
                top: `${window.innerHeight / 2 - 50}px`
              }}
            >
              {hoverData.name}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected City Panel */}
        <AnimatePresence>
          {selectedCity && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/2 right-8 transform -translate-y-1/2 w-96 glass-effect rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="relative p-8 pb-6 bg-gradient-to-r from-red-900/30 to-transparent">
                <button 
                  onClick={() => setSelectedCity(null)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent mb-2">
                  {selectedCity.name}
                </h2>
                <div className="text-xl text-red-400 mb-4">{selectedCity.genre}</div>
              </div>

              {/* Navigation */}
              <div className="border-y border-red-900/20">
                <div className="flex">
                  {(['overview', 'impact', 'stats'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        flex-1 px-6 py-3 text-sm font-medium transition-all duration-300
                        ${activeTab === tab 
                          ? 'bg-red-900/20 text-red-400' 
                          : 'text-gray-400 hover:text-red-400 hover:bg-red-900/10'
                        }
                      `}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {selectedCity.description}
                      </p>
                      
                      <div>
                        <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
                          Notable Artists
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCity.artists.map(artist => (
                            <span 
                              key={artist}
                              className="px-4 py-2 bg-red-900/30 text-red-200 rounded-full text-sm font-medium transition-colors hover:bg-red-900/40"
                            >
                              {artist}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">
                          Top Songs
                        </h3>
                        <div className="space-y-2">
                          {selectedCity.topSongs.map(song => (
                            <div 
                              key={song.title}
                              className="flex items-center justify-between p-3 rounded-lg bg-red-900/10 hover:bg-red-900/20 transition-colors"
                            >
                              <div>
                                <div className="font-medium">{song.title}</div>
                                <div className="text-sm text-gray-400">{song.year}</div>
                              </div>
                              <div className="text-red-400">{song.streams}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'impact' && (
                    <motion.div
                      key="impact"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid gap-4">
                        {selectedCity.culturalImpact.map((impact, index) => (
                          <div 
                            key={index}
                            className="p-4 rounded-lg bg-red-900/10 border border-red-900/20"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-red-900/30 flex items-center justify-center text-red-400 text-sm">
                                {index + 1}
                              </div>
                              <p className="text-gray-300">{impact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'stats' && (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="p-4 rounded-lg bg-red-900/10 border border-red-900/20">
                        <div className="text-sm text-red-400 mb-1">Total Streams</div>
                        <div className="text-2xl font-bold">{selectedCity.stats.streams}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-red-900/10 border border-red-900/20">
                        <div className="text-sm text-red-400 mb-1">Music Venues</div>
                        <div className="text-2xl font-bold">{selectedCity.stats.venues}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-red-900/10 border border-red-900/20">
                        <div className="text-sm text-red-400 mb-1">Annual Festivals</div>
                        <div className="text-2xl font-bold">{selectedCity.stats.festivals}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-red-900/10 border border-red-900/20">
                        <div className="text-sm text-red-400 mb-1">Yearly Events</div>
                        <div className="text-2xl font-bold">{selectedCity.stats.yearlyEvents}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GeographicView;
