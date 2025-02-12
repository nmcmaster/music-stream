"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from 'tone'
import { Chord, Interval, Note, Scale} from 'tonal';
import axios from "axios";

const SCALE_OPTIONS = {
  'Major Pentatonic': Scale.get('C4 Major Pentatonic').notes,
  'Minor Pentatonic': Scale.get('C4 Minor Pentatonic').notes,
  'Major': Scale.get('C4 Major').notes,
  'Minor': Scale.get('C4 Minor').notes,
  'Blues': Scale.get('C4 Blues').notes,
  'Chromatic': Scale.get('C4 Chromatic').notes,
} as const;
let selectedScale = 'Major Pentatonic';
let currentScale = SCALE_OPTIONS['Major Pentatonic'];

type ScaleType = keyof typeof SCALE_OPTIONS;

interface WikimediaEventData {
  title: string;
	meta: { dt: string };
	performer?: { user_text: string };
	server_name?: string; 
	length?: { old: number | 0, new: number | 0 };
	minor?: boolean;
	comment?: string;
	type?: string;
	parsedcomment?: string;
	$schema?: string;
}

// not used for now, TOO LOUD
function cloudNoise() {
    const noise = new Tone.Noise("white").start();
    // make an autofilter to shape the noise
    const autoFilter = new Tone.AutoFilter({
        frequency: "8n",
        baseFrequency: 200,
        octaves: 8
    }).toDestination().start();
    // connect the noise
    noise.connect(autoFilter);
    // start the autofilter LFO
    autoFilter.start();
}

export default function WeatherSynth() {
  const [myWeather, setMyWeather] = useState<any | null>(null);
  
  const myLat = 33.44;
  const myLon = -94.04;

  const weatherApiKey = process.env.NEXT_PUBLIC_;
  console.log("weatherApiKey", weatherApiKey);
  let myWeatherRequest = `https://api.openweathermap.org/data/3.0/onecall?lat=${myLat}&lon=${myLon}&appid=${weatherApiKey}&units=imperial`;

  const synthRef = useRef<Tone.PolySynth | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);


  useEffect(() => {
      // Create a filter
    filterRef.current = new Tone.Filter({
        type: "highpass",
        frequency: 50,
        Q: 1
    }).toDestination();
        // Create a synth and connect it to the filter
    synthRef.current = new Tone.PolySynth(Tone.FMSynth, {
        harmonicity: 1,
        modulationIndex: 5,
        oscillator: {
        type: "sine"
        },
        envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.2,
        release: 0.2
        },
        modulation: {
        type: "square"
        },
        modulationEnvelope: {
        attack: 0.5,
        decay: 0,
        sustain: 1,
        release: 0.5
        }
    }).connect(filterRef.current);
    if (!synthRef.current || !filterRef.current) return;
    console.log("playing C4 for weather");
    synthRef.current.triggerAttack('C4');
    
    const fetchWeather = async () => {
      try {
        const response = await axios.get(myWeatherRequest);
        setMyWeather(response.data.current);
        // if (response.data.current.clouds > 50) {
        //     console.log("playing cloud noise");
        //     cloudNoise();
        // }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div>
      {myWeather && (
        <h4>
          Temperature: {myWeather.temp}°F, Feels Like: {myWeather.feels_like}°F, Clouds: {myWeather.clouds}%
        </h4>
      )}
    </div>
  );
}