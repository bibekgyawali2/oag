'use client'
import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { FormDataInterface } from "@/types/form"
import Link from "next/link"

export default function RecordForm() {
    const [formData, setFormData] = useState<FormDataInterface>({
        id: "",
        chalaniNumber: "",
        date: "",
        dartaNumber: "",
        dartaMiti: "",
        officeName: "",
        fiscalYear: "",
        asul: 0,
        aniyamit: 0,
        paperProof: 0,
        peski: 0,
        total: 0,
        chalaniNumber2: "",
        chalaniDate: "",
        ministry: "",
        barsikPratibedan: "",
        samparisayad_anurodh_rakam: 0,
        lagat_katta_ko_bibarad: "",
        samparisad_huna_nasakeko: "",
    })

    // Calculate total whenever asul, aniyamit, paperProof, or peski changes
    useEffect(() => {
        const total = (
            (Number(formData.asul) || 0) +
            (Number(formData.aniyamit) || 0) +
            (Number(formData.paperProof) || 0) +
            (Number(formData.peski) || 0)
        );
        setFormData((prev) => ({
            ...prev,
            total,
        }));
    }, [formData.asul, formData.aniyamit, formData.paperProof, formData.peski]);

    const handleInputChange = (field: keyof FormDataInterface, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: field === "asul" || field === "aniyamit" || field === "paperProof" || field === "peski" || field === "samparisayad_anurodh_rakam" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newRecord = {
            ...formData,
            id: Date.now().toString(),
        };

        try {
            await fetch('/api/records', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRecord),
            });

            setFormData({
                id: '',
                chalaniNumber: '',
                date: '',
                dartaNumber: '',
                dartaMiti: '',
                officeName: '',
                fiscalYear: '',
                asul: 0,
                aniyamit: 0,
                paperProof: 0,
                peski: 0,
                total: 0,
                chalaniNumber2: '',
                chalaniDate: '',
                ministry: '',
                barsikPratibedan: '',
                samparisayad_anurodh_rakam: 0,
                lagat_katta_ko_bibarad: '',
                samparisad_huna_nasakeko: '',
            });

        } catch (error) {
            console.error('Error saving record:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="container mx-auto space-y-6">
                {/* Header */}
                <div className="text-center py-6">
                    <h1 className="text-3xl font-bold text-gray-900">रेकर्ड व्यवस्थापन प्रणाली</h1>
                    <p className="text-gray-600 mt-2">Record Management System</p>
                    <Link href={"/records"}>Records</Link>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            नयाँ रेकर्ड थप्नुहोस् (Add New Record)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="chalaniNumber">चलानी नम्बर (Chalani Number)</Label>
                                    <Input
                                        id="chalaniNumber"
                                        value={formData.chalaniNumber}
                                        onChange={(e) => handleInputChange("chalaniNumber", e.target.value)}
                                        placeholder="चलानी नम्बर प्रविष्ट गर्नुहोस्"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">मिति (Date)</Label>
                                    <Input
                                        id="date"
                                        type="text"
                                        value={formData.date}
                                        onChange={(e) => handleInputChange("date", e.target.value)}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dartaNumber">दर्ता नम्बर (Darta Number)</Label>
                                    <Input
                                        id="dartaNumber"
                                        value={formData.dartaNumber}
                                        onChange={(e) => handleInputChange("dartaNumber", e.target.value)}
                                        placeholder="दर्ता नम्बर प्रविष्ट गर्नुहोस्"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dartaMiti">दर्ता मिति (Darta Date)</Label>
                                    <Input
                                        id="dartaMiti"
                                        type="text"
                                        value={formData.dartaMiti}
                                        onChange={(e) => handleInputChange("dartaMiti", e.target.value)}
                                        placeholder="YYYY-MM-DD"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="officeName">कार्यालयको नाम (Office Name)</Label>
                                    <Input
                                        id="officeName"
                                        value={formData.officeName}
                                        onChange={(e) => handleInputChange("officeName", e.target.value)}
                                        placeholder="कार्यालयको नाम प्रविष्ट गर्नुहोस्"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fiscalYear">आर्थिक वर्ष (Fiscal Year)</Label>
                                    <Input
                                        id="fiscalYear"
                                        value={formData.fiscalYear}
                                        onChange={(e) => handleInputChange("fiscalYear", e.target.value)}
                                        placeholder="२०८०/८१"
                                    />
                                </div>
                            </div>

                            <Separator />

                            {/* Price Amount Details */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">मूल्य विवरण (Price Details)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="asul">असुल (Asul)</Label>
                                        <Input
                                            id="asul"
                                            type="number"
                                            value={formData.asul}
                                            onChange={(e) => handleInputChange("asul", e.target.value)}
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="aniyamit">अनियमित (Aniyamit)</Label>
                                        <Input
                                            id="aniyamit"
                                            type="number"
                                            value={formData.aniyamit}
                                            onChange={(e) => handleInputChange("aniyamit", e.target.value)}
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="paperProof">कागजात प्रमाण (Paper Proof)</Label>
                                        <Input
                                            id="paperProof"
                                            type="number"
                                            value={formData.paperProof}
                                            onChange={(e) => handleInputChange("paperProof", e.target.value)}
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="peski">पेस्की (Peski)</Label>
                                        <Input
                                            id="peski"
                                            type="number"
                                            value={formData.peski}
                                            onChange={(e) => handleInputChange("peski", e.target.value)}
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="total">जम्मा (Total)</Label>
                                        <Input
                                            id="total"
                                            type="number"
                                            value={formData.total.toFixed(2)}
                                            readOnly
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Additional Information */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">अन्य विवरण (Other Details)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="chalaniNumber2">चलानी नम्बर (Chalani Number)</Label>
                                        <Input
                                            id="chalaniNumber2"
                                            value={formData.chalaniNumber2}
                                            onChange={(e) => handleInputChange("chalaniNumber2", e.target.value)}
                                            placeholder="चलानी नम्बर"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="chalaniDate">चलानी मिति (Chalani Date)</Label>
                                        <Input
                                            id="chalaniDate"
                                            type="text"
                                            value={formData.chalaniDate}
                                            onChange={(e) => handleInputChange("chalaniDate", e.target.value)}
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ministry">मन्त्रालय (Ministry)</Label>
                                        <Input
                                            id="ministry"
                                            value={formData.ministry}
                                            onChange={(e) => handleInputChange("ministry", e.target.value)}
                                            placeholder="मन्त्रालयको नाम"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="barsikPratibedan">बार्षिक प्रतिवेदन (Annual Report)</Label>
                                        <Input
                                            id="barsikPratibedan"
                                            value={formData.barsikPratibedan}
                                            onChange={(e) => handleInputChange("barsikPratibedan", e.target.value)}
                                            placeholder="बार्षिक प्रतिवेदन"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="samparisayad_anurodh_rakam">सम्परीक्ष्यद अनुरोध रकम (Samparisayad Anurodh Rakam)</Label>
                                        <Input
                                            id="samparisayad_anurodh_rakam"
                                            type="number"
                                            value={formData.samparisayad_anurodh_rakam}
                                            onChange={(e) => handleInputChange("samparisayad_anurodh_rakam", e.target.value)}
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lagat_katta_ko_bibarad">लगत कट्टाको विवरण (Lagat Katta Ko Bibarad)</Label>
                                        <Input
                                            id="lagat_katta_ko_bibarad"
                                            value={formData.lagat_katta_ko_bibarad}
                                            onChange={(e) => handleInputChange("lagat_katta_ko_bibarad", e.target.value)}
                                            placeholder="लगत कट्टाको विवरण"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="samparisad_huna_nasakeko">सम्परीक्षद हुन नसकेको (Samparisad Huna Nasakeko)</Label>
                                        <Input
                                            id="samparisad_huna_nasakeko"
                                            value={formData.samparisad_huna_nasakeko}
                                            onChange={(e) => handleInputChange("samparisad_huna_nasakeko", e.target.value)}
                                            placeholder="सम्परीक्षद हुन नसकेको"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" className="px-8">
                                    रेकर्ड सुरक्षित गर्नुहोस् (Save Record)
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}