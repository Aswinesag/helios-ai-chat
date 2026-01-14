// Custom react components for rendering markdown content

import CodeBlock from './CodeBlock';

const asTag = (Tag, ClassName) => ({children}) => <Tag className={ClassName}>{children}</Tag>;

const markdownComponents = {
    code: CodeBlock,
    table: ({children}) => (
        <div className='overflow-x-auto'>
            <table className='min-w-full border-collapse border border-zinc-700'>{children}</table>
        </div>
    ),
    blockqoute: ({children}) => (
        <blockquote className='border-l-4 border-blue-500 pl-4 italic text-zinc-300 bg-zinc-800/50
        p-2 pb-1 rounded-r-lg mb-3'>
            {children}
        </blockquote>
    ),
    hr: () => <hr className='border-zinc-700 my-4' />,
    th: asTag('th', 'border border-zinc-700 p-2 text-left bg-zinc-800/50 font-semibold'),
    td: asTag('td', 'border border-zinc-700 p-2 text-left bg-zinc-800/50'),
    h1: asTag('h1', 'text-2xl font-bold mb-3'),
    h2: asTag('h2', 'text-xl font-semibold mb-2'),
    h3: asTag('h3', 'text-lg font-semibold mb-2'),
    h4: asTag('h4', 'text-base font-semibold mb-2'),
    p: asTag('p', 'mb-3 text-zinc-200'),
    ul: asTag('ul', 'list-disc list-inside space-y-1 mb-3'),
    ol: asTag('ol', 'list-decimal list-inside space-y-1 mb-3'),
    li: asTag('li', 'text-zinc-200'),
}

export default markdownComponents;