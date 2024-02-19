import { Voter } from "./voter"; //retrieve details of the voter

export interface Vote {
  voteID: string; //identity for the vote placed
  voter: Voter
  candidateId: string;
}