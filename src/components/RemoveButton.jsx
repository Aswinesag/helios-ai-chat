import { FaTimes } from 'react-icons/fa';

// Reusable remove/clear button component
const RemoveButton = ({onClick}) => (
    <button className='p-2 bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-300' type='button'
    onClick={onClick}>
        <FaTimes className='w-4 h-4' />
    </button>
)

export default RemoveButton;
