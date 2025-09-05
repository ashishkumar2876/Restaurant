import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword,setNewPassword] = useState<string>("");
  const loading = false;
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form className="flex flex-col gap-5 md:border md:p-8 w-full max-w-md rounded-lg mx-4">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600">
            Enter your new password to reset
          </p>
        </div>
        <div className="relative w-full">
          <Input
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            placeholder="Enter your new password"
            className="pl-10 focus-visible:ring-1"
          />
          <LockKeyhole className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
        </div>
        <Button
          disabled={loading}
          type="submit"
          className="bg-[#D19254] hover:bg-[#d18c47] w-full"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Please wait</span>
            </div>
          ) : (
            "Reset"
          )}
        </Button>
        <div className="flex justify-center items-center">
          <span>
            Back to{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
