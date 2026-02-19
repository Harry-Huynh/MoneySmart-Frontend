"use client";

import Link from "next/link";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  verifyPassword,
  changePassword,
  getLastPasswordChangeDate,
  getMyProfile,
} from "@/lib/user.actions";
import Loading from "@/components/Loading";
import emailjs from "@emailjs/browser";

const SecurityPage = () => {
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [lastPasswordChangeDate, setLastPasswordChangeDate] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    const fetchLastPasswordChangeDate = async () => {
      try {
        let date = await getLastPasswordChangeDate();
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        setLastPasswordChangeDate(formattedDate);
      } catch (error) {
        console.error(
          "An error occurred while fetching the last password change date.",
        );
      }
    };

    fetchLastPasswordChangeDate();
  }, [loading]);

  const handleVerifyCurrentPassword = async (data) => {
    setLoading(true);
    try {
      const isMatched = await verifyPassword(data.currentPassword);
      if (isMatched) {
        setErrorMessage("");
        setStep(2);
        reset();
      } else {
        setErrorMessage("Current password is incorrect.");
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while verifying the password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      setErrorMessage("New password and confirm password do not match.");
      return;
    }

    setLoading(true);

    try {
      const isSuccess = await changePassword(data.newPassword);
      if (isSuccess) {
       

        setErrorMessage("");
        setOpenDialog(false);
        setStep(1);
        reset();
        try{
           //get user name + email
        const profile = await getMyProfile();
        console.log(profile.name)

        //send email
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          name: profile.name,
          email: profile.email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      );


      console.log("Email sent successfully");
    } catch (emailError) {
      console.error("Email failed:", emailError);
    }
        
      } else {
        setErrorMessage("Failed to change password. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        "An error occurred while changing the password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setOpenDialog(false);
    setStep(1);
    setErrorMessage("");
  };

  return (
    <section>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 select-none relative">
        <Link
          className="w-full pl-6 mb-5 inline-flex gap-2 items-center text-slate-600 hover:text-slate-900 font-medium text-xl cursor-pointer"
          href="/settings"
        >
          <FaArrowLeftLong />
          <p className="">Account Settings</p>
        </Link>

        <div className="flex justify-between w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Password Settings</h1>
            <p className="text-md text-gray-500">
              Last changed: {lastPasswordChangeDate}
            </p>
          </div>

          <button
            className="bg-[#4f915f] hover:bg-[#214a2b] text-white font-semibold px-6 py-2 rounded-lg cursor-pointer"
            onClick={() => setOpenDialog(true)}
          >
            Change Password
          </button>

          {loading && <Loading />}

          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="max-w-lg" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Change Password
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Please enter your current password.
                </DialogDescription>
              </DialogHeader>

              <form
                className="mt-2 flex flex-col gap-3"
                onSubmit={
                  step === 1
                    ? handleSubmit(handleVerifyCurrentPassword)
                    : handleSubmit(handleChangePassword)
                }
              >
                {step === 1 && (
                  <div className="flex flex-col gap-1">
                    <label className="font-medium">Current Password</label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      {...register("currentPassword", { required: true })}
                    />

                    {errors.currentPassword && (
                      <span className="text-red-500 text-sm">
                        Current password is required.
                      </span>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="font-medium">New Password</label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        {...register("newPassword", { required: true })}
                      />
                    </div>

                    {errors.newPassword && (
                      <span className="text-red-500 text-sm">
                        New password is required.
                      </span>
                    )}

                    <div className="flex flex-col gap-1">
                      <label className="font-medium">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                        {...register("confirmNewPassword", { required: true })}
                      />
                    </div>

                    {errors.confirmNewPassword && (
                      <span className="text-red-500 text-sm">
                        Confirm password is required.
                      </span>
                    )}
                  </>
                )}

                {!errors.currentPassword &&
                  !errors.confirmNewPassword &&
                  !errors.newPassword &&
                  errorMessage && (
                    <p className="text-red-500 text-sm">{errorMessage}</p>
                  )}

                <div className="flex gap-4 mt-1">
                  <button
                    className="flex-1 px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-black font-semibold disabled:opacity-50 transition cursor-pointer"
                    onClick={handleCancel}
                    type="button"
                  >
                    Cancel
                  </button>

                  <button
                    className={`flex-1 bg-[#4f915f] hover:bg-[#214a2b] text-white font-semibold px-6 py-2 rounded-lg cursor-pointer ${Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    type="submit"
                  >
                    {step === 1 ? "Verify" : "Change Password"}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default SecurityPage;
