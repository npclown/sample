"use client";

import { ParsedError } from "@/lib/definitions";

export default function parseError(err: any): ParsedError {
  let data: ParsedError = {
    message: "Unknown error",
  };

  console.error(err);

  if (err.response?.data?.errors !== undefined) {
    for (let error of err.response.data.errors) {
      // TODO: handle to multiple error
      data.message = error.detail;
    }
  } else if (err.response?.data?.error?.message !== undefined) {
    data.message = err.response.data.error.message;
  } else if (err.response?.data?.detail !== undefined) {
    data.message = err.response.data.detail;
  } else if (err.message !== undefined) {
    data.message = err.message;
  } else if (typeof err === "string") {
    data.message = err;
  }

  return data;
}
