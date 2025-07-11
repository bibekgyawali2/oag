'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { FormDataInterface } from '@/types/form';
import { X } from 'lucide-react';

interface RecordDetailDialogProps {
    record: FormDataInterface | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RecordDetailDialog({ record, open, onOpenChange }: RecordDetailDialogProps) {
    if (!record) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>रेकर्ड विवरण (Record Details)</DialogTitle>
                    <DialogDescription>तलको रेकर्डको विस्तृत जानकारी।</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">चलानी नम्बर:</span>
                        <span className="col-span-3">{record.chalaniNumber}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">मिति:</span>
                        <span className="col-span-3">{record.date}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">दर्ता नम्बर:</span>
                        <span className="col-span-3">{record.dartaNumber}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">दर्ता मिति:</span>
                        <span className="col-span-3">{record.dartaMiti}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">कार्यालय:</span>
                        <span className="col-span-3">{record.officeName}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">आर्थिक वर्ष:</span>
                        <span className="col-span-3">{record.fiscalYear}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">असुल:</span>
                        <span className="col-span-3">{record.asul}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">अनियमित:</span>
                        <span className="col-span-3">{record.aniyamit}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">कागजात प्रमाण:</span>
                        <span className="col-span-3">{record.paperProof}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">पेस्की:</span>
                        <span className="col-span-3">{record.peski}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">जम्मा:</span>
                        <span className="col-span-3">{record.total}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">चलानी नम्बर २:</span>
                        <span className="col-span-3">{record.chalaniNumber2}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">चलानी मिति:</span>
                        <span className="col-span-3">{record.chalaniDate}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">मन्त्रालय:</span>
                        <span className="col-span-3">{record.ministry}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">वार्षिक प्रतिवेदन:</span>
                        <span className="col-span-3">{record.barsikPratibedan}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">सम्परीक्ष्यद अनुरोध रकम:</span>
                        <span className="col-span-3">{record.samparisayad_anurodh_rakam}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">लागत कट्टाको विवरण:</span>
                        <span className="col-span-3">{record.lagat_katta_ko_bibarad}</span>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-medium">सम्परीक्षद हुन नसकेको:</span>
                        <span className="col-span-3">{record.samparisad_huna_nasakeko}</span>
                    </div>
                </div>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}