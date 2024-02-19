'use client';
import React, { useEffect } from 'react'
import { auth } from "../_utility/lib/firebase";
import { useState } from 'react';
import candidates from '../_utility/constants/candidates';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import database from '../_utility/lib/database'; 
import { Voter } from '../_utility/models/voter';
import { Vote } from '../_utility/models/vote';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

const BallotPage = () => {
    
    const [voter,setVoter] = useState<any>();
    const [user,setUser] = useState(null);
    const route = useRouter();
    

    //Get the voter to get the province



    //checks if there is any auth change; who is logged in and how we refence them 
    useEffect(() => {
        auth.onAuthStateChanged( async(user) => {
          if (user) {
            setUser(user);
            const userID = user.uid;
    ``
            const promisedVoter: Promise<Voter | undefined> = database.getVoter(userID);

            const allVotes = database.getVotes();

            allVotes.then((votes) => {
              votes.forEach((vote) => {
                if (vote.voter.voterId === userID) {
                  alert("You've already voted!");

                  route.push("/")

                }
              })
            })
     
            promisedVoter.then((voter) => {
              if (voter) {
                setVoter(voter);
              }
            });      
          }
        });
      }
      , []);
      
      const handleSignOut = () => {
        signOut(auth).then(
          (response) => {
            route.push('/')
          }
        ).catch((e) => {
          console.log(e.message)
        })
      }

      const handleHome = () => {
        route.push('/');
      }

      const handleSubmit = async(cID:string) =>{
        const vote: Vote = {
            candidateId: cID,
            voteID: `v_${Math.floor(100000 + Math.random() * 900000)}`,
            voter: voter,
        }

    try{
        await database.addVote(vote)
        alert("Voted successfully")
        handleSignOut();
    }
    catch(e) {
        console.log(e)
    };
      }
      return (
        <div className= 'w-screen h-screen flex flex-col justify-center items-center'>
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/AbbottElementary.png/800px-AbbottElementary.png" className="w-96 mb-8 rounded-lg shadow-lg" alt="Abbott Elementary" />
          {
            voter ? (
              <div>
                <div className='flex justify-center items-center'>
                  <h2 className="text-1xl font-bold text-center mb-4 p-4"> {voter.name}, vote for your Educator of the year!</h2>      
                </div>
      
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto pl-64">
                  {
                    candidates.map((candidate, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{`${candidate.candName} ${candidate.candSurname}`}</CardTitle>
                          <CardDescription>{candidate.candManifesto}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <img className="w-48 h-36" src={candidate.candImage} alt="Candidate Profile" />
                        </CardContent>
                        <CardFooter className="flex justify-center">
                          <Button onClick={() => handleSubmit((index + 1).toString())}>Vote Now</Button>
                        </CardFooter>
                      </Card>
                    ))
                  }
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )
          }
        <br></br>
          <Button onClick={handleHome}>Home</Button><br></br>
        </div>
      );
    }         

export default BallotPage