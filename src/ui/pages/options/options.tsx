import "../../../../public/index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Claude } from "../../components/Claude";
import { Cloudflare } from "../../components/Cloudflare";
import { GlobalPrompt } from "../../components/Prompt";

const Options = () => {

    return (
        <>
            <Toaster position="bottom-center" />
            <div className="min-h-screen p-4 text-white bg-gray-950">
                <h1 className="my-5 text-2xl font-bold">Options</h1>
                <div className="container p-4 bg-gray-800 border border-gray-700 rounded-xl">
                    <GlobalPrompt />
                    <Claude />
                    <Cloudflare />
                </div>
            </div>

        </>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Options />
    </React.StrictMode>
);