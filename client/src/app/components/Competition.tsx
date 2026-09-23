import {
    ScrollView,
    Text,
    View,
    Pressable,
    Alert
} from "react-native";

import {
    ArrowLeft,
    Trophy,
    Users,
    CalendarDays,
    Send,
    Upload,
    ShieldCheck,
    Info,
    Award,
    Scale,
    CheckCircle,
} from "lucide-react-native";
import ConfirmPopup from "./ConfirmPopup";

import { SafeAreaView } from "react-native-safe-area-context";
import { SetStateAction, useState } from "react";
import { useRouter } from "expo-router";

import CountdownTimer from "./CountDownTimer";
import { competitionApi } from "../api/competition.api";


// -----------------------------------------------------
// TYPES
// -----------------------------------------------------

interface Judge {
    _id: string;
    name: string;
    profession: string;
    experience: string;
}

interface JudgingParameter {
    _id: string;
    parameter: string;
    weight: number;
}

interface PreviousWinner {
    _id: string;
    name: string;
    position: string;
}

interface Reward {
    _id: string;
    position: string;
    prizeMoney: number;
}

interface Competition {
    _id: string;
    competitionName: string;
    aboutCompetition: string;

    competitionType: string[];

    entryFee: number;
    prizePool: number;

    totalSlots: number;
    bookedSlots: number;

    eligibility: string[];

    judges: Judge[];

    judgingParameters: JudgingParameter[];

    previousWinners: PreviousWinner[];

    rewards: Reward[];

    rules: string[];

    registrationDeadline: string;
    submissionStarts: string;
    submissionEnds: string;
    resultDate: string;
}


// -----------------------------------------------------
// PROPS
// -----------------------------------------------------

interface CompetitionProps {
    competition: Competition;
    compLoading?: boolean;
    isRegistered?: boolean;
    setIsRegistered?: React.Dispatch<SetStateAction<boolean>>;
    user: any
}


// -----------------------------------------------------
// COMPONENT
// -----------------------------------------------------

