"use client";
import React, { useState } from "react";
import classes from "./register.module.css";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; //add this line
import Link from "next/link";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "" || email === "" || password === "") {
      toast.error("Fill all the fields");
    }

    if (password.length < 6) {
      toast.error("Password must be at least of 6 characters");
      return;
    }

    try {
      const res = await fetch(
        "https://blogs-app-web.vercel.app//api/register",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ username, email, password }),
        }
      );

      console.log(await res.json());

      if (res.ok) {
        toast.success("Successfully registered the user");
        setTimeout(() => {
          signIn();
        }, 1500);
        return;
      } else {
        toast.error("Error occured while registering");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
          <input
            type="password"
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={classes.submitButton}>Register</button>
          {/* <button className={classes.registerNow} onClick={() => signIn}>
            Don't have an account <br /> Register Now.
          </button> */}
          <Link className={classes.registerNow} href="/login">
            Already have an account? <br />
            Login now.
          </Link>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
