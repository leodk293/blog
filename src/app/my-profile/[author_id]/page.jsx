"use client";
import { useState, useEffect, use, useCallback } from "react";
import React from "react";
import Loader from "@/app/components/loader/Loader";
import Image from "next/image";
import Link from "next/link";
import ReadMore from "@/app/components/readMore";
import { Search } from "lucide-react";
import { useSession, signIn } from "next-auth/react";
import {
  ArrowRight,
  Plus,
  BookOpen,
  Calendar,
  User,
  Mail,
  FileText,
} from "lucide-react";

const AuthorProfilePage = ({ params }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.author_id;
  const { status, data: session } = useSession();
  const [articleTitle, setArticleTitle] = useState("");
  const [userPosts, setUserPosts] = useState({
    loading: false,
    posts: [],
    comments: [],
    error: false,
  });

  const [userData, setUserData] = useState();

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

  async function getUsersData() {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }

  const fetchUserPosts = useCallback(async () => {
    setUserPosts({ loading: true, posts: [], comments: [], error: false });
    try {
      const response = await fetch(`/api/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const filteredPosts = data.filter(
        (item) => item.authorId === session?.user?.id
      );
      console.log(filteredPosts);
      let commentsLength = 0;
      for (let i = 0; i < filteredPosts.length; i++) {
        commentsLength += filteredPosts[i].comments.length;
      }

      setUserPosts({
        loading: false,
        posts: data.filter(
          (item) =>
            item.authorId === session?.user?.id &&
            (articleTitle === "" ||
              item.title.toLowerCase().includes(articleTitle.toLowerCase()))
        ),
        comments: commentsLength,
        error: false,
      });
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setUserPosts({ loading: false, posts: [], comments: [], error: true });
    }
  }, [session?.user?.id]);

  const userStats = {
    postsCount: userPosts.posts.length,
    commentsCount: userPosts.comments,
  };

  useEffect(() => {
    if (status !== "loading") {
      fetchUserPosts();
      getUsersData();
    }
  }, [fetchUserPosts, status]);

  useEffect(() => {
    if (status !== "loading" && userPosts.posts.length > 0) {
      setUserPosts((prevState) => ({
        ...prevState,
        posts: prevState.posts.filter(
          (item) =>
            item.authorId === session?.user?.id &&
            (articleTitle === "" ||
              item.title.toLowerCase().includes(articleTitle.toLowerCase()))
        ),
      }));
    }
  }, [articleTitle]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-50 rounded-xl p-8 max-w-md text-center shadow-lg">
          <h2 className="text-2xl font-bold mb-4">You're not signed in</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to view your profile
          </p>
          <button
            onClick={() => signIn("google")}
            className=" border border-transparent shadow rounded-[50px] px-4 py-2 font-medium cursor-pointer"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {session ? (
        session && (
          <main className="bg-gray-50 min-h-screen pb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-50 shadow-xl">
                    {session?.user?.image ? (
                      <Image
                        src={session?.user?.image}
                        alt={session?.user?.name || "Profile image"}
                        fill
                        className=" object-contain"
                        priority
                      />
                    ) : (
                      <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                        <User size={60} className="text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="text-center md:text-left md:flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      {session.user.name || "Your Profile"}
                    </h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <Mail size={16} />
                      <span>{session.user.email}</span>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
                      <h1 className=" text-3xl font-bold">
                        Total Posts : {userStats.postsCount}
                      </h1>
                      <h1 className=" text-3xl font-bold">
                        Total Comments : {userStats.commentsCount}
                      </h1>
                    </div>
                  </div>
                  <Link
                    href="/create-post"
                    className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    <Plus size={18} />
                    <span>New Post</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-6">
              <div className="bg-white rounded-xl shadow-md p-6 -mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-blue-50">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Calendar size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-600 text-sm">Joined Since</h3>
                      {userData && (
                        <p className="font-semibold">
                          {transformDate(userData.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-purple-50">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <BookOpen size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-600 text-sm">
                        Articles Published
                      </h3>
                      <p className="font-semibold">{userPosts.posts.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 mt-6">
              {userPosts.loading && (
                <div className="flex justify-center py-12">
                  <Loader />
                </div>
              )}

              {userPosts.error && (
                <div className="bg-red-50 rounded-lg p-6 text-center my-8">
                  <h3 className="text-red-600 font-medium text-lg mb-2">
                    An error occurred
                  </h3>
                  <p className="text-gray-700 mb-4">
                    We couldn't load your posts. Please try again later.
                  </p>
                  <button
                    onClick={fetchUserPosts}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!userPosts.loading && !userPosts.error && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Your Articles
                    </h2>

                    <form className=" border border-transparent px-4 py-2 rounded-lg bg-gray-100 flex flex-row gap-2">
                      <Search
                        className=" self-center text-gray-600"
                        size={24}
                        strokeWidth={2.25}
                      />
                      <input
                        type="text"
                        value={articleTitle}
                        onChange={(e) => {
                          setArticleTitle(e.target.value);
                          if (e.target.value === "") {
                            fetchUserPosts();
                          }
                        }}
                        placeholder="Enter the title of an article"
                        className="bg-transparent self-center outline-none text-gray-700 font-medium transition-colors"
                      />
                    </form>
                  </div>

                  {userPosts.posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {userPosts.posts.map((post) => (
                        <Link
                          key={post._id}
                          href={`/post/${post._id}`}
                          className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                        >
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>

                          <div className="p-5 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                                {post.category}
                              </span>
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                              {post.title}
                            </h2>
                            <div className="text-gray-600">
                              <ReadMore
                                text={post.description}
                                maxLength={100}
                              />
                            </div>
                            <p className="flex flex-row items-center gap-2 text-blue-600 font-medium mt-2 group-hover:translate-x-1 transition-transform duration-200">
                              <span>Read more</span>
                              <ArrowRight size={18} strokeWidth={2.5} />
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-12 text-center shadow-md">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FileText size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        No posts yet
                      </h3>
                      <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        You haven't published any articles yet. Start sharing
                        your thoughts with the world!
                      </p>
                      <Link
                        href="/create-post"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Plus size={18} />
                        <span>Create A Post</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        )
      ) : (
        <Loader />
      )}
    </>
  );
};

export default AuthorProfilePage;
