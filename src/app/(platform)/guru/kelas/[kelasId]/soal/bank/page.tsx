"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowBackIos, FolderCopy } from "@mui/icons-material";
import {
    SoalClusterCard,
    QuestionPreviewModal,
    QuestionEditModal,
    type Question,
} from "@/components/guru";
import Swal from "sweetalert2";

// Dummy data - replace with API call
const dummyQuestions: Question[] = [
    {
        id: "1",
        questionType: "C1",
        questionFile: null,
        questionFilePreview: null,
        questionText: "Apa yang dimaksud dengan pecahan?",
        answerType: "Tulisan",
        answerFile: null,
        answerFilePreview: null,
        answerText: "Pecahan adalah bilangan yang menyatakan bagian dari keseluruhan",
        timeValue: 5,
        timeUnit: "Menit",
    },
    {
        id: "2",
        questionType: "C1",
        questionFile: null,
        questionFilePreview: null,
        questionText: "Sebutkan jenis-jenis pecahan!",
        answerType: "Tulisan",
        answerFile: null,
        answerFilePreview: null,
        answerText: "Pecahan biasa, pecahan campuran, pecahan desimal",
        timeValue: 3,
        timeUnit: "Menit",
    },
    {
        id: "3",
        questionType: "C2",
        questionFile: null,
        questionFilePreview: null,
        questionText: "Jelaskan perbedaan antara pecahan biasa dan pecahan campuran!",
        answerType: "Tulisan",
        answerFile: null,
        answerFilePreview: null,
        answerText:
            "Pecahan biasa hanya terdiri dari pembilang dan penyebut, sedangkan pecahan campuran terdiri dari bilangan bulat dan pecahan",
        timeValue: 7,
        timeUnit: "Menit",
    },
    {
        id: "4",
        questionType: "C2",
        questionFile: null,
        questionFilePreview: null,
        questionText: "Bagaimana cara mengubah pecahan biasa menjadi pecahan campuran?",
        answerType: "Tulisan",
        answerFile: null,
        answerFilePreview: null,
        answerText:
            "Bagi pembilang dengan penyebut, hasil bagi menjadi bilangan bulat dan sisa menjadi pembilang baru",
        timeValue: 6,
        timeUnit: "Menit",
    },
    {
        id: "5",
        questionType: "C3",
        questionFile: null,
        questionFilePreview: null,
        questionText: "Hitunglah: 2/3 + 1/4 = ?",
        answerType: "Angka",
        answerFile: null,
        answerFilePreview: null,
        answerText: "11/12",
        timeValue: 8,
        timeUnit: "Menit",
    },
    {
        id: "6",
        questionType: "C4",
        questionFile: null,
        questionFilePreview: null,
        questionText: "Analisis: Mengapa 3/4 lebih besar dari 2/3?",
        answerType: "Tulisan",
        answerFile: null,
        answerFilePreview: null,
        answerText:
            "Karena jika disamakan penyebutnya menjadi 9/12 dan 8/12, maka 9/12 > 8/12",
        timeValue: 10,
        timeUnit: "Menit",
    },
    {
        id: "7",
        questionType: "C5",
        questionFile: null,
        questionFilePreview: null,
        questionText: "Evaluasi: Apakah cara penyelesaian soal pecahan ini sudah benar?",
        answerType: "Tulisan",
        answerFile: null,
        answerFilePreview: null,
        answerText: "Evaluasi berdasarkan langkah-langkah yang sistematis",
        timeValue: 12,
        timeUnit: "Menit",
    },
    {
        id: "8",
        questionType: "C6",
        questionFile: null,
        questionFilePreview: null,
        questionText: "Buatlah soal cerita tentang pecahan dalam kehidupan sehari-hari!",
        answerType: "Tulisan",
        answerFile: null,
        answerFilePreview: null,
        answerText: "Contoh soal cerita yang kreatif dan relevan",
        timeValue: 15,
        timeUnit: "Menit",
    },
];

const bloomCategories = [
    { level: "C1", label: "C1 - Mengingat", color: "from-blue-500 to-blue-600" },
    { level: "C2", label: "C2 - Memahami", color: "from-green-500 to-green-600" },
    {
        level: "C3",
        label: "C3 - Menerapkan",
        color: "from-yellow-500 to-yellow-600",
    },
    {
        level: "C4",
        label: "C4 - Menganalisis",
        color: "from-orange-500 to-orange-600",
    },
    {
        level: "C5",
        label: "C5 - Mengevaluasi",
        color: "from-red-500 to-red-600",
    },
    { level: "C6", label: "C6 - Mencipta", color: "from-purple-500 to-purple-600" },
];

