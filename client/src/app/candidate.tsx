import CompetitionForm from "@/app/components/CompetitionForm";
import { Redirect, useLocalSearchParams } from "expo-router";

export default function CandidateTab() {
    const {
        competitionId,
        name,
        totalSlots,
        bookedSlots,
        description,
        entryFee,
    } = useLocalSearchParams();

    if (!competitionId) {
        return <Redirect href="/" />;
    }

    return (
        <CompetitionForm
            competitionId={typeof competitionId === "string" ? competitionId : ""}
            name={name}
            totalSlots={totalSlots}
            bookedSlots={bookedSlots}
            description={description}
            entryFee={entryFee}
        />
    );
}