import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { CloudflareConfig } from "../../types";

export const Cloudflare = () => {

    const [apiEndpoint, setEndpoint] = useState("https://api.cloudflare.com")
    const [accountId, setAccountId] = useState("")
    const [modelName, setModelName] = useState("")
    const [apiKey, setApiKey] = useState("")

    const [showAccountId, setShowAccountId] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        chrome.storage.sync.get("CloudflareConfig", (res) => {
            if (res.CloudflareConfig) {
                const { apiEndpoint, accountId, modelName, apiKey } = res.CloudflareConfig as CloudflareConfig;
                setEndpoint(apiEndpoint);
                setAccountId(accountId);
                setModelName(modelName);
                setApiKey(apiKey);
            }
        })
    }, [isLoading])
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const value = e.target.value;
        setter(value);



    };

    const handleSave = async () => {
        setIsLoading(true);
        chrome.storage.sync.set({
            CloudflareConfig: {
                apiEndpoint,
                accountId,
                modelName,
                apiKey,
            }
        }, () => {
            if (chrome.runtime.lastError) {
                toast.error("Failed to save settings");
                return;
            } else {
                toast.success("Successfully Updated!")
            }
            setIsLoading(false);

        });
    }
    return (
        <>
            <h1 className="text-lg font-medium">Cloudflare Workers</h1>
            <p className="text-sm text-gray-400">
                This options for Cloudflare AI Workers, Know More From{" "}
                <a
                    href="https://zolve.gitnasr.com/docs/options/cloudflare"
                    target="_blank"
                    className="underline decoration-cyan-400 underline-offset-2"
                >
                    here.
                </a>
            </p>
            <div className="flex flex-col flex-wrap gap-4 my-3">
                <div className="flex flex-col gap-2">
                    <label>Endpoint</label>
                    <input type="text" placeholder={apiEndpoint} onChange={(e) => handleInputChange(e, setEndpoint)} name="apiEndpoint" value={apiEndpoint} className="p-2 bg-transparent border outline-none rounded-xl border-cyan-700" />
                </div>
                <div className="flex flex-col gap-2">
                    <label>Account ID</label>
                    <div className="relative">
                        <input
                            name="accountId"

                            onChange={(e) => handleInputChange(e, setAccountId)}

                            type={showAccountId ? "text" : "password"}
                            className="w-full p-2 bg-transparent border outline-none rounded-xl border-cyan-700"
                            placeholder="xxxxxxxxxxxxxxxx"
                            value={accountId}
                        />
                        <button
                            type="button"
                            onClick={() => setShowAccountId(!showAccountId)}
                            className="absolute -translate-y-1/2 right-2 top-1/2 text-cyan-400"
                        >
                            👁️
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label>Model Name</label>
                    <input
                        value={modelName}
                        onChange={(e) => handleInputChange(e, setModelName)}
                        type="text"
                        name="modelName"

                        className="p-2 bg-transparent border outline-none rounded-xl border-cyan-700" placeholder="@cf/johne-doe" />
                </div>
                <div className="flex flex-col gap-2">
                    <label>API Key</label>
                    <div className="relative">
                        <input
                            name="apiKey"
                            onChange={(e) => handleInputChange(e, setApiKey)}
                            value={apiKey}
                            type={showApiKey ? "text" : "password"}
                            className="w-full p-2 bg-transparent border outline-none rounded-xl border-cyan-700"
                            placeholder="*****"
                        />
                        <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute -translate-y-1/2 right-2 top-1/2 text-cyan-400"
                        >
                            👁️
                        </button>
                    </div>
                </div>
                <button disabled={isLoading} onClick={handleSave} className="w-full p-2 text-white bg-green-700 hover:bg-green-800 rounded-xl disabled:bg-green-900 disabled:cursor-not-allowed">Save</button>

            </div>
        </>
    )
}