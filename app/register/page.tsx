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

import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";

const formSchema = z
  .object({
    emailAddress: z.string().email(),
    name: z.string().min(2),
    surname: z.string().min(3),
    password: z.string().min(3),
    passwordConfirm: z.string(),
    provinceName: z.enum(["Limpopo", "Mpumalanga", "Free State", "North West", "KwaZulu Natal", "Northern Cape", "Western Cape", "Eastern Cape","Gauteng"]),
  })
  .refine(
    (data) => {
      return data.password === data.passwordConfirm;
    },
    {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    }
  );

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
      name: "",
      surname: "",
      password: "",
      passwordConfirm: "",
      //provinceName: "",
      
    },
  });

  const province = form.watch("provinceName");

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ values });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      type="text"
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
            name="surname"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Last name"
                      type="text"
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
            name="provinceName"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lim">Limpopo</SelectItem>
                      <SelectItem value="nw">North West</SelectItem>
                      <SelectItem value="ec">Eastern Cape</SelectItem>
                      <SelectItem value="nc">Northern Cape</SelectItem>
                      <SelectItem value="wc">Western Cape</SelectItem>
                      <SelectItem value="kzn">KwaZulu Natal</SelectItem>
                      <SelectItem value="mp">Mpumalanga</SelectItem>
                      <SelectItem value="fs">Free State</SelectItem>
                      <SelectItem value="gau">Gauteng</SelectItem>
                    </SelectContent>
                  </Select>
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
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password confirm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password confirm"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}