const BankSoalPage = () => {
    const params = useParams();
    const router = useRouter();
    const kelasId = params.kelasId as string;

    const [questions, setQuestions] = useState<Question[]>(dummyQuestions);
    const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
    const [previewNumber, setPreviewNumber] = useState(0);
    const [editQuestion, setEditQuestion] = useState<Question | null>(null);
    const [editNumber, setEditNumber] = useState(0);

    // Group questions by Bloom level
    const groupedQuestions = useMemo(() => {
        const groups: Record<string, Question[]> = {
            C1: [],
            C2: [],
            C3: [],
            C4: [],
            C5: [],
            C6: [],
        };

        questions.forEach((q) => {
            groups[q.questionType].push(q);
        });

        return groups;
    }, [questions]);

    const handlePreview = (question: Question, number: number) => {
        setPreviewQuestion(question);
        setPreviewNumber(number);
    };

    const handleEdit = (question: Question, number: number) => {
        setEditQuestion(question);
        setEditNumber(number);
    };

    const handleSaveEdit = (updatedQuestion: Question) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
        );

        Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Soal berhasil diperbarui",
            confirmButtonColor: "#336d82",
            timer: 2000,
        });
    };

    const handleDelete = (question: Question, number: number) => {
        Swal.fire({
            title: "Hapus Soal?",
            html: `Apakah Anda yakin ingin menghapus <strong>Soal Nomor ${number}</strong>?<br/><small class="text-gray-600">Tindakan ini tidak dapat dibatalkan.</small>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff1919",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                setQuestions((prev) => prev.filter((q) => q.id !== question.id));

                Swal.fire({
                    icon: "success",
                    title: "Terhapus!",
                    text: "Soal berhasil dihapus dari bank soal",
                    confirmButtonColor: "#336d82",
                    timer: 2000,
                });
            }
        });
    };

    const totalQuestions = questions.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] to-[#f0f9fc]">
            {/* Sticky Compact Header */}
            <div className="sticky top-0 z-40 bg-gradient-to-r from-[#336d82] to-[#2a5a6d] shadow-2xl">
                <div className="px-8 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Back Button & Title */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                            >
                                <ArrowBackIos sx={{ fontSize: 18, color: "white", ml: 0.5 }} />
                            </button>
                            <div>
                                <h1 className="text-white text-2xl poppins-bold">Bank Soal</h1>
                                <p className="text-white/70 text-xs poppins-medium">
                                    Kelola soal berdasarkan Taksonomi Bloom
                                </p>
                            </div>
                        </div>

                        {/* Right: Quick Stats */}
                        <div className="flex items-center gap-4">
                            {/* Total */}
                            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                                <FolderCopy sx={{ fontSize: 28, color: "white" }} />
                                <div>
                                    <p className="text-white/70 text-xs poppins-medium">Total</p>
                                    <p className="text-white text-xl poppins-bold">{totalQuestions}</p>
                                </div>
                            </div>

                            {/* Bloom Stats */}
                            <div className="flex gap-2">
                                {bloomCategories.map((cat) => (
                                    <div
                                        key={cat.level}
                                        className="bg-white/15 backdrop-blur-sm px-3 py-2 rounded-lg text-center min-w-[55px] hover:bg-white/25 transition-colors cursor-default"
                                    >
                                        <p className="text-white text-xs poppins-semibold">
                                            {cat.level}
                                        </p>
                                        <p className="text-white text-lg poppins-bold">
                                            {groupedQuestions[cat.level].length}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
                {totalQuestions === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <FolderCopy sx={{ fontSize: 80, color: "#336d82", opacity: 0.3 }} />
                        <h3 className="text-[#336d82] text-2xl poppins-bold mt-4 mb-2">
                            Belum Ada Soal
                        </h3>
                        <p className="text-gray-600 poppins-regular mb-6">
                            Mulai buat soal pertama Anda di halaman Tambah Soal
                        </p>
                        <button
                            onClick={() => router.push(`/guru/kelas/${kelasId}/soal/tambah`)}
                            className="bg-[#336d82] hover:bg-[#2a5a6d] text-white px-8 py-3 rounded-xl poppins-semibold transition-colors"
                        >
                            Tambah Soal Baru
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bloomCategories.map((category) => {
                            const categoryQuestions = groupedQuestions[category.level];
                            if (categoryQuestions.length === 0) return null;

                            return (
                                <div key={category.level}>
                                    {/* Category Header - Compact */}
                                    <div
                                        className={`bg-gradient-to-r ${category.color} rounded-xl px-5 py-3 mb-3 shadow-lg`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-white text-xl poppins-bold">
                                                {category.label}
                                            </h2>
                                            <span className="bg-white/30 px-3 py-1 rounded-lg text-white text-sm poppins-bold">
                                                {categoryQuestions.length} Soal
                                            </span>
                                        </div>
                                    </div>

                                    {/* Questions Grid - 4 columns for better space usage */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {categoryQuestions.map((question) => {
                                            const globalNumber =
                                                questions.findIndex((q) => q.id === question.id) + 1;
                                            return (
                                                <SoalClusterCard
                                                    key={question.id}
                                                    question={question}
                                                    questionNumber={globalNumber}
                                                    onPreview={() => handlePreview(question, globalNumber)}
                                                    onEdit={() => handleEdit(question, globalNumber)}
                                                    onDelete={() => handleDelete(question, globalNumber)}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modals */}
            <QuestionPreviewModal
                isOpen={!!previewQuestion}
                question={previewQuestion}
                questionNumber={previewNumber}
                onClose={() => setPreviewQuestion(null)}
            />

            <QuestionEditModal
                isOpen={!!editQuestion}
                question={editQuestion}
                questionNumber={editNumber}
                onClose={() => setEditQuestion(null)}
                onSave={handleSaveEdit}
            />
        </div>
    );
};

export default BankSoalPage;
