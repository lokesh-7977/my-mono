"use client";

import DragDropFileUpload from "@/components/shared/drag-drop-file-upload";
import FormInput from "@/components/shared/form-input";
import FormLabel from "@/components/shared/form-label";
import FormSelect from "@/components/shared/form-select";
import { Button } from "@/components/ui/button";
import { getYear } from "date-fns";
import { Trash2, Eye, FileText, PlusCircle } from "lucide-react";
import { useState } from "react";

const region = [
    { id: "1", title: "Himachal Pradesh" },
    { id: "2", title: "Uttarakhand" },
    { id: "3", title: "Ladakh" },
]

const BASE_ITEM = {
    id: "",
    certificationType: "",
    issuingAuthority: "",
    yearOfCertification: "",
    file: null,
    title: ""
}

type UserCerts = {
    certificationType: string,
    issuingAuthority: string,
    yearOfCertification: string,
    file: File | null,
    title?: string,
    id?: string
}

type Props = {
    requiredCerts?: string[];
    initialCerts?: UserCerts[];
}

export default function CertificateStep({
    requiredCerts = ["Identity Verification"],
    initialCerts = []
}: Props) {
    const currentYear = getYear(new Date());
    // const yearOptions = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => {
    const yearOptions = Array.from({ length: 50 }, (_, i) => {
        const year = (currentYear - i).toString();
        return { value: year, label: year };
    });

    const [relatedCerts, setRelatedCerts] = useState(() => {
        if (initialCerts && initialCerts.length > 0) {
            return initialCerts.map(cert => ({
                ...BASE_ITEM,
                ...cert,
                id: cert.id || crypto.randomUUID()
            }));
        }
        return requiredCerts.map(title => ({ ...BASE_ITEM, title, id: crypto.randomUUID() }));
    });

    const updateCert = (id: string, patch: Partial<UserCerts>) =>
        setRelatedCerts(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)));

    return (
        <>
            <h4 className="text-sm font-semibold mb-3">Certification</h4>
            <div className="space-y-5">
                {relatedCerts.map((cert) => (
                    <div key={cert.id} className="border border-border rounded-xl p-4 space-y-1.5">
                        <div className="w-full flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-lg">{cert.title || "Additional Certification"}</h5>
                            {cert.title ? (
                                <span className="text-xs font-medium ml-auto bg-primary text-white rounded-full px-2.5 py-px">Required</span>
                            ) : (
                                <Button
                                    variant={"ghost"}
                                    size={"icon-sm"}
                                    onClick={() => setRelatedCerts(prev => prev.filter(c => c.id !== cert.id))}
                                    className="ml-auto text-danger-red hover:text-red-600 transition-colors cursor-pointer"
                                >
                                    <Trash2 />
                                </Button>
                            )}
                        </div>
                        <div className="grid grid-cols-[1fr_1fr_0.7fr] gap-4">
                            <FormSelect
                                label="Certification"
                                value={cert.certificationType}
                                onChange={(val) => updateCert(cert.id, { certificationType: val })}
                                required
                                options={region.map(r => ({ value: r.id, label: r.title }))}
                                placeholder="Select certificate type"
                            />
                            <FormInput
                                label={"Issuing Authority"}
                                value={cert.issuingAuthority}
                                onChange={(val) => updateCert(cert.id, { issuingAuthority: val })}
                                placeholder="e.g. Nehru Institute of Mountaineering"
                                maxLength={100}
                                required
                            />
                            <FormSelect
                                label="Year of Certification"
                                value={cert.yearOfCertification}
                                onChange={(val) => updateCert(cert.id, { yearOfCertification: val })}
                                required
                                options={yearOptions}
                                placeholder="Select Year"
                            />
                        </div>

                        <div className="space-y-2">
                            <FormLabel label="Upload Certificate" required />
                            <DragDropFileUpload
                                initialFiles={[]}
                                size="small"
                                maxFiles={1}
                                acceptedFileTypes={["application/pdf", "image/jpeg", "image/png", "image/webp"]}
                            //   onFilesChange={(newFiles) => onChange(prev => ({ ...prev, gallery: newFiles }))}
                            >
                                {({ files, removeFile }) => (
                                    files.length > 0 && (
                                        <div className="flex items-center justify-between border border-border rounded-lg p-3 mt-4 bg-white shadow-sm">
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className="bg-primary rounded-lg size-10 flex items-center justify-center shrink-0">
                                                    <FileText className="text-white size-6" />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-sm font-semibold text-foreground truncate">
                                                        {files[0].name}
                                                    </span>
                                                    <span className="text-xs font-medium text-foreground/60 mt-0.5">
                                                        {(files[0].size / (1024 * 1024)).toFixed(1)} MB
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-5 shrink-0 ml-4">
                                                <button type="button" onClick={() => window.open(files[0].preview, '_blank')} className="text-[#8E9EAB] hover:text-foreground/80 transition-colors cursor-pointer">
                                                    <Eye className="size-5" />
                                                </button>
                                                <button type="button" onClick={() => removeFile(0)} className="text-danger-red hover:text-red-600 transition-colors cursor-pointer">
                                                    <Trash2 className="size-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </DragDropFileUpload>

                        </div>
                    </div>
                ))}

                <div className="flex justify-end mt-2">
                    <Button
                        variant={"outline"}
                        onClick={() => setRelatedCerts(prev => [...prev, { ...BASE_ITEM, id: crypto.randomUUID() }])}
                        className="flex items-center gap-2 px-4 h-10! border-primary text-primary bg-primary/10 hover:bg-primary hover:text-white cursor-pointer transition-colors font-semibold text-sm!"
                    >
                        <PlusCircle className="size-4" />
                        Add Certification
                    </Button>
                </div>
            </div>
        </>
    )
}