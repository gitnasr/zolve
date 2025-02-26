import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";

export const Claude = () => {
    const [serverURL, setServerURL] = useState("http://localhost");
    const [port, setPort] = useState(3005);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {

        chrome.storage.sync.get("ClaudeConfig", (res) => {

            if (res.ClaudeConfig) {
                setServerURL(res.ClaudeConfig.serverURL);
                setPort(res.ClaudeConfig.port);
            } else {
                chrome.storage.sync.set({ ClaudeConfig: { serverURL, port } });
            }
        });
    }, [])
    const handleSave = async () => {
        setIsLoading(true);
        await chrome.storage.sync.set({ ClaudeConfig: { serverURL, port } });
        setIsLoading(false);
        toast.success('Successfully Updated!')


    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === "number") {
            setPort(parseInt(e.target.value));
        } else {
            setServerURL(e.target.value);
        }

    }
    return (
        <div className="mb-16">
            <h1 className="text-xl font-semibold">Claude API Options</h1>
            <p className="text-sm text-gray-400">This options for claude server reversed API, Download it From <a href="https://github.com/gitnasr/zolve/releases/latest" target="_blank" className="underline decoration-cyan-400 underline-offset-2">here.</a></p>
            <div className="flex flex-col flex-wrap w-full gap-4 my-3">
                <div className="flex flex-col gap-2">
                    <label>Server URL</label>
                    <input
                        onChange={handleOnChange}
                        value={serverURL}
                        type="text" placeholder="http://localhost" className="p-2 bg-transparent border outline-none rounded-xl border-cyan-700" />
                </div>
                <div className="flex flex-col gap-2">
                    <label>Port</label>
                    <input
                        onChange={handleOnChange}
                        value={port}
                        type="number" className="p-2 bg-transparent border outline-none rounded-xl border-cyan-700" placeholder="3005" />
                </div>

                <button disabled={isLoading} onClick={handleSave} className="w-full p-2 text-white bg-green-700 hover:bg-green-800 rounded-xl disabled:bg-green-900 disabled:cursor-not-allowed">Save</button>

            </div>
            <small>These default values are the values that are compatible with our Python server. <br /> DO NOT CHANGE them unless you know what you're doing</small>

        </div>
    )
}