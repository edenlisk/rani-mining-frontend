import React from "react";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
let rendercount=0;
const HookForm = () => {
const form =useForm({
    defaultValues:{
        username:'leila',
        email:'',
        channel:'',
        social:{
            twitter:'',
            facebook:'',
        }
    }
});
const {register,control,handleSubmit,formState}=form;
const {errors}=formState;
const onSubmit=(data)=>{
}
rendercount++;
    return (
        <>
        <div className=" w-full flex flex-col justify-center items-center ">
            <h1>form re render count({rendercount/2})</h1>
            <form className=" space-y-3 flex flex-col w-1/2 justify-end" onSubmit={handleSubmit(onSubmit)} noValidate>
                <p>user name</p>
                <input className="p-2 border rounded-lg focus:outline-none" type="text" id="username" {...register('username',
                {required:{
                    value:true,
                    message:'user name required'}})} />
                <p className=" text-red-500">{errors.username?.message}</p>

                <p>email</p>
                <input className="p-2 border rounded-lg focus:outline-none" type="text" id="email" {...register('email',
                {required:{
                    value:true,
                    message:'email required'}})} />
                <p className=" text-red-500">{errors.email?.message}</p>

                <p>channel</p>
                <input className="p-2 border rounded-lg focus:outline-none" type="text" id="channel" {...register('channel',
                {required:{
                    value:true,
                    message:'channel required'}})} />
                <p className=" text-red-500">{errors.channel?.message}</p>
                <p>twitter</p>
                <input className="p-2 border rounded-lg focus:outline-none" type="text" id="twitter" {...register('social.twitter',
               )} />
                
                <p>facebook</p>
                <input className="p-2 border rounded-lg focus:outline-none" type="text" id="facebook" {...register('social.facebook',
               )} />
                
                <button className=" p-1 bg-slate-400 border">submit</button>
            </form>
        </div>
        <DevTool control={control}/>
        </>
    )
}
export default HookForm;