export default function CompetitionDetails({
    user,
    competition,
    isRegistered,
    setIsRegistered,
    compLoading = false,
}: CompetitionProps) {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<
        "about" | "judging" | "rules"
    >("about");

    const [showWithdrawPopup, setShowWithdrawPopup] = useState<boolean>(false);
    const [withDrawLoading, setWithdrawLoading] = useState<boolean>(false);
    const handleWithdraw = async () => {
        setWithdrawLoading(true);

        try {
            await competitionApi.withDrawApplication(
                user.email,
                competition._id
            );

            if (setIsRegistered) setIsRegistered(false);

            Alert.alert(
                "Application Withdrawn",
                "Your application has been successfully withdrawn."
            );

        } catch (error: any) {
            console.error("Withdrawal failed:", error);

            Alert.alert(
                "Withdrawal Failed",
                error?.response?.data?.message ||
                "Something went wrong while withdrawing your application."
            );

            throw error;

        } finally {
            setWithdrawLoading(false);
        }
    };


    // ---------------------------------------------------
    // LOADING
    // ---------------------------------------------------

    if (compLoading || !competition) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-[#172B4D] font-semibold">
                    Loading competition...
                </Text>
            </SafeAreaView>
        );
    }


    // ---------------------------------------------------
    // BASIC CALCULATIONS
    // ---------------------------------------------------

    const remainingSlots =
        competition.totalSlots - competition.bookedSlots;

    const bookingPercentage =
        competition.totalSlots > 0
            ? (competition.bookedSlots / competition.totalSlots) * 100
            : 0;


    // ---------------------------------------------------
    // DATE FORMATTER
    // ---------------------------------------------------

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };


    // ---------------------------------------------------
    // REWARD ICON
    // ---------------------------------------------------

    const getRewardIcon = (position: string) => {
        switch (position) {
            case "1st":
                return "🥇";

            case "2nd":
                return "🥈";

            case "3rd":
                return "🥉";

            default:
                return "🏆";
        }
    };


    // ---------------------------------------------------
    // UI
    // ---------------------------------------------------

    return (
        <SafeAreaView className="flex-1 bg-white">

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 30,
                }}
            >

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <View className="flex-row items-center justify-between px-5 pt-3 pb-4">

                    <Pressable
                        onPress={() => router.replace("/")}
                        className="flex-row items-center"
                    >
                        <ArrowLeft
                            size={25}
                            color="#172B4D"
                        />

                        <Text className="ml-3 text-[16px] font-bold text-[#172B4D]">
                            Go back
                        </Text>
                    </Pressable>


                    <View className="flex-row rounded-full bg-[#F2F4F7] p-1">

                        <View className="rounded-full bg-[#087F8C] px-4 py-2">
                            <Text className="text-[13px] font-bold text-white">
                                ENG
                            </Text>
                        </View>

                        <View className="px-3 py-2">
                            <Text className="text-[13px] font-medium text-[#172B4D]">
                                हिंदी
                            </Text>
                        </View>

                    </View>

                </View>


                {/* ================================================= */}
                {/* MAIN COMPETITION CARD */}
                {/* ================================================= */}

                <View className="mx-4 rounded-2xl border border-[#E8EDF1] bg-white p-5">

                    <View className="flex-row items-center flex-wrap">
                        <Text className="text-[25px] font-extrabold text-[#172B4D]">
                            {competition.competitionName}
                        </Text>

                        {isRegistered && (
                            <View className="ml-3 mt-1 flex-row items-center rounded-full bg-[#E9F7F8] px-3 py-1.5">
                                <CheckCircle
                                    size={16}
                                    color="#087F8C"
                                    strokeWidth={2.5}
                                />

                                <Text className="ml-1.5 text-[12px] font-extrabold text-[#087F8C]">
                                    Registered
                                </Text>
                            </View>
                        )}
                    </View>


                    {/* Competition Types */}

                    <View className="mt-3 flex-row flex-wrap items-center">

                        {competition.competitionType.map(
                            (type, index) => (
                                <View
                                    key={index}
                                    className="mr-2 mb-2 rounded-lg bg-[#F3F5F9] px-3 py-2"
                                >
                                    <Text className="text-[12px] font-bold text-[#172B4D]">
                                        {type}
                                    </Text>
                                </View>
                            )
                        )}

                    </View>


                    {/* Prize + Entry + Slots */}

                    <View className="mt-5 flex-row">

                        {/* Prize */}

                        <View className="flex-1">

                            <Text className="text-[13px] text-[#718096]">
                                Prize Pool
                            </Text>

                            <Text className="mt-1 text-[25px] font-extrabold text-[#087F8C]">
                                ₹{competition.prizePool.toLocaleString("en-IN")}
                            </Text>

                        </View>


                        {/* Entry */}

                        <View className="flex-1">

                            <Text className="text-[13px] text-[#718096]">
                                Entry Fee
                            </Text>

                            <Text className="mt-1 text-[23px] font-extrabold text-[#172B4D]">
                                ₹{competition.entryFee.toLocaleString("en-IN")}
                            </Text>

                        </View>


                        {/* Slots */}

                        <View className="flex-1">

                            <View className="flex-row items-center">

                                <Users
                                    size={17}
                                    color="#087F8C"
                                />

                                <Text className="ml-1 text-[12px] font-bold text-[#087F8C]">
                                    {remainingSlots} spots left
                                </Text>

                            </View>


                            <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#D9EEF0]">

                                <View
                                    className="h-full rounded-full bg-[#087F8C]"
                                    style={{
                                        width: `${Math.min(
                                            bookingPercentage,
                                            100
                                        )}%`,
                                    }}
                                />

                            </View>


                            <Text className="mt-2 text-[11px] text-[#64748B]">
                                {competition.bookedSlots} /{" "}
                                {competition.totalSlots} Booked
                            </Text>

                        </View>

                    </View>

                </View>


                {/* ================================================= */}
                {/* COUNTDOWN */}
                {/* ================================================= */}

                <CountdownTimer
                    targetDate={competition.registrationDeadline}
                />


                {/* ================================================= */}
                {/* JUDGES */}
                {/* ================================================= */}

                <View className="mt-4">

                    <Text className="px-5 text-[17px] font-bold text-[#172B4D]">
                        Judges
                    </Text>


                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mt-3"
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                        }}
                    >

                        {competition.judges.map(
                            (judge) => (

                                <View
                                    key={judge._id}
                                    className="mr-3 w-[250px] rounded-2xl border border-[#E8EDF1] p-4"
                                >

                                    <View className="flex-row items-center">

                                        <View className="h-16 w-16 items-center justify-center rounded-full bg-[#E9F7F8]">

                                            <Text className="text-2xl">
                                                👨🏻‍⚖️
                                            </Text>

                                        </View>


                                        <View className="ml-3 flex-1">

                                            <Text className="text-[16px] font-bold text-[#172B4D]">
                                                {judge.name}
                                            </Text>

                                            <Text className="mt-1 text-[12px] text-[#087F8C]">
                                                {judge.profession}
                                            </Text>

                                        </View>

                                    </View>


                                    <Text className="mt-4 text-[12px] leading-5 text-[#60708A]">
                                        {judge.experience}
                                    </Text>

                                </View>

                            )
                        )}

                    </ScrollView>

                </View>


                {/* ================================================= */}
                {/* IMPORTANT DATES */}
                {/* ================================================= */}

                <View className="mx-4 mt-4 rounded-2xl border border-[#E8EDF1] p-4">

                    <Text className="text-[17px] font-bold text-[#172B4D]">
                        Important Dates
                    </Text>


                    <View className="mt-3 overflow-hidden rounded-xl border border-[#E4EAF0]">

                        <View className="flex-row border-b border-[#E4EAF0]">

                            <DateItem
                                icon={
                                    <CalendarDays
                                        size={21}
                                        color="#087F8C"
                                    />
                                }
                                title="Register Before"
                                date={formatDate(
                                    competition.registrationDeadline
                                )}
                                time={formatTime(
                                    competition.registrationDeadline
                                )}
                            />

                            <DateItem
                                icon={
                                    <Send
                                        size={21}
                                        color="#087F8C"
                                    />
                                }
                                title="Submission Starts"
                                date={formatDate(
                                    competition.submissionStarts
                                )}
                                time={formatTime(
                                    competition.submissionStarts
                                )}
                                border
                            />

                        </View>


                        <View className="flex-row">

                            <DateItem
                                icon={
                                    <Upload
                                        size={21}
                                        color="#087F8C"
                                    />
                                }
                                title="Submission Ends"
                                date={formatDate(
                                    competition.submissionEnds
                                )}
                                time={formatTime(
                                    competition.submissionEnds
                                )}
                            />

                            <DateItem
                                icon={
                                    <Trophy
                                        size={21}
                                        color="#087F8C"
                                    />
                                }
                                title="Result Date"
                                date={formatDate(
                                    competition.resultDate
                                )}
                                time={formatTime(
                                    competition.resultDate
                                )}
                                border
                            />

                        </View>

                    </View>

                </View>


                {/* ================================================= */}
                {/* PREVIOUS WINNERS */}
                {/* ================================================= */}

                <View className="mt-5">

                    <Text className="px-5 text-[17px] font-bold text-[#172B4D]">
                        Previous Winners
                    </Text>


                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mt-3"
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                        }}
                    >

                        {competition.previousWinners.map(
                            (winner) => (

                                <View
                                    key={winner._id}
                                    className="mr-3 w-[190px] flex-row items-center rounded-xl bg-[#F7F8FA] p-3"
                                >

                                    <View className="h-14 w-14 items-center justify-center rounded-xl bg-[#DDE7E8]">

                                        <Text className="text-2xl">
                                            {getRewardIcon(winner.position)}
                                        </Text>

                                    </View>


                                    <View className="ml-3 flex-1">

                                        <Text
                                            numberOfLines={1}
                                            className="text-[13px] font-bold text-[#172B4D]"
                                        >
                                            {winner.name}
                                        </Text>

                                        <Text className="mt-1 text-[11px] font-bold text-[#087F8C]">
                                            {winner.position} Position
                                        </Text>

                                    </View>

                                </View>

                            )
                        )}

                    </ScrollView>

                </View>


                {/* ================================================= */}
                {/* TABS */}
                {/* ================================================= */}

                <View className="mx-4 mt-6 border-b border-[#E1E7EC]">

                    <View className="flex-row">

                        <Tab
                            title="About"
                            active={activeTab === "about"}
                            onPress={() => setActiveTab("about")}
                        />

                        <Tab
                            title="Judging"
                            active={activeTab === "judging"}
                            onPress={() => setActiveTab("judging")}
                        />

                        <Tab
                            title="Rules"
                            active={activeTab === "rules"}
                            onPress={() => setActiveTab("rules")}
                        />

                    </View>

                </View>


                {/* ================================================= */}
                {/* ABOUT */}
                {/* ================================================= */}

                {activeTab === "about" && (

                    <View className="mx-4 py-4">

                        <Text className="text-[14px] leading-6 text-[#53657D]">
                            {competition.aboutCompetition}
                        </Text>

                    </View>

                )}


                {/* ================================================= */}
                {/* JUDGING PARAMETERS */}
                {/* ================================================= */}

                {activeTab === "judging" && (

                    <View className="mx-4 mt-4 rounded-2xl border border-[#E8EDF1] p-4">

                        {competition.judgingParameters.map(
                            (item, index) => (

                                <View
                                    key={item._id}
                                    className={`flex-row items-center justify-between py-4 ${index !==
                                        competition.judgingParameters.length - 1
                                        ? "border-b border-[#EDF0F3]"
                                        : ""
                                        }`}
                                >

                                    <View className="flex-row items-center flex-1">

                                        <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#E9F7F8]">

                                            <Scale
                                                size={18}
                                                color="#087F8C"
                                            />

                                        </View>

                                        <Text className="ml-3 text-[14px] font-bold text-[#172B4D]">
                                            {item.parameter}
                                        </Text>

                                    </View>


                                    <Text className="text-[15px] font-extrabold text-[#087F8C]">
                                        {item.weight}%
                                    </Text>

                                </View>

                            )
                        )}

                    </View>

                )}


                {/* ================================================= */}
                {/* RULES + ELIGIBILITY */}
                {/* ================================================= */}

                {activeTab === "rules" && (

                    <View className="mx-4 mt-4">

                        {/* Rules */}

                        <View className="rounded-2xl border border-[#E8EDF1] p-4">

                            <Text className="text-[17px] font-bold text-[#172B4D]">
                                Rules
                            </Text>


                            {competition.rules.map(
                                (rule, index) => (

                                    <View
                                        key={index}
                                        className="mt-4 flex-row"
                                    >

                                        <View className="mt-1 h-5 w-5 items-center justify-center rounded-full bg-[#E9F7F8]">

                                            <Text className="text-[10px] font-bold text-[#087F8C]">
                                                {index + 1}
                                            </Text>

                                        </View>

                                        <Text className="ml-3 flex-1 text-[13px] leading-5 text-[#53657D]">
                                            {rule}
                                        </Text>

                                    </View>

                                )
                            )}

                        </View>


                        {/* Eligibility */}

                        <View className="mt-3 rounded-2xl border border-[#E8EDF1] p-4">

                            <Text className="text-[17px] font-bold text-[#172B4D]">
                                Eligibility
                            </Text>


                            {competition.eligibility.map(
                                (item, index) => (

                                    <View
                                        key={index}
                                        className="mt-4 flex-row"
                                    >

                                        <ShieldCheck
                                            size={18}
                                            color="#087F8C"
                                        />

                                        <Text className="ml-3 flex-1 text-[13px] leading-5 text-[#53657D]">
                                            {item}
                                        </Text>

                                    </View>

                                )
                            )}

                        </View>

                    </View>

                )}


                {/* ================================================= */}
                {/* REWARDS */}
                {/* ================================================= */}

                <View className="mx-4 mt-5 rounded-2xl border border-[#E8EDF1] p-4">

                    <View className="flex-row items-center">

                        <Award
                            size={20}
                            color="#087F8C"
                        />

                        <Text className="ml-2 text-[17px] font-bold text-[#172B4D]">
                            Rewards
                        </Text>

                    </View>


                    {competition.rewards.map(
                        (reward, index) => (

                            <View
                                key={reward._id}
                                className={`flex-row items-center justify-between py-4 ${index !== competition.rewards.length - 1
                                    ? "border-b border-[#EDF0F3]"
                                    : ""
                                    }`}
                            >

                                <View className="flex-row items-center">

                                    <Text className="w-10 text-xl">
                                        {getRewardIcon(reward.position)}
                                    </Text>

                                    <Text className="text-[14px] font-bold text-[#172B4D]">
                                        {reward.position}
                                    </Text>

                                </View>


                                <Text className="text-[16px] font-extrabold text-[#087F8C]">
                                    ₹{reward.prizeMoney.toLocaleString("en-IN")}
                                </Text>

                            </View>

                        )
                    )}

                </View>


                {/* ================================================= */}
                {/* INFO / DISCLAIMER */}
                {/* ================================================= */}

                <View className="mx-4 mt-3 flex-row items-center rounded-xl bg-[#EDF8F8] px-4 py-3">

                    <Info
                        size={19}
                        color="#087F8C"
                    />

                    <Text className="ml-2 flex-1 text-[11px] leading-5 text-[#334E68]">

                        <Text className="font-bold">
                            Competition information:{" "}
                        </Text>

                        Please make sure your registration information
                        is accurate and follow all competition rules.

                    </Text>

                </View>


                {/* ================================================= */}
                {/* REGISTER BUTTON */}
                {/* ================================================= */}

                {/* ================================================= */}
                {/* REGISTRATION / SUBMISSION ACTIONS */}
                {/* ================================================= */}

                {isRegistered ? (
                    <View className="mx-4 mt-4">

                        {/*Submission Button*/}
                        <Pressable
                            onPress={() =>
                                Alert.alert(
                                    "Submission Feature",
                                    "The submission feature is currently under development. We are working on adding support for uploading competition submissions."
                                )
                            }
                            className="items-center rounded-xl bg-[#087F8C] py-4"
                        >
                            <View className="flex-row items-center">
                                <Upload
                                    size={19}
                                    color="#FFFFFF"
                                />

                                <Text className="ml-2 text-[16px] font-extrabold text-white">
                                    Upload Submission
                                </Text>
                            </View>
                        </Pressable>


                        {/* Withdraw Application */}
                        <Pressable
                            onPress={() => setShowWithdrawPopup(true)}
                            className="mt-3 items-center rounded-xl border border-[#E05252] bg-white py-4"
                        >
                            <Text className="text-[15px] font-extrabold text-[#E05252]">
                                Withdraw Application
                            </Text>

                            <ConfirmPopup
                                visible={showWithdrawPopup}
                                loading={withDrawLoading}
                                title="Withdraw Application?"
                                message="Are you sure you want to withdraw from this competition? This action cannot be undone."
                                onConfirm={handleWithdraw}
                                onCancel={() => setShowWithdrawPopup(false)}
                            />

                            <Text className="mt-1 text-[11px] text-[#718096]">
                                Cancel your competition registration
                            </Text>
                        </Pressable>

                    </View>
                ) : (
                    <Pressable
                        onPress={() =>
                            router.replace({
                                pathname: "/candidate",
                                params: {
                                    competitionId: competition?._id,
                                    name: competition?.competitionName,
                                    totalSlots: String(competition?.totalSlots),
                                    bookedSlots: String(competition?.bookedSlots),
                                    description: competition?.aboutCompetition,
                                    entryFee: competition.entryFee,
                                },
                            })
                        }
                        className="mx-4 mt-4 items-center rounded-xl bg-[#087F8C] py-4"
                    >
                        <Text className="text-[16px] font-extrabold text-white">
                            Register for Competition
                        </Text>

                        <Text className="mt-1 text-[12px] text-white">
                            Entry Fee ₹
                            {competition.entryFee.toLocaleString("en-IN")}
                        </Text>
                    </Pressable>
                )}


            </ScrollView>

        </SafeAreaView>
    );
}


