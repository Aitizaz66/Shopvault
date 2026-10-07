import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../../utils/axios.js";
import { errorMessage } from "../../../../shared/http.js";

export default function ImageUpload({ initialImage, onImageUpload, onBusyChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const controller = useRef(null);
  useEffect(() => () => controller.current?.abort(), []);
  const upload = async event => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) { toast.error("Choose a JPG, PNG or WebP image up to 5 MB"); return; }
    setIsUploading(true); onBusyChange?.(true);
    controller.current = new AbortController();
    try {
      const body = new FormData(); body.append("image", file);
      const response = await api.post("/api/products/upload", body, { signal: controller.current.signal });
      onImageUpload(response.data.data.url);
      toast.success("Image uploaded");
    } catch (error) { if (error.code !== "ERR_CANCELED") toast.error(errorMessage(error)); }
    finally { setIsUploading(false); onBusyChange?.(false); }
  };
  const legacy = initialImage?.startsWith("data:");
  return <div className="space-y-3">
    {initialImage && <img src={initialImage} alt="Product preview" className="w-40 h-40 object-contain rounded-lg border" />}
    <label className="block text-sm font-medium">Upload an image (JPG, PNG or WebP, up to 5 MB)
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={isUploading} className="block mt-2" />
    </label>
    <label className="block text-sm font-medium">Or use an image URL
      <input type="url" value={legacy ? "" : initialImage || ""} onChange={event => onImageUpload(event.target.value)} disabled={isUploading} placeholder="https://example.com/product.jpg" maxLength={2048} className="block w-full border rounded-lg p-2 mt-1" />
    </label>
    {legacy && <p className="text-sm text-gray-500">Your existing image is kept unless you replace it.</p>}
    {isUploading && <p role="status">Uploading image...</p>}
  </div>;
}
