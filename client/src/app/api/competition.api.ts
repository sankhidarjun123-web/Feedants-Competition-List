import { api } from "./baseURL";




export const competitionApi = {
    getCompetitionList: (
        limit: number,
        skip: number,
        email: string
    ) =>
        api.get(
            `/competition/list?limit=${limit}&skip=${skip}&email=${email}`
        ),

    getCompetitionDetails: (
        email: string,
        competitionId: string
    ) =>
        api.get(
            `/competition/details/${competitionId}?email=${encodeURIComponent(email)}`
        ),

    registerForCompetition: async (
        competitionId: string,
        email: string,
        candidateData: {
            phoneNumber: string;
            userId: string;
            firstName: string;
            lastName: string;
            dateOfBirth: string;
            city: string;
            state: string;
            country: string;
        }
    ) =>
        api.post(
            `/competition/candidate/register/${competitionId}?email=${encodeURIComponent(email)}`,
            candidateData
        ),

    withDrawApplication: async(
        email: string,
        competitionId: string
    ) => 
        api.delete(
            `/competition/candidate/withdraw/${competitionId}?email=${encodeURIComponent(email)}`
        ),
};