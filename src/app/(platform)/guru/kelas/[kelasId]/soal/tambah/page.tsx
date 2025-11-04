// "use client";

// import React, { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { ArrowBackIos, Add, CheckCircle } from "@mui/icons-material";
// import {
//   PreviewModal,
//   QuestionSection,
//   MateriDropdownSelector,
//   type Question,
// } from "@/components/guru";

// const TambahSoalPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const kelasId = params.kelasId as string;

//   // Dummy materi list - replace with API call
//   const materiList = [
//     { id: "1", judul: "Pecahan biasa & campuran" },
//     { id: "2", judul: "Perkalian & Pembagian" },
//     { id: "3", judul: "Geometri Bangun Datar" },
//   ];

//   const [selectedMateri, setSelectedMateri] = useState<string | null>(null);
//   const [questions, setQuestions] = useState<Question[]>([
//     {
//       id: "1",
//       questionType: "C1",
//       questionFile: null,
//       questionFilePreview: null,
//       questionText: "",
//       answerType: "Tulisan",
//       answerFile: null,
//       answerFilePreview: null,
//       answerText: "",
//       timeValue: 5,
//       timeUnit: "Menit",
//     },
//   ]);

//   const [previewModal, setPreviewModal] = useState<{
//     isOpen: boolean;
//     type: "image" | "video" | "pdf";
//     src: string;
//     fileName: string;
//   }>({
//     isOpen: false,
//     type: "image",
//     src: "",
//     fileName: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Add new question section
//   const handleAddQuestion = () => {
//     const newQuestion: Question = {
//       id: Date.now().toString(),
//       questionType: "C1",
//       questionFile: null,
//       questionFilePreview: null,
//       questionText: "",
//       answerType: "Tulisan",
//       answerFile: null,
//       answerFilePreview: null,
//       answerText: "",
//       timeValue: 5,
//       timeUnit: "Menit",
//     };
//     setQuestions([...questions, newQuestion]);
//   };

//   // Remove question section
//   const handleRemoveQuestion = (id: string) => {
//     if (questions.length === 1) {
//       alert("Minimal harus ada 1 soal!");
//       return;
//     }
//     setQuestions(questions.filter((q) => q.id !== id));
//   };

//   // Update question field
//   const updateQuestion = (id: string, field: keyof Question, value: any) => {
//     setQuestions(
//       questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
//     );
//   };

//   // Handle file upload for question
//   const handleQuestionFileUpload = (
//     id: string,
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         updateQuestion(id, "questionFile", file);
//         updateQuestion(id, "questionFilePreview", reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle file upload for answer
//   const handleAnswerFileUpload = (
//     id: string,
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         updateQuestion(id, "answerFile", file);
//         updateQuestion(id, "answerFilePreview", reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Remove uploaded file
//   const handleRemoveFile = (id: string, type: "question" | "answer") => {
//     if (type === "question") {
//       updateQuestion(id, "questionFile", null);
//       updateQuestion(id, "questionFilePreview", null);
//     } else {
//       updateQuestion(id, "answerFile", null);
//       updateQuestion(id, "answerFilePreview", null);
//     }
//   };

//   // Preview file
//   const handlePreviewFile = (src: string, fileName: string) => {
//     const fileType = fileName.toLowerCase().endsWith(".pdf")
//       ? "pdf"
//       : fileName.match(/\.(mp4|webm|ogg)$/i)
//         ? "video"
//         : "image";

//     setPreviewModal({
//       isOpen: true,
//       type: fileType,
//       src,
//       fileName,
//     });
//   };

//   // Validate form
//   const validateForm = () => {
//     // Check if materi is selected
//     if (!selectedMateri) {
//       alert("Silakan pilih materi terlebih dahulu!");
//       return false;
//     }

//     for (const q of questions) {
//       if (!q.questionText.trim() && !q.questionFile) {
//         alert("Setiap soal harus memiliki pertanyaan (teks atau file)!");
//         return false;
//       }
//       if (!q.answerText.trim() && !q.answerFile) {
//         alert("Setiap soal harus memiliki jawaban (teks atau file)!");
//         return false;
//       }
//       if (q.timeValue <= 0) {
//         alert("Waktu menjawab harus lebih dari 0!");
//         return false;
//       }
//     }
//     return true;
//   };

//   // Submit form
//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     const selectedMateriName =
//       materiList.find((m) => m.id === selectedMateri)?.judul || "";

