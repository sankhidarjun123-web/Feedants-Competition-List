import {
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { competitionApi } from "../api/competition.api";

interface CompetitionFormProps {
    competitionId: string;
    name: string | string[];
    totalSlots: string | string[];
    bookedSlots: string | string[];
    description: string | string[];
    entryFee: string | string[];
}

export default function CompetitionForm({
    competitionId,
    name,
    totalSlots,
    bookedSlots,
    description,
    entryFee,
}: CompetitionFormProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");

    const [loading, setLoading] = useState(false);

    // Convert Expo Router params to strings
    const competitionName = Array.isArray(name) ? name[0] : name;
    const competitionDescription = Array.isArray(description)
        ? description[0]
        : description;

    const competitionIdValue = Array.isArray(competitionId)
        ? competitionId[0]
        : competitionId;

    const total = Number(
        Array.isArray(totalSlots) ? totalSlots[0] : totalSlots
    ) || 0;

    const booked = Number(
        Array.isArray(bookedSlots) ? bookedSlots[0] : bookedSlots
    ) || 0;

    const fee = Number(
        Array.isArray(entryFee) ? entryFee[0] : entryFee
    ) || 0;

    const availableSlots = Math.max(total - booked, 0);

    const handleSubmit = async () => {
        if (
            !email ||
            !phoneNumber ||
            !firstName ||
            !lastName ||
            !dateOfBirth ||
            !city ||
            !state ||
            !country
        ) {
            Alert.alert(
                "Missing Fields",
                "Please fill in all candidate details."
            );
            return;
        }

        if (!user?._id) {
            console.log(user);
            Alert.alert(
                "Error",
                "User information is missing."
            );
            return;
        }

        if (!competitionIdValue) {
            Alert.alert(
                "Error",
                "Competition information is missing."
            );
            return;
        }

        if (availableSlots <= 0) {
            Alert.alert(
                "Competition Full",
                "There are no available slots for this competition."
            );
            return;
        }

        try {
            setLoading(true);

            const candidateData = {
                phoneNumber,
                userId: user._id,
                firstName,
                lastName,
                dateOfBirth,
                city,
                state,
                country,
            };

            const response =
                await competitionApi.registerForCompetition(
                    competitionIdValue,
                    email,
                    candidateData
                );

            Alert.alert(
                "Registration Successful",
                response.data?.message ||
                `You have been registered for ${competitionName}.`
            );
            router.replace({
                pathname: "/competition/[competitionId]",
                params: {
                    competitionId: competitionIdValue,
                },
            });
        } catch (error: any) {
            console.error(
                "Competition registration error:",
                error
            );

            Alert.alert(
                "Registration Failed",
                error?.response?.data?.message ||
                "Something went wrong while registering."
            );
        } finally {
            setLoading(false);
        }
    };



    return (
        <SafeAreaView className="flex-1 bg-green-50">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{
                    padding: 20,
                    paddingBottom: 50,
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}

                <Text className="text-3xl font-bold text-gray-900">
                    Competition Registration
                </Text>

                <Text className="text-gray-600 mt-2 mb-6">
                    Complete your details and review the competition
                    information before registering.
                </Text>

                {/* Competition Information */}

                <View className="bg-white rounded-2xl p-5 mb-7 border border-green-100">
                    <Text className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                        Competition
                    </Text>

                    <Text className="text-2xl font-bold text-gray-900 mt-1">
                        {competitionName}
                    </Text>

                    {competitionDescription ? (
                        <Text className="text-gray-600 mt-3 leading-6">
                            {competitionDescription}
                        </Text>
                    ) : null}

                    {/* Competition Stats */}

                    <View className="flex-row mt-5">
                        {/* Available Slots */}

                        <View className="flex-1 bg-green-50 rounded-xl p-4 mr-2">
                            <Text className="text-gray-500 text-sm">
                                Available Slots
                            </Text>

                            <Text className="text-green-700 text-xl font-bold mt-1">
                                {availableSlots}
                            </Text>

                            <Text className="text-gray-500 text-xs mt-1">
                                of {total} total
                            </Text>
                        </View>

                        {/* Entry Fee */}

                        <View className="flex-1 bg-gray-50 rounded-xl p-4 ml-2">
                            <Text className="text-gray-500 text-sm">
                                Entry Fee
                            </Text>

                            <Text className="text-gray-900 text-xl font-bold mt-1">
                                ₹{fee}
                            </Text>

                            <Text className="text-gray-500 text-xs mt-1">
                                Registration fee
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Candidate Details */}

                <Text className="text-2xl font-bold text-gray-900 mb-1">
                    Candidate Details
                </Text>

                <Text className="text-gray-600 mb-6">
                    Enter your information to register for this competition.
                </Text>

                {/* First Name */}

                <Text className="text-base font-semibold mb-2">
                    First Name
                </Text>

                <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Enter first name"
                    placeholderTextColor="#9CA3AF"
                    className="w-full h-14 bg-white border border-gray-300 rounded-xl px-4 mb-5 text-black"
                />

                {/* Last Name */}

                <Text className="text-base font-semibold mb-2">
                    Last Name
                </Text>

                <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Enter last name"
                    placeholderTextColor="#9CA3AF"
                    className="w-full h-14 bg-white border border-gray-300 rounded-xl px-4 mb-5 text-black"
                />

                {/* Email */}

                <Text className="text-base font-semibold mb-2">
                    Email
                </Text>

                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email address"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="w-full h-14 bg-white border border-gray-300 rounded-xl px-4 mb-5 text-black"
                />

                {/* Phone */}

                <Text className="text-base font-semibold mb-2">
                    Phone Number
                </Text>

                <TextInput
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter phone number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    className="w-full h-14 bg-white border border-gray-300 rounded-xl px-4 mb-5 text-black"
                />

                {/* Date of Birth */}

                <Text className="text-base font-semibold mb-2">
                    Date of Birth
                </Text>

                <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="w-full h-14 bg-white border border-gray-300 rounded-xl px-4 mb-5 justify-center"
                >
                    <Text
                        className={
                            dateOfBirth
                                ? "text-black"
                                : "text-gray-400"
                        }
                    >
                        {dateOfBirth || "Select date of birth"}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={
                            dateOfBirth
                                ? new Date(dateOfBirth)
                                : new Date(2000, 0, 1)
                        }
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);

                            if (selectedDate) {
                                const year = selectedDate.getFullYear();
                                const month = String(
                                    selectedDate.getMonth() + 1
                                ).padStart(2, "0");
                                const day = String(
                                    selectedDate.getDate()
                                ).padStart(2, "0");

                                setDateOfBirth(
                                    `${year}-${month}-${day}`
                                );
                            }
                        }}
                    />
                )}

                {/* City */}

                <Text className="text-base font-semibold mb-2">
                    City
                </Text>

                <TextInput
                    value={city}
                    onChangeText={setCity}
                    placeholder="Enter city"
                    placeholderTextColor="#9CA3AF"
                    className="w-full h-14 bg-white border border-gray-300 rounded-xl px-4 mb-5 text-black"
                />

                {/* State */}

                <Text className="text-base font-semibold mb-2">
                    State
                </Text>

                <TextInput
                    value={state}
                    onChangeText={setState}
                    placeholder="Enter state"
                    placeholderTextColor="#9CA3AF"
                    className="w-full h-14 bg-white border border-gray-300 rounded-xl px-4 mb-5 text-black"
                />

                {/* Country */}

                <Text className="text-base font-semibold mb-2">
                    Country
                </Text>

                <TextInput
                    value={country}
                    onChangeText={setCountry}
                    placeholder="Enter country"
                    placeholderTextColor="#9CA3AF"
                    className="w-full h-14 bg-white border border-gray-300 rounded-xl px-4 mb-7 text-black"
                />

                {/* Payment Summary */}

                <View className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
                    <Text className="text-xl font-bold text-gray-900 mb-4">
                        Payment Summary
                    </Text>

                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-gray-600">
                            Competition Entry
                        </Text>

                        <Text className="text-gray-900 font-semibold">
                            ₹{fee}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text className="text-gray-600">
                            Registration Fee
                        </Text>

                        <Text className="text-gray-900 font-semibold">
                            ₹{fee}
                        </Text>
                    </View>

                    <View className="border-t border-gray-200 mt-4 pt-4 flex-row justify-between items-center">
                        <Text className="text-lg font-bold text-gray-900">
                            Total Amount
                        </Text>

                        <Text className="text-xl font-bold text-green-700">
                            ₹{fee}
                        </Text>
                    </View>

                    {/* Payment Notice */}

                    <View className="bg-green-50 rounded-xl p-4 mt-4">
                        <Text className="text-green-800 text-sm leading-5">
                            💳 A payment of ₹{fee} is required to complete
                            your competition registration.
                        </Text>
                    </View>
                </View>

                {/* Register & Pay */}

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading || availableSlots <= 0}
                    className={`w-full h-14 rounded-xl items-center justify-center ${availableSlots <= 0
                        ? "bg-gray-400"
                        : "bg-green-600"
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white text-lg font-bold">
                            {availableSlots <= 0
                                ? "Competition Full"
                                : `Register & Pay ₹${fee}`}
                        </Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        router.replace({
                            pathname: "/competition/[competitionId]",
                            params: {
                                competitionId: competitionId,
                            },
                        })
                    }
                    className={`w-full h-14 rounded-xl items-center justify-center bg-white text-red-600`}
                >
                    <Text className="text-lg font-md text-red-600">
                        Cancel
                    </Text>
                </TouchableOpacity>

                {/* Bottom Notice */}

                <Text className="text-center text-gray-500 text-xs mt-4 px-5 leading-4">
                    Your registration will be confirmed after the payment
                    process is successfully completed.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
