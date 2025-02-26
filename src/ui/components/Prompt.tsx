import React, { useEffect, useState } from "react";

export const GlobalPrompt = () => {
    const [prompt, setPrompt] = useState("");
    useEffect(() => {
        chrome.storage.sync.get("GlobalPrompt", (res) => {
            if (res.GlobalPrompt) {
                setPrompt(res.GlobalPrompt);
            } else {
                chrome.storage.sync.set({ GlobalPrompt: "" });
            }
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
    }
    const handleSave = async () => {
        await chrome.storage.sync.set({ GlobalPrompt: prompt });
    }
    return (
        <div className="mb-16">
            <h1 className="text-2xl font-semibold">Global Prompt</h1>
            <p className="text-gray-400">This is the global prompt that will be sent to the AI agents to solve the exam questions</p>
            <div className="flex flex-col gap-2 my-3">
                <label>Global Prompt</label>
                <textarea value={prompt} onChange={handleInputChange} className="p-2 bg-transparent border outline-none rounded-xl border-cyan-700" placeholder="Write your global prompt here"></textarea>
            </div>
            <button onClick={handleSave} className="w-full p-2 text-white bg-green-700 hover:bg-green-800 rounded-xl">Save</button>
        </div>
    )
}