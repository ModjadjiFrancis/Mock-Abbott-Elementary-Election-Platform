'use client';
import React, { useEffect } from 'react'
import { auth } from "../_utility/lib/firebase";
import { useState } from 'react';

const BallotPage = () => {
    
    const [voter,setVoter] = useState(null);

    //checks if there is any auth change; who is logged in and how we refence them 
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            setVoter(user);
        
            // const userID = user.uid;
    
            // const promisedVoter: Promise<Voter | undefined> = database.getVoter(userID);
    
            // promisedVoter.then((voter) => {
            //   if (voter) {
            //     setVoter(voter);
               }
            });
          }, [] //runs as soon as page loads
        );

        return (
            <div>
              {
                voter ? (
                  <div>
                    User email: {voter.email}
                  </div>
                ) : (
                  <p>Loading...</p>
                )
              }
            </div>
          ); 
    }         

export default BallotPage