// =====================================================
// DATE ITEM
// =====================================================

function DateItem({
    icon,
    title,
    date,
    time,
    border,
}: {
    icon: React.ReactNode;
    title: string;
    date: string;
    time: string;
    border?: boolean;
}) {
    return (
        <View
            className={`flex-1 flex-row p-4 ${border
                ? "border-l border-[#E4EAF0]"
                : ""
                }`}
        >

            <View className="mt-1">
                {icon}
            </View>


            <View className="ml-3 flex-1">

                <Text className="text-[10px] text-[#718096]">
                    {title}
                </Text>

                <Text className="mt-1 text-[12px] font-bold text-[#087F8C]">
                    {date}
                </Text>

                <Text className="mt-1 text-[11px] font-semibold text-[#172B4D]">
                    {time}
                </Text>

            </View>

        </View>
    );
}


// =====================================================
// TAB
// =====================================================

function Tab({
    title,
    active = false,
    onPress,
}: {
    title: string;
    active?: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable
            onPress={onPress}
            className={`flex-1 items-center pb-3 ${active
                ? "border-b-[3px] border-[#087F8C]"
                : ""
                }`}
        >

            <Text
                numberOfLines={1}
                className={`text-[12px] font-bold ${active
                    ? "text-[#087F8C]"
                    : "text-[#718096]"
                    }`}
            >
                {title}
            </Text>

        </Pressable>
    );
}