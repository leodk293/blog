"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Loader from "@/app/components/loader/Loader";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Delete,
  Share2,
  Edit,
} from "lucide-react";
import { useSession } from "next-auth/react";

const PostPage = ({ params }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.post_id;

  const [postData, setPostData] = useState({
    error: false,
    loading: false,
    data: undefined,
  });
  const router = useRouter();

  const { data: session } = useSession();

  async function fetchCurrentPost() {
    setPostData((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPostData({ loading: false, error: false, data });
    } catch (error) {
      console.error("Failed to fetch post:", error);
      setPostData((prev) => ({ ...prev, loading: false, error: true }));
    }
  }

  async function handlePostSuppression(postId, userId) {
    const confirmed = confirm("Are you sure you want to delete this post ?");
    if (confirmed) {
      try {
        const response = await fetch(
          `/api/posts?id=${postId}&userId=${userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        router.push("/");
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  }

  useEffect(() => {
    fetchCurrentPost();
  }, [id]);

  if (postData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (postData.error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="bg-red-50 rounded-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-700 mb-6">
            We couldn't load this post. Please try again later.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={fetchCurrentPost}
              className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <ArrowLeft size={18} className="mr-2" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!postData.data) {
    return null;
  }

  function transformDate(target) {
    const date = new Date(target);

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    const formattedTime = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

    const fullFormattedDate = `${formattedDate} ${formattedTime}`;
    console.log(fullFormattedDate);
    return fullFormattedDate;
  }

  const { data } = postData;

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero section with image */}
      <div className="relative w-full h-[50vh] bg-gradient-to-b from-gray-900 to-gray-800">
        {data.imageUrl && (
          <Image
            src={data.imageUrl}
            alt={data.title}
            fill
            priority
            className="object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Back button */}
        <div className="absolute top-8 left-8">
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-full transition-all duration-300"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-24 bg-white rounded-t-3xl shadow-lg p-8">
          {postData.data.authorId === session?.user?.id ? (
            <div className=" flex flex-row">
              <Link
                href={`/edit-post/${postData.data._id}`}
                className="flex items-center self-center gap-2 bg-white/20 backdrop-blur-sm text-blue-500 px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
              >
                <button className=" cursor-pointer border border-blue-100 rounded-[5px] bg-blue-100 px-4 py-2 flex flex-row font-bold gap-1">
                  <Edit className=" self-center" color="blue" size={18} />
                  <span className=" self-center">Edit</span>
                </button>
              </Link>
              <button
                onClick={() => {
                  handlePostSuppression(postData.data._id, session?.user?.id);
                }}
                className=" cursor-pointer border border-red-100 rounded-[5px] bg-red-100 px-4 py-2 text-red-500 self-center flex flex-row font-bold gap-1"
              >
                <Delete className=" self-center" color="red" size={18} />
                <span className=" self-center">Delete</span>
              </button>
            </div>
          ) : (
            ""
          )}
          <div className="flex flex-col items-center text-center">
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Tag size={14} className="mr-1" />
                {data.category || "Uncategorized"}
              </span>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                <Calendar size={14} className="mr-1" />
                {transformDate(data.createdAt)}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {data.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
                <Image
                  src={data.authorImage}
                  alt={data.authorName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">
                  <User size={14} className="inline mr-1" />
                  {data.authorName}
                </p>
                <Link
                  href={
                    session?.user?.id === data.authorId
                      ? `/my-profile/${session?.user?.id}`
                      : `/author-profile/${data.authorId}`
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
                >
                  {session?.user?.id === data.authorId
                    ? "Your profile"
                    : "Visit profile"}
                </Link>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-blue mx-auto mb-12">
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8 shadow-md">
                <Image
                  src={data.imageUrl}
                  alt={data.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="text-gray-700 leading-relaxed space-y-6">
                {data.description.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Share buttons */}
            <div className="border-t border-gray-200 pt-8 mt-12">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">
                    Share this article
                  </h3>
                  <div className="flex gap-2">
                    {["Twitter", "Facebook", "LinkedIn"].map((platform) => (
                      <button
                        key={platform}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label={`Share on ${platform}`}
                      >
                        <Share2 size={18} />
                      </button>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/author-profile/${data.authorId}`}
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  More posts by {data.authorName}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
