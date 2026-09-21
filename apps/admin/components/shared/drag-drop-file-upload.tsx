"use client";
import { ReactNode } from "react";
import { UploadCloud, X, FileImage } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { useDragDropFileUpload, UseDragDropFileUploadProps, FileWithPreview } from "@/hooks/use-drag-drop-file-upload";

export type { FileWithPreview };

export type DragDropFileUploadProps = UseDragDropFileUploadProps & {
    className?: string;
    children?: (props: {
        files: FileWithPreview[],
        removeFile: (index: number) => void
    }) => ReactNode;
    size?: "default" | "small";
    headerIcon?: React.ElementType;
};

export default function DragDropFileUpload({
    initialFiles,
    onFilesChange,
    maxFiles = 5,
    acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
    // acceptedFileTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"],
    maxSizeInMB = 5,
    className,
    children,
    size = "default",
    headerIcon: HeaderIcon
}: DragDropFileUploadProps) {
    const {
        dragActive,
        files,
        handleDrag,
        handleDrop,
        handleClick,
        removeFile
    } = useDragDropFileUpload({
        initialFiles,
        onFilesChange,
        maxFiles,
        acceptedFileTypes,
        maxSizeInMB
    });

    // File size formatter (e.g. 1.5 MB)
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Helper to get simple extensions (e.g. ['image/jpeg', 'image/png'] -> 'JPEG, PNG')
    const getFormattedExtensions = () => {
        return acceptedFileTypes
            .map(type => {
                if (type.includes('/')) return type.split('/')[1].toUpperCase();
                return type.replace('.', '').toUpperCase();
            })
            .filter((val, index, self) => self.indexOf(val) === index) // Unique
            .join(', ');
    };

    return (
        <div className={cn("w-full space-y-4")}>
            {files.length < maxFiles &&
                <div
                    className={cn(
                        "relative border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 group overflow-hidden *:pointer-events-none",
                        size === "small" ? "gap-3 max-h-22! min-h-22!" : "flex-col h-59 min-h-50",
                        className,
                        dragActive
                            ? "border-primary bg-primary/5 scale-[0.99]"
                            : "border-[#CFE7D7] bg-[#F6F8F6] hover:bg-primary/5 hover:border-primary/50"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >

                    <div className={cn(
                        "bg-white rounded-full shadow-xs flex items-center justify-center transition-all duration-300",
                        size === "small" ? "size-10" : "size-14 mb-4",
                        dragActive ? "scale-110 shadow-md text-primary" : "group-hover:shadow-sm"
                    )}>
                        {dragActive
                            ? <UploadCloud className={cn("text-primary", size === "small" ? "size-5" : "size-6 ")} />
                            : HeaderIcon
                                ? <HeaderIcon className={cn("text-primary", size === "small" ? "size-5" : "size-6")} />
                                : <UploadCloud className={cn("text-primary", size === "small" ? "size-5" : "size-6")} />
                        }
                    </div>

                    <div className="flex flex-col items-center justify-center ">

                        <p className={cn("text-sm font-bold text-foreground mb-1",
                            size === "small" ? "mr-auto" : 'text-center'
                        )}>
                            {dragActive ? "Drop your files here!" :
                                <>
                                    <span className="group-hover:text-primary transition-all duration-200">
                                        Click {size !== "small" && "to upload"}
                                    </span> or drag {size !== "small" ? "and drop" : "file to upload"}
                                </>
                            }
                        </p>
                        <p className={cn("text-xs text-slate-500 font-medium w-full", size === "small" ? "text-left" : "text-center")}>
                            {getFormattedExtensions()} (Max. {maxSizeInMB}MB)
                        </p>

                        {size !== "small" && maxFiles > 1 && (
                            <div className="mt-4 px-3 py-1 bg-white rounded-full border border-[#CFE7D7] text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                Up to {maxFiles - files?.length || 0} {maxFiles - files?.length === 1 ? "file" : "files"} allowed
                            </div>
                        )}
                    </div>

                </div>}

            {/* File Previews */}
            {children ? (
                children({ files, removeFile })
            ) : (
                files.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {files.map((file, index) => {
                            const isImage = file.type.startsWith('image/');
                            return (
                                <div
                                    key={file.id}
                                    className="relative group bg-white border border-[#CFE7D7] rounded-xl p-2.5 flex items-center gap-3 pr-10 hover:border-primary/40 hover:shadow-sm transition-all animate-in fade-in zoom-in-95 duration-200"
                                >
                                    <div className="w-12 h-12 shrink-0 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                                        {isImage && file.preview ? (
                                            // eslint-disable-next-line
                                            <img
                                                src={file.preview}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FileImage className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>

                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-sm font-bold text-foreground truncate block">
                                            {file.name}
                                        </span>
                                        <span className="text-xs font-medium text-slate-500">
                                            {formatFileSize(file.size)}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeFile(index);
                                        }}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-full transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )
            )}
        </div>
    );
}