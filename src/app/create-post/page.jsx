"use client";
import React, { useState } from "react";
import { Upload, BookOpen, Check, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";

const CreatePostPage = () => {
  const { status, data: session } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const notify = () => {
    toast.success("Comment added successfully", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit");
      return;
    }

    setImage(file);
    setFileName(file.name);
    setError("");
  };

  const handleSubmit = async (e) => {
    if (status === "authenticated") {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      if (!title.trim()) {
        setError("Title is required");
        setIsLoading(false);
        return;
      }

      if (!description.trim()) {
        setError("Description is required");
        setIsLoading(false);
        return;
      }

      if (!image) {
        setError("Please upload a thumbnail image");
        setIsLoading(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("authorId", session?.user?.id);
        formData.append("authorImage", session?.user?.image);
        formData.append("authorName", session?.user?.name);
        formData.append("image", image);

        const response = await fetch("/api/posts", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to create post");
        }
        notify();

        router.push("/");
        router.refresh();
      } catch (err) {
        console.error("Error creating post:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please sign in before making posts");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
        <p className="text-gray-600">Share your thoughts with the world</p>
      </div>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8"
      >
        {error && (
          <div className="flex items-center px-4 py-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="thumbnail"
            className="block text-sm font-medium text-gray-700"
          >
            Blog Thumbnail
          </label>
          <div className="relative">
            <input
              required
              id="thumbnail"
              name="image"
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="thumbnail"
              className={`flex items-center justify-center w-full h-32 md:h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                fileName
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
            >
              {fileName ? (
                <div className="flex flex-col items-center text-green-600">
                  <Check className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium truncate max-w-xs">
                    {fileName}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">
                    Click to upload thumbnail
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Blog Title
          </label>
          <input
            required
            id="title"
            type="text"
            name="title"
            placeholder="Enter an engaging title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Blog Description
          </label>
          <textarea
            required
            id="description"
            name="description"
            placeholder="Write your content here..."
            rows="6"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Blog Category
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none cursor-pointer w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10 bg-white"
            >
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Startup">Startup</option>
              <option value="Series">Series</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:transform-none disabled:hover:shadow-md"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5" />
                <span>Publish Post</span>
              </>
            )}
          </button>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