//     if (
//       !confirm(
//         `Anda akan menyimpan ${questions.length} soal untuk materi "${selectedMateriName}". Lanjutkan?`
//       )
//     ) {
//       return;
//     }

//     setIsSubmitting(true);
//     // TODO: API call with selectedMateri
//     console.log("Saving questions for materi:", selectedMateri);
//     await new Promise((resolve) => setTimeout(resolve, 1500));
//     alert(`${questions.length} soal berhasil disimpan untuk materi "${selectedMateriName}"!`);
//     router.push(`/guru/kelas/${kelasId}/soal`);
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-gradient-to-br from-[#e8f4f8] via-white to-[#f0f9fc] py-8 px-4">
//         {/* Header */}
//         <div className="max-w-4xl mx-auto mb-6">
//           <div className="bg-gradient-to-r from-[#336d82] to-[#2a5a6d] rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl">
//             <button
//               onClick={() => router.push(`/guru/kelas/${kelasId}/materi`)}
//               className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
//             >
//               <ArrowBackIos sx={{ fontSize: 18, color: "#336d82", ml: 0.5 }} />
//             </button>
//             <h1 className="text-2xl font-bold text-white font-poppins flex-1 text-center">
//               TAMBAH SOAL
//             </h1>
//           </div>
//         </div>

//         {/* Materi Selector */}
//         <div className="max-w-4xl mx-auto mb-8">
//           <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-[#336d82]/20">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="w-12 h-12 bg-gradient-to-br from-[#336d82] to-[#2a5a6d] rounded-xl flex items-center justify-center shadow-md">
//                 <span className="text-white text-2xl">📚</span>
//               </div>
//               <div>
//                 <h2 className="text-[#336d82] text-lg poppins-semibold">
//                   Pilih Materi
//                 </h2>
//                 <p className="text-gray-600 text-sm poppins-regular">
//                   Soal-soal ini akan dikaitkan dengan materi yang dipilih
//                 </p>
//               </div>
//             </div>
//             <MateriDropdownSelector
//               materiList={materiList}
//               selectedMateri={selectedMateri}
//               onSelectMateri={setSelectedMateri}
//             />
//             {!selectedMateri && (
//               <p className="text-amber-600 text-sm poppins-medium mt-3 flex items-center gap-2">
//                 <span className="text-lg">⚠️</span>
//                 Silakan pilih materi terlebih dahulu sebelum membuat soal
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Questions Container */}
//         <div className="max-w-4xl mx-auto space-y-6">
//           {questions.map((question, index) => (
//             <QuestionSection
//               key={question.id}
//               question={question}
//               index={index}
//               onUpdate={updateQuestion}
//               onRemove={handleRemoveQuestion}
//               onQuestionFileUpload={handleQuestionFileUpload}
//               onAnswerFileUpload={handleAnswerFileUpload}
//               onRemoveFile={handleRemoveFile}
//               onPreviewFile={handlePreviewFile}
//               canDelete={questions.length > 1}
//             />
//           ))}

//           {/* Add Question Button - Full Width */}
//           <div className="w-full">
//             <button
//               onClick={handleAddQuestion}
//               type="button"
//               className="w-full bg-white text-[#336d82] px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all font-poppins shadow-lg flex items-center justify-center gap-3 border-2 border-[#336d82] hover:scale-[1.02] text-lg"
//             >
//               <Add sx={{ fontSize: 28 }} />
//               Tambah Soal Baru
//             </button>
//           </div>

//           {/* Submit Button - Full Width */}
//           <div className="w-full pt-4">
//             <button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               type="button"
//               className="w-full bg-gradient-to-r from-[#336d82] to-[#2a5a6d] text-white px-12 py-5 rounded-2xl font-bold hover:from-[#2a5a6d] hover:to-[#336d82] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-poppins shadow-xl flex items-center justify-center gap-3 text-xl hover:scale-[1.02]"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
//                   Menyimpan Soal...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle sx={{ fontSize: 28 }} />
//                   Konfirmasi & Simpan ({questions.length} Soal)
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Preview Modal */}
//       <PreviewModal
//         isOpen={previewModal.isOpen}
//         onClose={() =>
//           setPreviewModal({ ...previewModal, isOpen: false })
//         }
//         type={previewModal.type}
//         src={previewModal.src}
//         fileName={previewModal.fileName}
//       />
//     </>
//   );
// };

// export default TambahSoalPage;
