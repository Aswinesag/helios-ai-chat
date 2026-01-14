// Reusable upload button component with hidden file input

const UploadButton = ({ inputRef, accept, onChange, title, iconClass, Icon }) => (
    <label className='inline-flex items-center gap-2 px-3 py-2 border border-zinc-700/50 rounded-xl text-sm text-zinc-300 shadow-inner cursor-pointer shrink-0 self-start' title={title}>
        <Icon className={`w-4 h-4 ${iconClass || ''}`} />
        <input type='file' ref={inputRef} accept={accept} onChange={onChange} className='hidden'/>
        <span className='sr-only'>{title}</span>
    </label>
)

export default UploadButton;
