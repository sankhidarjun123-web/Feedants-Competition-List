import { Text, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { Redirect, useRouter } from "expo-router";
import { competitionApi } from "./api/competition.api";

export default function CompetitionTab() {

    const router = useRouter();
    const { isAuthenticated, loading, user, logout } = useAuth();
    const [compLoading, setCompLoading] = useState<boolean>(false);
    const [noMore, setNoMore] = useState<boolean>(false);
    const [competitions, setCompetitions] = useState<any[]>([]);

    const LIMIT = 10;
    const [skip, setSkip] = useState<number>(0);

    const fetchCompetitions = async () => {
        if (!isAuthenticated || !user?.email) {
            return;
        }
        try {
            setCompLoading(true);

            const response =
                await competitionApi.getCompetitionList(
                    LIMIT,
                    skip,
                    user.email
                );

            setCompetitions(prev => [...prev, ...response.data.competitions]);
            setSkip(response.data.nextSkip);
            setNoMore(response.data.noMore);

        } catch (error) {
            console.error(
                "Error fetching competitions:",
                error
            );
        } finally {
            setCompLoading(false);
        }
    };

    useEffect(() => {

        fetchCompetitions();

    }, [isAuthenticated, user?.email]);

    if (loading) {

        return <SafeAreaView><Text>loading...</Text></SafeAreaView>;
    }


    if (!isAuthenticated) {
        return <Redirect href="/" />
    }

    return (
        <SafeAreaView className="flex-1 bg-green-50">

            <View className="flex-1 px-3">

                {/* Header */}
                <View className="py-5">

                    <View className="flex-row items-center justify-between">

                        <View className="flex-1">
                            <Text className="text-4xl text-black font-bold">
                                Feedants Competitions
                            </Text>

                            <Text className="font-light text-gray-600 mt-2">
                                Welcome, {user?.username}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={logout}
                            className="bg-red-500 px-4 py-2 rounded-xl ml-3"
                        >
                            <Text className="text-white font-bold">
                                Logout
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <Text className="font-light text-gray-600 mt-2">
                        The list of ongoing competitions
                    </Text>

                </View>



                {/* Competition List */}
                <FlatList
                    data={competitions}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}

                    renderItem={({ item }) => (

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.replace({
                                pathname: "/competition/[competitionId]",
                                params: {
                                    competitionId: item._id,
                                },
                            })}
                            className="bg-white rounded-2xl p-4 mb-4"
                        >

                            {/* Name */}
                            <Text className="text-2xl font-bold text-black">
                                {item.competitionName}
                            </Text>

                            {/* Types */}
                            <View className="flex-row flex-wrap gap-2 mt-2">

                                {item.competitionType.map(
                                    (type: any) => (
                                        <View
                                            key={type}
                                            className="bg-green-100 px-3 py-1 rounded-full"
                                        >
                                            <Text className="text-green-700">
                                                {type}
                                            </Text>
                                        </View>
                                    )
                                )}

                            </View>

                            {/* Prize + Entry */}
                            <View className="flex-row justify-between mt-4">

                                <View>
                                    <Text className="text-gray-500">
                                        Prize Pool
                                    </Text>

                                    <Text className="text-xl font-bold">
                                        ₹{item.prizePool.toLocaleString()}
                                    </Text>
                                </View>

                                <View>
                                    <Text className="text-gray-500">
                                        Entry Fee
                                    </Text>

                                    <Text className="text-xl font-bold">
                                        {item.entryFee === 0
                                            ? "Free"
                                            : `₹${item.entryFee.toLocaleString()}`}
                                    </Text>
                                </View>

                            </View>

                            {/* Slots */}
                            <View className="mt-4">

                                <Text className="text-gray-500">
                                    Slots
                                </Text>

                                <Text className="font-semibold">
                                    {item.bookedSlots} / {item.totalSlots}
                                </Text>

                            </View>

                            {/* Deadline */}
                            <View className="mt-3">

                                <Text className="text-gray-500">
                                    Registration Deadline
                                </Text>

                                <Text className="font-semibold">
                                    {new Date(
                                        item.registrationDeadline
                                    ).toLocaleDateString()}
                                </Text>

                            </View>

                        </TouchableOpacity>

                    )}

                    ListEmptyComponent={
                        !compLoading ? (
                            <Text className="text-center mt-10 text-gray-500">
                                No competitions available.
                            </Text>
                        ) : null
                    }

                    // Button at the bottom
                    ListFooterComponent={

                        !noMore ? (
                            <TouchableOpacity
                                disabled={compLoading}
                                onPress={() =>
                                    fetchCompetitions()
                                }
                                className="bg-black rounded-xl py-4 mb-8 mt-2"
                            >

                                {compLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text className="text-white text-center font-bold text-lg">
                                        Load More
                                    </Text>
                                )}

                            </TouchableOpacity>
                        ) : (
                            <Text className="text-center text-gray-500 py-5">
                                No more competitions
                            </Text>
                        )
                    }
                />

            </View>

        </SafeAreaView>
    );

}