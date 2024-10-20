import { createContext, useState, useEffect } from "react";
import run from '../config/gemini';

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState('');
    const [recentPrompt, setRecentPrompt] = useState('');
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState('');

    const [isDarkMode, setIsDarkMode] = useState(false);

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord);
        }, index * 75);
    }

    const newChat = () => {
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {
        setResultData('');
        setLoading(true);
        setShowResult(true);
    
        let response;
    
        if (prompt !== undefined) {
            setPrevPrompts(prev => [...prev, prompt]);
            setRecentPrompt(prompt);  
            response = await run(prompt);
        } else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await run(input);
        }
    
        let responceArray = response.split('**');
        let newResponce = '';
        for (let i = 0; i < responceArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponce += responceArray[i].split('*').join(' ');
            } else {
                newResponce += "<br/><b>" + responceArray[i].split('*').join('<br/>') + "</b>";
            }
        }
    
        let newResponceArray = newResponce.split(' ');
        for (let i = 0; i < newResponceArray.length; i++) {
            const nextWord = newResponceArray[i];
            delayPara(i, nextWord + ' ');
        }
    
        setLoading(false);
        setInput('');
    };
    
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
        isDarkMode,
        toggleDarkMode
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )

}

export default ContextProvider;