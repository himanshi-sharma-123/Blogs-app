"use client";

import React, { useEffect, useState } from "react";
import classes from "./blog.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BsFillPencilFill } from "react-icons/bs";
import { AiFillDelete, AiFillLike, AiOutlineLike } from "react-icons/ai";
import { format } from "timeago.js";
import { useRouter } from "next/navigation";

const page = (ctx) => {
  const [blogDetails, setBlogDetails] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [blogLikes, setBlogLikes] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();
  // console.log(blogDetails);
  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(
        `http://localhost:3000/api/blog/${ctx.params.id}`,
        { cache: "no-store" }
      );
      const blog = await res.json();

      setBlogDetails(blog);
      setIsLiked(blog?.likes?.includes(session?.user?._id));
      setBlogLikes(blog?.likes?.length || 0);
    }
    session && fetchBlog();
  }, [session]);

  const handleDelete = async () => {
    try {
      const confirmModal = confirm(
        "Are you sure you want to delete your blog?"
      );

      if (confirmModal) {
        const res = await fetch(
          `http://localhost:3000/api/blog/${ctx.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
            method: "DELETE",
          }
        );

        if (res.ok) {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async () => {};

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <Image src={blogDetails?.imageUrl} width="750" height="650" alt="" />
        <div className={classes.row}>
          <h3 className={classes.title}>{blogDetails?.title}</h3>
          {blogDetails?.authorId?._id.toString() ===
          session?.user?._id.toString() ? (
            <div className={classes.controls}>
              <Link
                className={classes.editButton}
                href={`/blog/edit/${ctx.params.id}`}
              >
                Edit <BsFillPencilFill />
              </Link>
              <button onClick={handleDelete} className={classes.deleteButton}>
                Delete
                <AiFillDelete />
              </button>
            </div>
          ) : (
            <div className={classes.author}>
              Author : <span>{blogDetails?.authorId?.username}</span>
            </div>
          )}
        </div>
        <div className={classes.row}>
          <div className={classes.category}>
            Category:
            <span>{blogDetails?.category}</span>
          </div>
          <div className={classes.right}>
            {blogLikes}{" "}
            {isLiked ? (
              <AiFillLike size={20} onClick={handleLike} />
            ) : (
              <AiOutlineLike size={20} onClick={handleLike} />
            )}
          </div>
        </div>
        <div className={classes.row}>
          <p>{blogDetails?.desc}</p>
          <span>
            Posted: <span>{format(blogDetails?.createdAt)}</span>
          </span>
        </div>
        <div className={classes.commentSection}>
          <div className={classes.commentInput}></div>
        </div>
      </div>
    </div>
  );
};

export default page;
