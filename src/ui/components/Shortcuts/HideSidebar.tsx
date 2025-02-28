import React, { useEffect } from "react";

import { useRecordHotkeys } from "react-hotkeys-hook";
import { ChromeEngine } from "../../../Chrome/Utils";

export const HideSidebar = () => {
    const [keys, { start, stop, isRecording }] = useRecordHotkeys()

    const [shortcut, setShortcut] = React.useState<string>("");
    const ConfigName = "ToggleSidebarShortcut";
    useEffect(() => {
        ChromeEngine.getLocalStorage(ConfigName).then((shortcut) => {
            setShortcut(shortcut as string);
        });
    }, []);

    useEffect(() => {
        if (shortcut) {
            ChromeEngine.setLocalStorage(ConfigName, shortcut);
        }
    }, [shortcut]);
    React.useEffect(() => {
        if (keys.size > 0) {
            setShortcut(Array.from(keys).join("+"))
        }
    }, [keys, setShortcut])
    return (
        <div>
            <h1 className="text-base text-gray-200">Shortcut to View/Hide Answer Box</h1>
            <h4 className="mb-3 text-xs font-medium text-gray-400">
                {isRecording ? <span className="animate-pulse">Press the keys for the shortcut, once you're done click on any letter</span> : "Click on the button to start recording the shortcut"}
            </h4>
            <div className="flex justify-center space-x-2" onClick={isRecording ? stop : start}>
                {shortcut.split("+").map((key, index) => (
                    <span key={index} className="p-2 text-lg font-bold text-center text-gray-200 bg-black cursor-pointer min-w-24 rounded-2xl">{key.toUpperCase()}</span>))}
            </div>

        </div>
    );

}