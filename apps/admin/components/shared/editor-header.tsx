interface EditorHeaderProps {
    title: string;
    subTitle: string;
    actions: React.ReactNode;
}
export default function EditorHeader({ title, subTitle, actions }: EditorHeaderProps) {
    return (
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
            <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <div className="flex items-center text-sm text-slate-500 mt-1 gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span>{subTitle}</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {actions}
            </div>
        </header>
    )
}