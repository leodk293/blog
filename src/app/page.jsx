"use client";
import Image from "next/image";
import Link from "next/link";
import googleLogo from "./assets/google-logo.png";
import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./components/loader/Loader";
import ReadMore from "./components/readMore";
import { ArrowRight, Shield, Mail, User } from "lucide-react";
import { nanoid } from "nanoid";

export default function Home() {
  const { status, data: session } = useSession();
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [category, setCategory] = useState("all");
  const [posts, setPosts] = useState({
    error: false,
    loading: false,
    data: [],
  });

  const categories = [
    "all",
    "Technology",
    "Lifestyle",
    "Startup",
    "Series",
    "Education",
  ];
  const successSubscription = () => {
    toast.success("Subscription successful", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const error = (errorMsg) => {
    toast.error(`Error saving email: ${errorMsg}`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const storedEmails = async (e) => {
    e.preventDefault();
    if (status === "authenticated") {
      try {
        const response = await fetch("api/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: session?.user?.name,
            userEmail: subscriptionEmail,
          }),
        });
        if (!response.ok) {
          error(response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          successSubscription();
          setSubscriptionEmail("");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("You must be logged in to subscribe.");
    }
  };

  const fetchPosts = useCallback(async () => {
    setPosts((prev) => ({ ...prev, loading: true, error: false }));

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
      if (category === "all") {
        setPosts({
          error: false,
          loading: false,
          data: data,
        });
      } else {
        setPosts({
          error: false,
          loading: false,
          data: data.filter((item) => item.category === category),
        });
      }
    } catch (error) {
      setPosts((prev) => ({ ...prev, error: true, loading: false }));
      console.error("Failed to fetch posts:", error);
    }
  }, [session?.user?.id, category]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, status]);

  return (
    <div className="container mx-auto px-4 py-16">
      <section className="flex flex-col items-center gap-8 max-w-3xl mx-auto mb-20">
        <h1 className="font-bold text-4xl md:text-6xl text-center tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Latest Blogs
        </h1>
        <p className="font-medium text-gray-700 text-center max-w-2xl text-lg leading-relaxed">
          Stay updated with our latest articles, insights, and stories.
          Subscribe to our newsletter to receive fresh content directly to your
          inbox.
        </p>

        {status === "authenticated" ? (
          <div className="flex items-center gap-4 mb-8">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md">
              <Image
                src={session?.user?.image}
                alt={session?.user?.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">
                <User size={14} className="inline mr-1" />
                {session?.user?.name}
              </p>
              <Link
                href={`/my-profile/${session?.user?.id}`}
                className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
              >
                Visit your profile
              </Link>
            </div>
          </div>
        ) : status === "loading" ? (
          <Loader />
        ) : (
          <div className=" flex flex-col items-center gap-2">
            <p className=" text-[14px] font-medium italic text-gray-700">
              Sign in and start posting your thoughts
            </p>
            <button
              onClick={() => signIn("google")}
              className="flex items-center cursor-pointer gap-2 py-2 px-4 rounded-full border border-gray-200 hover:border-gray-300 bg-white shadow-sm transition-all duration-200 hover:shadow"
              aria-label="Sign in with Google"
            >
              <Image
                src={googleLogo}
                width={24}
                height={24}
                alt="Google Logo"
                className="w-6 h-6"
              />
              <span className="font-medium text-gray-800">
                Sign in with Google
              </span>
            </button>
          </div>
        )}

        <form
          onSubmit={storedEmails}
          className="flex flex-col sm:flex-row w-full max-w-md mt-4 gap-3 sm:gap-0 relative"
        >
          <div className="w-full relative">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              required
              onChange={(e) => setSubscriptionEmail(e.target.value)}
              className="border rounded-lg sm:rounded-r-none border-gray-300 pl-10 p-4 text-lg font-medium w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
              placeholder="Enter your email"
              value={subscriptionEmail}
              type="email"
              aria-label="Email address"
            />
          </div>
          <button
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg sm:rounded-l-none transition-all duration-200 hover:shadow-lg flex items-center justify-center"
            type="submit"
          >
            Subscribe
            <Shield className="ml-2" size={18} />
          </button>
        </form>
        <ToastContainer />

        <div className="flex items-center gap-2 text-gray-500 text-sm mt-6 animate-bounce">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span>Scroll to explore featured posts</span>
        </div>
      </section>

      {/* Categories and Posts Section */}
      <section className="flex flex-col items-center gap-12 w-full">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={nanoid(10)}
              onClick={() => setCategory(cat)}
              className={`border transition-all duration-200 cursor-pointer border-gray-300 px-6 py-3 rounded-full text-lg font-medium ${
                category === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "text-gray-700 bg-transparent hover:bg-gray-50"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {posts.loading && <Loader />}

        {posts.error && (
          <div className="text-center p-8 bg-red-50 rounded-lg w-full max-w-2xl">
            <p className="text-red-600 font-medium">
              An error occurred while fetching posts. Please try again later.
            </p>
            <button
              onClick={fetchPosts}
              className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!posts.loading && !posts.error && posts.data.length === 0 && (
          <div className="text-center p-8 bg-gray-50 rounded-lg w-full max-w-2xl">
            <p className="text-gray-600 font-medium">
              No posts found for this category. Check back later!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!posts.loading &&
            posts.data &&
            posts.data.length > 0 &&
            posts.data.map((post) => (
              <Link key={post._id} href={`/post/${post._id}`} className="group">
                <div className="flex flex-col border border-gray-900 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="w-full h-60 overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={350}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5 flex flex-col gap-3">
                    <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                      {post.title}
                    </h2>
                    <div className="text-gray-600">
                      <ReadMore text={post.description} maxLength={100} />
                    </div>
                    <p className="flex flex-row items-center gap-2 text-blue-600 font-medium mt-2 group-hover:translate-x-1 transition-transform duration-200">
                      <span>Read more</span>
                      <ArrowRight size={18} strokeWidth={2.5} />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
