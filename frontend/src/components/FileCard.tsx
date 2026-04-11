import type { IFile } from "../@types/file";

interface Props {
  file: IFile;
  onDelete: (id: string) => void;
}

export function FileCard({ file, onDelete }: Props) {
  const isImage = file.type.startsWith("image/");

const openFile = () => {
  if (isImage) {
    window.open(file.url, '_blank');
  } else {
    window.open(file.url, '_blank');
  }
};

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      
      <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden relative">
        {isImage ? (
          <img 
            src={file.url} 
            alt={file.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
            onClick={openFile} 
          />
        ) : (
          <div 
            className="flex flex-col items-center cursor-pointer w-full h-full justify-center hover:bg-gray-200 transition-colors"
            onClick={openFile}
          >
            <span className={`text-6xl ${file.type.includes('pdf') ? 'text-red-500' : 'text-gray-400'}`}>
                {file.type.includes('pdf') ? '📕' : '📄'}
            </span>
            <span className="text-[10px] font-extrabold mt-2 uppercase bg-white border border-gray-200 px-2 py-1 rounded shadow-sm">
                {file.type.split('/')[1] || 'DOC'}
            </span>
            <p className="text-[10px] text-gray-400 mt-2 font-medium">Clique para visualizar</p>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          {file.type.split('/')[1]}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 truncate text-sm" title={file.name}>
          {file.name}
        </h3>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-400 italic">
            {new Date(file.createdAt).toLocaleDateString('pt-BR')}
          </span>
          <span className="text-xs font-medium text-gray-500">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        </div>

        <button 
          onClick={() => onDelete(file.id)}
          className="mt-4 w-full py-2 text-xs font-bold text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          EXCLUIR ARQUIVO
        </button>
      </div>
    </div>
  );
}