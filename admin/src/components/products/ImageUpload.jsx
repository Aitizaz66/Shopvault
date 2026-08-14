import { useState } from "react";
import { Upload, X } from "lucide-react";

const ImageUpload = ({ onImageUpload, initialImage }) => {
  const [image, setImage] = useState(initialImage || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show uploading state
    setIsUploading(true);

    // Use local URL preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setImage(imageUrl);
      onImageUpload(imageUrl);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setImage("");
    onImageUpload("");
  };

  return (
    <div className="space-y-4">
      {image ? (
        <div className="relative inline-block">
          <img
            src={image}
            alt="Product"
            className="w-48 h-48 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="text-sm text-gray-500 mt-2">Upload Image</span>
          <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
      {isUploading && <div className="text-sm text-blue-600">Uploading...</div>}
    </div>
  );
};

export default ImageUpload;
