// Quick action buttons components providing preset prompts for common AI assistant tasks

import { FaBug, FaBolt, FaFileAlt} from 'react-icons/fa';

// Predefined quick actions configuration with icons, labels and prompts
const QUICK_ACTIONS = [
    { icon: FaFileAlt, label: 'Write a cover letter', prompt: 'Write a cover letter for the position of'},
    { icon: FaBug, label: 'Find bugs in the code', prompt: 'Find bugs in the code and fix them'},
    { icon: FaBolt, label: 'Optimize the code', prompt: 'Optimize the code for better performance'},
]

const QuickActions = ({ onselect }) => (
    <div className='text-center'>
        {/*Section description*/}
        <p className='text-sm text-zinc-500'>
            Select a quick action to get started
        </p>
        {/*Quick Action Button grid*/}
        <div className='flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap sm:gap-3'>
            {QUICK_ACTIONS.map(({icon: Icon, label, prompt}) => (
                <button key={label} onClick={() => onselect(prompt)} className='group flex items-center justify-center
                gap-2 px-4 py-2.5 bg-linear-to-r from-zinc-900/80 to-zinc-800/80 hover:from-zinc-800/80 hover:to-zinc-700/80
                border border-zinc-700/50 hover:border-zinc-600/50 rounded-xl text-zinc-300 hover:text-zinc-200 transition-all
                duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl'>
                    <div className='text-blue-400 group-hover:text-blue-300 transition-colors'>
                        <Icon className='w-4 h-4' />
                    </div> 
                    <span className='text-center sm:text-left'>{label}</span>
                </button>
            ))}
        </div>
    </div>
)

export default QuickActions;
