// Main form component for user input, model selection and image/file upload

import { FaFileAlt, FaTimes, FaImage, FaBrain, FaTrash, FaRobot, FaPaperPlane } from 'react-icons/fa';
import UploadButton from './UploadButton.jsx';
import RemoveButton from './RemoveButton.jsx';

// Main prompt form component with text input, file uploads, model selection
export const PromptForm = ({
    prompt,
    onPromptChange,
    onSubmit,
    models,
    selectedModel,
    onModelChange,
    isVisionModel,
    isNovaFileModel,
    onImageChange,
    onFileChange,
    imageData,
    fileAttachment,
    clearImage,
    clearFile,
    loading,
    imageInputRef,
    fileInputRef,
}) => {
    // Disable submit button if no valid content or currently loading
    const disabledSubmit = (!prompt.trim() && !(isVisionModel && imageData) && !fileAttachment) || loading;

    return (
        <div className='bg-linear-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/50 rounded-2xl p-4
        backdrop-blur-sm shadow-2xl sm:p-6'>
            <form onSubmit={onSubmit}>
                <div className='relative'>
                    <textarea value={prompt} onChange={(e) => onPromptChange(e.target.value)} placeholder='Ask me Anything..' className='w-full bg-transparent border-none
                    outline-none text-zinc-200 placeholder-zinc-500 resize-none text-sm leading-relaxed min-h-15 max-h-27.5 focus:placeholder-zinc-600 transition-colors sm:text-base
                    sm:min-h-20' onKeyDown={(e) => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && onSubmit(e)}></textarea>

                    {/* Upload buttons section - conditionally shown based on model type */}
                    <div className='mt-3 mb-2 flex flex-row items-center gap-3 flex-wrap'>
                        {/* Image upload button - only shown for vision models */}
                        {isVisionModel && (
                            <UploadButton inputRef={imageInputRef} accept='image/*' onChange={onImageChange}
                            title='Attach Image' Icon={FaImage} iconClass='text-blue-300' />
                        )}

                        {/* File upload button - only shown for file models */}
                        {isNovaFileModel && (
                            <UploadButton inputRef={fileInputRef} accept='.txt,.md,.markdown,.json,.csv,.log,.yaml,
                            .yml,.xml' onChange={onFileChange} title='Attach File' Icon={FaFileAlt} iconClass='text-amber-300'  />
                        )}

                        {/* Image attachment preview*/}
                        {imageData && (
                            <div className='flex items-center gap-2'>
                                <div className='w-16 h-16 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-900'>
                                    <img src={imageData} alt='Upload preview' className='w-full h-full object-cover' />
                                </div>
                                <RemoveButton onClick={clearImage} />
                            </div>
                        )}

                        {/* File attachment preview*/}
                        {fileAttachment && (
                            <div className='flex items-center gap-2'>
                                <div className='px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs
                                text-zinc-300 max-w-50 truncate'>
                                    {fileAttachment.name}
                                </div>
                                <RemoveButton onClick={clearFile} />
                            </div>
                        )}
                    </div>

                    {/* Form footer with model selector and action buttons */}
                    <div className='flex flex-col justify-between pt-4 border-t border-zinc-700/50 gap-3 sm:flex-row sm:items-center sm:gap-0'>
                        {/* Left side - model selector and keyboard shortcut */}
                        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
                            {/* Model selector*/}
                            <label className='flex items-center gap-2 px-3 py-2 bg-black border border-zinc-700/50
                            rounded-xl text-sm text-white shadow-inner w-full sm:w-auto'>
                                <FaBrain className='w-3 h-3 text-blue-400 shrink-0 sm:w-4 sm:h-4' />
                                <select value={selectedModel.id} onChange={(e) => onModelChange(e.target.value)} className='bg-black border-none
                                focus:outline-none text-sm text-white pr-2 cursor-pointer flex-1 min-w-0'>
                                    {models.map((model) => (
                                        <option key={model.id} value={model.id} className='bg-black text-white'>
                                            {model.shortlabel}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            {/* Keyboard shortcut*/}
                            <div className='text-xs text-zinc-500 hidden sm:block'>
                                Press <kbd className='px-1.5 py-0 bg-zinc-800 border border=zinc-700 rounded text-zinc-400'>K</kbd>{' '} +
                                <kbd className='px-1.5 py-0 bg-zinc-800 border border=zinc-700 rounded text-zinc-400'>Enter</kbd>{' '} to send
                            </div>
                        </div>

                        {/* Right side action buttons*/}
                        <div className='flex items-center gap-2 w-full sm:w-auto'>
                            {/* Submit button with loading state */}
                            <button type='submit' disabled={disabledSubmit} className='flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600
                            hover:from-blue-500 hover:to-purple-500 disabled:from-zinc-700 disabled:to-zinc-800 disabled:opacity-50 border border-zinc-700 disabled:border-zinc-700
                            rounded-xl text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed'>
                                {loading ? (
                                    <div className='flex items-center justify-center gap-2'>
                                        <FaRobot className='w-4 h-4 animate-spin' />
                                        <span className='hidden sm:inline'>Thinking....</span>
                                    </div>
                                ) : (
                                    <div className='flex items-center justify-center gap-2'>
                                        <FaPaperPlane className='w-4 h-4' />
                                        <span>Send</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default PromptForm;