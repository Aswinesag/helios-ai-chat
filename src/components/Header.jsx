// Header component for the app

import { FaBolt, FaSignOutAlt } from 'react-icons/fa';

const Header = ({selectedModel, user, onSignOut}) => (
    <header className="border-b border-zinc-800/50 backdrop-blur-sm bg-zinc-900/30">
        <div className="max-wl-4xl mx-auto px-4 py-4 sm:px-6 lg:pl-16">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center
                    shadow-lg sm:w-8 sm:h-8">
                        <FaBolt  className='w-3 h-3 text-white sm:w-4 sm:h-4'/>
                    </div>
                    <div>
                        <h1 className='text-lg font-bold bg-linear-to-r from-white to-zinc-300 bg-clip-text text-transparent
                        sm:text-xl'>
                            Helios
                        </h1>
                        <p className='text-xs text-zinc-500'>Powered by OpenRouter</p>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    {user && (
                        <div className='flex items-center gap-2'>
                            <span className='text-xs text-zinc-400 hidden sm:inline'>
                                {user.email}
                            </span>
                            <button
                                onClick={onSignOut}
                                className='p-2 text-zinc-400 hover:text-red-400 transition-colors'
                                title='Sign Out'
                            >
                                <FaSignOutAlt className='w-4 h-4' />
                            </button>
                        </div>
                    )}
                    <div className='px-2 py-1 bg-zinc-800/60 border border-zinc-700/50 rounded-full text-xs
                    text-zinc-400 backdrop-blur-sm sm:px-3 sm:py-1.5'>
                        <span className='hidden sm:inline'>{selectedModel?.shortlabel}</span>
                        <span className='sm:hidden'>{selectedModel?.shortlabel?.split(' ')[0]}</span>
                    </div>
                    <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50'></div>
                </div>
            </div>
        </div>
    </header>
)

export default Header;