"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../_utility/lib/firebase";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    emailAddress: z.string().email(),
    password: z.string().min(3),
  })

const SignInPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const route = useRouter();

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    signInWithEmailAndPassword(auth, values.emailAddress, values.password).then(
      (response) => {
        alert("Signed in successfully")
        route.push('/ballot')
      }
    ).catch((e)=>{
      alert('ERROR!')
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/AbbottElementary.png/800px-AbbottElementary.png" className="w-96 mb-8 rounded-lg shadow-lg" alt="Abbott Elementary" />
      <h2 className="text-2xl font-bold mb-4">LOG IN TO PLACE YOUR VOTE</h2>
      <Form {...form}>
      <form
          onSubmit={form.handleSubmit(handleSubmit)} //need to add this to the log in/sign in page
          className="max-w-md w-full flex flex-col gap-4"
        >
        
          <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email address"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* <Button type="submit" className="w-full">
            Log In
          </Button> */}
          <Button type="submit" className="w-full" >
              Log In
          </Button>

        </form>
      </Form>
    </main>
  );
}

export default SignInPage