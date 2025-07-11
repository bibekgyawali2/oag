// src/app/records/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { FormDataInterface } from '@/types/form';
import { withAuth } from '@/lib/withAuths';
import { RecordDetailDialog } from '@/component/record-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming Shadcn/UI Select component

function RecordsPage() {
    const [records, setRecords] = useState<FormDataInterface[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<FormDataInterface[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterField, setFilterField] = useState<keyof FormDataInterface>('chalaniNumber');
    const [selectedMinistry, setSelectedMinistry] = useState<string>('all');
    const [selectedOffice, setSelectedOffice] = useState<string>('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<FormDataInterface | null>(null);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/records', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setRecords(data);
            setFilteredRecords(data);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    // Compute unique ministries and offices for dropdowns
    const ministries = useMemo(() => {
        const unique = new Set(records.map((record) => record.ministry));
        return ['all', ...unique];
    }, [records]);

    const offices = useMemo(() => {
        const unique = new Set(records.map((record) => record.officeName));
        return ['all', ...unique];
    }, [records]);

    // Handle filtering
    useEffect(() => {
        let result = records;

        // Apply ministry filter
        if (selectedMinistry !== 'all') {
            result = result.filter((record) => record.ministry === selectedMinistry);
        }

        // Apply office filter
        if (selectedOffice !== 'all') {
            result = result.filter((record) => record.officeName === selectedOffice);
        }

        // Apply search filter
        if (searchTerm) {
            result = result.filter((record) =>
                String(record[filterField])
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }

        setFilteredRecords(result);
    }, [records, selectedMinistry, selectedOffice, searchTerm, filterField]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterFieldChange = (value: string) => {
        setFilterField(value as keyof FormDataInterface);
        setSearchTerm('');
    };

    const handleViewRecord = (record: FormDataInterface) => {
        setSelectedRecord(record);
        setDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="container mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            रेकर्डहरू (Records)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 flex gap-4 flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                                <Input
                                    placeholder="खोज्नुहोस्..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full"
                                />
                            </div>
                            <Select value={filterField} onValueChange={handleFilterFieldChange}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="फिल्टर क्षेत्र" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="chalaniNumber">चलानी नम्बर</SelectItem>
                                    <SelectItem value="dartaNumber">दर्ता नम्बर</SelectItem>
                                    <SelectItem value="officeName">कार्यालयको नाम</SelectItem>
                                    <SelectItem value="fiscalYear">आर्थिक वर्ष</SelectItem>
                                    <SelectItem value="ministry">मन्त्रालय</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedMinistry} onValueChange={setSelectedMinistry}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="मन्त्रालय छान्नुहोस्" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">सबै मन्त्रालय</SelectItem>
                                    {ministries
                                        .filter((ministry) => ministry !== 'all')
                                        .map((ministry) => (
                                            <SelectItem key={ministry} value={ministry}>
                                                {ministry}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedOffice} onValueChange={setSelectedOffice}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="कार्यालय छान्नुहोस्" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">सबै कार्यालय</SelectItem>
                                    {offices
                                        .filter((office) => office !== 'all')
                                        .map((office) => (
                                            <SelectItem key={office} value={office}>
                                                {office}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>चलानी नम्बर</TableHead>
                                        <TableHead>मिति</TableHead>
                                        <TableHead>दर्ता नम्बर</TableHead>
                                        <TableHead>कार्यालय</TableHead>
                                        <TableHead>आर्थिक वर्ष</TableHead>
                                        <TableHead>मन्त्रालय</TableHead>
                                        <TableHead>कार्य</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRecords.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>{record.chalaniNumber}</TableCell>
                                            <TableCell>{record.date}</TableCell>
                                            <TableCell>{record.dartaNumber}</TableCell>
                                            <TableCell>{record.officeName}</TableCell>
                                            <TableCell>{record.fiscalYear}</TableCell>
                                            <TableCell>{record.ministry}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewRecord(record)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    हेर्नुहोस्
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <RecordDetailDialog
                record={selectedRecord}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </div>
    );
}

export default RecordsPage;