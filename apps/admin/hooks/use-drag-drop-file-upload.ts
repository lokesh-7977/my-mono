import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface FileWithPreview extends File {
    id: string;
    preview: string;
}

export type UseDragDropFileUploadProps = {
    initialFiles?: FileWithPreview[] | File[];
    onFilesChange?: (files: File[]) => void;
    maxFiles?: number;
    acceptedFileTypes?: string[];
    maxSizeInMB?: number;
};

export function useDragDropFileUpload({
    initialFiles = [],
    onFilesChange,
    maxFiles = 5,
    acceptedFileTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"],
    maxSizeInMB = 5,
}: UseDragDropFileUploadProps = {}) {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<FileWithPreview[]>(initialFiles as FileWithPreview[]);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const validateFiles = (newFiles: File[]): FileWithPreview[] => {
        const validFiles: FileWithPreview[] = [];
        
        if (files.length + newFiles.length > maxFiles) {
            toast.error(`You can only upload up to ${maxFiles} files.`);
            return [];
        }

        for (const file of newFiles) {
            if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(file.type)) {
                toast.error(`File type for ${file.name} is not supported.`);
                continue;
            }
            if (file.size > maxSizeInMB * 1024 * 1024) {
                toast.error(`File ${file.name} exceeds the ${maxSizeInMB}MB limit.`);
                continue;
            }

            const isDuplicate = files.some(f => f.name === file.name && f.size === file.size) || 
                                validFiles.some(f => f.name === file.name && f.size === file.size);
            if (isDuplicate) {
                toast.error(`File ${file.name} is already added.`);
                continue;
            }
            
            // Generate preview URL and unique ID
            Object.assign(file, {
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                preview: URL.createObjectURL(file),
            });
            
            validFiles.push(file as FileWithPreview);
        }
        return validFiles;
    };

    const processFiles = useCallback((newFiles: File[]) => {
        const validFiles = validateFiles(newFiles);
        if (validFiles.length > 0) {
            const updatedFiles = [...files, ...validFiles];
            setFiles(updatedFiles);
            onFilesChange?.(updatedFiles);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files, maxFiles, acceptedFileTypes, maxSizeInMB, onFilesChange]);

    // Portal-mount the file input to document.body (Dropzone.js technique)
    // This isolates it from parent CSS transforms/transitions/overflow
    // which cause the Windows/Chromium file dialog flicker bug.
    useEffect(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = maxFiles > 1;
        input.accept = acceptedFileTypes.join(",");
        input.style.visibility = "hidden";
        input.style.position = "absolute";
        input.style.top = "0px";
        input.style.left = "0px";
        input.style.height = "0px";
        input.style.width = "0px";
        input.tabIndex = -1;

        document.body.appendChild(input);
        inputRef.current = input;

        return () => {
            document.body.removeChild(input);
            inputRef.current = null;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Attach change listener separately so it always has fresh state
    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        const onChangeHandler = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                const selectedFiles = Array.from(target.files);
                processFiles(selectedFiles);
            }
            // Reset so the same file can be selected again
            target.value = "";
        };

        input.addEventListener("change", onChangeHandler);
        return () => input.removeEventListener("change", onChangeHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files, maxFiles, acceptedFileTypes, maxSizeInMB]);

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    // Removed URL.revokeObjectURL cleanup to support React 18 Strict Mode remounting 
    // and persisting previews when navigating between form steps.

    const removeFile = (indexToRemove: number) => {
        const fileToRemove = files[indexToRemove];
        if (fileToRemove.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
    };

    return {
        dragActive,
        files,
        handleDrag,
        handleDrop,
        handleClick,
        removeFile
    };
}
