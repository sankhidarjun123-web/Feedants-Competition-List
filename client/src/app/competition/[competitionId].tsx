import { useState, useEffect } from "react";
import { competitionApi } from "../api/competition.api";
import { useAuth } from "../context/AuthContext";
import { useLocalSearchParams } from "expo-router";
import CompetitionDetails from "../components/Competition";

export default function HomeScreen() {
    const { user } = useAuth();
    const { competitionId }: { competitionId: string } = useLocalSearchParams();
    const [compLoading, setCompLoading] = useState<boolean>(false);
    const [competitionDetails, setCompetitionDetails] = useState<any>(null);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);

    useEffect(() => {

        const getCompetitionDetails = async() => {

            if(!competitionId || !user?.email) {
                return;
            }

            try {
                setCompLoading(true);
                const response = await competitionApi.getCompetitionDetails(user?.email, competitionId);

                setCompetitionDetails(response?.data?.competitionDetails);

                setIsRegistered(response?.data?.isRegistered);

            } catch (error) {
                console.error(error);
            } finally {
                setCompLoading(false);
            }
        }

        getCompetitionDetails();
    },[]);
  return (
    <CompetitionDetails user={user} setIsRegistered={setIsRegistered} compLoading={compLoading} competition={competitionDetails} isRegistered={isRegistered} />
  );
}