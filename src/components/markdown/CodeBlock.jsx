import { useState } from "react";

const CodeBlock = ({ inline, className, children, ...props}) => {
    const [copied, setCopied] = useState(false);

    const match = /language-(\w+)/.exec(className || '');

    const codeText = Array.isArray(children) ? children.join('') : children;

    const handleCopy = () => {
        if(typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(codeText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }
    if(!inline && match) {
        return (
            <div className="relative group mb-4">
                <pre className="bg-zinc-900/70 border-zinc-700 rounded-lg p-4 overflow-x-auto">
                    <code className={className} {...props}>
                        {children}
                    </code>
                </pre>
                <button type="button" onClick={handleCopy} className="absolute top-2 right-2 px-2 py-1 rounded-md bg-zinc-800/80 border
                border-zinc-700 text-xs text-zinc-300 hover:bg-zinc-700 focus:outline-none shadow-sm transition-opacity opacity-0
                group-hover:opacity-100">
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
        )
    }
    return (
        <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200" {...props}>
            {children}
        </code>
    )
}

export default CodeBlock;