import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import React, { FormEvent, useRef, useState } from "react";


const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRef = useRef<any>([]);
  
  const {loading,verifyEmail}=useUserStore();

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) {
        inputRef.current[index + 1].focus();
      }
    }
  };
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && index > 0) {
      if (otp[index] == "") {
        inputRef.current[index-1].focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "Backspace" && index == 0) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
    else if(e.key=='ArrowRight' && index<5 && otp[index]){
      inputRef.current[index + 1].focus();
    }
    
  };

  const handleSubmit=async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const verificationCode:string=otp.join("");
    await verifyEmail(verificationCode);
  }
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl">Verify your email</h1>
          <p className="text-sm text-gray-600">
            Enter the 6 digit code send to your email address
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
            {otp.map((letter: any, idx: number) => (
              <Input
                key={idx}
                ref={(element: any) => (inputRef.current[idx] = element)}
                value={letter}
                maxLength={1}
                type="text"
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(idx, e)
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(idx, e.target.value)
                }
                className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus:ring-2 focus-visible:ring-1"
              />
            ))}
          </div>
          <Button disabled={loading} type="submit" className="bg-[#D19254] hover:bg-[#d18c47] w-full mt-5">
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Please wait</span>
            </div>
          ) : (
            "Verify"
          )}
        </Button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
