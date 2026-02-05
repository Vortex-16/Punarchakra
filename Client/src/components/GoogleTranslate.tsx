"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

export default function GoogleTranslate() {
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;

        // callback function
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,hi,bn,te,ta,kn,mr,gu,pa,ml,es,fr,de", // Added more Indian languages + major global
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                "google_translate_element"
            );
        };

        // load script
        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);

        isInitialized.current = true;
    }, []);

    return (
        <div className="google-translate-container">
            <div id="google_translate_element" />
            <style jsx>{`
                /* Hide the Google Translate top bar */
                :global(.goog-te-banner-frame) {
                    display: none !important;
                }
                :global(body) {
                    top: 0px !important;
                }
                /* Customize the gadget */
                :global(.goog-te-gadget-simple) {
                    background-color: transparent !important;
                    border: 1px solidhsl(var(--border)) !important;
                    padding: 8px !important;
                    border-radius: 8px !important;
                    font-size: 14px !important;
                    line-height: 20px !important;
                    display: inline-block;
                    cursor: pointer;
                    zoom: 1;
                    width: 100%;
                }
                :global(.goog-te-menu-value) {
                    color: inherit !important;
                }
                :global(.goog-te-gadget-icon) {
                    display: none !important;
                }
            `}</style>
        </div>
    );
}
