import { useEffect, useState } from "react";
import api from "../api";
import type { IFile } from "../@types/file";
import { FileCard } from "../components/FileCard";

export default function Dashboard() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchFiles = async () => {
    try {
      const response = await api.get<IFile[]>("/files");
      setFiles(response.data);
    } catch (error) {
      console.error("Erro ao buscar arquivos:", error);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      await api.post("/files/upload", formData);
      fetchFiles();
    } catch (error) {
      alert("Erro ao subir arquivo para o Cloudinary");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir este arquivo?")) return;
    
    try {
      await api.delete(`/files/${id}`);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      alert("Erro ao excluir arquivo");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gerenciador de Arquivos</h1>
            <p className="text-gray-500">Gerencie seus uploads de forma simples.</p>
          </div>

          <label className={`
            cursor-pointer flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all
            ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100'}
          `}>
            {isUploading ? "Enviando..." : "＋ Upload de Arquivo"}
            <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} accept="image/*,.pdf"/>
          </label>
        </header>

        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <span className="text-5xl mb-4 text-gray-300">☁️</span>
            <p className="text-gray-400 font-medium">Sua nuvem está vazia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {files.map(file => (
              <FileCard key={file.id} file={file} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}