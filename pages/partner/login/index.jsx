import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import * as Yup from "yup";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { login } from "../../../redux/actions/auth";
import LoadingSpinerChase from "../../../components/ui/LoadingSpinerChase";
import Navbar from "../../../components/ui/Navbar";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

function Login(props) {
  const router = useRouter();

  const [state, setState] = useState({
    showPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const changeShowPasswordToFalse = () => {
    setState({ ...state, showPassword: false });
  };

  const dispatch = useDispatch();

  const { loginError } = useSelector((state) => state.auth);

  const changeShowPasswordToTrue = () => {
    setState({ ...state, showPassword: true });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("This field is required"),
      password: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      await dispatch(
        login({
          data: {
            email: values.email,
            password: values.password,
          },
          router: router,
        })
      );
      setLoading(false);
    },
  });

  const errorMessage = {
    show: {
      opacity: 1,
      y: 0,
    },

    hide: {
      opacity: 0,
      y: -10,
      transition: {
        type: "spring",
        stiffness: 60,
      },
    },
  };
  return (
    <div>
      <div className="flex items-center justify-between py-3 px-4 border-b">
        <div
          onClick={() => {
            router.back();
          }}
          className="flex gap-1 justify-center font-bold hover:bg-gray-100 px-2 py-1 rounded-3xl cursor-pointer items-center text-black"
        >
          <Icon className="w-6 h-6" icon="bx:chevron-left" />
          <span>Back</span>
        </div>
        <Link href="/">
          <a className="relative w-28 h-9 cursor-pointer">
            <Image
              layout="fill"
              alt="Logo"
              src="/images/winda_logo/horizontal-blue-font.png"
              priority
            ></Image>
          </a>
        </Link>
        <div></div>
      </div>
      <div className="mt-4 w-[400px] mx-auto">
        {loginError ? (
          <motion.div
            variants={errorMessage}
            animate="show"
            initial="hide"
            className="text-white sticky top-0 z-40 right-0 w-full mb-4 text-sm py-3 rounded-lg text-center px-4 bg-red-500 font-bold"
          >
            We couldn’t find an account matching the email or password you
            entered. Please check your email or password and try again.
          </motion.div>
        ) : null}
        <h1 className="font-black text-2xl">
          Sign in to manage you properties
        </h1>

        <div className="py-4 rounded-xl flex w-full flex-col mt-4">
          <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-1">
              <Input
                name="email"
                type="email"
                errorStyle={
                  formik.touched.email && formik.errors.email ? true : false
                }
                placeholder="Email"
                label="Email address"
                className="placeholder:text-sm text-sm"
                {...formik.getFieldProps("email")}
              ></Input>
              {formik.touched.email && formik.errors.email ? (
                <span className="text-sm font-bold text-red-400">
                  {formik.errors.email}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <Input
                name="password"
                type={state.showPassword ? "text" : "password"}
                errorStyle={
                  formik.touched.password && formik.errors.password
                    ? true
                    : false
                }
                placeholder="Password"
                label="Password"
                {...formik.getFieldProps("password")}
                showPassword={state.showPassword}
                changeShowPasswordToFalse={changeShowPasswordToFalse}
                changeShowPasswordToTrue={changeShowPasswordToTrue}
              ></Input>
              {formik.touched.password && formik.errors.password ? (
                <span className="text-sm font-bold text-red-400">
                  {formik.errors.password}
                </span>
              ) : null}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={
                "mt-5 w-full px-5 flex items-center gap-2 !py-3 !rounded-lg !bg-blue-700 !text-base " +
                (loading ? "opacity-60 cursor-not-allowed" : "")
              }
            >
              <span className="font-bold font-SourceSans">Login</span>
              <div>
                {loading ? (
                  <LoadingSpinerChase
                    width={20}
                    height={20}
                  ></LoadingSpinerChase>
                ) : (
                  ""
                )}
              </div>
            </Button>
          </form>

          <h3 className="mt-6 font-bold text-center">
            Don&apos;t have an account?{" "}
            <div
              onClick={() => {
                router.replace({
                  pathname: "/partner/signup",
                  query: { redirect: `${router.query.redirect || "/"}` },
                });
              }}
              className="text-blue-500 inline cursor-pointer"
            >
              Sign up
            </div>
          </h3>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {};

export default Login;
