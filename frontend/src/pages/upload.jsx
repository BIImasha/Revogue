import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./upload.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axiosInstance from "../api/axiosInstance";

function Upload() {
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]     = useState("");
  const [condition, setCondition]   = useState("");
  const [size, setSize]             = useState("");
  const [images, setImages]         = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // FormData is used because we are sending images
      const formData = new FormData();
      formData.append("title",       title);
      formData.append("description", description);
      formData.append("category",    category);
      formData.append("condition",   condition);
      formData.append("size",        size);

      // Add each image to formData
      images.forEach((img) => formData.append("images", img));

      await axiosInstance.post("/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Item uploaded successfully!");

      // Go to items page after 2 seconds
      setTimeout(() => navigate("/items"), 2000);

    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="upload-container">
        <div className="upload-card">
          <h2>Upload an Item</h2>

          {error   && <p style={{ color: "red",   marginBottom: "10px" }}>{error}</p>}
          {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

          <form className="upload-form" onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Item Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            {/* Category Dropdown — added from your homepage categories */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option>Women's Clothing</option>
              <option>Men's Clothing</option>
              <option>Kids' Clothing</option>
              <option>Footwear</option>
              <option>Accessories</option>
              <option>Jewelry</option>
              <option>Outerwear & Seasonal Wear</option>
              <option>Bags & Carry Items</option>
            </select>

            <div className="row">
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="">Condition</option>
                <option>Like New</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
              </select>

              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="">Size</option>
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
                <option>One Size</option>
                <option>N/A</option>
              </select>
            </div>

            <div className="upload-box">
              <p>Drag & Drop or Click to Upload Images</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(Array.from(e.target.files))}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Submit Item"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Upload;