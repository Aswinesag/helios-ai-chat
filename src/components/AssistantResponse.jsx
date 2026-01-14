// Component that displays the AI assistant's reponse with markdown rendering and typing animation

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FaRobot } from 'react-icons/fa';
import markdownComponents from './markdown/markdownComponents';

const AssistantResponse = ({answer, displayedAnswer, selectedModel}) => {
    // Use displayed answer for typing animation , fallback to full answer
    const content = displayedAnswer || answer
    if(!content) return null

    return (
        <div className='bg-linear-to-br from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 rounded-2xl p-4 backdrop-blur-sm shadow-2xl sm:p-6'>
            <div className='w-7 h-7 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center
            justify-center shrink-0 shadow-lg sm:w-8 sm:h-8'>
                <FaRobot className='w-4 h-4 text-white sm:w-5 sm:h-5'/>
            </div>
            <div className='flex-1 min-w-0'>
                <div className='flex flex-col gap-1 mb-2 sm:flex-row sm:items-center sm:gap-2 sm:mb-3'>
                    <p className='text-sm font-medium text-zinc-300'>Assistant</p>
                    <span className='px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full self-start sm:self-auto'>
                        {selectedModel.shortlabel}
                    </span>
                </div>
                <div className='prose prose-invert prose-sm max-w-none text-zinc-200 leading-relaxed text-sm
                wrap-break-word prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:overflow-x-auto
                prose-code:break-words'>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {content}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}

export default AssistantResponse;