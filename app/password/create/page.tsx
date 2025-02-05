"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { genericClient } from "@/lib/genericClient";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { BasicInput } from "@/components/ui/basic-input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ApiResponse } from "@/lib/apiClient";

interface IUserPasswordCreateRequest {
    emailAddress: string;
    password: string;
    confirmPassword: string;
    code: string;
}

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code") || "";
    const emailAddress = searchParams.get("emailAddress") || "";

    const formInstance = useForm<IUserPasswordCreateRequest>({
        defaultValues: {
            code: code,
            emailAddress: emailAddress,
        },
    });
    const {
        handleSubmit,
        register,
        watch,
        formState: { isSubmitting, isValid },
    } = formInstance;

    const password = watch("password");

    const onSubmit: SubmitHandler<IUserPasswordCreateRequest> = async (data) => {
        await toast.promise(
            genericClient<IUserPasswordCreateRequest, unknown>({
                url: "/api/users/create-password",
                method: "PUT",
                data: data,
            }),
            {
                loading: "Processing...",
                success: (response: ApiResponse<unknown>) => {
                    if (response.data) {
                        router.push("/?action=login");
                        return "Password created successfully!";
                    } else if (response.error) {
                        throw new Error(response.error as unknown as string);
                    }
                    throw new Error("Unexpected response format.");
                },
                error: (err: { message: string }) => err.message || "Something went wrong! Try again later.",
            }
        );
    };

    return (
        <div className="bg-gray-50 py-16 px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Password</h1>
                <FormProvider {...formInstance}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <FormField
                                {...register("code")}
                                rules={{
                                    required: "Verification code is required",
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <BasicInput
                                                type={"text"}
                                                placeholder={"Enter verification code"}
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormField
                                {...register("emailAddress")}
                                rules={{
                                    required: "Email address is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address",
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <BasicInput
                                                type={"email"}
                                                placeholder={"Enter email address"}
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormField
                                {...register("password")}
                                rules={{
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <BasicInput
                                                type={"password"}
                                                placeholder={"Enter password"}
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormField
                                {...register("confirmPassword")}
                                rules={{
                                    required: "Password is required",
                                    validate: (value) => value === password || "Passwords do not match",
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <BasicInput
                                                type={"password"}
                                                placeholder={"Enter password again"}
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-full font-semibold bg-foreground hover:bg-neutral-700 focus: outline-none"
                            disabled={isSubmitting || !isValid}
                        >
                            Create Password
                        </Button>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default Page;
