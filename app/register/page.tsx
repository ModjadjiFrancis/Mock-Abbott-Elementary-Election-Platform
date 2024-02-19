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
import { auth } from "../_utility/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

import {
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Select,
} from "@/components/ui/select";

import { Voter } from "../_utility/models/voter";
import database from "../_utility/lib/database";

const formSchema = z
  .object({
    emailAddress: z.string().email(),
    name: z.string().min(2),
    surname: z.string().min(3),
    password: z.string().min(3),
    //idNum: z.string().regex(/^\d{13}$/, "Invalid National ID format"),
    passwordConfirm: z.string(),
    provinceName: z.enum([
      "Limpopo",
      "Mpumalanga",
      "Free State",
      "North West",
      "KwaZulu Natal",
      "Northern Cape",
      "Western Cape",
      "Eastern Cape",
      "Gauteng",
    ]),
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
      //idNum: "",
      password: "",
      passwordConfirm: "",
      //provinceName: "",
    },
  });

  const province = form.watch("provinceName");

  const createVoterObject = (
    userID: string,
    values: z.infer<typeof formSchema>
  ) => {
    const newVoter: Voter = {
      voterId: userID,
      name: values.name,
      surname: values.surname,
      email: values.emailAddress,
      //identityNum: values.idNum,
      province: values.provinceName,
    };

    return newVoter;
  };

  const route = useRouter();
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ values });
    createUserWithEmailAndPassword(auth, values.emailAddress, values.password)
      .then(async (response) => {
        const newVoterObject = createVoterObject(response.user?.uid, values);
        await database.addVoter(newVoterObject);
        alert("Registered Successfully!") 
        route.push('/ballot');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/AbbottElementary.png/800px-AbbottElementary.png" className="w-96 mb-8 rounded-lg shadow-lg" alt="Abbott Elementary"/>
        <h2 className="text-2xl font-bold mb-4">REGISTER TO PLACE YOUR VOTE</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)} //need to add this to the log in/sign in page
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
                    <Input placeholder="First Name" type="text" {...field} />
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
                    <Input placeholder="Last name" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* <FormField
            control={form.control}
            name="idNum"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Identity Number</FormLabel>
                  <FormControl>
                    <Input placeholder="ID Number" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          /> */}

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
                      <SelectItem value="Limpopo">Limpopo</SelectItem>
                      <SelectItem value="North West">North West</SelectItem>
                      <SelectItem value="Eastern Cape">Eastern Cape</SelectItem>
                      <SelectItem value="Northern Cape">Northern Cape</SelectItem>
                      <SelectItem value="Western Cape">Western Cape</SelectItem>
                      <SelectItem value="KwaZulu Natal">KwaZulu Natal</SelectItem>
                      <SelectItem value="Mpumalanga">Mpumalanga</SelectItem>
                      <SelectItem value="Free State">Free State</SelectItem>
                      <SelectItem value="Gauteng">Gauteng</SelectItem>
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
