import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./upload.css";
import Navbar        from "../components/navbar";
import Footer        from "../components/footer";
import axiosInstance from "../api/axiosInstance";

function Upload() {
  const [title,          setTitle]          = useState("");
  const [description,    setDescription]    = useState("");
  const [category,       setCategory]       = useState("");
  const [condition,      setCondition]      = useState("");
  const [size,           setSize]           = useState("");
  const [material,       setMaterial]       = useState("");
  const [color,          setColor]          = useState("");
  const [style,          setStyle]          = useState("");
  const [images,         setImages]         = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [analyzing,      setAnalyzing]      = useState(false);
  const [error,          setError]          = useState("");
  const [success,        setSuccess]        = useState("");
  const [previewUrl,     setPreviewUrl]     = useState(null);
  const [aiFilledFields, setAiFilledFields] = useState(new Set());

  const navigate = useNavigate();

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImages(files);
    setPreviewUrl(URL.createObjectURL(files[0]));
    await analyzeWithAI(files[0]);
  };

  const analyzeWithAI = async (imageFile) => {
    setAnalyzing(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", imageFile);
      const res  = await axiosInstance.post("/items/analyze-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { tags } = res.data;
      const filled   = new Set();
      if (tags.title)       { setTitle(tags.title);             filled.add("title");       }
      if (tags.description) { setDescription(tags.description); filled.add("description"); }
      if (tags.category)    { setCategory(tags.category);       filled.add("category");    }
      if (tags.condition)   { setCondition(tags.condition);     filled.add("condition");   }
      if (tags.size)        { setSize(tags.size);               filled.add("size");        }
      if (tags.material)    { setMaterial(tags.material);       filled.add("material");    }
      if (tags.color)       { setColor(tags.color);             filled.add("color");       }
      if (tags.style)       { setStyle(tags.style);             filled.add("style");       }
      setAiFilledFields(filled);
    } catch {
      setError("AI tagging failed. You can still fill in the details manually.");
    }
    setAnalyzing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title",       title);
      fd.append("description", description);
      fd.append("category",    category);
      fd.append("condition",   condition);
      fd.append("size",        size);
      fd.append("material",    material);
      fd.append("color",       color);
      fd.append("style",       style);
      images.forEach((img) => fd.append("images", img));
      await axiosInstance.post("/items", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Item uploaded successfully!");
      setTimeout(() => navigate("/items"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    }
    setLoading(false);
  };

  const ai      = (f) => aiFilledFields.has(f) ? "ai-filled" : "";
  const clearAi = (f) => setAiFilledFields((p) => { const n = new Set(p); n.delete(f); return n; });

  return (
    <div className="upload-page">
      <Navbar />

      {/* ── HEADER ── */}
      <div className="upload-header">
        <h1>Upload an <em>Item</em></h1>
        <div className="upload-header-divider" />
        <p className="upload-header-sub">
          Share and exchange pre-loved fashion items sustainably
        </p>
      </div>

      <div className="up-page">

        {/* ── LEFT: photo + AI status ── */}
        <aside className="up-left">
          <span className="up-left-label">Photo Upload</span>

          <p className="up-sub">
            Drop a photo and our AI will identify the title, category,
            condition, material, colour and style for you — edit anything
            before submitting.
          </p>

          {/* Drop zone */}
          <div className={`up-dropzone${previewUrl ? " has-img" : ""}`}>
            {previewUrl ? (
              <div className="up-preview-wrap">
                <img src={previewUrl} alt="Item preview" className="up-preview-img" />
                
              </div>
            ) : (
              <label className="up-drop-label">
                <div className="up-drop-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </div>
                <span className="up-drop-title">Click or drag to upload</span>
                <span className="up-drop-hint">AI fills in all details automatically</span>
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            )}
          </div>

          {/* Extra photos */}
          {/*previewUrl && (
            <label className="up-extra-photos">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add more photos
              <input
                type="file" multiple accept="image/*" hidden
                onChange={(e) => setImages((p) => [...p, ...Array.from(e.target.files)])}
              />
            </label>
          )*/}

          {/* AI banners */}
          {analyzing && (
            <div className="up-banner analyzing">
              <span className="up-spinner" />
              Analysing your photo…
            </div>
          )}
          {aiFilledFields.size > 0 && !analyzing && (
            <div className="up-banner done">
              Highlighted fields were filled by AI — review and edit if needed.
            </div>
          )}
        </aside>

        {/* ── RIGHT: form ── */}
        <main className="up-right">
          {error   && <div className="up-msg error">⚠ {error}</div>}
          {success && <div className="up-msg success">✓ {success}</div>}

          <form className="up-form" onSubmit={handleSubmit}>

            {/* Title */}
            <div className="up-field">
              <label>
                Item Title
                {aiFilledFields.has("title") && <span className="ai-pill">AI</span>}
              </label>
              <input
                type="text" placeholder="e.g. Blue Denim Jacket"
                value={title} className={ai("title")} required
                onChange={(e) => { setTitle(e.target.value); clearAi("title"); }}
              />
            </div>

            {/* Description */}
            <div className="up-field">
              <label>
                Description
                {aiFilledFields.has("description") && <span className="ai-pill">AI</span>}
              </label>
              <textarea
                placeholder="Describe the item…"
                value={description} className={ai("description")} required
                onChange={(e) => { setDescription(e.target.value); clearAi("description"); }}
              />
            </div>

            {/* Category */}
            <div className="up-field">
              <label>
                Category
                {aiFilledFields.has("category") && <span className="ai-pill">AI</span>}
              </label>
              <select
                value={category} className={ai("category")} required
                onChange={(e) => { setCategory(e.target.value); clearAi("category"); }}
              >
                <option value="">Select category</option>
                <option>Women's Clothing</option>
                <option>Men's Clothing</option>
                <option>Kids' Clothing</option>
                <option>Footwear</option>
                <option>Accessories</option>
                <option>Jewelry</option>
                <option>Outerwear &amp; Seasonal Wear</option>
                <option>Bags &amp; Carry Items</option>
              </select>
            </div>

            {/* Condition + Size */}
            <div className="up-row">
              <div className="up-field">
                <label>
                  Condition
                  {aiFilledFields.has("condition") && <span className="ai-pill">AI</span>}
                </label>
                <select
                  value={condition} className={ai("condition")} required
                  onChange={(e) => { setCondition(e.target.value); clearAi("condition"); }}
                >
                  <option value="">Select condition</option>
                  <option>Like New</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                </select>
              </div>
              <div className="up-field">
                <label>
                  Size
                  {aiFilledFields.has("size") && <span className="ai-pill">AI</span>}
                </label>
                <select
                  value={size} className={ai("size")}
                  onChange={(e) => { setSize(e.target.value); clearAi("size"); }}
                >
                  <option value="">Select size</option>
                  <option>XS</option><option>S</option><option>M</option>
                  <option>L</option><option>XL</option>
                  <option>One Size</option><option>N/A</option>
                </select>
              </div>
            </div>

            {/* Material + Colour */}
            <div className="up-row">
              <div className="up-field">
                <label>
                  Material
                  {aiFilledFields.has("material") && <span className="ai-pill">AI</span>}
                </label>
                <input
                  type="text" placeholder="e.g. Cotton, Leather"
                  value={material} className={ai("material")}
                  onChange={(e) => { setMaterial(e.target.value); clearAi("material"); }}
                />
              </div>
              <div className="up-field">
                <label>
                  Colour
                  {aiFilledFields.has("color") && <span className="ai-pill">AI</span>}
                </label>
                <input
                  type="text" placeholder="e.g. Navy Blue"
                  value={color} className={ai("color")}
                  onChange={(e) => { setColor(e.target.value); clearAi("color"); }}
                />
              </div>
            </div>

            {/* Style */}
            <div className="up-field">
              <label>
                Style
                {aiFilledFields.has("style") && <span className="ai-pill">AI</span>}
              </label>
              <input
                type="text" placeholder="e.g. Vintage, Minimalist, Streetwear"
                value={style} className={ai("style")}
                onChange={(e) => { setStyle(e.target.value); clearAi("style"); }}
              />
            </div>

            <button type="submit" className="up-submit" disabled={loading || analyzing}>
              {loading ? "Uploading…" : "Submit Item"}
            </button>

          </form>
        </main>

      </div>

      <Footer />
    </div>
  );
}

export default Upload;