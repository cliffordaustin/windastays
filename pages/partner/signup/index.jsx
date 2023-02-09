import React, { useState } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useDispatch, useStore } from "react-redux";

import * as Yup from "yup";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import LoadingSpinerChase from "../../../components/ui/LoadingSpinerChase";
import { signup, signinWithGoogle } from "../../../redux/actions/auth";
import Navbar from "../../../components/ui/Navbar";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import axios from "axios";

function Signup(props) {
  const router = useRouter();

  const [state, setState] = useState({
    showPassword: false,
  });

  const [loading, setLoading] = useState(false);

  const changeShowPasswordToFalse = () => {
    setState({ ...state, showPassword: false });
  };

  const changeShowPasswordToTrue = () => {
    setState({ ...state, showPassword: true });
  };

  const dispatch = useDispatch();

  const store = useStore();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password1: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(120, "This field has a max length of 120")
        .required("This field is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("This field is required"),
      password1: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values, { setErrors }) => {
      setLoading(true);
      await dispatch(
        signup({
          data: {
            first_name: values.name,
            email: values.email,
            password1: values.password1,
            password2: values.password1,
            is_partner: true,
          },
          router,
        })
      );
      setLoading(false);
      const errorVals = {
        name: "",
        email: "",
        password1: "",
      };

      setErrors({ ...errorVals, ...store.getState().auth.signupErrors });
    },
  });

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
        <h1 className="font-black text-2xl">Create your partner account</h1>
        <p className="text-gray-500 mt-0.5">
          Create an account to manage your property
        </p>

        <div className="py-4 rounded-xl flex w-full flex-col mt-4">
          <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
            <div className="w-full flex flex-col gap-1 relative">
              <Input
                name="name"
                type="text"
                placeholder="Company's name"
                errorStyle={
                  formik.touched.name && formik.errors.name ? true : false
                }
                className={"w-full "}
                label="Company's name"
                {...formik.getFieldProps("name")}
              ></Input>
              {formik.touched.name && formik.errors.name ? (
                <span className="text-sm font-bold text-red-400">
                  {formik.errors.name}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-1">
              <Input
                name="email"
                type="email"
                errorStyle={
                  formik.touched.email && formik.errors.email ? true : false
                }
                placeholder="Email"
                label="Email"
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
                name="password1"
                type={state.showPassword ? "text" : "password"}
                errorStyle={
                  formik.touched.password1 && formik.errors.password1
                    ? true
                    : false
                }
                placeholder="Password"
                label="Password"
                {...formik.getFieldProps("password1")}
                showPassword={state.showPassword}
                changeShowPasswordToFalse={changeShowPasswordToFalse}
                changeShowPasswordToTrue={changeShowPasswordToTrue}
              ></Input>
              {formik.touched.password1 && formik.errors.password1 ? (
                <span className="text-sm font-bold text-red-400">
                  {formik.errors.password1}
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
              <span className="font-bold font-SourceSans">Register</span>
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
            Already on Winda?{" "}
            <div
              onClick={() => {
                router.replace({
                  pathname: "/partner/login",
                  query: { redirect: `${router.query.redirect || "/"}` },
                });
              }}
              className="text-blue-500 inline cursor-pointer"
            >
              Login
            </div>
          </h3>
        </div>
      </div>
    </div>
  );
}

Signup.propTypes = {};

export default Signup;
