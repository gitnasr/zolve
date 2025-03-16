import "../../../../public/index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Claude } from "../../components/Claude";
import { Cloudflare } from "../../components/Cloudflare";
import { HideSidebar } from "../../components/Shortcuts/HideSidebar";

const Options = () => {

    return (
        <>
            <Toaster position="bottom-center" />
            <div className="min-h-screen p-4 text-white bg-gray-950">
                <h1 className="my-5 text-2xl font-bold">Options</h1>
                <div className="container p-4 bg-gray-800 border border-gray-700 rounded-xl">
                    <h1 className="text-xl font-bold">Keyboard Shortcuts</h1>
                    <HideSidebar />
                    <h1 className="text-xl font-bold">Customize Your AI Agents</h1>
                    <div className="flex flex-col">
                        <h4 className="text-sm font-medium text-gray-400" >See How to Modify <a href="https://zolve.gitnasr.com/docs" className="underline underline-offset-1" target="_blank">here</a></h4>
                        <Claude />
                        <Cloudflare />
                    </div>

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