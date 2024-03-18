"use client"
import React, { useState, useEffect } from 'react';

interface ClientProps {
    title: string;
    metadata: string;
    locale: string;
}

const TextConvertor: React.FC<ClientProps> = ({ title, metadata,locale }) => {
    // Initialize state to store the current language from localStorage or default to 'he'
    // const [lang, setLang] = useState(localStorage.getItem('lang') ?? 'he');

    // Safely parse metadata from string to object
    const parseMetadata = (metadataString: string): object => {
        try {
            return JSON.parse(metadataString);
        } catch (error) {
            console.error("Failed to parse metadata:", error);
            return {}; // Return an empty object in case of error
        }
    };
    const metadataObj: { [key: string]: any } | null = metadata !== null ?  parseMetadata(metadata) : null;

       
    // Determine which text to display based on the current language
    const findTextForCurrentLang = (): string => {
        // Assuming metadata object keys are in the format "title_en", "title_he", etc.
        const textKey = metadataObj !== null ? Object.keys(metadataObj).find(key => key.endsWith(`_${locale}`)) : null;
        return textKey && metadataObj !== null ? metadataObj[textKey] : title; // Fallback to the title if no matching key is found
    };

    const text = findTextForCurrentLang();

    return <>{text}</>;
};

export default TextConvertor;
