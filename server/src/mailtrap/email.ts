
import {client,sender} from "./mailtrap"
import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
export const sendVerificationEmail=async (email:string,verificationToken:string)=>{
    const recipients = [{ email }];
    try {
        const res=await client.send({
            from:sender,
            to:recipients,
            subject:'Verify your Email',
            html:htmlContent.replace("{verificationToken}",verificationToken),
            category:'Email verification'
        })
    } catch (error) {
        
        throw new Error("Failed to send email verification");
    }    
}
export const sendWelcomeEmail=async (email:string,name:string)=>{
    const recipients = [{ email }];
    const htmlContent=generateWelcomeEmailHtml(name);
    try {
        const res=await client.send({
            from:sender,
            to:recipients,
            subject:'Welcome to Ashish Eats',
            html:htmlContent,
            template_variables:{
                company_info_name:"Ashish Eats",
                name:name
            }
        })
    } catch (error) {
        
        throw new Error("Failed to send email verification");
    }    
}
export const sendPasswordResetEmail=async (email:string,resetURL:string)=>{
    const recipients = [{ email }];
    const htmlContent=generatePasswordResetEmailHtml(resetURL);
    try {
        const res=await client.send({
            from:sender,
            to:recipients,
            subject:'Reset your password',
            html:htmlContent,
            category:"Reset Password"
        })
    } catch (error) {
        
        throw new Error("Failed to reset password");
    }    
}
export const sendResetSuccessEmail=async (email:string)=>{
    const recipients = [{ email }];
    const htmlContent=generateResetSuccessEmailHtml();
    try {
        const res=await client.send({
            from:sender,
            to:recipients,
            subject:'Password Reset Successfully',
            html:htmlContent,
            category:"Password is reset"
        })
    } catch (error) {
        
        throw new Error("Failed to send password reset success email");
    }    
}