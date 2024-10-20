import React, { useContext, useRef, useState } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'

const Main = () => {
    
    const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context)

    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); // State to toggle dark/light mode


    const handleMicClick = () => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'en-US';
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;
    
            recognitionRef.current.onstart = () => {
                setIsListening(true);
            };
    
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
    
                // Call onSent with the recognized speech to add it to "Recent"
                onSent(transcript);
            };
    
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
    
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
    
            recognitionRef.current.start();
        } else {
            console.error('Speech recognition is not supported in this browser.');
        }
    };
    

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input.trim()) {
            onSent();
        }
    };

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <div className={`main ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className='nav'>
                <p>Gemini</p>
                <div className='cont'>
                <img src={assets.user_icon} alt='' />
                <div className="dark-mode-toggle" onClick={toggleDarkMode}> {/* Toggle Button */}
                    {isDarkMode ? <img src={assets.gemini_icon} alt="Light Mode" /> : <img src={assets.bulb_icon} alt="Dark Mode" />}
                </div>
                </div>
            </div>
            
            <div className='main-container'>

                {!showResult
                    ? <>
                        <div className='greet'>
                            <p><span>Hello, Rahul.</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className='cards'>
                            <div className='card' onClick={() => onSent("Suggest beautiful places to see on next road trip")}>
                                <p>Suggest beautiful places to see on next road trip</p>
                                <img src={assets.compass_icon} alt='' />
                            </div>
                            <div className='card' onClick={() => onSent("Briefly summarise this concept: OOPs")}>
                                <p>Briefly summarise this concept: OOPs</p>
                                <img src={assets.bulb_icon} alt='' />
                            </div>
                            <div className='card' onClick={() => onSent("Differences between a stack and a queue?")}>
                                <p>Differences between a stack and a queue?</p>
                                <img src={assets.message_icon} alt='' />
                            </div>
                            <div className='card' onClick={() => onSent('What are the key features of React?')}>
                                <p>What are the key features of React?</p>
                                <img src={assets.code_icon} alt='' />
                            </div>
                        </div>

                    </>
                    : <div className='result'>
                        <div className='result-title'>
                            <img src={assets.user_icon} alt='' />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className='result-data'>
                            <img src={assets.gemini_icon} alt='' />
                            {loading
                                ? <div className='loader'>
                                    <hr />
                                    <hr />
                                    <hr />
                                </div>
                                : <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            }
                        </div>
                    </div>
                }

                <div className='main-bottom'>
                    <div className='search-box'>
                        <input onChange={(e) => setInput(e.target.value)}
                            value={input} type='text'
                            placeholder='Enter a prompt here'
                            onKeyDown={handleKeyDown}
                        />
                        <div>
                            <img src={assets.gallery_icon} 
                                alt="Gallery" 
                                style={{ cursor: 'pointer' }} 
                            />
                            <img
                                onClick={handleMicClick}
                                src={isListening ? assets.gemini_icon : assets.mic_icon}
                                alt='Mic icon'
                            />
                            {input ? <img onClick={() => onSent()} src={assets.send_icon} alt='' /> : null}
                        </div>
                    </div>
                    {isListening && <div className='listening-indicator'>Listening...</div>}

                    <p className='bottom-info'>
                        Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main
