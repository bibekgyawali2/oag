// src/app/records/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface FormData {
    id: string;
    chalaniNumber: string;
    date: string;
    dartaNumber: string;
    dartaMiti: string;
    officeName: string;
    fiscalYear: string;
    asul: string;
    aniyamit: string;
    paperProof: string;
    peski: string;
    chalaniNumber2: string;
    chalaniDate: string;
    ministry: string;
    barsikPratibedan: string;
}

export default function RecordDetail() {
    const [record, setRecord] = useState<FormData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const id = params.id as string;

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/records');
                if (!response.ok) {
                    throw new Error('Failed to fetch records');
                }
                const records = await response.json();
                const foundRecord = records.find((r: FormData) => r.id === id);
                if (!foundRecord) {
                    throw new Error('Record not found');
                }
                setRecord(foundRecord);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRecord();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-6xl mx-auto">लोड हुँदैछ...</div>
            </div>
        );
    }

    if (error || !record) {
        return (
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-6xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>त्रुटि</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{error || 'रेकर्ड फेला परेन'}</p>
                            <Link href="/records">
                                <Button variant="outline" className="mt-4">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    फिर्ता
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>रेकर्ड विवरण</CardTitle>
                            <Link href="/records">
                                <Button variant="outline">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    फिर्ता
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">चलानी नम्बर</h3>
                                    <p>{record.chalaniNumber || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">मिति</h3>
                                    <p>{record.date || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">दर्ता नम्बर</h3>
                                    <p>{record.dartaNumber || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">दर्ता मिति</h3>
                                    <p>{record.dartaMiti || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">कार्यालयको नाम</h3>
                                    <p>{record.officeName || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">आर्थिक वर्ष</h3>
                                    <p>{record.fiscalYear || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">मन्त्रालय</h3>
                                    <p>{record.ministry || '-'}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">असुल</h3>
                                    <p>{record.asul || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">अनियमित</h3>
                                    <p>{record.aniyamit || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">कागजात प्रमाण</h3>
                                    <p>{record.paperProof || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">पेस्की</h3>
                                    <p>{record.peski || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">चलानी नम्बर २</h3>
                                    <p>{record.chalaniNumber2 || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">चलानी मिति</h3>
                                    <p>{record.chalaniDate || '-'}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">बार्षिक प्रतिवेदन</h3>
                                    <p>{record.barsikPratibedan || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}